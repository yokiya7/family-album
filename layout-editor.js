const STORAGE_KEY = "familyAlbumGrandfatherLayout";
const IDB_DB_NAME = "familyAlbumLayoutEditor";
const IDB_STORE_NAME = "layouts";

const pageList = document.querySelector("#pageList");
const editorStage = document.querySelector("#editorStage");
const sceneTitle = document.querySelector("#sceneTitle");
const pagesInput = document.querySelector("#pagesInput");
const captionInput = document.querySelector("#captionInput");
const uploadInput = document.querySelector("#uploadInput");
const importJsonInput = document.querySelector("#importJsonInput");
const statusEl = document.querySelector("#editorStatus");

const fieldMap = {
  text: document.querySelector("#fieldText"),
  x: document.querySelector("#fieldX"),
  y: document.querySelector("#fieldY"),
  width: document.querySelector("#fieldWidth"),
  fontSize: document.querySelector("#fieldFontSize"),
  color: document.querySelector("#fieldColor"),
  rotate: document.querySelector("#fieldRotate"),
  z: document.querySelector("#fieldZ"),
  opacity: document.querySelector("#fieldOpacity"),
  blur: document.querySelector("#fieldBlur"),
};

const inspectorEmpty = document.querySelector("#inspectorEmpty");
const inspectorFields = document.querySelector("#inspectorFields");
const selectedFileName = document.querySelector("#selectedFileName");
const textFields = document.querySelectorAll(".text-field");

let layout = { version: 1, scenes: [] };
let currentPageIndex = 0;
let selectedItemId = null;
let dragItemId = null;
let dragStartX = 0;
let dragStartY = 0;
let dragItemStartX = 0;
let dragItemStartY = 0;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uid() {
  return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setStatus(message) {
  statusEl.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    if (statusEl.textContent === message) {
      statusEl.textContent = "";
    }
  }, 2600);
}

function openLayoutDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDB_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLayoutToIndexedDb(nextLayout) {
  const db = await openLayoutDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_STORE_NAME, "readwrite");
    transaction.objectStore(IDB_STORE_NAME).put(nextLayout, STORAGE_KEY);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function loadLayoutFromIndexedDb() {
  const db = await openLayoutDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_STORE_NAME, "readonly");
    const request = transaction.objectStore(IDB_STORE_NAME).get(STORAGE_KEY);
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

function normalizeScene(scene, index) {
  return {
    id: scene.id || `G-${String(index + 1).padStart(2, "0")}`,
    pages: scene.pages || "",
    caption: scene.caption || "",
    interactionType: scene.interactionType || "none",
    interactionEnabled: false,
    items: (scene.items || []).map((item) => ({
      id: item.id || uid(),
      file: item.file || item.name || "uploaded-image.png",
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
      id: textItem.id || uid(),
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

function normalizeLayout(nextLayout) {
  const scenes = (nextLayout.scenes || []).map(normalizeScene);
  if (scenes.length === 0) {
    scenes.push(normalizeScene({ id: "G-01", pages: "P01", caption: "", items: [], texts: [] }, 0));
  }

  return { version: 1, scenes };
}

function getCurrentScene() {
  return layout.scenes[currentPageIndex];
}

function getSelectedItem() {
  const scene = getCurrentScene();
  const photo = scene?.items.find((item) => item.id === selectedItemId);
  if (photo) {
    return { kind: "photo", value: photo };
  }

  const text = scene?.texts.find((item) => item.id === selectedItemId);
  if (text) {
    return { kind: "text", value: text };
  }

  return null;
}

function applyItemStyle(el, item) {
  el.style.setProperty("--item-x", `${item.x}%`);
  el.style.setProperty("--item-y", `${item.y}%`);
  el.style.setProperty("--item-width", `${item.width}%`);
  el.style.setProperty("--item-rotate", `${item.rotate}deg`);
  el.style.setProperty("--item-z", String(item.z));
  el.style.setProperty("--item-opacity", String(item.opacity));
  el.style.setProperty("--item-blur", `${item.blur}px`);
}

function applyTextStyle(el, item) {
  el.style.setProperty("--text-x", `${item.x}%`);
  el.style.setProperty("--text-y", `${item.y}%`);
  el.style.setProperty("--text-width", `${item.width}%`);
  el.style.setProperty("--text-size", `${item.fontSize}px`);
  el.style.setProperty("--text-color", item.color);
  el.style.setProperty("--text-rotate", `${item.rotate}deg`);
  el.style.setProperty("--text-z", String(item.z));
  el.style.setProperty("--text-opacity", String(item.opacity));
  el.style.setProperty("--text-blur", `${item.blur}px`);
}

function renderPages() {
  pageList.innerHTML = layout.scenes.map((scene, index) => `
    <button class="page-row ${index === currentPageIndex ? "is-active" : ""}" type="button" data-page-index="${index}">
      <span class="page-row-id">${scene.id}</span>
      <span class="page-row-meta">${scene.pages || "未填写页码"} · ${scene.items.length} 图 / ${scene.texts.length} 字</span>
    </button>
  `).join("");
}

function renderStage() {
  const scene = getCurrentScene();
  sceneTitle.textContent = `${scene.id} / ${scene.pages || "未填写页码"}`;
  pagesInput.value = scene.pages || "";
  captionInput.value = scene.caption || "";
  editorStage.innerHTML = `
    ${scene.items.map((item) => `
      <img class="editor-item ${item.id === selectedItemId ? "is-selected" : ""}" data-item-id="${item.id}" src="${item.src}" alt="">
    `).join("")}
    ${scene.texts.map((item) => `
      <div class="editor-text ${item.id === selectedItemId ? "is-selected" : ""}" data-item-id="${item.id}">${escapeHtml(item.text)}</div>
    `).join("")}
  `;

  editorStage.querySelectorAll(".editor-item").forEach((el) => {
    const item = scene.items.find((candidate) => candidate.id === el.dataset.itemId);
    applyItemStyle(el, item);
  });
  editorStage.querySelectorAll(".editor-text").forEach((el) => {
    const item = scene.texts.find((candidate) => candidate.id === el.dataset.itemId);
    applyTextStyle(el, item);
  });

  updateInspector();
}

function render() {
  renderPages();
  renderStage();
}

function updateInspector() {
  const selected = getSelectedItem();
  const item = selected?.value;
  inspectorEmpty.hidden = Boolean(selected);
  inspectorFields.hidden = !selected;

  if (!item) {
    return;
  }

  selectedFileName.textContent = selected.kind === "text" ? "文字图层" : item.file;
  textFields.forEach((field) => {
    field.hidden = selected.kind !== "text";
  });
  fieldMap.text.value = item.text || "";
  fieldMap.x.value = item.x.toFixed(1);
  fieldMap.y.value = item.y.toFixed(1);
  fieldMap.width.value = item.width.toFixed(1);
  fieldMap.fontSize.value = Number(item.fontSize ?? 18).toFixed(1);
  fieldMap.color.value = item.color || "#eee1c6";
  fieldMap.rotate.value = item.rotate.toFixed(1);
  fieldMap.z.value = Math.round(item.z);
  fieldMap.opacity.value = item.opacity.toFixed(2);
  fieldMap.blur.value = item.blur.toFixed(1);
}

function selectPage(index) {
  currentPageIndex = Math.max(0, Math.min(layout.scenes.length - 1, index));
  selectedItemId = null;
  render();
}

function selectItem(itemId) {
  selectedItemId = itemId;
  renderStage();
}

function updateSelectedItem(mutator) {
  const selected = getSelectedItem();
  if (!selected) {
    return;
  }

  const item = selected.value;
  mutator(item);
  item.x = Number(item.x);
  item.y = Number(item.y);
  item.width = Number(item.width);
  if (selected.kind === "text") {
    item.fontSize = Number(item.fontSize);
    item.color = item.color || "#eee1c6";
  }
  item.rotate = Number(item.rotate);
  item.z = Number(item.z);
  item.opacity = Number(item.opacity);
  item.blur = Number(item.blur);

  const el = editorStage.querySelector(`[data-item-id="${item.id}"]`);
  if (el) {
    if (selected.kind === "text") {
      el.textContent = item.text || "";
      applyTextStyle(el, item);
    } else {
      applyItemStyle(el, item);
    }
    el.classList.add("is-selected");
  }
  updateInspector();
}

function addPage(afterIndex = layout.scenes.length - 1) {
  const nextIndex = afterIndex + 1;
  layout.scenes.splice(nextIndex, 0, normalizeScene({
    id: `G-${String(layout.scenes.length + 1).padStart(2, "0")}`,
    pages: "",
    caption: "",
    items: [],
    texts: [],
  }, layout.scenes.length));
  layout.scenes.forEach((scene, index) => {
    scene.id = `G-${String(index + 1).padStart(2, "0")}`;
  });
  selectPage(nextIndex);
}

function addTextLayer() {
  const scene = getCurrentScene();
  const maxZ = [...scene.items, ...scene.texts].reduce((max, item) => Math.max(max, item.z), 2);
  const textItem = {
    id: uid(),
    text: "在这里输入文字",
    x: 50,
    y: 50,
    width: 24,
    fontSize: 18,
    color: "#eee1c6",
    rotate: 0,
    z: maxZ + 1,
    opacity: 0.82,
    blur: 0,
  };
  scene.texts.push(textItem);
  selectedItemId = textItem.id;
  render();
  setStatus("已新增文字图层");
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addUploadedFiles(files) {
  const scene = getCurrentScene();
  const startZ = scene.items.reduce((max, item) => Math.max(max, item.z), 2) + 1;
  const additions = [];

  for (const file of files) {
    const src = await fileToDataUrl(file);
    additions.push({
      id: uid(),
      file: file.name,
      src,
      x: 48 + additions.length * 4,
      y: 48 + additions.length * 4,
      width: 24,
      rotate: 0,
      z: startZ + additions.length,
      opacity: 1,
      blur: 0,
    });
  }

  scene.items.push(...additions);
  selectedItemId = additions.at(-1)?.id || selectedItemId;
  render();
  setStatus(`已添加 ${additions.length} 张照片`);
}

function importCurrentGrandfatherScenes() {
  const sourceScenes = window.defaultGrandfatherScenes || window.grandfatherScenes;
  if (!sourceScenes?.length) {
    setStatus("没有找到当前爷爷序列素材");
    return;
  }

  layout = normalizeLayout({ scenes: clone(sourceScenes) });
  currentPageIndex = 0;
  selectedItemId = null;
  render();
  setStatus("已导入当前爷爷序列素材");
}

async function savePreview() {
  const payload = JSON.stringify(layout);
  let localStorageSaved = false;
  let indexedDbSaved = false;

  try {
    localStorage.setItem(STORAGE_KEY, payload);
    localStorageSaved = true;
  } catch {
    localStorageSaved = false;
  }

  try {
    await saveLayoutToIndexedDb(layout);
    indexedDbSaved = true;
  } catch {
    indexedDbSaved = false;
  }

  if (indexedDbSaved || localStorageSaved) {
    setStatus(indexedDbSaved
      ? "已保存到网页预览，刷新爷爷序列即可看到"
      : "已保存到网页预览；如刷新无效，请导出 JSON 备份");
    return;
  }

  setStatus("保存失败：浏览器存储空间不足，请先导出 JSON 备份");
}

function exportJson() {
  try {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grandfather-layout-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
    setStatus("已开始导出 JSON");
  } catch {
    setStatus("导出 JSON 失败，请先减少上传的大图数量");
  }
}

async function importJsonFile(file) {
  const text = await file.text();
  layout = normalizeLayout(JSON.parse(text));
  currentPageIndex = 0;
  selectedItemId = null;
  render();
  setStatus("已导入 JSON");
}

function moveSelectedItemToPage(offset) {
  const scene = getCurrentScene();
  const selected = getSelectedItem();
  const item = selected?.value;
  const nextIndex = currentPageIndex + offset;
  if (!item || nextIndex < 0 || nextIndex >= layout.scenes.length) {
    return;
  }

  if (selected.kind === "text") {
    scene.texts = scene.texts.filter((candidate) => candidate.id !== item.id);
    layout.scenes[nextIndex].texts.push(item);
  } else {
    scene.items = scene.items.filter((candidate) => candidate.id !== item.id);
    layout.scenes[nextIndex].items.push(item);
  }
  currentPageIndex = nextIndex;
  selectedItemId = item.id;
  render();
}

function deleteSelectedItem() {
  const scene = getCurrentScene();
  if (!selectedItemId) {
    return;
  }
  scene.items = scene.items.filter((item) => item.id !== selectedItemId);
  scene.texts = scene.texts.filter((item) => item.id !== selectedItemId);
  selectedItemId = null;
  render();
}

function startDrag(event) {
  const itemEl = event.target.closest(".editor-item, .editor-text");
  if (!itemEl) {
    selectedItemId = null;
    renderStage();
    return;
  }

  event.preventDefault();
  selectedItemId = itemEl.dataset.itemId;
  const item = getSelectedItem().value;
  dragItemId = selectedItemId;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragItemStartX = item.x;
  dragItemStartY = item.y;
  itemEl.setPointerCapture(event.pointerId);
  renderStage();
}

function moveDrag(event) {
  if (!dragItemId || dragItemId !== selectedItemId) {
    return;
  }

  event.preventDefault();
  const rect = editorStage.getBoundingClientRect();
  const dx = ((event.clientX - dragStartX) / rect.width) * 100;
  const dy = ((event.clientY - dragStartY) / rect.height) * 100;
  updateSelectedItem((item) => {
    item.x = Math.max(-40, Math.min(140, dragItemStartX + dx));
    item.y = Math.max(-40, Math.min(140, dragItemStartY + dy));
  });
}

function endDrag() {
  dragItemId = null;
}

function wireInspectorField(key, input) {
  input.addEventListener("input", () => {
    updateSelectedItem((item) => {
      if (key === "text" || key === "color") {
        item[key] = input.value;
      } else {
        item[key] = Number(input.value);
      }
    });
  });
}

Object.entries(fieldMap).forEach(([key, input]) => wireInspectorField(key, input));

pageList.addEventListener("click", (event) => {
  const button = event.target.closest(".page-row");
  if (button) {
    selectPage(Number(button.dataset.pageIndex));
  }
});

editorStage.addEventListener("pointerdown", startDrag);
editorStage.addEventListener("pointermove", moveDrag);
editorStage.addEventListener("pointerup", endDrag);
editorStage.addEventListener("pointercancel", endDrag);
editorStage.addEventListener("wheel", (event) => {
  if (!selectedItemId) {
    return;
  }
  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  updateSelectedItem((item) => {
    if (typeof item.fontSize === "number") {
      item.fontSize = Math.max(6, Math.min(96, item.fontSize + direction * (event.shiftKey ? 0.2 : 1)));
    } else {
      item.width = Math.max(2, Math.min(140, item.width + direction * (event.shiftKey ? 0.4 : 1.2)));
    }
  });
}, { passive: false });

pagesInput.addEventListener("input", () => {
  getCurrentScene().pages = pagesInput.value;
  renderPages();
  sceneTitle.textContent = `${getCurrentScene().id} / ${getCurrentScene().pages || "未填写页码"}`;
});

captionInput.addEventListener("input", () => {
  getCurrentScene().caption = captionInput.value;
});

document.querySelector("#addPage").addEventListener("click", () => addPage(currentPageIndex));
document.querySelector("#addText").addEventListener("click", addTextLayer);
document.querySelector("#prevPage").addEventListener("click", () => selectPage(currentPageIndex - 1));
document.querySelector("#nextPage").addEventListener("click", () => selectPage(currentPageIndex + 1));
document.querySelector("#importCurrent").addEventListener("click", importCurrentGrandfatherScenes);
document.querySelector("#savePreview").addEventListener("click", savePreview);
document.querySelector("#exportJson").addEventListener("click", exportJson);
document.querySelector("#moveItemPrev").addEventListener("click", () => moveSelectedItemToPage(-1));
document.querySelector("#moveItemNext").addEventListener("click", () => moveSelectedItemToPage(1));
document.querySelector("#deleteItem").addEventListener("click", deleteSelectedItem);
document.querySelector("#bringForward").addEventListener("click", () => updateSelectedItem((item) => { item.z += 1; }));
document.querySelector("#sendBackward").addEventListener("click", () => updateSelectedItem((item) => { item.z -= 1; }));

uploadInput.addEventListener("change", () => {
  addUploadedFiles([...uploadInput.files]);
  uploadInput.value = "";
});

importJsonInput.addEventListener("change", () => {
  const file = importJsonInput.files[0];
  if (file) {
    importJsonFile(file).catch(() => setStatus("JSON 导入失败"));
  }
  importJsonInput.value = "";
});

window.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    selectPage(currentPageIndex - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    selectPage(currentPageIndex + 1);
  }
  if (event.key.toLowerCase() === "q") {
    updateSelectedItem((item) => { item.rotate -= event.shiftKey ? 0.2 : 1; });
  }
  if (event.key.toLowerCase() === "e") {
    updateSelectedItem((item) => { item.rotate += event.shiftKey ? 0.2 : 1; });
  }
  if (event.key === "[") {
    updateSelectedItem((item) => { item.z -= 1; });
  }
  if (event.key === "]") {
    updateSelectedItem((item) => { item.z += 1; });
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    deleteSelectedItem();
  }
});

async function loadInitialLayout() {
  try {
    const storedInIndexedDb = await loadLayoutFromIndexedDb();
    if (storedInIndexedDb) {
      layout = normalizeLayout(storedInIndexedDb);
      render();
      setStatus("已载入上次保存的排版");
      return;
    }
  } catch {
    // Fall back to localStorage/default data below.
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      layout = normalizeLayout(JSON.parse(stored));
      render();
      setStatus("已载入上次保存的排版");
      return;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const sourceScenes = window.defaultGrandfatherScenes || window.grandfatherScenes;
  if (sourceScenes?.length) {
    layout = normalizeLayout({ scenes: clone(sourceScenes) });
  } else {
    layout = normalizeLayout({ scenes: [] });
  }
  render();
}

loadInitialLayout();
