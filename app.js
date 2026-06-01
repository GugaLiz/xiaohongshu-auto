const sampleStory = `《六一儿童节礼物》：因为爸爸妈妈都有一双洞洞鞋，然后满发现身边有好多人也穿洞洞鞋，而且洞洞鞋都不一样，所以每次遇到洞洞鞋都要认真研究一番。因为夏天到了，所以妈妈决定给满买一双洞洞鞋，选了黄色的长颈鹿图案的，方便去公园玩水的时候穿。昨晚洞洞鞋快递到了，拆开装好装饰，满超级高兴：“洞洞鞋”，拎起来就跑过去向爷爷嘚瑟。然后穿上洞洞鞋满屋子跑，超级兴奋，洗澡的时候也要穿进去泡澡。晚上上床读绘本的时候也超级开心，在被窝上打滚转圈，一直说“快递姐姐”，哈哈，可能她觉得拿了快递就有新玩具吧~`;

const panelBeats = [
  { scene: "发现", role: "起因", fallback: "满发现了一件很有趣的小事。" },
  { scene: "准备", role: "铺垫", fallback: "爸爸妈妈悄悄商量，准备给满一个小惊喜。" },
  { scene: "惊喜", role: "展开", fallback: "快递到了，满一下子被新东西吸引住。" },
  { scene: "炫耀", role: "升级", fallback: "满迫不及待把新发现展示给家里人看。" },
  { scene: "坚持", role: "反转", fallback: "到了该停下来的时候，满还舍不得放手。" },
  { scene: "收尾", role: "金句", fallback: "睡前她还在念叨这件事，快乐一点都没散。" }
];

const defaultPalette = ["#f8df82", "#9fc6b0", "#94b9d0", "#e7a18c", "#d7c4a2", "#f3f0e6"];
const state = {
  view: "blank",
  result: null,
  baseImage: null,
  baseImageUrl: "./assets/liuyi-blank.png"
};

const $ = (selector) => document.querySelector(selector);
const els = {
  story: $("#story-input"),
  title: $("#episode-title"),
  scene: $("#scene-select"),
  count: $("#panel-count"),
  style: $("#caption-style"),
  generate: $("#generate"),
  reset: $("#reset"),
  sample: $("#load-sample"),
  preview: $("#comic-preview"),
  canvas: $("#comic-canvas"),
  blankImageInput: $("#blank-image-input"),
  dialogue: $("#dialogue-output"),
  prompts: $("#prompt-output"),
  publishTitle: $("#publish-title"),
  publishCaption: $("#publish-caption"),
  publishTags: $("#publish-tags"),
  pinComment: $("#pin-comment"),
  toast: $("#toast")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeStory(raw) {
  return raw
    .replace(/\s+/g, " ")
    .replace(/^《[^》]+》[:：]?/, "")
    .trim();
}

function splitSentences(text) {
  return text
    .split(/[。！？!?；;~，,、]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickSentence(sentences, keywords, fallbackIndex, fallback) {
  const hit = sentences.find((sentence) => keywords.some((keyword) => sentence.includes(keyword)));
  return hit || sentences[fallbackIndex % Math.max(sentences.length, 1)] || fallback;
}

function buildPanels(story, panelCount) {
  const clean = normalizeStory(story);
  const sentences = splitSentences(clean);
  const candidates = [
    pickSentence(sentences, ["发现", "看到", "遇到", "研究", "不一样"], 0, panelBeats[0].fallback),
    pickSentence(sentences, ["决定", "商量", "买", "选", "准备"], 1, panelBeats[1].fallback),
    pickSentence(sentences, ["快递", "拆", "收到"], 2, panelBeats[2].fallback),
    pickSentence(sentences, ["爷爷", "嘚瑟", "炫耀", "展示"], 3, panelBeats[3].fallback),
    pickSentence(sentences, ["洗澡", "泡澡", "不肯", "要穿"], 4, panelBeats[4].fallback),
    pickSentence(sentences, ["晚上", "绘本", "被窝", "快递姐姐", "睡"], 5, panelBeats[5].fallback)
  ];

  const selected = panelCount === 4
    ? [candidates[0], candidates[2], candidates[4], candidates[5]]
    : candidates;

  return selected.map((action, index) => ({
    index: index + 1,
    scene: panelBeats[index]?.scene || `第 ${index + 1} 格`,
    role: panelBeats[index]?.role || "推进",
    action,
    dialogue: inferDialogue(action, index, panelCount)
  }));
}

function inferDialogue(action, index, panelCount) {
  if (/洞洞鞋|鞋/.test(action) && /研究|不一样|发现|看到/.test(action)) {
    return ["满：洞洞鞋……不一样"];
  }
  if (/商量|决定|买|选|准备/.test(action)) {
    return ["妈妈：给满买一双玩水的洞洞鞋吧？", "爸爸：这双长颈鹿的怎么样"];
  }
  if (/快递|拆|收到|到了/.test(action)) {
    return ["满：哇～洞洞鞋喜欢"];
  }
  if (/爷爷|嘚瑟|炫耀|展示/.test(action)) {
    return ["满：爷爷～洞洞鞋", "爷爷：哎呀，好神气"];
  }
  if (/洗澡|泡澡|不肯|要穿/.test(action)) {
    return ["满：要穿，好玩", "妈妈：洗澡也要穿吗？"];
  }
  if (/快递姐姐|晚上|绘本|被窝|睡/.test(action)) {
    return ["满：快递姐姐～快递姐姐～"];
  }
  return index === panelCount - 1 ? ["满：还要～"] : ["满：好玩"];
}

function buildTitle(story, episodeTitle) {
  if (/洞洞鞋/.test(story)) return "给满买了第一双洞洞鞋，她开心到洗澡都要穿";
  if (/快递/.test(story)) return "快递到了以后，满又发现了新的快乐";
  if (/洗澡/.test(story)) return "小朋友的坚持，有时候真的好可爱";
  return episodeTitle ? `${episodeTitle}，被满认真可爱到了` : "满满今天又有新的童言童语";
}

function buildCaption(story, panels, style) {
  const clean = normalizeStory(story);
  const punchline = panels.at(-1)?.dialogue?.[0]?.replace(/^满：/, "") || "小朋友的快乐真的很具体";

  if (style === "short") {
    return `${clean}\n\n最后她一直念：“${punchline}”\n\n小朋友的快乐真的好具体。`;
  }

  if (style === "casual") {
    return `${clean}\n\n后面真的有点好笑，明明只是一个小礼物，她却像发现了全世界。\n\n我猜她现在的逻辑是：只要有新鲜事，就值得开心一整天。`;
  }

  return `${clean}\n\n最可爱的是后面那句：“${punchline}”\n\n有时候大人觉得很普通的小事，在小朋友那里就是一件特别盛大的快乐。`;
}

function buildResult() {
  const story = els.story.value.trim() || sampleStory;
  const panelCount = Number(els.count.value);
  const panels = buildPanels(story, panelCount);
  const title = buildTitle(story, els.title.value.trim());
  const caption = buildCaption(story, panels, els.style.value);
  const tags = ["#宝宝日常", "#童言童语", "#育儿日常", "#亲子漫画", "#小朋友的快乐", "#全职奶爸"];
  if (/六一|儿童节/.test(story + els.title.value)) tags.unshift("#六一儿童节");
  if (/洞洞鞋/.test(story)) tags.push("#洞洞鞋");

  return {
    episodeTitle: els.title.value.trim() || "满满日常小漫画",
    story,
    panels,
    publish: {
      title,
      caption,
      tags: tags.slice(0, 8).join(" "),
      pin: /快递姐姐/.test(story) ? "她现在可能觉得：快递姐姐 = 快乐配送员。" : "你家小朋友也会这样一本正经地认真吗？"
    }
  };
}

function wrapText(text, maxChars) {
  const chunks = [];
  let line = "";
  for (const char of text) {
    line += char;
    if (line.length >= maxChars || /[，。！？、]/.test(char)) {
      chunks.push(line.trim());
      line = "";
    }
  }
  if (line.trim()) chunks.push(line.trim());
  return chunks.slice(0, 4);
}

function svgTextLines(text, x, y, maxChars, className = "bubbleText", lineHeight = 24) {
  return wrapText(text, maxChars)
    .map((line, index) => `<tspan x="${x}" y="${y + index * lineHeight}">${escapeHtml(line)}</tspan>`)
    .join("");
}

function panelIllustration(panel, x, y, width, height, index) {
  const color = defaultPalette[index % defaultPalette.length];
  const ground = y + height - 44;
  const toddlerX = x + width * 0.45;
  const toddlerY = y + height * 0.48;
  const hasShoes = /洞洞鞋|鞋|快递|洗澡|爷爷/.test(panel.action);
  const hasBath = /洗澡|泡澡/.test(panel.action);
  const hasBed = /晚上|绘本|被窝|睡/.test(panel.action);
  const hasDelivery = /快递|拆|收到/.test(panel.action);
  const hasGrandpa = /爷爷/.test(panel.action);

  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#fff9ea"/>
    <path d="M ${x + 14} ${ground} C ${x + width * 0.35} ${ground - 18}, ${x + width * 0.64} ${ground + 12}, ${x + width - 14} ${ground - 10}" fill="none" stroke="#9a8b76" stroke-width="2" opacity="0.36"/>
    <circle cx="${x + width - 44}" cy="${y + 34}" r="24" fill="${color}" opacity="0.42"/>
    ${hasBath ? `<rect x="${x + width - 138}" y="${y + 56}" width="102" height="76" rx="22" fill="#cfe5ec" stroke="#2c2722" stroke-width="2"/><path d="M ${x + width - 125} ${y + 70} h75" stroke="#fff" stroke-width="6" opacity="0.5"/>` : ""}
    ${hasBed ? `<rect x="${x + 28}" y="${ground - 62}" width="${width - 56}" height="70" rx="24" fill="#e7d7c5" stroke="#2c2722" stroke-width="2"/><rect x="${x + 46}" y="${ground - 78}" width="110" height="36" rx="12" fill="#f2f0dc"/>` : ""}
    ${hasDelivery ? `<rect x="${x + 32}" y="${ground - 72}" width="118" height="58" fill="#c8955f" stroke="#2c2722" stroke-width="2"/><path d="M ${x + 32} ${ground - 72} l58 28 l60 -28" fill="none" stroke="#2c2722" stroke-width="2"/>` : ""}
    ${hasGrandpa ? `<circle cx="${x + width - 82}" cy="${toddlerY - 24}" r="28" fill="#f0d2bb" stroke="#2c2722" stroke-width="2"/><path d="M ${x + width - 112} ${toddlerY - 52} q30 -24 62 0" fill="none" stroke="#d9d9d9" stroke-width="9"/><path d="M ${x + width - 112} ${toddlerY + 12} q34 42 76 0" fill="#c8d4c2" stroke="#2c2722" stroke-width="2"/>` : ""}
    <g transform="translate(${toddlerX} ${toddlerY})">
      <circle cx="0" cy="-38" r="31" fill="#f1cdb5" stroke="#2c2722" stroke-width="2"/>
      <path d="M -26 -50 q24 -28 52 0" fill="#342a21"/>
      <circle cx="-11" cy="-38" r="4" fill="#2c2722"/>
      <circle cx="12" cy="-38" r="4" fill="#2c2722"/>
      <path d="M -8 -25 q8 7 18 0" fill="none" stroke="#2c2722" stroke-width="2" stroke-linecap="round"/>
      <path d="M -28 -4 q28 -18 56 0 v48 q-28 14 -56 0 z" fill="#f8f4ea" stroke="#2c2722" stroke-width="2"/>
      <path d="M -24 18 q-22 12 -32 32" fill="none" stroke="#2c2722" stroke-width="4" stroke-linecap="round"/>
      <path d="M 24 18 q26 7 38 30" fill="none" stroke="#2c2722" stroke-width="4" stroke-linecap="round"/>
      <path d="M -16 45 v30" stroke="#2c2722" stroke-width="5" stroke-linecap="round"/>
      <path d="M 15 45 v30" stroke="#2c2722" stroke-width="5" stroke-linecap="round"/>
      ${hasShoes ? `<ellipse cx="-18" cy="78" rx="18" ry="10" fill="#f4d164" stroke="#2c2722" stroke-width="2"/><ellipse cx="18" cy="78" rx="18" ry="10" fill="#f4d164" stroke="#2c2722" stroke-width="2"/><circle cx="-22" cy="75" r="3" fill="#2c2722"/><circle cx="14" cy="75" r="3" fill="#2c2722"/>` : `<ellipse cx="-18" cy="78" rx="15" ry="8" fill="#ffffff" stroke="#2c2722" stroke-width="2"/><ellipse cx="18" cy="78" rx="15" ry="8" fill="#ffffff" stroke="#2c2722" stroke-width="2"/>`}
    </g>
  `;
}

function speechBubble(x, y, width, height, text, showText) {
  return `
    <g>
      <path d="M ${x + 18} ${y} h${width - 36} q18 0 18 18 v${height - 36} q0 18 -18 18 h${width * 0.42} l-22 18 l6 -18 h-${width * 0.36} q-18 0 -18 -18 v-${height - 36} q0 -18 18 -18 z" fill="#fffef9" stroke="#2c2722" stroke-width="2"/>
      ${showText ? `<text class="bubbleText" text-anchor="middle">${svgTextLines(text, x + width / 2, y + 30, Math.max(5, Math.floor(width / 18)), "bubbleText", 20)}</text>` : ""}
    </g>
  `;
}

function cleanDialogue(dialogue) {
  return dialogue.replace(/^[^：]+：/, "").trim();
}

function renderBubbles(panel, x, y, panelWidth, showText) {
  const lines = panel.dialogue.map(cleanDialogue);
  if (lines.length > 1) {
    return [
      speechBubble(x + 38, y + 18, 184, 78, lines[0], showText),
      speechBubble(x + panelWidth - 228, y + 18, 188, 78, lines[1], showText)
    ].join("");
  }
  return speechBubble(x + panelWidth - 238, y + 18, 198, 82, lines[0] || "", showText);
}

function renderComic(result, withText) {
  const panelWidth = 760;
  const panelHeight = result.panels.length === 4 ? 220 : 180;
  const gap = 14;
  const top = 92;
  const pageHeight = top + result.panels.length * panelHeight + (result.panels.length - 1) * gap + 28;

  const panels = result.panels.map((panel, index) => {
    const x = 22;
    const y = top + index * (panelHeight + gap);
    return `
      <g>
        <rect x="${x}" y="${y}" width="${panelWidth}" height="${panelHeight}" rx="10" fill="#fffaf0" stroke="#2c2722" stroke-width="3"/>
        ${panelIllustration(panel, x, y, panelWidth, panelHeight, index)}
        <circle cx="${x + 24}" cy="${y + 24}" r="17" fill="#fffdf7" stroke="#2c2722" stroke-width="2"/>
        <text x="${x + 24}" y="${y + 31}" text-anchor="middle" class="indexText">${panel.index}</text>
        ${renderBubbles(panel, x, y, panelWidth, withText)}
      </g>
    `;
  }).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 804 ${pageHeight}" role="img" aria-label="${escapeHtml(result.episodeTitle)}">
      <style>
        .titleText{font:900 34px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}
        .bubbleText{font:900 18px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}
        .indexText{font:900 20px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}
      </style>
      <rect width="804" height="${pageHeight}" fill="#fff7e8"/>
      <rect x="22" y="18" width="760" height="54" rx="12" fill="#fffdf8" stroke="#2c2722" stroke-width="3"/>
      <text x="402" y="55" text-anchor="middle" class="titleText">${escapeHtml(result.episodeTitle || "满满日常")}</text>
      ${panels}
    </svg>
  `;
}

const textSlots = [
  { panel: 1, x: 553, y: 118, w: 152, h: 92, text: "洞洞鞋…\n不一样" },
  { panel: 2, x: 45, y: 440, w: 158, h: 112, text: "给满买一双\n玩水的\n洞洞鞋吧？" },
  { panel: 2, x: 646, y: 438, w: 164, h: 108, text: "这双长颈鹿\n的怎么样" },
  { panel: 3, x: 640, y: 724, w: 124, h: 110, text: "哇～\n洞洞鞋\n喜欢" },
  { panel: 4, x: 62, y: 1032, w: 134, h: 108, text: "爷爷～\n洞洞鞋" },
  { panel: 4, x: 742, y: 1030, w: 116, h: 94, text: "哎呀\n好神气" },
  { panel: 5, x: 72, y: 1326, w: 124, h: 90, text: "要穿\n好玩" },
  { panel: 5, x: 728, y: 1330, w: 126, h: 90, text: "洗澡\n也要穿吗？" },
  { panel: 6, x: 42, y: 1605, w: 162, h: 112, text: "快递姐姐～\n快递姐姐～" }
];

function getSlotTexts(result) {
  return textSlots.map((slot, index) => ({
    ...slot,
    text: slot.text
  }));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawWrappedCanvasText(ctx, text, box) {
  const lines = text.split("\n").flatMap((line) => wrapText(line, Math.max(4, Math.floor(box.w / 32))));
  let size = 30;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#16120f";
  ctx.lineJoin = "round";

  while (size >= 18) {
    ctx.font = `900 ${size}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
    const totalHeight = lines.length * size * 1.22;
    const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
    if (totalHeight <= box.h && maxWidth <= box.w) break;
    size -= 1;
  }

  ctx.font = `900 ${size}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
  const lineHeight = size * 1.22;
  const startY = box.y + box.h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    const x = box.x + box.w / 2;
    const y = startY + index * lineHeight;
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.lineWidth = Math.max(3, size * 0.16);
    ctx.strokeText(line, x, y);
    ctx.fillText(line, x, y);
  });
}

function renderCanvasComic(result, withText) {
  if (!state.baseImage) return;
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const image = state.baseImage;
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (!withText) return;

  const scaleX = canvas.width / 864;
  const scaleY = canvas.height / 1821;
  getSlotTexts(result).forEach((slot) => {
    drawWrappedCanvasText(ctx, slot.text, {
      x: slot.x * scaleX,
      y: slot.y * scaleY,
      w: slot.w * scaleX,
      h: slot.h * scaleY
    });
  });
}

function renderDialogue(result) {
  return result.panels
    .map((panel) => `第 ${panel.index} 格｜${panel.scene}\n画面：${panel.action}\n对话：${panel.dialogue.join(" / ")}`)
    .join("\n\n");
}

function buildImagePrompts(result) {
  const style = [
    "温暖手绘日系动画电影感",
    "铅笔感线条",
    "水彩质感背景",
    "低饱和自然色",
    "柔和自然光",
    "干净赛璐璐上色",
    "圆润但不过分 Q 版的人物比例",
    "生活细节丰富",
    "轻电影感分镜"
  ].join("，");
  const characterBase = [
    "主角满：20 月龄中国小女孩，圆脸，脸颊饱满，大而圆的黑棕色眼睛，深色短发，刘海自然稀疏，幼儿头身比，白色家居短袖套装。",
    "爸爸：年轻中国爸爸，短黑发，细框眼镜，白色宽松 T 恤，浅灰运动短裤，温和全职奶爸气质。",
    "妈妈：年轻中国妈妈，深色中长发自然扎起，细框眼镜，灰紫色宽松猫咪 T 恤，浅蓝牛仔裤，温柔务实。",
    "道具：黄色长颈鹿儿童洞洞鞋，奶黄色鞋身，长颈鹿大眼睛，小角，棕色斑点。"
  ].join("\n");
  const negative = "避免 3D 渲染、照片感、欧美卡通、塑料质感、强霓虹色、油腻高光、文字乱码。";

  return result.panels.map((panel) => {
    return [
      `第 ${panel.index} 格｜${panel.scene}`,
      `画面：${panel.action}`,
      `情绪：${panel.role}`,
      `角色设定：\n${characterBase}`,
      `画风：${style}`,
      `留白：保留干净空白气泡，不要生成可读文字，方便后期手动填字。`,
      `反向约束：${negative}`
    ].join("\n");
  }).join("\n\n---\n\n");
}

function updatePublish(result) {
  els.publishTitle.value = result.publish.title;
  els.publishCaption.value = result.publish.caption;
  els.publishTags.value = result.publish.tags;
  els.pinComment.value = result.publish.pin;
}

function render() {
  if (!state.result) state.result = buildResult();
  const withText = state.view === "lettered";
  renderCanvasComic(state.result, withText);
  els.dialogue.value = renderDialogue(state.result);
  els.prompts.value = buildImagePrompts(state.result);
  els.dialogue.hidden = state.view !== "dialogue";
  els.prompts.hidden = state.view !== "prompts";
  els.preview.hidden = state.view === "dialogue" || state.view === "prompts";
  updatePublish(state.result);
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 1700);
}

async function copyText(text, label) {
  await navigator.clipboard.writeText(text);
  showToast(`${label}已复制`);
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng() {
  els.canvas.toBlob((blob) => {
    const pngUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = state.view === "lettered" ? "manman-comic-lettered.png" : "manman-comic-blank.png";
    link.click();
    URL.revokeObjectURL(pngUrl);
  }, "image/png");
}

els.generate.addEventListener("click", () => {
  state.result = buildResult();
  localStorage.setItem("manman-comic-story", els.story.value);
  render();
  showToast("漫画方案已生成");
});

els.reset.addEventListener("click", () => {
  els.story.value = "";
  state.result = buildResult();
  render();
});

els.sample.addEventListener("click", () => {
  els.story.value = sampleStory;
  state.result = buildResult();
  render();
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

$("#copy-dialogue").addEventListener("click", () => copyText(els.dialogue.value, "对话文案"));
$("#copy-prompts").addEventListener("click", () => copyText(els.prompts.value, "AI 生图提示词"));
$("#copy-title").addEventListener("click", () => copyText(els.publishTitle.value, "标题"));
$("#copy-caption").addEventListener("click", () => copyText(els.publishCaption.value, "正文"));
$("#copy-tags").addEventListener("click", () => copyText(els.publishTags.value, "标签"));
$("#copy-all").addEventListener("click", () => {
  const all = `标题：\n${els.publishTitle.value}\n\n正文：\n${els.publishCaption.value}\n\n标签：\n${els.publishTags.value}\n\n置顶评论：\n${els.pinComment.value}`;
  copyText(all, "发布内容");
});

$("#download-svg").addEventListener("click", () => {
  showToast("当前为成稿图片模式，请下载 PNG");
});

$("#download-png").addEventListener("click", downloadPng);

els.blankImageInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (state.baseImageUrl.startsWith("blob:")) URL.revokeObjectURL(state.baseImageUrl);
  state.baseImageUrl = URL.createObjectURL(file);
  state.baseImage = await loadImage(state.baseImageUrl);
  render();
  showToast("空白漫画底图已载入");
});

const savedStory = localStorage.getItem("manman-comic-story");
els.story.value = savedStory || sampleStory;
state.result = buildResult();
loadImage(state.baseImageUrl).then((image) => {
  state.baseImage = image;
  render();
});
