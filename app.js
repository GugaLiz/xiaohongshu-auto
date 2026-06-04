const sampleStory = `《六一儿童节礼物》：因为爸爸妈妈都有一双洞洞鞋，然后满发现身边有好多人也穿洞洞鞋，而且洞洞鞋都不一样，所以每次遇到洞洞鞋都要认真研究一番。因为夏天到了，所以妈妈决定给满买一双洞洞鞋，选了黄色的长颈鹿图案的，方便去公园玩水的时候穿。昨晚洞洞鞋快递到了，拆开装好装饰，满超级高兴："洞洞鞋"，拎起来就跑过去向爷爷嘚瑟。然后穿上洞洞鞋满屋子跑，超级兴奋，洗澡的时候也要穿进去泡澡。晚上上床读绘本的时候也超级开心，在被窝上打滚转圈，一直说"快递姐姐"，哈哈，可能她觉得拿了快递就有新玩具吧~`;

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
  baseImageUrl: "./assets/liuyi-blank.png",
  refImages: []
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
  refImageInput: $("#ref-image-input"),
  refGallery: $("#ref-image-gallery"),
  refCategory: $("#ref-category-select"),
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function pickSentence(sentences, keywords, fallbackIndex, fallback, usedSet) {
  /* 优先从关键词中匹配，跳过已被其他面板使用的句子 */
  for (var i = 0; i < sentences.length; i++) {
    var sentence = sentences[i];
    if (usedSet && usedSet.indexOf(sentence) !== -1) continue;
    var matched = keywords.some(function (keyword) { return sentence.indexOf(keyword) !== -1; });
    if (matched) {
      if (usedSet) usedSet.push(sentence);
      return sentence;
    }
  }
  /* 没有匹配时，按 fallbackIndex 均匀分散取不同的句子 */
  var len = Math.max(sentences.length, 1);
  var idx = fallbackIndex % len;
  /* 如果这个位置已经被用过，往后找一个没用过的 */
  for (var j = 0; j < len; j++) {
    var tryIdx = (idx + j) % len;
    if (!usedSet || usedSet.indexOf(sentences[tryIdx]) === -1) {
      if (usedSet) usedSet.push(sentences[tryIdx]);
      return sentences[tryIdx] || fallback;
    }
  }
  /* 所有句子都用过了，允许重复 */
  return sentences[idx] || fallback;
}

function buildPanels(story, panelCount) {
  var clean = normalizeStory(story);
  var sentences = splitSentences(clean);
  var used = [];

  /*
   * 每格使用与叙事角色匹配的关键词来从原文中抽取句子。
   * 关键词尽量通用，以便适配不同主题的故事素材。
   * used 数组跟踪已选过的句子，确保每格拿到不同的内容。
   */
  var candidates = [
    pickSentence(sentences, ["发现", "看到", "遇到", "注意", "好奇", "研究", "不一样", "第一次", "去了", "来到"], 0, panelBeats[0].fallback, used),
    pickSentence(sentences, ["决定", "商量", "买", "选", "准备", "计划", "打算", "想", "带着", "一起"], 1, panelBeats[1].fallback, used),
    pickSentence(sentences, ["到了", "开始", "来了", "拿到", "收到", "快递", "拆", "打开", "出发", "跑", "追", "玩"], 2, panelBeats[2].fallback, used),
    pickSentence(sentences, ["展示", "炫耀", "嘚瑟", "告诉", "分享", "给", "看", "说", "叫", "开心", "笑", "高兴"], 3, panelBeats[3].fallback, used),
    pickSentence(sentences, ["不肯", "坚持", "还要", "舍不得", "一直", "不想", "要", "继续", "不走", "不要"], 4, panelBeats[4].fallback, used),
    pickSentence(sentences, ["晚上", "睡前", "最后", "回家", "结束", "开心", "高兴", "快乐", "笑", "说", "念叨"], 5, panelBeats[5].fallback, used)
  ];

  const selected = panelCount === 4
    ? [candidates[0], candidates[2], candidates[4], candidates[5]]
    : candidates;

  return selected.map((action, index) => ({
    index: index + 1,
    scene: (panelBeats[index] && panelBeats[index].scene) || ("第 " + (index + 1) + " 格"),
    role: (panelBeats[index] && panelBeats[index].role) || "推进",
    action,
    dialogue: inferDialogue(action, index, panelCount, sentences)
  }));
}

/*
 * 从句子中抽取直接引语（引号内的内容）。
 */
function extractQuote(text) {
  var match = text.match(/[""「]([^""」]+)[""」]/);
  if (match) return match[1].trim();
  var colonMatch = text.match(/[：:]\s*(.+?)(?:[。！？!?]|$)/);
  if (colonMatch) return colonMatch[1].trim();
  return null;
}

/*
 * 从句子中提取一个关键名词短语（2~4 字）。
 * 跳过主语、动词、连词等，尽量取到故事中的核心物品或场景词。
 * 优先从句子后半段提取（中文句子的宾语通常在后面）。
 */
function extractNoun(action) {
  /* 先尝试提取引号内容 */
  var quoteMatch = action.match(/[""「]([^""」]{2,4})[""」]/);
  if (quoteMatch) return quoteMatch[1];

  var nouns = action.match(/[\u4e00-\u9fa5]{2,4}/g);
  if (!nouns) return "";

  var skip = [
    "然后", "因为", "所以", "但是", "可是", "不过", "而且", "或者", "虽然", "如果",
    "已经", "一直", "开始", "准备", "后来", "今天", "昨天", "明天", "早上", "晚上",
    "到了", "回家", "出去", "去了", "来到", "看到", "拿到", "打开", "觉得",
    "知道", "告诉", "以为", "可能", "应该", "一定", "好像", "超级", "特别",
    "非常", "一个", "一只", "一双", "这个", "那个", "什么", "怎么", "为什么",
    "路上", "时候", "地方", "样子", "一下", "上面", "下面", "里面", "外面",
    "跑了好", "接住了", "好开心", "不肯走", "还要玩", "扔给了", "把球扔",
    "带着满", "今天带", "追着", "跑了好远"
  ];
  var subjects = ["满满", "爸爸", "妈妈", "爷爷", "奶奶", "外婆", "外公", "老爸"];

  /* 优先从后半段找（宾语通常在句末） */
  var halfStart = Math.floor(nouns.length / 2);
  var ordered = [];
  for (var k = halfStart; k < nouns.length; k++) ordered.push(nouns[k]);
  for (var k2 = 0; k2 < halfStart; k2++) ordered.push(nouns[k2]);

  for (var i = 0; i < ordered.length; i++) {
    var word = ordered[i];
    if (skip.indexOf(word) !== -1) continue;
    if (subjects.indexOf(word) !== -1) continue;
    if (word.length < 2) continue;
    /* 跳过以常见动词开头的短语 */
    if (/^[跑跳走看买选拿拆吃喝睡玩说叫喊哭打]/.test(word)) continue;
    return word;
  }
  return nouns[nouns.length - 1] || "";
}

/*
 * 从动作句子中识别关键物品/场景词。
 * 使用预定义的词库直接匹配，不依赖中文分词，确保提取结果是有效名词。
 */
function findTopic(action) {
  var wordBank = [
    "洞洞鞋", "蝴蝶", "球", "积木", "绘本", "泡泡", "水枪", "泡泡机",
    "自行车", "滑板车", "气球", "风筝", "小鸭子", "金鱼", "小狗", "小猫",
    "花", "树", "雨", "雪", "月亮", "星星", "太阳", "彩虹",
    "蛋糕", "冰淇淋", "糖果", "饼干", "牛奶", "水果", "西瓜", "草莓",
    "帽子", "裙子", "墨镜", "书包", "拖鞋", "外套", "围巾",
    "公园", "游乐场", "超市", "动物园", "游泳池", "沙坑", "滑梯",
    "快递", "礼物", "玩具", "拼图", "贴纸", "画笔", "彩泥",
    "电脑", "手机", "键盘", "屏幕", "鼠标"
  ];
  for (var i = 0; i < wordBank.length; i++) {
    if (action.indexOf(wordBank[i]) !== -1) return wordBank[i];
  }
  /* 尝试匹配引号内容 */
  var quoteMatch = action.match(/[""「]([^""」]{1,6})[""」]/);
  if (quoteMatch) return quoteMatch[1].trim();
  /* 尝试匹配"了X"结构中的X（通常是宾语） */
  var objMatch = action.match(/了([\u4e00-\u9fa5]{2,4})/);
  if (objMatch && objMatch[1] !== "一个" && objMatch[1] !== "一下") return objMatch[1];
  return null;
}

function inferDialogue(action, index, panelCount, allSentences) {
  /* 1. 优先使用原文中的直接引语 */
  var quoteMatch = action.match(/[""「]([^""」]+)[""」]/);
  if (quoteMatch) {
    var quote = quoteMatch[1].trim();
    if (quote.length >= 2 && quote.length <= 15) return ["满：" + quote];
  }

  var topic = findTopic(action);
  var role = (panelBeats[index] && panelBeats[index].role) || "推进";

  /* 2. 根据叙事角色 + 话题词生成对话 */
  if (role === "起因") {
    if (topic) return ["满：" + topic + "！" + topic + "！"];
    return ["满：哇"];
  }
  if (role === "铺垫") {
    if (topic) return ["妈妈：给满" + topic + "吧？", "爸爸：好呀"];
    return ["妈妈：我们准备一下吧？", "爸爸：好呀"];
  }
  if (role === "展开") {
    if (topic) return ["满：哇～" + topic + "喜欢"];
    return ["满：哇～好开心"];
  }
  if (role === "升级") {
    var familyWords = ["爷爷", "奶奶", "爸爸", "妈妈", "外婆", "外公"];
    var person = null;
    for (var i = 0; i < familyWords.length; i++) {
      if (action.indexOf(familyWords[i]) !== -1) { person = familyWords[i]; break; }
    }
    if (person && topic) return ["满：" + person + "～" + topic, person + "：哎呀，好棒"];
    if (topic) return ["满：" + topic + "好看", "爸爸：真厉害"];
    if (person) return ["满：" + person + "～", person + "：来啦"];
    return ["满：看～", "爸爸：好棒"];
  }
  if (role === "反转") {
    if (topic) return ["满：" + topic + "，还要", "妈妈：还不肯停呀？"];
    return ["满：还要～", "妈妈：再来一次？"];
  }
  if (role === "金句") {
    if (topic) return ["满：" + topic + "～" + topic + "～"];
    return ["满：还要～"];
  }

  return index === panelCount - 1 ? ["满：还要～"] : ["满：好玩"];
}

function buildTitle(story, episodeTitle) {
  if (/洞洞鞋/.test(story)) return "给满买了第一双洞洞鞋，她开心到洗澡都要穿";
  if (/快递/.test(story)) return "快递到了以后，满又发现了新的快乐";
  if (/洗澡/.test(story)) return "小朋友的坚持，有时候真的好可爱";
  if (episodeTitle) {
    var storyNoun = extractNoun(normalizeStory(story));
    if (storyNoun && storyNoun.length >= 2 && storyNoun.length <= 6) {
      return episodeTitle + "，满对" + storyNoun + "认真的样子好可爱";
    }
    return episodeTitle + "，被满认真可爱到了";
  }
  return "满满今天又有新的童言童语";
}

function buildCaption(story, panels, style) {
  const clean = normalizeStory(story);
  const lastPanel = panels[panels.length - 1];
  const punchline = (lastPanel && lastPanel.dialogue && lastPanel.dialogue[0]) ? lastPanel.dialogue[0].replace(/^满：/, "") : "小朋友的快乐真的很具体";

  if (style === "short") {
    return `${clean}\n\n最后她一直念："${punchline}"\n\n小朋友的快乐真的好具体。`;
  }

  if (style === "casual") {
    return `${clean}\n\n后面真的有点好笑，明明只是一个小礼物，她却像发现了全世界。\n\n我猜她现在的逻辑是：只要有新鲜事，就值得开心一整天。`;
  }

  return `${clean}\n\n最可爱的是后面那句："${punchline}"\n\n有时候大人觉得很普通的小事，在小朋友那里就是一件特别盛大的快乐。`;
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

/*
 * 基础文字位置模板（基于 6 格、864×1821 底图）。
 * 每个 slot 记录该气泡在底图上的相对位置比例（0~1），
 * 实际渲染时按真实 canvas 尺寸缩放，从而适配不同分辨率的底图。
 *
 * 对于 4 格模式，会根据映射关系取对应格的内容。
 */
const baseTextSlots = [
  { panel: 1, rx: 0.640, ry: 0.065, rw: 0.176, rh: 0.051, lineIndex: 0 },
  { panel: 2, rx: 0.052, ry: 0.242, rw: 0.183, rh: 0.059, lineIndex: 0 },
  { panel: 2, rx: 0.748, ry: 0.240, rw: 0.190, rh: 0.059, lineIndex: 1 },
  { panel: 3, rx: 0.741, ry: 0.398, rw: 0.144, rh: 0.060, lineIndex: 0 },
  { panel: 4, rx: 0.072, ry: 0.567, rw: 0.155, rh: 0.059, lineIndex: 0 },
  { panel: 4, rx: 0.859, ry: 0.566, rw: 0.134, rh: 0.052, lineIndex: 1 },
  { panel: 5, rx: 0.083, ry: 0.728, rw: 0.144, rh: 0.049, lineIndex: 0 },
  { panel: 5, rx: 0.843, ry: 0.730, rw: 0.146, rh: 0.049, lineIndex: 1 },
  { panel: 6, rx: 0.049, ry: 0.881, rw: 0.188, rh: 0.062, lineIndex: 0 }
];

function getSlotTexts(result) {
  var panels = result.panels;
  var panelCount = panels.length;

  /*
   * 6 格模式：直接使用所有 9 个槽位，panel 1~6 一一对应。
   * 4 格模式：buildPanels 选取 candidates[0,2,4,5]，
   *   内容面板索引为 0(发现)、1(惊喜)、2(坚持)、3(收尾)。
   *   底图仍为 6 格布局，只使用前 5 个气泡位置，
   *   映射关系：slot panel 1→panel[0]，2→panel[1]，3→panel[2]，4→panel[3]，5→panel[3]。
   */
  var fourPanelMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3 };
  var maxSlotPanel = panelCount === 4 ? 5 : 6;

  var activeSlots = baseTextSlots.filter(function (slot) {
    return slot.panel <= maxSlotPanel;
  });

  return activeSlots.map(function (slot) {
    var panelIndex;
    if (panelCount === 4) {
      panelIndex = fourPanelMap[slot.panel];
    } else {
      panelIndex = slot.panel - 1;
    }

    var panel = panelIndex !== undefined ? panels[panelIndex] : null;
    if (!panel) {
      return { rx: slot.rx, ry: slot.ry, rw: slot.rw, rh: slot.rh, text: "" };
    }

    var dialogueLines = panel.dialogue.map(cleanDialogue);

    /* 4 格模式下，最后一个 slot 取收尾面板的第二行对话（如果有） */
    var effectiveLineIndex = slot.lineIndex;
    if (panelCount === 4 && slot.panel === 5 && dialogueLines.length < 2) {
      effectiveLineIndex = 0;
    }

    var text = dialogueLines[effectiveLineIndex] || dialogueLines[0] || "";
    return {
      rx: slot.rx,
      ry: slot.ry,
      rw: slot.rw,
      rh: slot.rh,
      text: text
    };
  });
}

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload = function () { resolve(image); };
    image.onerror = reject;
    image.src = src;
  });
}

function drawWrappedCanvasText(ctx, text, box) {
  var lines = text.split("\n").flatMap(function (line) {
    return wrapText(line, Math.max(4, Math.floor(box.w / 32)));
  });
  var size = 30;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#16120f";
  ctx.lineJoin = "round";

  while (size >= 18) {
    ctx.font = '900 ' + size + 'px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    var totalHeight = lines.length * size * 1.22;
    var maxWidth = Math.max.apply(null, lines.map(function (line) { return ctx.measureText(line).width; }));
    if (totalHeight <= box.h && maxWidth <= box.w) break;
    size -= 1;
  }

  ctx.font = '900 ' + size + 'px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  var lineHeight = size * 1.22;
  var startY = box.y + box.h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach(function (line, index) {
    var x = box.x + box.w / 2;
    var y = startY + index * lineHeight;
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.lineWidth = Math.max(3, size * 0.16);
    ctx.strokeText(line, x, y);
    ctx.fillText(line, x, y);
  });
}

function maskBubbleTextAreas(ctx, canvas, slots) {
  /*
   * 在绘制新文字之前，先用气泡底色遮盖底图上原有的文字区域。
   * 使用比文字框稍大的区域（四周扩展 18%），确保旧文字被完全覆盖，
   * 同时尽量保留气泡的轮廓线条。
   */
  ctx.save();
  slots.forEach(function (slot) {
    var padX = slot.rw * 0.18;
    var padY = slot.rh * 0.22;
    var x = (slot.rx - padX) * canvas.width;
    var y = (slot.ry - padY) * canvas.height;
    var w = (slot.rw + padX * 2) * canvas.width;
    var h = (slot.rh + padY * 2) * canvas.height;
    var r = Math.min(w, h) * 0.2;

    ctx.fillStyle = "#fffef9";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

function renderCanvasComic(result, withText) {
  if (!state.baseImage) return;
  var canvas = els.canvas;
  var ctx = canvas.getContext("2d");
  var image = state.baseImage;
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (!withText) return;

  var slots = getSlotTexts(result);

  /* 先遮盖底图上的旧文字，再绘制新文字 */
  maskBubbleTextAreas(ctx, canvas, slots);

  slots.forEach(function (slot) {
    if (!slot.text) return;
    drawWrappedCanvasText(ctx, slot.text, {
      x: slot.rx * canvas.width,
      y: slot.ry * canvas.height,
      w: slot.rw * canvas.width,
      h: slot.rh * canvas.height
    });
  });
}

function renderDialogue(result) {
  return result.panels
    .map(function (panel) {
      return "第 " + panel.index + " 格｜" + panel.scene + "\n画面：" + panel.action + "\n对话：" + panel.dialogue.join(" / ");
    })
    .join("\n\n");
}

function buildImagePrompts(result) {
  /* ===== 画风 ===== */
  var stylePrefix = "日式治愈系手绘动画风格，宫崎骏吉卜力工作室风格，温暖手绘日系动画电影感";
  var styleDetail = [
    "铅笔感柔和线条",
    "水彩质感背景",
    "低饱和自然暖色调",
    "柔和自然光，带轻微光斑",
    "干净赛璐璐上色",
    "圆润但不过分 Q 版的人物比例（约 1:3.5 幼儿头身比）",
    "生活细节丰富",
    "轻电影感分镜构图",
    "背景有轻微虚化，突出人物"
  ].join("，");
  var negative = "避免 3D 渲染、照片感、欧美卡通、塑料质感、强霓虹色、油腻高光、文字乱码、过度 Q 版、厚重写实皮肤纹理。";

  /* ===== 角色精确描述 ===== */
  var girlDesc = "满（主角）：20 月龄中国小女孩，圆脸脸颊饱满下巴圆润，大而圆的黑棕色眼睛（好奇明亮），深棕色短发发尾微翘、刘海稀疏自然偏分。皮肤偏白皙暖调，脸颊微微泛粉。典型幼儿头身比（约 1:3.5），手臂和腿短而圆润。穿红白配色条纹袜。";
  var dadDesc = "爸爸（老爸）：年轻中国爸爸，中等偏壮实肩膀宽，偏长椭圆脸，较大温和的眼睛，深色短发利落。戴细框方形眼镜，左手腕黑色智能手表。穿米白色宽松圆领 T 恤（左胸有小 logo），浅灰色运动短裤，白色运动鞋。温和全职奶爸气质。";
  var momDesc = "妈妈：年轻中国妈妈，纤细身形，柔和鹅蛋脸，大眼笑起来有亲和力，深色中长发自然扎起低马尾。戴细框眼镜。穿藏蓝色短袖 T 恤（胸前白色卡通猫咪线条画和 Magician 白色字样，领口袖口白色滚边），浅蓝色水洗牛仔裤，白色洞洞鞋。干练温柔。";

  /* ===== 根据场景推断服装 ===== */
  var scene = (els.scene && els.scene.value) || "客厅";
  var girlOutfit = inferGirlOutfit(scene);
  var girlFull = girlDesc + "\n服装：" + girlOutfit;

  /* ===== 参考图说明 ===== */
  var refNote = "";
  if (state.refImages.length > 0) {
    var byCategory = {};
    state.refImages.forEach(function (img) {
      var cat = img.category || "style";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(img.name);
    });
    var categoryNames = { style: "画风参考", character: "人物形象参考", outfit: "服装参考", prop: "物品参考", composition: "构图参考" };
    var refLines = Object.keys(byCategory).map(function (cat) {
      return "- " + (categoryNames[cat] || "参考") + "：" + byCategory[cat].length + " 张";
    });
    refNote = "\n【参考图说明】\n" + refLines.join("\n") + "\n请严格参考上述图片的画风、人物形象和色调来生成画面。\n";
  }

  /* ===== 每格提示词 ===== */
  return result.panels.map(function (panel) {
    var sceneDesc = buildSceneDescription(scene, panel.action);
    var emotionDesc = buildEmotionDescription(panel.role);
    var charactersInScene = inferCharactersInScene(panel.action);

    var charBlock = "角色设定：\n" + girlFull + "\n" + dadDesc + "\n" + momDesc;
    if (charactersInScene.indexOf("爷爷") !== -1) {
      charBlock += "\n爷爷：年长中国男性，慈祥面容，银灰色短发，穿朴素浅色衬衫和深色长裤。";
    }

    return [
      "===== 第 " + panel.index + " 格 | " + panel.scene + " =====",
      "",
      "画风：" + stylePrefix + "，" + styleDetail,
      "",
      charBlock,
      "",
      "场景：" + sceneDesc,
      "画面动作：" + panel.action,
      "情绪氛围：" + emotionDesc,
      "出场人物：" + charactersInScene.join("、"),
      refNote,
      "构图要求：竖版单格漫画，人物居中或三分法构图，保留干净空白气泡框（不要生成可读文字），背景有丰富的生活细节。",
      "反向约束：" + negative
    ].join("\n");
  }).join("\n\n" + "=".repeat(40) + "\n\n");
}

/* 根据场景推断满的服装 */
function inferGirlOutfit(scene) {
  if (/公园|小区|户外|步道/.test(scene)) {
    return "蓝色牛仔背带连体裤（白色长袖内搭，胸前口袋有浅黄色云朵和香蕉小贴布装饰，金属扣背带），搭配红白配色条纹袜和红白运动鞋。活泼好动感。";
  }
  if (/浴室|洗澡/.test(scene)) {
    return "只穿纸尿裤/小内裤，光着小脚丫，圆润的手臂和腿。";
  }
  if (/卧室|睡/.test(scene)) {
    return "奶白色纯棉连体睡衣，轻薄柔软，小脚丫露出来。";
  }
  if (/餐桌|饭桌|吃饭/.test(scene)) {
    return "白色短袖上衣（胸前有黄色小柠檬图案和绿色小叶子），浅橄榄绿弹力长裤，裤脚有小鲸鱼线条画图案。";
  }
  return "白色短袖上衣搭配浅橄榄绿弹力松紧腰长裤，裤脚右下角有小黑色线条画小鲸鱼图案。搭配红白运动鞋。清爽日常感。";
}

/* 构建场景描述 */
function buildSceneDescription(scene, action) {
  var scenes = {
    "客厅": "温馨的家庭客厅，浅色木地板，米色布艺沙发，茶几上有儿童绘本和小玩具，角落有绿植，窗外柔和自然光透入，墙上挂着家庭照片",
    "餐桌": "明亮的餐厅区域，原木色餐桌和椅子，桌上有儿童餐具和辅食，窗边有绿植，暖色灯光",
    "电脑桌": "爸爸的工作角落，双屏显示器（一个显示代码/设计稿），黑色键盘鼠标，桌上有咖啡杯和便签纸，桌下有缠绕的线缆，旁边有一把小椅子",
    "浴室": "温馨的浴室，白色浴缸里有泡泡和橡胶鸭子玩具，瓷砖墙上有小动物装饰，暖黄色灯光",
    "公园步道": "小区附近的公园步道，两旁有茂密的绿树，红砖铺成的人行道，路边停着几辆车，远处有居民楼，午后柔和阳光透过树叶洒下斑驳光影",
    "小区楼下": "住宅小区楼下，有花坛和绿化带，远处有儿童游乐设施，暖色调的居民楼背景",
    "卧室": "温馨的卧室，柔软的大床，床头有暖色台灯，窗边有窗帘，地上有儿童绘本和毛绒玩具"
  };
  return scenes[scene] || "温馨的家庭室内环境，浅色木地板，柔和自然光，生活气息浓厚";
}

/* 构建情绪描述 */
function buildEmotionDescription(role) {
  var emotions = {
    "起因": "好奇、新鲜、眼睛发亮的探索感",
    "铺垫": "温暖、期待、大人之间的默契",
    "展开": "惊喜、兴奋、小朋友的纯粹快乐",
    "升级": "得意、嘚瑟、想要被关注的可爱",
    "反转": "执着、认真、大人觉得好笑但小朋友很严肃",
    "金句": "温馨、治愈、让人心头一软的收尾"
  };
  return emotions[role] || "温暖轻松的日常氛围";
}

/* 推断出场人物 */
function inferCharactersInScene(action) {
  var chars = ["满"];
  if (/爸|老爸|爸爸/.test(action)) chars.push("爸爸");
  if (/妈|妈妈/.test(action)) chars.push("妈妈");
  if (/爷爷|爷/.test(action)) chars.push("爷爷");
  if (chars.length === 1) {
    chars.push("爸爸");
  }
  return chars;
}

function updatePublish(result) {
  els.publishTitle.value = result.publish.title;
  els.publishCaption.value = result.publish.caption;
  els.publishTags.value = result.publish.tags;
  els.pinComment.value = result.publish.pin;
}

function render() {
  if (!state.result) state.result = buildResult();
  var withText = state.view === "lettered";
  try {
    renderCanvasComic(state.result, withText);
  } catch (e) {
    console.error("renderCanvasComic error:", e);
  }
  try {
    els.dialogue.value = renderDialogue(state.result);
    els.prompts.value = buildImagePrompts(state.result);
    els.dialogue.hidden = state.view !== "dialogue";
    els.prompts.hidden = state.view !== "prompts";
    els.preview.hidden = state.view === "dialogue" || state.view === "prompts";
    updatePublish(state.result);
  } catch (e) {
    console.error("render text error:", e);
  }
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.view === view);
  });
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(function () { els.toast.classList.remove("show"); }, 1700);
}

function copyText(text, label) {
  navigator.clipboard.writeText(text).then(function () {
    showToast(label + "已复制");
  });
}

function download(filename, content, type) {
  var blob = new Blob([content], { type: type });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng() {
  els.canvas.toBlob(function (blob) {
    var pngUrl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = pngUrl;
    link.download = state.view === "lettered" ? "manman-comic-lettered.png" : "manman-comic-blank.png";
    link.click();
    URL.revokeObjectURL(pngUrl);
  }, "image/png");
}

/* ============ 参考图上传 ============ */

function renderRefGallery() {
  var categoryNames = { style: "画风", character: "人物", outfit: "服装", prop: "物品", composition: "构图" };
  els.refGallery.innerHTML = "";
  state.refImages.forEach(function (item, index) {
    var thumb = document.createElement("div");
    thumb.className = "ref-thumb";

    var img = document.createElement("img");
    img.src = item.url;
    img.alt = "参考图 " + (index + 1);
    thumb.appendChild(img);

    var catLabel = document.createElement("span");
    catLabel.className = "ref-cat-label";
    catLabel.textContent = categoryNames[item.category] || "画风";
    thumb.appendChild(catLabel);

    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ref-remove";
    removeBtn.textContent = "\u00d7";
    removeBtn.addEventListener("click", function () {
      URL.revokeObjectURL(item.url);
      state.refImages.splice(index, 1);
      renderRefGallery();
      if (state.result) {
        els.prompts.value = buildImagePrompts(state.result);
      }
      showToast("已移除参考图");
    });
    thumb.appendChild(removeBtn);

    els.refGallery.appendChild(thumb);
  });
}

els.refImageInput.addEventListener("change", function (event) {
  var files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  var category = els.refCategory ? els.refCategory.value : "style";

  files.forEach(function (file) {
    var url = URL.createObjectURL(file);
    state.refImages.push({ url: url, name: file.name, category: category });
  });

  renderRefGallery();

  if (state.result) {
    els.prompts.value = buildImagePrompts(state.result);
  }

  var categoryNames = { style: "画风", character: "人物", outfit: "服装", prop: "物品", composition: "构图" };
  showToast("已添加 " + files.length + " 张" + (categoryNames[category] || "") + "参考图");
  els.refImageInput.value = "";
});

/* ============ 按钮事件 ============ */

/* 文案输入实时响应：输入时自动重新生成方案 */
var inputTimer = null;
els.story.addEventListener("input", function () {
  clearTimeout(inputTimer);
  inputTimer = setTimeout(function () {
    state.result = buildResult();
    render();
  }, 400);
});

/* 其他表单字段变化时也自动重新生成 */
[els.count, els.scene, els.style, els.title].forEach(function (el) {
  if (el) {
    el.addEventListener("change", function () {
      state.result = buildResult();
      render();
    });
  }
});

els.generate.addEventListener("click", function () {
  try {
    state.result = buildResult();
    try { localStorage.setItem("manman-comic-story", els.story.value); } catch (e) {}
    render();
    showToast("漫画方案已生成");
  } catch (e) {
    console.error("generate error:", e);
    showToast("生成出错，请查看控制台");
  }
});

els.reset.addEventListener("click", function () {
  els.story.value = "";
  state.result = buildResult();
  render();
});

els.sample.addEventListener("click", function () {
  els.story.value = sampleStory;
  state.result = buildResult();
  render();
});

document.querySelectorAll(".tab").forEach(function (tab) {
  tab.addEventListener("click", function () { setView(tab.dataset.view); });
});

$("#copy-dialogue").addEventListener("click", function () { copyText(els.dialogue.value, "对话文案"); });
$("#copy-prompts").addEventListener("click", function () { copyText(els.prompts.value, "AI 生图提示词"); });
$("#copy-title").addEventListener("click", function () { copyText(els.publishTitle.value, "标题"); });
$("#copy-caption").addEventListener("click", function () { copyText(els.publishCaption.value, "正文"); });
$("#copy-tags").addEventListener("click", function () { copyText(els.publishTags.value, "标签"); });
$("#copy-all").addEventListener("click", function () {
  var all = "标题：\n" + els.publishTitle.value + "\n\n正文：\n" + els.publishCaption.value + "\n\n标签：\n" + els.publishTags.value + "\n\n置顶评论：\n" + els.pinComment.value;
  copyText(all, "发布内容");
});

$("#download-svg").addEventListener("click", function () {
  showToast("当前为成稿图片模式，请下载 PNG");
});

$("#download-png").addEventListener("click", downloadPng);

els.blankImageInput.addEventListener("change", function (event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;
  if (state.baseImageUrl.startsWith("blob:")) URL.revokeObjectURL(state.baseImageUrl);
  state.baseImageUrl = URL.createObjectURL(file);
  loadImage(state.baseImageUrl).then(function (image) {
    state.baseImage = image;
    render();
    showToast("空白漫画底图已载入");
  });
});

/* ============ 初始化 ============ */

var savedStory;
try { savedStory = localStorage.getItem("manman-comic-story"); } catch (e) {}
els.story.value = savedStory || sampleStory;
state.result = buildResult();
loadImage(state.baseImageUrl).then(function (image) {
  state.baseImage = image;
  render();
});
