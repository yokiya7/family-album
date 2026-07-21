const scene = document.querySelector("#homeScene");
const photo = document.querySelector("#photoObject");
const photoInteractionLayer = document.querySelector(".photo-interaction-layer");
const personHitAreas = document.querySelectorAll(".person-hit-area");
const grandfatherSequence = document.querySelector("#grandfatherSequence");
const horizontalMemoryStage = document.querySelector("#horizontalMemoryStage");
const sequenceProgress = document.querySelector("#sequenceProgress");
const sequenceSceneInfo = document.querySelector("#sequenceSceneInfo");
const sequenceBackTop = document.querySelector("#sequenceBackTop");
const sequencePrev = document.querySelector("#sequencePrev");
const sequenceNext = document.querySelector("#sequenceNext");
const SAVED_LAYOUT_KEY = "familyAlbumGrandfatherLayout";
const LAYOUT_DB_NAME = "familyAlbumLayoutEditor";
const LAYOUT_STORE_NAME = "layouts";

const phases = {
  initial: "initial",
  peek: "peek",
  dragging: "dragging",
  settling: "settling",
  enlarging: "enlarging",
  revealing: "revealing",
  familyPhotoIdle: "familyPhotoIdle",
  final: "final",
};

let phase = phases.initial;
let pointerId = null;
let startX = 0;
let startY = 0;
let hasMoved = false;

let currentIndex = 0;
let axisGap = 0;
let trackX = 0;
let isTransitioning = false;
let sequenceIntroTimer = null;
let sequenceLeaveTimer = null;
let animationFrame = null;

let stagePointerId = null;
let stageStartX = 0;
let stageStartY = 0;
let stageStartTrackX = 0;
let stageOriginIndex = 0;
let stageLastDx = 0;
let stageLastDy = 0;
let stageHasMoved = false;
let stageDocumentToggleSpread = null;
let stageCardToggleSpread = null;
let suppressDocumentClick = false;
let lastRenderedControlIndex = -1;
let layoutMode = false;
let selectedLayoutItem = null;
let layoutPanel = null;
let itemPointerId = null;
let itemDragStartX = 0;
let itemDragStartY = 0;
let itemStartX = 0;
let itemStartY = 0;
let savedGrandfatherLayoutLoaded = false;

function setFamilyState(nextState) {
  scene.dataset.familyState = nextState;
  if (nextState !== "namesReveal") {
    clearFamilyHoverState();
  }
}

function clearActivePerson() {
  scene.removeAttribute("data-active-person");
}

function clearPhotoHovered() {
  scene.removeAttribute("data-photo-hovered");
}

function clearFamilyHoverState() {
  clearPhotoHovered();
  clearActivePerson();
}

function setPhotoHovered() {
  if (scene.dataset.familyState !== "namesReveal") {
    return;
  }

  scene.dataset.photoHovered = "true";
}

function setPhase(nextPhase) {
  phase = nextPhase;
  scene.dataset.phase = nextPhase;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setDragVars(x, y, progress) {
  const rot = -3;
  const scale = 0.65;
  photo.style.setProperty("--drag-x", `${x}px`);
  photo.style.setProperty("--drag-y", `${y}px`);
  photo.style.setProperty("--drag-rot", `${rot}deg`);
  photo.style.setProperty("--drag-scale", String(scale));
}

function clearDragVars() {
  photo.style.removeProperty("--drag-x");
  photo.style.removeProperty("--drag-y");
  photo.style.removeProperty("--drag-rot");
  photo.style.removeProperty("--drag-scale");
  photo.style.removeProperty("--drag-base-left");
  photo.style.removeProperty("--drag-base-top");
}

function formatSceneNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function sceneHasVisibleContent(sceneData) {
  const visibleItems = (sceneData?.items || []).some((item) => Number(item.opacity ?? 1) > 0 && Number(item.width ?? 0) > 0);
  const visibleTexts = (sceneData?.texts || []).some((item) => String(item.text || "").trim() && Number(item.opacity ?? 1) > 0);
  return visibleItems || visibleTexts;
}

function getScenes() {
  return (window.grandfatherScenes || []).filter(sceneHasVisibleContent);
}

function openGrandfatherLayoutDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LAYOUT_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(LAYOUT_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadGrandfatherLayoutFromIndexedDb() {
  const db = await openGrandfatherLayoutDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LAYOUT_STORE_NAME, "readonly");
    const request = transaction.objectStore(LAYOUT_STORE_NAME).get(SAVED_LAYOUT_KEY);
    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function ensureSavedGrandfatherLayoutLoaded() {
  if (savedGrandfatherLayoutLoaded) {
    return;
  }

  savedGrandfatherLayoutLoaded = true;
  try {
    const savedLayout = await loadGrandfatherLayoutFromIndexedDb();
    const normalizedLayout = window.normalizeGrandfatherLayout?.(savedLayout);
    if (normalizedLayout) {
      window.grandfatherScenes = normalizedLayout;
    }
  } catch {
    // localStorage/default scenes are already loaded by grandfather-scenes.js.
  }
}

function calculateAxisGap() {
  axisGap = Math.max(680, window.innerWidth * 0.58);
}

function getMinTrackX() {
  return -Math.max(0, getScenes().length - 1) * axisGap;
}

function getTrackXForIndex(index) {
  return -index * axisGap;
}

function getNearestIndex() {
  const scenes = getScenes();
  if (scenes.length === 0) {
    return 0;
  }

  return clamp(Math.round(-trackX / axisGap), 0, scenes.length - 1);
}

function getSceneInteractionType(sceneData) {
  const sceneId = String(sceneData?.id || "");
  const pages = String(sceneData?.pages || "");
  const itemRefs = (sceneData?.items || [])
    .map((item) => `${item.file || ""} ${item.src || ""}`)
    .join(" ")
    .toLowerCase();
  const hasG02Pair =
    (itemRefs.includes("g02_document_cover") || itemRefs.includes("组 1") || itemRefs.includes("017_p008")) &&
    itemRefs.includes("016_p007");
  const hasRedDocumentPair = itemRefs.includes("023_p012") && itemRefs.includes("024_p012");
  const hasMedicalCardPair = itemRefs.includes("018_p009") && itemRefs.includes("019_p009");

  if (hasG02Pair || hasRedDocumentPair || sceneId === "G-02" || /p0?7\s*-\s*p0?8/i.test(pages)) {
    return "document-open";
  }

  if (hasMedicalCardPair) {
    return "paper-flip";
  }

  if (sceneData?.interactionType === "document-open") {
    return "none";
  }

  if (sceneData?.interactionType && sceneData.interactionType !== "none") {
    return sceneData.interactionType;
  }

  return "none";
}

function getItemRef(item) {
  return `${item?.file || ""} ${item?.src || ""}`.toLowerCase();
}

function itemHas(item, token) {
  return getItemRef(item).includes(token);
}

function sceneHas(sceneData, token) {
  return (sceneData?.items || []).some((item) => itemHas(item, token));
}

function getSceneId(sceneData) {
  return String(sceneData?.id || "");
}

function getSceneItemDelay(index, base = 0.24, step = 0.22) {
  return Number((base + index * step).toFixed(2));
}

function getDocumentItemClass(sceneData, item, index) {
  if (getSceneInteractionType(sceneData) !== "document-open") {
    return "";
  }

  const ref = getItemRef(item);
  const sceneRef = (sceneData?.items || [])
    .map((sceneItem) => `${sceneItem.file || ""} ${sceneItem.src || ""}`)
    .join(" ")
    .toLowerCase();
  const knownDocumentTokens = [
    "g02_document_cover",
    "组 1",
    "016_p007",
    "017_p008",
    "022_p011",
    "023_p012",
    "024_p012",
  ];
  const hasKnownDocumentAssets = knownDocumentTokens.some((token) => sceneRef.includes(token));
  const hasRedDocumentPair = sceneRef.includes("023_p012") && sceneRef.includes("024_p012");

  const isCover =
    ref.includes("g02_document_cover") ||
    ref.includes("组 1") ||
    ref.includes("017_p008") ||
    ref.includes("022_p011");
  const isInside = ref.includes("016_p007") || ref.includes("024_p012");

  if (hasRedDocumentPair && ref.includes("023_p012")) {
    return " is-document-hidden-cover";
  }

  if (isCover) {
    return " is-document-cover";
  }

  if (isInside) {
    return " is-document-inside";
  }

  if (hasKnownDocumentAssets) {
    return "";
  }

  if (index === 0) {
    return " is-document-cover";
  }

  return "";
}

function getMotionConfig(item, sceneData, index) {
  const sceneId = getSceneId(sceneData);
  const ref = getItemRef(item);
  const has = (token) => ref.includes(token);

  if (has("020_p010_img003")) {
    return { className: " is-document-after-reveal", delay: 0 };
  }

  if (has("019_p009_img002")) {
    return { className: " is-card-flip is-card-front", delay: 0 };
  }

  if (has("018_p009_img001")) {
    return { className: " is-card-flip is-card-back", delay: 0 };
  }

  if (has("062_p033_img001")) {
    return { className: " is-depth-soft-reveal", delay: 0.55 };
  }

  if (has("038_p023_img001")) {
    return { className: " is-gentle-shake", delay: 0.58 };
  }

  if (sceneId === "G-06" && has("027_p015_img003")) {
    return { className: " is-place-reveal is-late-reveal", delay: 1.18 };
  }

  if (sceneId === "G-07" && has("045_p026_img003")) {
    return { className: " is-slide-up-reveal is-slower-motion", delay: 0.5 };
  }

  if (sceneId === "G-09" && has("058_p030_img002")) {
    return { className: " is-place-reveal", delay: 0.55 };
  }

  if (sceneId === "G-11") {
    return { className: " is-place-reveal", delay: getSceneItemDelay(index, 0.22, 0.24) };
  }

  if (sceneId === "G-12" && has("048_p027_img002")) {
    return { className: " is-place-reveal", delay: 0.24 };
  }

  if (sceneId === "G-12" && has("049_p028_img001")) {
    return { className: " is-down-reveal", delay: 1.36 };
  }

  if (sceneId === "G-14" && has("069_p036_img002")) {
    return { className: " is-place-reveal", delay: 0.24 };
  }

  if (sceneId === "G-14" && has("067_p035_img003")) {
    return { className: " is-ticket-shake", delay: 1.28 };
  }

  if (sceneId === "G-13") {
    return { className: " is-depth-soft-reveal", delay: getSceneItemDelay(index, 0.18, 0.2) };
  }

  if (sceneId === "G-16" && has("070_p037_img001")) {
    return { className: " is-place-reveal is-stable-reveal", delay: 0.46 };
  }

  if (sceneId === "G-21" && has("071_p038_img001")) {
    return { className: " is-place-reveal is-stable-reveal", delay: 0.46 };
  }

  if (sceneId === "G-19" && (has("080_p042_img006") || has("082_p043_img002"))) {
    return { className: " is-left-unfold-reveal", delay: has("080_p042_img006") ? 0.46 : 0.72 };
  }

  if (sceneId === "G-23" && has("093_p050_img004")) {
    return { className: " is-after-text-reveal", delay: 1.42 };
  }

  if (sceneId === "G-27" && has("103_p057_img001")) {
    return { className: " is-notice-reveal", delay: 0.64 };
  }

  if (has("031_p018_img002")) {
    return { className: " is-place-reveal", delay: 0.42 };
  }

  if (has("032_p018_img003")) {
    return { className: " is-place-reveal", delay: 0.82 };
  }

  if (has("067_p035_img003")) {
    return { className: " is-ticket-shake", delay: 0.38 };
  }

  if (has("098_p053_img002")) {
    return { className: " is-slide-up-reveal", delay: 0.5 };
  }

  if (has("070_p037_img001") || has("071_p038_img001")) {
    return { className: " is-depth-reveal", delay: 0.48 };
  }

  if (
    has("050_p029_img001") ||
    has("056_p029_img007") ||
    has("057_p030_img001") ||
    has("058_p030_img002") ||
    has("069_p036_img002") ||
    has("093_p050_img004") ||
    has("103_p057_img001")
  ) {
    return { className: " is-slow-reveal", delay: 0.36 };
  }

  return { className: "", delay: 0 };
}

function getItemClasses(sceneData, item, index) {
  return `${getDocumentItemClass(sceneData, item, index)}${getMotionConfig(item, sceneData, index).className}`;
}

function getTextMotionConfig(textItem, sceneData, index) {
  if (getSceneId(sceneData) === "G-11") {
    return { className: " is-delayed-text", delay: 3.35 };
  }

  return { className: "", delay: 0.22 };
}

function createSequenceItemMarkup(sceneData, item, index, extraClassName = "", overrides = {}) {
  const x = Number(overrides.x ?? item.x);
  const y = Number(overrides.y ?? item.y);
  const width = Number(overrides.width ?? item.width);
  const rotate = Number(overrides.rotate ?? item.rotate);
  const z = Number(overrides.z ?? item.z);
  const opacity = Number(overrides.opacity ?? item.opacity);
  const blur = Number(overrides.blur ?? item.blur);
  const motionConfig = overrides.motionConfig || getMotionConfig(item, sceneData, index);

  return `
    <img
      class="sequence-item${extraClassName || getItemClasses(sceneData, item, index)}"
      src="${overrides.src || item.src}"
      data-file="${overrides.file || item.file}"
      alt=""
      style="
        --item-x: ${x}%;
        --item-y: ${y}%;
        --item-width: ${width}%;
        --item-rotate: ${rotate}deg;
        --item-z: ${z};
        --item-opacity: ${opacity};
        --item-blur: ${blur}px;
        --motion-delay: ${motionConfig.delay}s;
      "
    >
  `;
}

function createRedDocumentClosedCover(sceneData) {
  if (!sceneHas(sceneData, "023_p012") || !sceneHas(sceneData, "024_p012")) {
    return "";
  }

  const openCover = (sceneData.items || []).find((item) => itemHas(item, "023_p012"));
  if (!openCover) {
    return "";
  }

  const closedWidth = Number(openCover.width) * 0.54;
  const closedX = Number(openCover.x) + Number(openCover.width) * 0.25;

  return createSequenceItemMarkup(
    sceneData,
    openCover,
    -1,
    " is-document-cover is-document-closed-cover",
    {
      file: "red_member_cover_closed.png",
      src: "assets/grandfather/items/red_member_cover_closed.png",
      x: clamp(closedX, -30, 130),
      width: closedWidth,
      z: Number(openCover.z || 0) + 32,
      opacity: 1,
      motionConfig: { delay: 0 },
    },
  );
}

function createSceneItems(sceneData) {
  return `${sceneData.items.map((item, index) => createSequenceItemMarkup(sceneData, item, index)).join("")}${createRedDocumentClosedCover(sceneData)}`;
}

function createSceneTexts(sceneData) {
  return (sceneData.texts || []).map((item, index) => {
    const textMotionConfig = getTextMotionConfig(item, sceneData, index);
    return `
    <div
      class="sequence-text${textMotionConfig.className}"
      data-text-id="${item.id}"
      style="
        --text-x: ${item.x}%;
        --text-y: ${item.y}%;
        --text-width: ${item.width}%;
        --text-size: ${item.fontSize}px;
        --text-color: ${item.color};
        --text-rotate: ${item.rotate}deg;
        --text-z: ${item.z};
        --text-opacity: ${item.opacity};
        --text-blur: ${item.blur}px;
        --text-motion-delay: ${textMotionConfig.delay}s;
      "
    >${escapeHtml(item.text || "")}</div>
  `;
  }).join("");
}

function renderGrandfatherSequence() {
  const scenes = getScenes();
  if (!horizontalMemoryStage || scenes.length === 0) {
    return;
  }

  calculateAxisGap();
  horizontalMemoryStage.innerHTML = `
    <div class="memory-axis-track" id="memoryAxisTrack">
      ${scenes.map((sceneData, index) => `
        <article
          class="axis-spread"
          data-scene-index="${index}"
          data-scene-id="${sceneData.id}"
          data-interaction="${getSceneInteractionType(sceneData)}"
          style="--axis-x: ${index * axisGap}px;"
        >
          <div class="spread-stage">
            ${createSceneItems(sceneData)}
            ${createSceneTexts(sceneData)}
          </div>
        </article>
      `).join("")}
    </div>
  `;

  trackX = getTrackXForIndex(currentIndex);
  applyTrackPosition();
  updateAxisVisuals();
}

function updateSequenceControls(force = false) {
  const scenes = getScenes();
  const activeScene = scenes[currentIndex];
  if (!activeScene) {
    return;
  }

  if (force || lastRenderedControlIndex !== currentIndex) {
    sequenceProgress.textContent = `${formatSceneNumber(currentIndex)} / ${scenes.length}`;
    sequenceSceneInfo.innerHTML = "";
    lastRenderedControlIndex = currentIndex;
  }

  sequencePrev.disabled = currentIndex <= 0 || isTransitioning;
  sequenceNext.disabled = currentIndex >= scenes.length - 1 || isTransitioning;
}

function applyTrackPosition() {
  const track = document.querySelector("#memoryAxisTrack");
  if (track) {
    track.style.transform = `translate3d(${trackX}px, 0, 0)`;
  }
}

function updateAxisVisuals() {
  const viewportCenter = window.innerWidth / 2;
  const fadeDistance = window.innerWidth * 0.78;
  let nearestIndex = currentIndex;
  let nearestDistance = Infinity;

  document.querySelectorAll(".axis-spread").forEach((spread) => {
    const index = Number(spread.dataset.sceneIndex);
    const spreadCenter = viewportCenter + trackX + index * axisGap;
    const distance = spreadCenter - viewportCenter;
    const absDistance = Math.abs(distance);
    const normalized = clamp(absDistance / fadeDistance, 0, 1);
    const focus = 1 - normalized;
    const opacity = 0.24 + focus * 0.76;
    const blur = normalized * 10;
    const brightness = 0.66 + focus * 0.34;
    const contrast = 0.88 + focus * 0.12;
    const saturation = 0.78 + focus * 0.22;
    const scale = 0.92 + focus * 0.08;
    const z = Math.round(focus * 100);

    if (absDistance < nearestDistance) {
      nearestDistance = absDistance;
      nearestIndex = index;
    }

    spread.style.setProperty("--axis-opacity", opacity.toFixed(3));
    spread.style.setProperty("--axis-blur", `${blur.toFixed(2)}px`);
    spread.style.setProperty("--axis-brightness", brightness.toFixed(3));
    spread.style.setProperty("--axis-contrast", contrast.toFixed(3));
    spread.style.setProperty("--axis-saturation", saturation.toFixed(3));
    spread.style.setProperty("--axis-scale", scale.toFixed(3));
    spread.style.setProperty("--axis-z", String(z));
    const isCurrent = index === currentIndex;
    spread.classList.toggle("is-axis-current", isCurrent);
    if (!isCurrent) {
      spread.classList.remove("is-document-open");
      spread.classList.remove("is-card-flipped");
    }
  });

  if (nearestIndex !== currentIndex && !isTransitioning) {
    currentIndex = nearestIndex;
  } else if (nearestIndex !== currentIndex && isTransitioning) {
    currentIndex = nearestIndex;
  }

  updateSequenceControls();
  updateLayoutPanel();
}

function getCurrentScene() {
  return getScenes()[currentIndex] || null;
}

function getSelectedItemData() {
  if (!selectedLayoutItem) {
    return null;
  }

  const activeScene = getCurrentScene();
  if (!activeScene) {
    return null;
  }

  return activeScene.items.find((item) => item.file === selectedLayoutItem.dataset.file) || null;
}

function ensureLayoutPanel() {
  if (layoutPanel) {
    return layoutPanel;
  }

  layoutPanel = document.createElement("div");
  layoutPanel.className = "layout-panel";
  layoutPanel.innerHTML = `
    <div class="layout-panel-title">调版模式</div>
    <div class="layout-panel-body" id="layoutPanelBody">按 D 进入，点选当前幕照片。</div>
  `;
  grandfatherSequence.appendChild(layoutPanel);
  return layoutPanel;
}

function updateLayoutPanel(message = "") {
  if (!layoutMode || !layoutPanel) {
    return;
  }

  const body = layoutPanel.querySelector("#layoutPanelBody");
  const activeScene = getCurrentScene();
  const item = getSelectedItemData();
  if (!body || !activeScene) {
    return;
  }

  if (!item) {
    body.innerHTML = `
      <div>${activeScene.id} / ${activeScene.pages}</div>
      <div>点选中间这一幕里的照片。</div>
      <div class="layout-panel-hint">拖动位置，滚轮缩放，Q/E 旋转，[/] 层级，C 复制。</div>
      ${message ? `<div class="layout-panel-message">${message}</div>` : ""}
    `;
    return;
  }

  body.innerHTML = `
    <div>${activeScene.id} / ${activeScene.pages}</div>
    <div class="layout-panel-file">${item.file}</div>
    <pre>{
  "${item.file}": { x: ${Number(item.x).toFixed(1)}, y: ${Number(item.y).toFixed(1)}, width: ${Number(item.width).toFixed(1)}, rotate: ${Number(item.rotate).toFixed(1)}, z: ${Math.round(Number(item.z))} }
}</pre>
    <div class="layout-panel-hint">拖动位置，滚轮缩放，Q/E 旋转，[/] 层级，C 复制当前幕。</div>
    ${message ? `<div class="layout-panel-message">${message}</div>` : ""}
  `;
}

function clearSelectedLayoutItem() {
  selectedLayoutItem?.classList.remove("is-layout-selected");
  selectedLayoutItem = null;
  updateLayoutPanel();
}

function selectLayoutItem(itemElement) {
  if (!layoutMode) {
    return;
  }

  selectedLayoutItem?.classList.remove("is-layout-selected");
  selectedLayoutItem = itemElement;
  selectedLayoutItem.classList.add("is-layout-selected");
  updateLayoutPanel();
}

function applyItemDataToElement(itemElement, itemData) {
  itemElement.style.setProperty("--item-x", `${itemData.x}%`);
  itemElement.style.setProperty("--item-y", `${itemData.y}%`);
  itemElement.style.setProperty("--item-width", `${itemData.width}%`);
  itemElement.style.setProperty("--item-rotate", `${itemData.rotate}deg`);
  itemElement.style.setProperty("--item-z", itemData.z);
  itemElement.style.setProperty("--item-opacity", itemData.opacity ?? 1);
  itemElement.style.setProperty("--item-blur", `${itemData.blur ?? 0}px`);
}

function updateSelectedItem(mutator) {
  const item = getSelectedItemData();
  if (!item || !selectedLayoutItem) {
    return;
  }

  mutator(item);
  item.x = Number(item.x);
  item.y = Number(item.y);
  item.width = Number(item.width);
  item.rotate = Number(item.rotate);
  item.z = Number(item.z);
  applyItemDataToElement(selectedLayoutItem, item);
  updateLayoutPanel();
}

function toggleLayoutMode() {
  layoutMode = !layoutMode;
  grandfatherSequence.dataset.layoutMode = layoutMode ? "true" : "false";
  ensureLayoutPanel();
  layoutPanel.hidden = !layoutMode;
  if (!layoutMode) {
    clearSelectedLayoutItem();
    return;
  }

  snapToNearestScene();
  updateLayoutPanel("已进入调版模式");
}

async function copyCurrentSceneLayout() {
  const activeScene = getCurrentScene();
  if (!activeScene) {
    return;
  }

  const lines = activeScene.items.map((item) => (
    `    "${item.file}": { x: ${Number(item.x).toFixed(1)}, y: ${Number(item.y).toFixed(1)}, width: ${Number(item.width).toFixed(1)}, rotate: ${Number(item.rotate).toFixed(1)}, z: ${Math.round(Number(item.z))}, opacity: ${Number(item.opacity ?? 1).toFixed(2)}, blur: ${Number(item.blur ?? 0).toFixed(1)} }`
  ));
  const text = `"${activeScene.id}": {\n${lines.join(",\n")}\n}`;

  try {
    await navigator.clipboard.writeText(text);
    updateLayoutPanel("已复制当前幕参数");
  } catch {
    updateLayoutPanel(text);
  }
}

function animateTrackTo(targetX, duration = 950) {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }

  const startXValue = trackX;
  const delta = targetX - startXValue;
  const startTime = performance.now();
  isTransitioning = true;
  grandfatherSequence.dataset.transition = "axis";
  updateSequenceControls();

  const ease = (value) => {
    if (value < 0.5) {
      return 4 * value * value * value;
    }

    return 1 - Math.pow(-2 * value + 2, 3) / 2;
  };

  function step(now) {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const eased = ease(progress);
    trackX = startXValue + delta * eased;
    applyTrackPosition();
    updateAxisVisuals();

    if (progress < 1) {
      animationFrame = window.requestAnimationFrame(step);
      return;
    }

    animationFrame = null;
    trackX = targetX;
    currentIndex = getNearestIndex();
    isTransitioning = false;
    delete grandfatherSequence.dataset.transition;
    applyTrackPosition();
    updateAxisVisuals();
  }

  animationFrame = window.requestAnimationFrame(step);
}

function snapToNearestScene() {
  const nearestIndex = getNearestIndex();
  animateTrackTo(getTrackXForIndex(nearestIndex), 860);
}

function goToSequenceIndex(nextIndex) {
  const scenes = getScenes();
  if (isTransitioning || nextIndex < 0 || nextIndex >= scenes.length || nextIndex === currentIndex) {
    return;
  }

  clearSelectedLayoutItem();
  animateTrackTo(getTrackXForIndex(nextIndex), 1120);
}

function goNextSequence() {
  goToSequenceIndex(currentIndex + 1);
}

function goPrevSequence() {
  goToSequenceIndex(currentIndex - 1);
}

async function showGrandfatherSequence(pushState = true) {
  await ensureSavedGrandfatherLayoutLoaded();

  if (sequenceLeaveTimer) {
    window.clearTimeout(sequenceLeaveTimer);
    sequenceLeaveTimer = null;
  }

  currentIndex = 0;
  isTransitioning = false;
  trackX = 0;
  lastRenderedControlIndex = -1;
  scene.hidden = true;
  grandfatherSequence.hidden = false;
  grandfatherSequence.dataset.intro = "show";
  delete grandfatherSequence.dataset.ready;
  delete grandfatherSequence.dataset.leaving;
  delete grandfatherSequence.dataset.transition;
  document.body.classList.add("sequence-mode");
  renderGrandfatherSequence();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  window.requestAnimationFrame(() => {
    grandfatherSequence.dataset.ready = "true";
    applyTrackPosition();
    updateAxisVisuals();
  });

  if (sequenceIntroTimer) {
    window.clearTimeout(sequenceIntroTimer);
  }

  sequenceIntroTimer = window.setTimeout(() => {
    grandfatherSequence.dataset.intro = "hidden";
  }, 1450);

  if (pushState) {
    window.history.pushState({ view: "grandfather" }, "", "/family/grandfather");
  }
}

function finishShowFamilyHome() {
  layoutMode = false;
  layoutPanel?.setAttribute("hidden", "");
  clearSelectedLayoutItem();
  document.body.classList.remove("sequence-mode");
  grandfatherSequence.hidden = true;
  delete grandfatherSequence.dataset.ready;
  delete grandfatherSequence.dataset.leaving;
  delete grandfatherSequence.dataset.transition;
  delete grandfatherSequence.dataset.layoutMode;
  scene.hidden = false;
  setPhase(phases.final);
  setFamilyState("namesReveal");
  clearActivePerson();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function showFamilyHome(pushState = true) {
  if (sequenceIntroTimer) {
    window.clearTimeout(sequenceIntroTimer);
    sequenceIntroTimer = null;
  }

  scene.hidden = false;
  grandfatherSequence.dataset.leaving = "true";
  isTransitioning = true;
  sequenceLeaveTimer = window.setTimeout(() => {
    isTransitioning = false;
    finishShowFamilyHome();
  }, 760);

  if (pushState) {
    window.history.pushState({ view: "home" }, "", "/");
  }
}

async function completeExtraction() {
  setPhase(phases.settling);
  await wait(1900);
  clearDragVars();
  setPhase(phases.enlarging);
  await wait(3450);
  setPhase(phases.final);
  setFamilyState("photoIdle");
  await wait(1000);
  if (phase === phases.final) {
    setFamilyState("namesReveal");
  }
}

function startDrag(event) {
  if (phase !== phases.peek) {
    return;
  }

  event.preventDefault();
  pointerId = event.pointerId;
  startX = event.clientX;
  startY = event.clientY;
  hasMoved = false;
  const currentBox = photo.getBoundingClientRect();
  photo.style.setProperty("--drag-base-left", `${currentBox.left + currentBox.width / 2}px`);
  photo.style.setProperty("--drag-base-top", `${currentBox.top + currentBox.height / 2}px`);
  photo.setPointerCapture(pointerId);
  setDragVars(0, 0, 0);
  setPhase(phases.dragging);
}

function moveDrag(event) {
  if (phase !== phases.dragging || event.pointerId !== pointerId) {
    return;
  }

  event.preventDefault();
  const rawX = event.clientX - startX;
  const rawY = event.clientY - startY;
  const progress = clamp(Math.hypot(rawX, rawY) / 150, 0, 1);

  if (Math.abs(rawX) > 3 || Math.abs(rawY) > 3) {
    hasMoved = true;
  }

  setDragVars(rawX, rawY, progress);
}

function endDrag(event, forceComplete = false) {
  if (phase !== phases.dragging || event.pointerId !== pointerId) {
    return;
  }

  try {
    photo.releasePointerCapture(pointerId);
  } catch {
    // The browser can release pointer capture during a completed gesture.
  }

  pointerId = null;

  const dragX = Number.parseFloat(getComputedStyle(photo).getPropertyValue("--drag-x")) || 0;
  const dragY = Number.parseFloat(getComputedStyle(photo).getPropertyValue("--drag-y")) || 0;
  const progressed = Math.hypot(dragX, dragY) > 90;

  if (forceComplete || progressed) {
    completeExtraction();
    return;
  }

  clearDragVars();
  setPhase(phases.peek);
}

function clickFallback() {
  if (phase === phases.peek && !hasMoved) {
    completeExtraction();
  }
}

function startStageDrag(event) {
  if (grandfatherSequence.hidden || layoutMode) {
    return;
  }

  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    isTransitioning = false;
    delete grandfatherSequence.dataset.transition;
  }

  stagePointerId = event.pointerId;
  stageStartX = event.clientX;
  stageStartY = event.clientY;
  stageStartTrackX = trackX;
  stageOriginIndex = currentIndex;
  stageLastDx = 0;
  stageLastDy = 0;
  stageHasMoved = false;
  stageDocumentToggleSpread = event.target
    ?.closest(".sequence-item")
    ?.closest('.axis-spread.is-axis-current[data-interaction="document-open"]') || null;
  stageCardToggleSpread = stageDocumentToggleSpread
    ? null
    : event.target
      ?.closest(".is-card-flip")
      ?.closest(".axis-spread.is-axis-current") || null;
  horizontalMemoryStage.setPointerCapture(stagePointerId);
  grandfatherSequence.dataset.dragging = "true";
}

function moveStageDrag(event) {
  if (event.pointerId !== stagePointerId) {
    return;
  }

  const dx = event.clientX - stageStartX;
  const dy = event.clientY - stageStartY;
  stageLastDx = dx;
  stageLastDy = dy;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    stageHasMoved = true;
  }

  event.preventDefault();
  trackX = clamp(stageStartTrackX + dx, getMinTrackX(), 0);
  applyTrackPosition();
  updateAxisVisuals();
}

function endStageDrag(event) {
  if (event.pointerId !== stagePointerId) {
    return;
  }

  try {
    horizontalMemoryStage.releasePointerCapture(stagePointerId);
  } catch {
    // Pointer capture may already be released by the browser.
  }

  stagePointerId = null;
  delete grandfatherSequence.dataset.dragging;

  if (!stageHasMoved) {
    if (stageDocumentToggleSpread?.isConnected) {
      stageDocumentToggleSpread.classList.toggle("is-document-open");
      suppressDocumentClick = true;
      window.setTimeout(() => {
        suppressDocumentClick = false;
      }, 0);
    } else if (stageCardToggleSpread?.isConnected) {
      stageCardToggleSpread.classList.toggle("is-card-flipped");
      suppressDocumentClick = true;
      window.setTimeout(() => {
        suppressDocumentClick = false;
      }, 0);
    }
    stageDocumentToggleSpread = null;
    stageCardToggleSpread = null;
    return;
  }

  stageDocumentToggleSpread = null;
  stageCardToggleSpread = null;

  const horizontalIntent = Math.abs(stageLastDx) > Math.abs(stageLastDy) * 1.15;
  const shouldAdvance = horizontalIntent && Math.abs(stageLastDx) > 88;
  if (shouldAdvance) {
    const nextIndex = clamp(stageOriginIndex + (stageLastDx < 0 ? 1 : -1), 0, getScenes().length - 1);
    animateTrackTo(getTrackXForIndex(nextIndex), 980);
    return;
  }

  snapToNearestScene();
}

function handleStageWheel(event) {
  if (layoutMode) {
    if (!selectedLayoutItem) {
      return;
    }

    event.preventDefault();
    const step = event.shiftKey ? 0.4 : 1.2;
    const direction = event.deltaY < 0 ? 1 : -1;
    updateSelectedItem((item) => {
      item.width = clamp(item.width + direction * step, 2, 120);
    });
    return;
  }

  if (grandfatherSequence.hidden || isTransitioning) {
    return;
  }

  event.preventDefault();
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (Math.abs(delta) < 24) {
    return;
  }

  if (delta > 0) {
    goNextSequence();
  } else {
    goPrevSequence();
  }
}

function startItemDrag(event) {
  if (!layoutMode || !event.target.classList.contains("sequence-item")) {
    return;
  }

  const spread = event.target.closest(".axis-spread");
  if (!spread?.classList.contains("is-axis-current")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  selectLayoutItem(event.target);
  const item = getSelectedItemData();
  if (!item) {
    return;
  }

  itemPointerId = event.pointerId;
  itemDragStartX = event.clientX;
  itemDragStartY = event.clientY;
  itemStartX = Number(item.x);
  itemStartY = Number(item.y);
  event.target.setPointerCapture(itemPointerId);
  event.target.classList.add("is-layout-dragging");
}

function moveItemDrag(event) {
  if (!layoutMode || event.pointerId !== itemPointerId || !selectedLayoutItem) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const stage = selectedLayoutItem.closest(".spread-stage");
  const rect = stage?.getBoundingClientRect();
  if (!rect) {
    return;
  }

  const dx = ((event.clientX - itemDragStartX) / rect.width) * 100;
  const dy = ((event.clientY - itemDragStartY) / rect.height) * 100;
  updateSelectedItem((item) => {
    item.x = clamp(itemStartX + dx, -30, 130);
    item.y = clamp(itemStartY + dy, -30, 130);
  });
}

function endItemDrag(event) {
  if (event.pointerId !== itemPointerId || !selectedLayoutItem) {
    return;
  }

  try {
    selectedLayoutItem.releasePointerCapture(itemPointerId);
  } catch {
    // Pointer capture can be released by the browser.
  }

  selectedLayoutItem.classList.remove("is-layout-dragging");
  itemPointerId = null;
}

function toggleDocumentOpen(event) {
  if (suppressDocumentClick) {
    suppressDocumentClick = false;
    return;
  }

  if (grandfatherSequence.hidden || layoutMode || stageHasMoved) {
    return;
  }

  const item = event.target.closest(".sequence-item");
  const spread = item?.closest('.axis-spread[data-interaction="document-open"]');
  if (!spread?.classList.contains("is-axis-current")) {
    const cardSpread = event.target.closest(".is-card-flip")?.closest(".axis-spread.is-axis-current");
    if (cardSpread) {
      event.preventDefault();
      cardSpread.classList.toggle("is-card-flipped");
    }
    return;
  }

  event.preventDefault();
  spread.classList.toggle("is-document-open");
}

window.addEventListener("load", async () => {
  if (window.location.pathname.replace(/\/$/, "") === "/family/grandfather") {
    await showGrandfatherSequence(false);
    return;
  }

  await wait(900);
  setPhase(phases.peek);
});

photo.addEventListener("pointerdown", startDrag);
photo.addEventListener("pointermove", moveDrag);
photo.addEventListener("pointerup", (event) => endDrag(event));
photo.addEventListener("pointercancel", (event) => endDrag(event));
photo.addEventListener("click", clickFallback);
photo.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && phase === phases.peek) {
    event.preventDefault();
    completeExtraction();
  }
});

photoInteractionLayer?.addEventListener("pointerenter", setPhotoHovered);
photoInteractionLayer?.addEventListener("pointerleave", clearFamilyHoverState);

personHitAreas.forEach((area) => {
  area.addEventListener("pointerenter", () => {
    if (scene.dataset.familyState !== "namesReveal") {
      return;
    }

    setPhotoHovered();
    scene.dataset.activePerson = area.dataset.person;
  });

  area.addEventListener("pointerleave", clearActivePerson);

  area.addEventListener("click", (event) => {
    if (scene.dataset.familyState !== "namesReveal") {
      return;
    }

    event.stopPropagation();
    if (area.dataset.person === "grandfather") {
      showGrandfatherSequence(true);
      return;
    }

    const href = area.dataset.href;
    if (href) {
      window.location.href = href;
    }
  });
});

sequenceBackTop?.addEventListener("click", () => showFamilyHome(true));
sequencePrev?.addEventListener("click", goPrevSequence);
sequenceNext?.addEventListener("click", goNextSequence);
horizontalMemoryStage?.addEventListener("pointerdown", startStageDrag);
horizontalMemoryStage?.addEventListener("pointerdown", startItemDrag);
horizontalMemoryStage?.addEventListener("pointermove", moveStageDrag);
horizontalMemoryStage?.addEventListener("pointermove", moveItemDrag);
horizontalMemoryStage?.addEventListener("pointerup", endStageDrag);
horizontalMemoryStage?.addEventListener("pointerup", endItemDrag);
horizontalMemoryStage?.addEventListener("pointercancel", (event) => {
  if (event.pointerId === stagePointerId) {
    stagePointerId = null;
    stageDocumentToggleSpread = null;
    stageCardToggleSpread = null;
    delete grandfatherSequence.dataset.dragging;
    snapToNearestScene();
  }

  if (event.pointerId === itemPointerId) {
    endItemDrag(event);
  }
});
horizontalMemoryStage?.addEventListener("wheel", handleStageWheel, { passive: false });
horizontalMemoryStage?.addEventListener("click", toggleDocumentOpen);

window.addEventListener("resize", () => {
  if (grandfatherSequence.hidden) {
    return;
  }

  calculateAxisGap();
  document.querySelectorAll(".axis-spread").forEach((spread) => {
    const index = Number(spread.dataset.sceneIndex);
    spread.style.setProperty("--axis-x", `${index * axisGap}px`);
  });
  trackX = getTrackXForIndex(currentIndex);
  applyTrackPosition();
  updateAxisVisuals();
});

window.addEventListener("keydown", (event) => {
  if (grandfatherSequence.hidden) {
    return;
  }

  if (event.key.toLowerCase() === "d") {
    event.preventDefault();
    toggleLayoutMode();
    return;
  }

  if (layoutMode && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copyCurrentSceneLayout();
    return;
  }

  if (layoutMode && selectedLayoutItem) {
    if (event.key.toLowerCase() === "q") {
      event.preventDefault();
      updateSelectedItem((item) => {
        item.rotate -= event.shiftKey ? 0.2 : 1;
      });
      return;
    }

    if (event.key.toLowerCase() === "e") {
      event.preventDefault();
      updateSelectedItem((item) => {
        item.rotate += event.shiftKey ? 0.2 : 1;
      });
      return;
    }

    if (event.key === "[") {
      event.preventDefault();
      updateSelectedItem((item) => {
        item.z = clamp(Math.round(item.z) - 1, 0, 99);
      });
      return;
    }

    if (event.key === "]") {
      event.preventDefault();
      updateSelectedItem((item) => {
        item.z = clamp(Math.round(item.z) + 1, 0, 99);
      });
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      updateSelectedItem((item) => {
        item.opacity = item.opacity === 0 ? 1 : 0;
      });
      return;
    }
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goNextSequence();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrevSequence();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    showFamilyHome(true);
  }
});

window.addEventListener("popstate", () => {
  if (window.location.pathname.replace(/\/$/, "") === "/family/grandfather") {
    showGrandfatherSequence(false);
    return;
  }

  showFamilyHome(false);
});
