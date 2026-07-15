(function () {
const GRANDFATHER_ITEM_BASE = "assets/grandfather/items/";

const grandfatherItemOverrides = {
  // 后续手动调位置就在这里写。数值都是百分比，基于当前场景画面。
  // 示例：
  // "G-01": {
  //   "012_p005_img003.png": { x: 30, y: 55, width: 30, rotate: -2, z: 4 },
  // },
};

const grandfatherLayoutPresets = {
  two: [
    { x: 35, y: 51, width: 31, rotate: -1.2, z: 3 },
    { x: 66, y: 43, width: 22, rotate: 2.2, z: 4 },
  ],
  three: [
    { x: 32, y: 51, width: 30, rotate: -1.4, z: 3 },
    { x: 65, y: 38, width: 19, rotate: 2.6, z: 5 },
    { x: 69, y: 61, width: 22, rotate: 0.4, z: 4 },
  ],
  four: [
    { x: 30, y: 50, width: 28, rotate: -1.2, z: 4 },
    { x: 56, y: 38, width: 17, rotate: 1.5, z: 5 },
    { x: 70, y: 54, width: 18, rotate: -2, z: 3 },
    { x: 54, y: 66, width: 16, rotate: 1.1, z: 6 },
  ],
  five: [
    { x: 25, y: 53, width: 24, rotate: -1.6, z: 4 },
    { x: 47, y: 36, width: 16, rotate: 1.8, z: 5 },
    { x: 66, y: 45, width: 18, rotate: -2.2, z: 3 },
    { x: 59, y: 66, width: 15, rotate: 1.2, z: 6 },
    { x: 77, y: 64, width: 14, rotate: -0.4, z: 4 },
  ],
  six: [
    { x: 22, y: 51, width: 22, rotate: -1.7, z: 4 },
    { x: 42, y: 37, width: 15, rotate: 1.6, z: 5 },
    { x: 59, y: 43, width: 15, rotate: -1.8, z: 3 },
    { x: 74, y: 52, width: 15, rotate: 2.4, z: 4 },
    { x: 47, y: 67, width: 14, rotate: -0.6, z: 6 },
    { x: 65, y: 70, width: 14, rotate: 1.1, z: 5 },
  ],
  many: [
    { x: 19, y: 39, width: 13, rotate: -2.2, z: 4 },
    { x: 35, y: 33, width: 12, rotate: 1.8, z: 5 },
    { x: 51, y: 37, width: 12, rotate: -1.4, z: 3 },
    { x: 67, y: 34, width: 12, rotate: 2.6, z: 4 },
    { x: 80, y: 45, width: 12, rotate: -1.1, z: 5 },
    { x: 31, y: 63, width: 13, rotate: 1.2, z: 6 },
    { x: 49, y: 69, width: 12, rotate: -2, z: 4 },
    { x: 66, y: 64, width: 13, rotate: 1.6, z: 5 },
    { x: 79, y: 69, width: 12, rotate: -0.5, z: 3 },
  ],
};

function createGrandfatherScene(id, pages, caption, interactionType, files) {
  const presetKey =
    files.length <= 2 ? "two" :
    files.length === 3 ? "three" :
    files.length === 4 ? "four" :
    files.length === 5 ? "five" :
    files.length === 6 ? "six" :
    "many";

  return {
    id,
    pages,
    caption,
    interactionType,
    interactionEnabled: false,
    items: files.map((file, index) => {
      const preset = grandfatherLayoutPresets[presetKey][index % grandfatherLayoutPresets[presetKey].length];
      const override = grandfatherItemOverrides[id]?.[file] || {};
      return {
        file,
        src: `${GRANDFATHER_ITEM_BASE}${file}`,
        x: preset.x,
        y: preset.y,
        width: preset.width,
        rotate: preset.rotate,
        z: preset.z,
        opacity: 1,
        blur: 0,
        ...override,
      };
    }),
  };
}

window.grandfatherScenes = [
  createGrandfatherScene("G-01", "P05-P06", "他从这里进入这段家庭记忆。", "reveal", ["012_p005_img003.png", "014_p006_img003.png", "015_p006_img004.png"]),
  createGrandfatherScene("G-02", "P07-P08", "身份被折进纸页里，留下一个时代的痕迹。", "document-open", ["g02_document_cover.png", "016_p007_img001.png"]),
  createGrandfatherScene("G-03", "P09-P10", "照片很小，时间却很长。", "reveal", ["018_p009_img001.png", "019_p009_img002.png", "020_p010_img003.png", "021_p010_img004.png"]),
  createGrandfatherScene("G-04", "P11-P12", "证件合上以后，一个人的身份仍然留在里面。", "document-open", ["022_p011_img001.png", "023_p012_img001.png", "024_p012_img002.png"]),
  createGrandfatherScene("G-05", "P13-P14", "工作、组织和生活，被放在同一页里。", "none", ["025_p013_img001.png", "026_p014_img003.png"]),
  createGrandfatherScene("G-06", "P15-P16", "钱包里装着的，不只是票据。", "wallet-pull", ["027_p015_img003.png", "028_p016_img003.png"]),
  createGrandfatherScene("G-07", "P17-P18", "几张纸片，把生活的重量压得很轻。", "paper-slide", ["029_p017_img003.png", "030_p018_img001.png", "031_p018_img002.png", "032_p018_img003.png"]),
  createGrandfatherScene("G-08", "P19-P20", "他在照片里站定，也被一个年代看见。", "reveal", ["033_p019_img003.png", "034_p019_img004.png", "035_p020_img001.png"]),
  createGrandfatherScene("G-09", "P21-P22", "人群中的位置，也是一种留下来的痕迹。", "reveal", ["036_p021_img003.png", "037_p022_img003.png"]),
  createGrandfatherScene("G-10", "P23-P24", "纸页之间，夹着被反复确认过的身份。", "paper-slide", ["038_p023_img001.png", "039_p023_img002.png", "040_p024_img003.png"]),
  createGrandfatherScene("G-11", "P25-P26", "这些头像很轻，却把一个人分成了许多个时刻。", "reveal", ["041_p025_img003.png", "042_p025_img004.png", "043_p025_img005.png", "044_p025_img006.png", "045_p026_img003.png", "046_p026_img004.png"]),
  createGrandfatherScene("G-12", "P27-P28", "背面和正面之间，藏着另一种观看。", "paper-flip", ["047_p027_img001.png", "048_p027_img002.png", "049_p028_img001.png"]),
  createGrandfatherScene("G-13", "P29-P30", "票据留下来，生活也留下来。", "paper-slide", ["050_p029_img001.png", "051_p029_img002.png", "052_p029_img003.png", "053_p029_img004.png", "054_p029_img005.png", "055_p029_img006.png", "056_p029_img007.png", "057_p030_img001.png", "058_p030_img002.png"]),
  createGrandfatherScene("G-14", "P31-P32", "一个人的面孔，被不同的纸张反复保存。", "reveal", ["059_p031_img001.png", "060_p032_img001.png", "061_p032_img002.png"]),
  createGrandfatherScene("G-15", "P33-P34", "边齿、相纸和小头像，把时间切得很细。", "reveal", ["062_p033_img001.png", "063_p034_img001.png", "064_p034_img002.png"]),
  createGrandfatherScene("G-16", "P35-P36", "那些被收好的纸片，仍然带着生活的温度。", "paper-slide", ["065_p035_img001.png", "066_p035_img002.png", "067_p035_img003.png", "068_p036_img001.png", "069_p036_img002.png"]),
  createGrandfatherScene("G-17", "P37-P38", "照片放大以后，沉默也变得更清楚。", "reveal", ["070_p037_img001.png", "071_p038_img001.png"]),
  createGrandfatherScene("G-18", "P39-P40", "旧纸托着旧照片，像把一个人慢慢托回眼前。", "reveal", ["072_p039_img003.png", "073_p039_img004.png", "074_p040_img001.png"]),
  createGrandfatherScene("G-19", "P41-P42", "同一张脸，在不同年月里留下不同的距离。", "none", ["075_p041_img003.png", "076_p041_img004.png", "077_p042_img003.png", "078_p042_img004.png", "079_p042_img005.png", "080_p042_img006.png"]),
  createGrandfatherScene("G-20", "P43-P44", "小头像被排列起来，像一组没有说完的年份。", "none", ["081_p043_img001.png", "082_p043_img002.png", "083_p044_img001.png"]),
  createGrandfatherScene("G-21", "P45-P46", "钱、票和照片，把日常折成可以保存的形状。", "paper-slide", ["084_p045_img001.png", "085_p046_img003.png", "086_p046_img004.png", "087_p046_img005.png", "088_p046_img006.png"]),
  createGrandfatherScene("G-22", "P47-P48", "一张小纸条，靠近了两个人的旧时光。", "paper-flip", ["089_p047_img001.png", "090_p048_img001.png"]),
  createGrandfatherScene("G-23", "P49-P50", "集体照里，他成为许多人中的一个，也成为家人记住的那一个。", "reveal", ["091_p049_img001.png", "092_p050_img003.png", "093_p050_img004.png"]),
  createGrandfatherScene("G-24", "P51-P52", "纸袋收着照片，也收着一次被带回来的观看。", "paper-slide", ["094_p051_img001.png", "095_p052_img001.png", "096_p052_img002.png"]),
  createGrandfatherScene("G-25", "P53-P54", "更多人的面孔靠近时，他的那一段时间也被照亮。", "reveal", ["097_p053_img001.png", "098_p053_img002.png", "099_p054_img001.png", "100_p054_img002.png"]),
  createGrandfatherScene("G-26", "P55-P56", "生活照把严肃的年代轻轻放松了一点。", "none", ["101_p055_img001.png", "102_p056_img001.png"]),
  createGrandfatherScene("G-27", "P57-P58", "最后留下来的，不只是一页通知，也是一段被确认过的人生。", "paper-flip", ["103_p057_img001.png", "104_p058_img001.png"]),
];

window.defaultGrandfatherScenes = JSON.parse(JSON.stringify(window.grandfatherScenes));

function normalizeSavedGrandfatherScene(scene, index) {
  return {
    id: scene.id || `G-${String(index + 1).padStart(2, "0")}`,
    pages: scene.pages || "",
    caption: scene.caption || "",
    interactionType: scene.interactionType || "none",
    interactionEnabled: false,
    items: (scene.items || []).map((item) => ({
      id: item.id,
      file: item.file || "uploaded-image.png",
      src: item.src,
      x: Number(item.x ?? 50),
      y: Number(item.y ?? 50),
      width: Number(item.width ?? 22),
      rotate: Number(item.rotate ?? 0),
      z: Number(item.z ?? 3),
      opacity: Number(item.opacity ?? 1),
      blur: Number(item.blur ?? 0),
    })),
    texts: (scene.texts || []).map((textItem) => ({
      id: textItem.id,
      text: textItem.text || "",
      x: Number(textItem.x ?? 50),
      y: Number(textItem.y ?? 50),
      width: Number(textItem.width ?? 24),
      fontSize: Number(textItem.fontSize ?? 18),
      color: textItem.color || "#eee1c6",
      rotate: Number(textItem.rotate ?? 0),
      z: Number(textItem.z ?? 10),
      opacity: Number(textItem.opacity ?? 0.82),
      blur: Number(textItem.blur ?? 0),
    })),
  };
}

window.normalizeGrandfatherLayout = function normalizeGrandfatherLayout(layout) {
  if (!Array.isArray(layout?.scenes) || layout.scenes.length === 0) {
    return null;
  }

  return layout.scenes.map(normalizeSavedGrandfatherScene);
};

try {
  const savedGrandfatherLayout = window.localStorage?.getItem("familyAlbumGrandfatherLayout");
  if (savedGrandfatherLayout) {
    const parsedGrandfatherLayout = JSON.parse(savedGrandfatherLayout);
    const normalizedGrandfatherLayout = window.normalizeGrandfatherLayout(parsedGrandfatherLayout);
    if (normalizedGrandfatherLayout) {
      window.grandfatherScenes = normalizedGrandfatherLayout;
    }
  }
} catch {
  window.grandfatherScenes = window.defaultGrandfatherScenes;
}
}());
