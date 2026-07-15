from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


WHITE_THRESHOLD = 248
MAX_WORK_SIZE = 1400
MIN_COMPONENT_AREA = 450
MIN_BOX_SIDE = 28


def rgb_and_alpha(image: Image.Image) -> tuple[Image.Image, np.ndarray]:
    rgba = image.convert("RGBA")
    return rgba.convert("RGB"), np.asarray(rgba)[..., 3]


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    h, w = mask.shape
    padded = np.pad(mask, radius, mode="constant", constant_values=False)
    out = np.zeros_like(mask, dtype=bool)
    for dy in range(radius * 2 + 1):
        for dx in range(radius * 2 + 1):
            out |= padded[dy : dy + h, dx : dx + w]
    return out


def erode(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    h, w = mask.shape
    padded = np.pad(mask, radius, mode="constant", constant_values=True)
    out = np.ones_like(mask, dtype=bool)
    for dy in range(radius * 2 + 1):
        for dx in range(radius * 2 + 1):
            out &= padded[dy : dy + h, dx : dx + w]
    return out


def connected_boxes(mask: np.ndarray) -> list[tuple[int, int, int, int, int]]:
    h, w = mask.shape
    seen = np.zeros(mask.shape, dtype=bool)
    boxes: list[tuple[int, int, int, int, int]] = []

    ys, xs = np.nonzero(mask)
    for start_y, start_x in zip(ys, xs):
        if seen[start_y, start_x]:
            continue
        queue: deque[tuple[int, int]] = deque([(int(start_y), int(start_x))])
        seen[start_y, start_x] = True
        min_x = max_x = int(start_x)
        min_y = max_y = int(start_y)
        area = 0

        while queue:
            y, x = queue.popleft()
            area += 1
            if x < min_x:
                min_x = x
            if x > max_x:
                max_x = x
            if y < min_y:
                min_y = y
            if y > max_y:
                max_y = y

            for ny in (y - 1, y, y + 1):
                if ny < 0 or ny >= h:
                    continue
                for nx in (x - 1, x, x + 1):
                    if nx < 0 or nx >= w or seen[ny, nx] or not mask[ny, nx]:
                        continue
                    seen[ny, nx] = True
                    queue.append((ny, nx))

        boxes.append((min_x, min_y, max_x + 1, max_y + 1, area))
    return boxes


def intersection_area(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> int:
    x1 = max(a[0], b[0])
    y1 = max(a[1], b[1])
    x2 = min(a[2], b[2])
    y2 = min(a[3], b[3])
    return max(0, x2 - x1) * max(0, y2 - y1)


def merge_overlapping(boxes: list[tuple[int, int, int, int]]) -> list[tuple[int, int, int, int]]:
    merged: list[tuple[int, int, int, int]] = []
    for box in sorted(boxes, key=lambda b: (b[1], b[0])):
        absorbed = False
        for i, existing in enumerate(merged):
            inter = intersection_area(box, existing)
            if inter == 0:
                continue
            box_area = (box[2] - box[0]) * (box[3] - box[1])
            existing_area = (existing[2] - existing[0]) * (existing[3] - existing[1])
            if inter / min(box_area, existing_area) > 0.85:
                merged[i] = (
                    min(box[0], existing[0]),
                    min(box[1], existing[1]),
                    max(box[2], existing[2]),
                    max(box[3], existing[3]),
                )
                absorbed = True
                break
        if not absorbed:
            merged.append(box)
    return sorted(merged, key=lambda b: (b[1], b[0]))


def detect_boxes(image: Image.Image) -> list[tuple[int, int, int, int]]:
    rgb, alpha = rgb_and_alpha(image)
    w, h = rgb.size
    scale = min(1.0, MAX_WORK_SIZE / max(w, h))
    work_w = max(1, int(round(w * scale)))
    work_h = max(1, int(round(h * scale)))

    small_rgb = rgb.resize((work_w, work_h), Image.Resampling.BILINEAR)
    small_alpha = Image.fromarray(alpha).resize((work_w, work_h), Image.Resampling.BILINEAR)

    arr = np.asarray(small_rgb)
    alpha_arr = np.asarray(small_alpha)
    near_white = np.all(arr >= WHITE_THRESHOLD, axis=2)
    visible = alpha_arr > 8
    channel_range = np.max(arr, axis=2) - np.min(arr, axis=2)
    colored = channel_range > 18
    dark_or_paper = np.min(arr, axis=2) < 246
    mask = (~near_white) & (dark_or_paper | colored) & (visible | colored)

    # Remove scanner dust, then bridge photo borders/text into one component.
    clean = dilate(mask, 1)
    clean = erode(clean, 1)
    group_radius = max(2, int(round(max(work_w, work_h) * 0.003)))
    grouped = dilate(clean, group_radius)

    raw_boxes: list[tuple[int, int, int, int]] = []
    for x1, y1, x2, y2, area in connected_boxes(grouped):
        bw = x2 - x1
        bh = y2 - y1
        if area < MIN_COMPONENT_AREA or bw < MIN_BOX_SIDE or bh < MIN_BOX_SIDE:
            continue
        if bw * bh < 1600:
            continue

        component_mask = grouped[y1:y2, x1:x2]
        if np.any(component_mask):
            visible_ratio = float(np.mean(visible[y1:y2, x1:x2][component_mask]))
            range_p90 = float(np.percentile(channel_range[y1:y2, x1:x2][component_mask], 90))
            if visible_ratio < 0.02 and range_p90 < 55:
                continue

        margin = max(10, int(round(max(bw, bh) * 0.07)))
        ox1 = max(0, int(np.floor((x1 - margin) / scale)))
        oy1 = max(0, int(np.floor((y1 - margin) / scale)))
        ox2 = min(w, int(np.ceil((x2 + margin) / scale)))
        oy2 = min(h, int(np.ceil((y2 + margin) / scale)))
        raw_boxes.append((ox1, oy1, ox2, oy2))

    return merge_overlapping(raw_boxes)


def clean_crop_rgba(rgba_crop: Image.Image) -> Image.Image:
    arr = np.asarray(rgba_crop).copy()
    rgb = arr[..., :3]
    alpha = arr[..., 3]
    channel_range = np.max(rgb, axis=2) - np.min(rgb, axis=2)

    visible_ratio = float(np.mean(alpha > 8))
    range_p90 = float(np.percentile(channel_range, 90))
    if visible_ratio < 0.02 and range_p90 > 55:
        return Image.fromarray(rgb, "RGB")

    rgb[alpha <= 8] = 255
    return Image.fromarray(rgb, "RGB")


def crop_all(source_dir: Path, output_dir: Path, dry_run: bool) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    total = 0
    for source in sorted(source_dir.glob("*.png")):
        image = Image.open(source)
        rgba = image.convert("RGBA")
        boxes = detect_boxes(image)
        print(f"{source.name}: {len(boxes)}")
        if dry_run:
            total += len(boxes)
            continue

        stem_dir = output_dir / source.stem
        stem_dir.mkdir(parents=True, exist_ok=True)
        for idx, box in enumerate(boxes, start=1):
            crop = clean_crop_rgba(rgba.crop(box))
            out = stem_dir / f"{source.stem}_{idx:02d}.png"
            crop.save(out)
        total += len(boxes)
    print(f"total: {total}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    crop_all(args.source_dir, args.output_dir, args.dry_run)


if __name__ == "__main__":
    main()
