/* ============================================================
 *  满满漫画工坊 — app.js (ES5 compatible)
 * ============================================================ */

/* Global error handler — catches any uncaught error and shows alert */
window.onerror = function (msg, url, line, col, error) {
  var detail = "app.js 运行出错！\n\n";
  detail += "错误：" + msg + "\n";
  detail += "行号：" + line + (col ? "，列 " + col : "") + "\n";
  if (error && error.stack) detail += "\n" + error.stack;
  try { alert(detail); } catch (e) {}
  return false;
};

var sampleStory = "\u300A\u516D\u4E00\u513F\u7AE5\u8282\u793C\u7269\u300B\uFF1A\u56E0\u4E3A\u7238\u7238\u5988\u5988\u90FD\u6709\u4E00\u53CC\u6D1E\u6D1E\u978B\uFF0C\u7136\u540E\u6EE1\u53D1\u73B0\u8EAB\u8FB9\u6709\u597D\u591A\u4EBA\u4E5F\u7A7F\u6D1E\u6D1E\u978B\uFF0C\u800C\u4E14\u6D1E\u6D1E\u978B\u90FD\u4E0D\u4E00\u6837\uFF0C\u6240\u4EE5\u6BCF\u6B21\u9047\u5230\u6D1E\u6D1E\u978B\u90FD\u8981\u8BA4\u771F\u7814\u7A76\u4E00\u756A\u3002\u56E0\u4E3A\u590F\u5929\u5230\u4E86\uFF0C\u6240\u4EE5\u5988\u5988\u51B3\u5B9A\u7ED9\u6EE1\u4E70\u4E00\u53CC\u6D1E\u6D1E\u978B\uFF0C\u9009\u4E86\u9EC4\u8272\u7684\u957F\u9888\u9E7F\u56FE\u6848\u7684\uFF0C\u65B9\u4FBF\u53BB\u516C\u56ED\u73A9\u6C34\u7684\u65F6\u5019\u7A7F\u3002\u6628\u665A\u6D1E\u6D1E\u978B\u5FEB\u9012\u5230\u4E86\uFF0C\u62C6\u5F00\u88C5\u597D\u88C5\u9970\uFF0C\u6EE1\u8D85\u7EA7\u9AD8\u5174\uFF1A\u201C\u6D1E\u6D1E\u978B\u201D\uFF0C\u62CE\u8D77\u6765\u5C31\u8DD1\u8FC7\u53BB\u5411\u7237\u7237\u5FB7\u746B\u3002\u7136\u540E\u7A7F\u4E0A\u6D1E\u6D1E\u978B\u6EE1\u5C4B\u5B50\u8DD1\uFF0C\u8D85\u7EA7\u5174\u594B\uFF0C\u6D17\u6FA1\u7684\u65F6\u5019\u4E5F\u8981\u7A7F\u8FDB\u53BB\u6CE1\u6FA1\u3002\u665A\u4E0A\u4E0A\u5E8A\u8BFB\u7ED8\u672C\u7684\u65F6\u5019\u4E5F\u8D85\u7EA7\u5F00\u5FC3\uFF0C\u5728\u88AB\u7A9D\u4E0A\u6253\u6EDA\u8F6C\u5708\uFF0C\u4E00\u76F4\u8BF4\u201C\u5FEB\u9012\u59D0\u59D0\u201D\uFF0C\u54C8\u54C8\uFF0C\u53EF\u80FD\u5979\u89C9\u5F97\u62FF\u4E86\u5FEB\u9012\u5C31\u6709\u65B0\u73A9\u5177\u5427~";

var panelBeats = [
  { scene: "\u53D1\u73B0", role: "\u8D77\u56E0", fallback: "\u6EE1\u53D1\u73B0\u4E86\u4E00\u4EF6\u5F88\u6709\u8DA3\u7684\u5C0F\u4E8B\u3002" },
  { scene: "\u51C6\u5907", role: "\u94FA\u57AB", fallback: "\u7238\u7238\u5988\u5988\u6084\u6084\u5546\u91CF\uFF0C\u51C6\u5907\u7ED9\u6EE1\u4E00\u4E2A\u5C0F\u60CA\u559C\u3002" },
  { scene: "\u60CA\u559C", role: "\u5C55\u5F00", fallback: "\u5FEB\u9012\u5230\u4E86\uFF0C\u6EE1\u4E00\u4E0B\u5B50\u88AB\u65B0\u4E1C\u897F\u5438\u5F15\u4F4F\u3002" },
  { scene: "\u70AB\u8000", role: "\u5347\u7EA7", fallback: "\u6EE1\u8FEB\u4E0D\u53CA\u5F85\u628A\u65B0\u53D1\u73B0\u5C55\u793A\u7ED9\u5BB6\u91CC\u4EBA\u770B\u3002" },
  { scene: "\u575A\u6301", role: "\u53CD\u8F6C", fallback: "\u5230\u4E86\u8BE5\u505C\u4E0B\u6765\u7684\u65F6\u5019\uFF0C\u6EE1\u8FD8\u820D\u4E0D\u5F97\u653E\u624B\u3002" },
  { scene: "\u6536\u5C3E", role: "\u91D1\u53E5", fallback: "\u7761\u524D\u5979\u8FD8\u5728\u53EE\u5FF5\u8FD9\u4EF6\u4E8B\uFF0C\u5FEB\u4E50\u4E00\u70B9\u90FD\u6CA1\u6563\u3002" }
];

var defaultPalette = ["#f8df82", "#9fc6b0", "#94b9d0", "#e7a18c", "#d7c4a2", "#f3f0e6"];
var state = {
  view: "blank",
  result: null,
  baseImage: null,
  baseImageUrl: "./assets/liuyi-blank.png",
  refImages: [],
  generatedImages: [],
  generatingImages: false
};

function $(selector) { return document.querySelector(selector); }
var els = {
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
  toast: $("#toast"),
  /* AI image generation */
  apiProvider: $("#api-provider"),
  sfModel: $("#sf-model"),
  sfModelRow: $("#sf-model-row"),
  apiKey: $("#api-key"),
  generateImages: $("#generate-images"),
  genProgress: $("#gen-progress")
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
    .replace(/^\u300A[^\u300B]+\u300B[\uFF1A:]?/, "")
    .trim();
}

function splitSentences(text) {
  return text
    .split(/[\u3002\uFF01\uFF1F!?\uFF1B;~\uFF0C,\u3001]+/)
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
}

function pickSentence(sentences, keywords, fallbackIndex, fallback, usedSet) {
  var i, sentence, matched, len, idx, j, tryIdx;
  for (i = 0; i < sentences.length; i++) {
    sentence = sentences[i];
    if (usedSet && usedSet.indexOf(sentence) !== -1) continue;
    matched = keywords.some(function (keyword) { return sentence.indexOf(keyword) !== -1; });
    if (matched) {
      if (usedSet) usedSet.push(sentence);
      return sentence;
    }
  }
  len = Math.max(sentences.length, 1);
  idx = fallbackIndex % len;
  for (j = 0; j < len; j++) {
    tryIdx = (idx + j) % len;
    if (!usedSet || usedSet.indexOf(sentences[tryIdx]) === -1) {
      if (usedSet) usedSet.push(sentences[tryIdx]);
      return sentences[tryIdx] || fallback;
    }
  }
  return sentences[idx] || fallback;
}

function buildPanels(story, panelCount) {
  var clean = normalizeStory(story);
  var sentences = splitSentences(clean);
  var used = [];

  var candidates = [
    pickSentence(sentences, ["\u53D1\u73B0", "\u770B\u5230", "\u9047\u5230", "\u6CE8\u610F", "\u597D\u5947", "\u7814\u7A76", "\u4E0D\u4E00\u6837", "\u7B2C\u4E00\u6B21", "\u53BB\u4E86", "\u6765\u5230"], 0, panelBeats[0].fallback, used),
    pickSentence(sentences, ["\u51B3\u5B9A", "\u5546\u91CF", "\u4E70", "\u9009", "\u51C6\u5907", "\u8BA1\u5212", "\u6253\u7B97", "\u60F3", "\u5E26\u7740", "\u4E00\u8D77"], 1, panelBeats[1].fallback, used),
    pickSentence(sentences, ["\u5230\u4E86", "\u5F00\u59CB", "\u6765\u4E86", "\u62FF\u5230", "\u6536\u5230", "\u5FEB\u9012", "\u62C6", "\u6253\u5F00", "\u51FA\u53D1", "\u8DD1", "\u8FFD", "\u73A9"], 2, panelBeats[2].fallback, used),
    pickSentence(sentences, ["\u5C55\u793A", "\u70AB\u8000", "\u5FB7\u746B", "\u544A\u8BC9", "\u5206\u4EAB", "\u7ED9", "\u770B", "\u8BF4", "\u53EB", "\u5F00\u5FC3", "\u7B11", "\u9AD8\u5174"], 3, panelBeats[3].fallback, used),
    pickSentence(sentences, ["\u4E0D\u80AF", "\u575A\u6301", "\u8FD8\u8981", "\u820D\u4E0D\u5F97", "\u4E00\u76F4", "\u4E0D\u60F3", "\u8981", "\u7EE7\u7EED", "\u4E0D\u8D70", "\u4E0D\u8981"], 4, panelBeats[4].fallback, used),
    pickSentence(sentences, ["\u665A\u4E0A", "\u7761\u524D", "\u6700\u540E", "\u56DE\u5BB6", "\u7ED3\u675F", "\u5F00\u5FC3", "\u9AD8\u5174", "\u5FEB\u4E50", "\u7B11", "\u8BF4", "\u53EE\u5FF5"], 5, panelBeats[5].fallback, used)
  ];

  var selected = panelCount === 4
    ? [candidates[0], candidates[2], candidates[4], candidates[5]]
    : candidates;

  return selected.map(function (action, index) {
    return {
      index: index + 1,
      scene: (panelBeats[index] && panelBeats[index].scene) || ("\u7B2C " + (index + 1) + " \u683C"),
      role: (panelBeats[index] && panelBeats[index].role) || "\u63A8\u8FDB",
      action: action,
      dialogue: inferDialogue(action, index, panelCount, sentences)
    };
  });
}

function extractQuote(text) {
  var match = text.match(/[\u201C\u201D\u300C]([^\u201C\u201D\u300D]+)[\u201C\u201D\u300D]/);
  if (match) return match[1].trim();
  var colonMatch = text.match(/[\uFF1A:]\s*(.+?)(?:[\u3002\uFF01\uFF1F!?]|$)/);
  if (colonMatch) return colonMatch[1].trim();
  return null;
}

function extractNoun(action) {
  var quoteMatch = action.match(/[\u201C\u201D\u300C]([^\u201C\u201D\u300D]{2,4})[\u201C\u201D\u300D]/);
  if (quoteMatch) return quoteMatch[1];

  var nouns = action.match(/[\u4e00-\u9fa5]{2,4}/g);
  if (!nouns) return "";

  var skip = [
    "\u7136\u540E", "\u56E0\u4E3A", "\u6240\u4EE5", "\u4F46\u662F", "\u53EF\u662F", "\u4E0D\u8FC7", "\u800C\u4E14", "\u6216\u8005", "\u867D\u7136", "\u5982\u679C",
    "\u5DF2\u7ECF", "\u4E00\u76F4", "\u5F00\u59CB", "\u51C6\u5907", "\u540E\u6765", "\u4ECA\u5929", "\u6628\u5929", "\u660E\u5929", "\u65E9\u4E0A", "\u665A\u4E0A",
    "\u5230\u4E86", "\u56DE\u5BB6", "\u51FA\u53BB", "\u53BB\u4E86", "\u6765\u5230", "\u770B\u5230", "\u62FF\u5230", "\u6253\u5F00", "\u89C9\u5F97",
    "\u77E5\u9053", "\u544A\u8BC9", "\u4EE5\u4E3A", "\u53EF\u80FD", "\u5E94\u8BE5", "\u4E00\u5B9A", "\u597D\u50CF", "\u8D85\u7EA7", "\u7279\u522B",
    "\u975E\u5E38", "\u4E00\u4E2A", "\u4E00\u53EA", "\u4E00\u53CC", "\u8FD9\u4E2A", "\u90A3\u4E2A", "\u4EC0\u4E48", "\u600E\u4E48", "\u4E3A\u4EC0\u4E48",
    "\u8DEF\u4E0A", "\u65F6\u5019", "\u5730\u65B9", "\u6837\u5B50", "\u4E00\u4E0B", "\u4E0A\u9762", "\u4E0B\u9762", "\u91CC\u9762", "\u5916\u9762",
    "\u8DD1\u4E86\u597D", "\u63A5\u4F4F\u4E86", "\u597D\u5F00\u5FC3", "\u4E0D\u80AF\u8D70", "\u8FD8\u8981\u73A9", "\u6254\u7ED9\u4E86", "\u628A\u7403\u6254",
    "\u5E26\u7740\u6EE1", "\u4ECA\u5929\u5E26", "\u8FFD\u7740", "\u8DD1\u4E86\u597D\u8FDC"
  ];
  var subjects = ["\u6EE1\u6EE1", "\u7238\u7238", "\u5988\u5988", "\u7237\u7237", "\u5976\u5976", "\u5916\u5A46", "\u5916\u516C", "\u8001\u7238"];

  var halfStart = Math.floor(nouns.length / 2);
  var ordered = [];
  var k;
  for (k = halfStart; k < nouns.length; k++) ordered.push(nouns[k]);
  for (k = 0; k < halfStart; k++) ordered.push(nouns[k]);

  for (var i = 0; i < ordered.length; i++) {
    var word = ordered[i];
    if (skip.indexOf(word) !== -1) continue;
    if (subjects.indexOf(word) !== -1) continue;
    if (word.length < 2) continue;
    if (/^[\u8DD1\u8DF3\u8D70\u770B\u4E70\u9009\u62FF\u62C6\u5403\u559D\u7761\u73A9\u8BF4\u53EB\u558A\u54ED\u6253]/.test(word)) continue;
    return word;
  }
  return nouns[nouns.length - 1] || "";
}

function findTopic(action) {
  var wordBank = [
    "\u6D1E\u6D1E\u978B", "\u8774\u8776", "\u7403", "\u79EF\u6728", "\u7ED8\u672C", "\u6CE1\u6CE1", "\u6C34\u67AA", "\u6CE1\u6CE1\u673A",
    "\u81EA\u884C\u8F66", "\u6ED1\u677F\u8F66", "\u6C14\u7403", "\u98CE\u7B5D", "\u5C0F\u9E2D\u5B50", "\u91D1\u9C7C", "\u5C0F\u72D7", "\u5C0F\u732B",
    "\u82B1", "\u6811", "\u96E8", "\u96EA", "\u6708\u4EAE", "\u661F\u661F", "\u592A\u9633", "\u5F69\u8679",
    "\u86CB\u7CD5", "\u51B0\u6DC7\u6DCB", "\u7CD6\u679C", "\u997C\u5E72", "\u725B\u5976", "\u6C34\u679C", "\u897F\u74DC", "\u8349\u8393",
    "\u5E3D\u5B50", "\u88D9\u5B50", "\u58A8\u955C", "\u4E66\u5305", "\u62D6\u978B", "\u5916\u5957", "\u56F4\u5DFE",
    "\u516C\u56ED", "\u6E38\u4E50\u573A", "\u8D85\u5E02", "\u52A8\u7269\u56ED", "\u6E38\u6CF3\u6C60", "\u6C99\u5751", "\u6ED1\u68AF",
    "\u5FEB\u9012", "\u793C\u7269", "\u73A9\u5177", "\u62FC\u56FE", "\u8D34\u7EB8", "\u753B\u7B14", "\u5F69\u6CE5",
    "\u7535\u8111", "\u624B\u673A", "\u952E\u76D8", "\u5C4F\u5E55", "\u9F20\u6807"
  ];
  for (var i = 0; i < wordBank.length; i++) {
    if (action.indexOf(wordBank[i]) !== -1) return wordBank[i];
  }
  var quoteMatch = action.match(/[\u201C\u201D\u300C]([^\u201C\u201D\u300D]{1,6})[\u201C\u201D\u300D]/);
  if (quoteMatch) return quoteMatch[1].trim();
  var objMatch = action.match(/\u4E86([\u4e00-\u9fa5]{2,4})/);
  if (objMatch && objMatch[1] !== "\u4E00\u4E2A" && objMatch[1] !== "\u4E00\u4E0B") return objMatch[1];
  return null;
}

function inferDialogue(action, index, panelCount, allSentences) {
  var quoteMatch = action.match(/[\u201C\u201D\u300C]([^\u201C\u201D\u300D]+)[\u201C\u201D\u300D]/);
  if (quoteMatch) {
    var quote = quoteMatch[1].trim();
    if (quote.length >= 2 && quote.length <= 15) return ["\u6EE1\uFF1A" + quote];
  }

  var topic = findTopic(action);
  var role = (panelBeats[index] && panelBeats[index].role) || "\u63A8\u8FDB";

  if (role === "\u8D77\u56E0") {
    if (topic) return ["\u6EE1\uFF1A" + topic + "\uFF01" + topic + "\uFF01"];
    return ["\u6EE1\uFF1A\u54C7"];
  }
  if (role === "\u94FA\u57AB") {
    if (topic) return ["\u5988\u5988\uFF1A\u7ED9\u6EE1" + topic + "\u5427\uFF1F", "\u7238\u7238\uFF1A\u597D\u5440"];
    return ["\u5988\u5988\uFF1A\u6211\u4EEC\u51C6\u5907\u4E00\u4E0B\u5427\uFF1F", "\u7238\u7238\uFF1A\u597D\u5440"];
  }
  if (role === "\u5C55\u5F00") {
    if (topic) return ["\u6EE1\uFF1A\u54C7\uFF5E" + topic + "\u559C\u6B22"];
    return ["\u6EE1\uFF1A\u54C7\uFF5E\u597D\u5F00\u5FC3"];
  }
  if (role === "\u5347\u7EA7") {
    var familyWords = ["\u7237\u7237", "\u5976\u5976", "\u7238\u7238", "\u5988\u5988", "\u5916\u5A46", "\u5916\u516C"];
    var person = null;
    for (var i = 0; i < familyWords.length; i++) {
      if (action.indexOf(familyWords[i]) !== -1) { person = familyWords[i]; break; }
    }
    if (person && topic) return ["\u6EE1\uFF1A" + person + "\uFF5E" + topic, person + "\uFF1A\u54CE\u5440\uFF0C\u597D\u68D2"];
    if (topic) return ["\u6EE1\uFF1A" + topic + "\u597D\u770B", "\u7238\u7238\uFF1A\u771F\u5389\u5BB3"];
    if (person) return ["\u6EE1\uFF1A" + person + "\uFF5E", person + "\uFF1A\u6765\u5566"];
    return ["\u6EE1\uFF1A\u770B\uFF5E", "\u7238\u7238\uFF1A\u597D\u68D2"];
  }
  if (role === "\u53CD\u8F6C") {
    if (topic) return ["\u6EE1\uFF1A" + topic + "\uFF0C\u8FD8\u8981", "\u5988\u5988\uFF1A\u8FD8\u4E0D\u80AF\u505C\u5440\uFF1F"];
    return ["\u6EE1\uFF1A\u8FD8\u8981\uFF5E", "\u5988\u5988\uFF1A\u518D\u6765\u4E00\u6B21\uFF1F"];
  }
  if (role === "\u91D1\u53E5") {
    if (topic) return ["\u6EE1\uFF1A" + topic + "\uFF5E" + topic + "\uFF5E"];
    return ["\u6EE1\uFF1A\u8FD8\u8981\uFF5E"];
  }

  return index === panelCount - 1 ? ["\u6EE1\uFF1A\u8FD8\u8981\uFF5E"] : ["\u6EE1\uFF1A\u597D\u73A9"];
}

function buildEpisodeTitle(story) {
  var clean = normalizeStory(story);
  var topic = findTopic(clean);
  var quote = extractQuote(clean);

  /* Try to extract from the story's own title marker 《xxx》 */
  var raw = story.trim();
  var titleMatch = raw.match(/\u300A([^\u300B]{2,12})\u300B/);
  if (titleMatch) return titleMatch[1];

  /* Use a direct quote as the episode title */
  if (quote && quote.length >= 2 && quote.length <= 10) {
    return "\u6EE1\u8BF4\uFF1A\u201C" + quote + "\u201D";
  }

  /* Build from topic + action/event */
  if (topic) {
    var actionWords = [
      "\u5230\u624B\u4E86", "\u6765\u4E86", "\u5F00\u7BB1", "\u521D\u4F53\u9A8C",
      "\u5C0F\u63D2\u66F2", "\u65E5\u8BB0", "\u7684\u6545\u4E8B",
      "\u53C8\u6765\u4E86", "\u5F00\u5FC3\u65E5", "\u7684\u4E00\u5929"
    ];
    var pick = actionWords[Math.floor(Math.random() * actionWords.length)];
    return topic + pick;
  }

  return "\u6EE1\u7684\u65E5\u5E38";
}

function buildTitle(story, episodeTitle) {
  var clean = normalizeStory(story);
  var topic = findTopic(clean);
  var quote = extractQuote(clean);
  var sentences = splitSentences(clean);

  /* Extract a fun detail from the story for dynamic titles */
  var funBit = "";
  for (var fi = 0; fi < sentences.length; fi++) {
    var s = sentences[fi];
    if (s.length > 5 && s.length < 28 && (
      /\u8D85\u7EA7|\u7279\u522B|\u597D\u5F00\u5FC3|\u5F00\u5FC3|\u5174\u594B|\u4E0D\u80AF|\u820D\u4E0D\u5F97|\u53EF\u7231|\u7B11|\u8BA4\u771F|\u5FB7\u746B|\u4E00\u76F4|\u8DD1|\u62CE/.test(s)
    )) {
      funBit = s.replace(/^[，,、\s]+/, "");
      break;
    }
  }

  /* Try to build a natural, specific title from story content */
  if (topic && funBit) {
    var templates = [
      topic + "\u5230\u624B\u4E86\uFF0C" + funBit,
      "\u7ED9\u6EE1\u4E70\u4E86" + topic + "\uFF0C" + funBit,
      "\u6EE1\u548C\u5979\u7684" + topic + "\uFF1A" + funBit,
      funBit + "\u2026\u53EA\u56E0\u4E3A\u4E00\u4E2A" + topic
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (quote && quote.length >= 2 && quote.length <= 14) {
    var quoteTemplates = [
      "\u6EE1\u8BF4\uFF1A\u201C" + quote + "\u201D\uFF0C\u6211\u7B11\u4E86\u4E00\u6574\u5929",
      "\u201C" + quote + "\u201D\u2014\u2014\u6EE1\u7684\u65E5\u5E38\u91D1\u53E5",
      "\u88AB\u6EE1\u8FD9\u53E5\u201C" + quote + "\u201D\u6574\u7834\u9632\u4E86"
    ];
    return quoteTemplates[Math.floor(Math.random() * quoteTemplates.length)];
  }

  if (topic) {
    var topicTemplates = [
      "\u6EE1\u5BF9" + topic + "\u7684\u6267\u5FF5\uFF0C\u771F\u7684\u53C8\u597D\u7B11\u53C8\u53EF\u7231",
      "\u4E00\u4E2A" + topic + "\u5C31\u8BA9\u6EE1\u5F00\u5FC3\u4E86\u4E00\u6574\u5929",
      "\u6EE1\u548C" + topic + "\u7684\u6545\u4E8B\uFF0C\u6BD4\u6211\u60F3\u8C61\u7684\u7CBE\u5F69"
    ];
    return topicTemplates[Math.floor(Math.random() * topicTemplates.length)];
  }

  if (episodeTitle) {
    return episodeTitle + "\uFF5C\u6EE1\u7684\u65E5\u5E38\u5C0F\u786E\u5E78";
  }
  return "\u6EE1\u6EE1\u4ECA\u5929\u53C8\u6709\u65B0\u641E\u7B11\u4E86";
}

function buildCaption(story, panels, style) {
  var clean = normalizeStory(story);
  var sentences = splitSentences(clean);
  var topic = findTopic(clean);
  var quote = extractQuote(clean);
  var lastPanel = panels[panels.length - 1];
  var punchline = (lastPanel && lastPanel.dialogue && lastPanel.dialogue[0])
    ? lastPanel.dialogue[0].replace(/^\u6EE1\uFF1A/, "")
    : "";

  /* Find a fun/vivid sentence from the story */
  var funSentence = "";
  for (var fi = 0; fi < sentences.length; fi++) {
    var s = sentences[fi];
    if (s.length > 5 && s.length < 35 && (
      /\u8D85\u7EA7|\u7279\u522B|\u597D\u5F00\u5FC3|\u5174\u594B|\u4E0D\u80AF|\u820D\u4E0D\u5F97|\u4E00\u76F4|\u8DD1|\u7B11|\u8BA4\u771F|\u5FB7\u746B|\u62CE|\u8F6C\u5708/.test(s)
    )) {
      funSentence = s;
      break;
    }
  }

  if (style === "short") {
    var lines = [clean, ""];
    if (funSentence) {
      lines.push("\u6700\u641E\u7B11\u7684\u662F\uFF0C" + funSentence + "\u3002");
    } else if (punchline) {
      lines.push("\u5979\u6700\u540E\u4E00\u76F4\u5FF5\u7740\uFF1A\u201C" + punchline + "\u201D");
    }
    lines.push("");
    var closings = [
      "\u5C0F\u5B69\u5B50\u7684\u5FEB\u4E50\u5C31\u662F\u8FD9\u4E48\u5177\u4F53\u3002",
      "\u5C0F\u670B\u53CB\u7684\u4E16\u754C\u771F\u597D\u61C2\u3002",
      "\u5C31\u8FD9\u6837\u5F00\u5FC3\u4E86\u4E00\u6574\u5929\u3002",
      "\u6EE1\u7684\u5FEB\u4E50\u9608\u503C\u771F\u4F4E\u554A\u3002"
    ];
    lines.push(closings[Math.floor(Math.random() * closings.length)]);
    return lines.join("\n");
  }

  if (style === "casual") {
    var lines = [clean, ""];
    if (funSentence) {
      var reactions = [
        "\u8BF4\u5B9E\u8BDD\u770B\u5230\u8FD9\u6BB5\u6211\u7B11\u4E86\u597D\u4E45\uFF0C" + funSentence + "\u3002",
        "\u7ED9\u4F60\u4EEC\u8BB2\u4E2A\u641E\u7B11\u7684\uFF0C" + funSentence + "\u3002",
        "\u54C8\u54C8\u54C8\u6700\u7EDD\u7684\u662F\uFF0C" + funSentence + "\u3002"
      ];
      lines.push(reactions[Math.floor(Math.random() * reactions.length)]);
    } else {
      lines.push("\u540E\u9762\u7684\u53D1\u5C55\u6211\u771F\u7684\u6CA1\u60F3\u5230\u3002");
    }
    lines.push("");
    var reflections = [
      "\u5C0F\u5B69\u5B50\u7684\u903B\u8F91\u5C31\u662F\u8FD9\u6837\uFF0C\u4E00\u4E2A\u5C0F\u4E8B\u5C31\u80FD\u5F00\u5FC3\u4E00\u6574\u5929\u3002\u771F\u7FA1\u6155\u3002",
      "\u5927\u4EBA\u89C9\u5F97\u666E\u901A\u7684\u4E8B\uFF0C\u5728\u5979\u90A3\u5C31\u662F\u4EF6\u5927\u4E8B\u3002\u4E5F\u8BB8\u8FD9\u624D\u662F\u5FEB\u4E50\u7684\u79D8\u8BC0\u5427\u3002",
      "\u5F53\u5988\u4E4B\u540E\u624D\u53D1\u73B0\uFF0C\u5C0F\u670B\u53CB\u6559\u6211\u7684\u6BD4\u6211\u6559\u5979\u7684\u591A\u3002\u5FEB\u4E50\u8FD9\u4EF6\u4E8B\uFF0C\u771F\u7684\u4E0D\u9700\u8981\u7406\u7531\u3002"
    ];
    lines.push(reflections[Math.floor(Math.random() * reflections.length)]);
    return lines.join("\n");
  }

  /* warm style */
  var lines = [clean, ""];
  if (quote) {
    var quoteReactions = [
      "\u6700\u8BA9\u6211\u5FC3\u5934\u4E00\u8F6F\u7684\u662F\u5979\u8BF4\uFF1A\u201C" + quote + "\u201D\u3002\u5C0F\u5C0F\u7684\u4EBA\uFF0C\u5C0F\u5C0F\u7684\u6267\u5FF5\u3002",
      "\u5979\u8BF4\u201C" + quote + "\u201D\u7684\u65F6\u5019\u8868\u60C5\u7279\u522B\u8BA4\u771F\uFF0C\u597D\u50CF\u5728\u8BF4\u4E00\u4EF6\u5F88\u91CD\u8981\u7684\u4E8B\u3002",
      "\u542C\u5230\u5979\u5FF5\u53E8\u201C" + quote + "\u201D\uFF0C\u7A81\u7136\u89C9\u5F97\u5F53\u5988\u7684\u5FEB\u4E50\u4E5F\u5F88\u5177\u4F53\u3002"
    ];
    lines.push(quoteReactions[Math.floor(Math.random() * quoteReactions.length)]);
  } else if (funSentence) {
    lines.push("\u5176\u5B9E\u6574\u4E2A\u8FC7\u7A0B\u6700\u6253\u52A8\u6211\u7684\u662F\uFF0C" + funSentence + "\u3002");
  } else if (punchline) {
    lines.push("\u5979\u6700\u540E\u8BF4\uFF1A\u201C" + punchline + "\u201D\u3002\u771F\u7684\u53C8\u597D\u7B11\u53C8\u6696\u3002");
  }
  lines.push("");
  var warmClosings = [
    "\u6709\u65F6\u5019\u89C9\u5F97\uFF0C\u5B69\u5B50\u957F\u5927\u7684\u8FC7\u7A0B\u91CC\uFF0C\u8FD9\u4E9B\u5C0F\u4E8B\u624D\u662F\u771F\u6B63\u7684\u5927\u4E8B\u3002",
    "\u8BB0\u5F55\u4E00\u4E0B\u8FD9\u4E9B\u5C0F\u786E\u5E78\uFF0C\u4EE5\u540E\u7FFB\u8D77\u6765\u90FD\u662F\u5B9D\u85CF\u3002",
    "\u5E0C\u671B\u5979\u957F\u5927\u4EE5\u540E\u770B\u5230\u8FD9\u4E9B\uFF0C\u4F1A\u89C9\u5F97\u81EA\u5DF1\u7684\u7AE5\u5E74\u5F88\u5FEB\u4E50\u3002",
    "\u6BCF\u4E2A\u5C0F\u670B\u53CB\u90FD\u6709\u81EA\u5DF1\u7684\u5C0F\u4E16\u754C\uFF0C\u6211\u4EEC\u53EA\u662F\u5E78\u8FD0\u5730\u88AB\u9080\u8BF7\u53C2\u89C2\u3002"
  ];
  lines.push(warmClosings[Math.floor(Math.random() * warmClosings.length)]);
  return lines.join("\n");
}

function buildResult() {
  console.log("[buildResult] called, story textarea value length:", els.story.value.length);
  var story = els.story.value.trim() || sampleStory;
  var panelCount = Number(els.count.value);
  var panels = buildPanels(story, panelCount);
  var title = buildTitle(story, els.title.value.trim());
  var caption = buildCaption(story, panels, els.style.value);
  /* Dynamic tags based on story content */
  var tags = ["#\u5B9D\u5B9D\u65E5\u5E38", "#\u4EB2\u5B50\u6F2B\u753B", "#\u5168\u804C\u5976\u7238"];
  if (/\u516D\u4E00|\u513F\u7AE5\u8282|\u793C\u7269/.test(story + els.title.value)) tags.push("#\u516D\u4E00\u513F\u7AE5\u8282");
  var topicNouns = [
    "\u6D1E\u6D1E\u978B", "\u5FEB\u9012", "\u6CE1\u6FA1", "\u6D17\u6FA1", "\u7ED8\u672C",
    "\u516C\u56ED", "\u81EA\u884C\u8F66", "\u6ED1\u677F\u8F66", "\u51B0\u6DC7\u6DCB", "\u86CB\u7CD5",
    "\u5C0F\u72D7", "\u5C0F\u732B", "\u6C14\u7403", "\u79EF\u6728", "\u6C34\u67AA",
    "\u5E3D\u5B50", "\u88D9\u5B50", "\u62D6\u978B", "\u8774\u8776", "\u897F\u74DC",
    "\u6E38\u6CF3\u6C60", "\u6C99\u5751", "\u6ED1\u68AF", "\u52A8\u7269\u56ED",
    "\u5F69\u6CE5", "\u62FC\u56FE", "\u73A9\u5177", "\u8D34\u7EB8", "\u753B\u7B14"
  ];
  for (var tni = 0; tni < topicNouns.length; tni++) {
    if (story.indexOf(topicNouns[tni]) !== -1) {
      tags.push("#" + topicNouns[tni]);
    }
  }
  if (/\u7237\u7237|\u5976\u5976|\u5916\u5A46|\u5916\u516C/.test(story)) tags.push("#\u9694\u4EE3\u4EB2");
  if (/\u5988\u5988/.test(story)) tags.push("#\u5988\u5988\u65E5\u5E38");
  if (/\u665A\u4E0A|\u7761\u524D|\u4E0A\u5E8A/.test(story)) tags.push("#\u7761\u524D\u65E5\u5E38");
  if (/\u4E0B\u96E8|\u4E0B\u96EA|\u5F69\u8679/.test(story)) tags.push("#\u5929\u6C14\u65E5\u5E38");
  /* Shuffle tags for variety, always include core + up to 8 total */
  var shuffled = tags.slice(3);
  for (var si = shuffled.length - 1; si > 0; si--) {
    var sj = Math.floor(Math.random() * (si + 1));
    var tmp = shuffled[si];
    shuffled[si] = shuffled[sj];
    shuffled[sj] = tmp;
  }
  var finalTags = tags.slice(0, 3).concat(shuffled).slice(0, 8);

  /* Dynamic pin comment based on story content */
  var pinQuote = extractQuote(story);
  var pinTopic = findTopic(normalizeStory(story));
  var pin = "";
  if (pinQuote && pinQuote.length >= 2 && pinQuote.length <= 20) {
    var pinTemplates = [
      "\u201C" + pinQuote + "\u201D\u2014\u2014\u5979\u8BF4\u8FD9\u53E5\u7684\u65F6\u5019\u8868\u60C5\u8D85\u8BA4\u771F\u7684\u54C8\u54C8",
      "\u6EE1\u7684\u539F\u8BDD\uFF1A\u201C" + pinQuote + "\u201D\uFF0C\u6211\u5F53\u573A\u5C31\u7B11\u4E86",
      "\u8C01\u61C2\u554A\uFF0C\u5979\u7ADF\u7136\u8BF4\u51FA\u4E86\u201C" + pinQuote + "\u201D"
    ];
    pin = pinTemplates[Math.floor(Math.random() * pinTemplates.length)];
  } else if (pinTopic) {
    var pinTopicTemplates = [
      "\u4F60\u5BB6\u5C0F\u670B\u53CB\u4E5F\u4F1A\u5BF9" + pinTopic + "\u8FD9\u4E48\u6267\u7740\u5417\uFF1F",
      "\u4E00\u4E2A" + pinTopic + "\u5C31\u80FD\u8BA9\u5979\u5F00\u5FC3\u4E00\u6574\u5929\uFF0C\u5C0F\u670B\u53CB\u7684\u5FEB\u4E50\u771F\u7B80\u5355",
      "\u8BF4\u8BF4\u4F60\u5BB6\u5A03\u6700\u8FD1\u8FF7\u4E0A\u4E86\u4EC0\u4E48\uFF1F"
    ];
    pin = pinTopicTemplates[Math.floor(Math.random() * pinTopicTemplates.length)];
  } else {
    var defaultPins = [
      "\u4F60\u5BB6\u5C0F\u670B\u53CB\u4E5F\u6709\u8FD9\u79CD\u641E\u7B11\u65E5\u5E38\u5417\uFF1F\u6765\u804A\u804A",
      "\u517B\u5A03\u7684\u5FEB\u4E50\u5C31\u85CF\u5728\u8FD9\u4E9B\u5C0F\u4E8B\u91CC\u5440"
    ];
    pin = defaultPins[Math.floor(Math.random() * defaultPins.length)];
  }

  var result = {
    episodeTitle: els.title.value.trim() || buildEpisodeTitle(story),
    story: story,
    panels: panels,
    publish: {
      title: title,
      caption: caption,
      tags: finalTags.join(" "),
      pin: pin
    }
  };
  console.log("[buildResult] done, panels:", panels.length, "title:", result.episodeTitle);
  return result;
}

function wrapText(text, maxChars) {
  var chunks = [];
  var line = "";
  for (var ci = 0; ci < text.length; ci++) {
    var ch = text.charAt(ci);
    line += ch;
    if (line.length >= maxChars || /[\uFF0C\u3002\uFF01\uFF1F\u3001]/.test(ch)) {
      chunks.push(line.trim());
      line = "";
    }
  }
  if (line.trim()) chunks.push(line.trim());
  return chunks.slice(0, 4);
}

function svgTextLines(text, x, y, maxChars, className, lineHeight) {
  if (!className) className = "bubbleText";
  if (!lineHeight) lineHeight = 24;
  var wrapped = wrapText(text, maxChars);
  var parts = [];
  for (var i = 0; i < wrapped.length; i++) {
    parts.push('<tspan x="' + x + '" y="' + (y + i * lineHeight) + '">' + escapeHtml(wrapped[i]) + '</tspan>');
  }
  return parts.join("");
}

function panelIllustration(panel, x, y, width, height, index) {
  var color = defaultPalette[index % defaultPalette.length];
  var ground = y + height - 44;
  var toddlerX = x + width * 0.45;
  var toddlerY = y + height * 0.48;
  var hasShoes = /\u6D1E\u6D1E\u978B|\u978B|\u5FEB\u9012|\u6D17\u6FA1|\u7237\u7237/.test(panel.action);
  var hasBath = /\u6D17\u6FA1|\u6CE1\u6FA1/.test(panel.action);
  var hasBed = /\u665A\u4E0A|\u7ED8\u672C|\u88AB\u7A9D|\u7761/.test(panel.action);
  var hasDelivery = /\u5FEB\u9012|\u62C6|\u6536\u5230/.test(panel.action);
  var hasGrandpa = /\u7237\u7237/.test(panel.action);

  var s = '';
  s += '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" fill="#fff9ea"/>';
  s += '<path d="M ' + (x + 14) + ' ' + ground + ' C ' + (x + width * 0.35) + ' ' + (ground - 18) + ', ' + (x + width * 0.64) + ' ' + (ground + 12) + ', ' + (x + width - 14) + ' ' + (ground - 10) + '" fill="none" stroke="#9a8b76" stroke-width="2" opacity="0.36"/>';
  s += '<circle cx="' + (x + width - 44) + '" cy="' + (y + 34) + '" r="24" fill="' + color + '" opacity="0.42"/>';

  if (hasBath) {
    s += '<rect x="' + (x + width - 138) + '" y="' + (y + 56) + '" width="102" height="76" rx="22" fill="#cfe5ec" stroke="#2c2722" stroke-width="2"/><path d="M ' + (x + width - 125) + ' ' + (y + 70) + ' h75" stroke="#fff" stroke-width="6" opacity="0.5"/>';
  }
  if (hasBed) {
    s += '<rect x="' + (x + 28) + '" y="' + (ground - 62) + '" width="' + (width - 56) + '" height="70" rx="24" fill="#e7d7c5" stroke="#2c2722" stroke-width="2"/><rect x="' + (x + 46) + '" y="' + (ground - 78) + '" width="110" height="36" rx="12" fill="#f2f0dc"/>';
  }
  if (hasDelivery) {
    s += '<rect x="' + (x + 32) + '" y="' + (ground - 72) + '" width="118" height="58" fill="#c8955f" stroke="#2c2722" stroke-width="2"/><path d="M ' + (x + 32) + ' ' + (ground - 72) + ' l58 28 l60 -28" fill="none" stroke="#2c2722" stroke-width="2"/>';
  }
  if (hasGrandpa) {
    s += '<circle cx="' + (x + width - 82) + '" cy="' + (toddlerY - 24) + '" r="28" fill="#f0d2bb" stroke="#2c2722" stroke-width="2"/><path d="M ' + (x + width - 112) + ' ' + (toddlerY - 52) + ' q30 -24 62 0" fill="none" stroke="#d9d9d9" stroke-width="9"/><path d="M ' + (x + width - 112) + ' ' + (toddlerY + 12) + ' q34 42 76 0" fill="#c8d4c2" stroke="#2c2722" stroke-width="2"/>';
  }

  s += '<g transform="translate(' + toddlerX + ' ' + toddlerY + ')">';
  s += '<circle cx="0" cy="-38" r="31" fill="#f1cdb5" stroke="#2c2722" stroke-width="2"/>';
  s += '<path d="M -26 -50 q24 -28 52 0" fill="#342a21"/>';
  s += '<circle cx="-11" cy="-38" r="4" fill="#2c2722"/>';
  s += '<circle cx="12" cy="-38" r="4" fill="#2c2722"/>';
  s += '<path d="M -8 -25 q8 7 18 0" fill="none" stroke="#2c2722" stroke-width="2" stroke-linecap="round"/>';
  s += '<path d="M -28 -4 q28 -18 56 0 v48 q-28 14 -56 0 z" fill="#f8f4ea" stroke="#2c2722" stroke-width="2"/>';
  s += '<path d="M -24 18 q-22 12 -32 32" fill="none" stroke="#2c2722" stroke-width="4" stroke-linecap="round"/>';
  s += '<path d="M 24 18 q26 7 38 30" fill="none" stroke="#2c2722" stroke-width="4" stroke-linecap="round"/>';
  s += '<path d="M -16 45 v30" stroke="#2c2722" stroke-width="5" stroke-linecap="round"/>';
  s += '<path d="M 15 45 v30" stroke="#2c2722" stroke-width="5" stroke-linecap="round"/>';

  if (hasShoes) {
    s += '<ellipse cx="-18" cy="78" rx="18" ry="10" fill="#f4d164" stroke="#2c2722" stroke-width="2"/><ellipse cx="18" cy="78" rx="18" ry="10" fill="#f4d164" stroke="#2c2722" stroke-width="2"/><circle cx="-22" cy="75" r="3" fill="#2c2722"/><circle cx="14" cy="75" r="3" fill="#2c2722"/>';
  } else {
    s += '<ellipse cx="-18" cy="78" rx="15" ry="8" fill="#ffffff" stroke="#2c2722" stroke-width="2"/><ellipse cx="18" cy="78" rx="15" ry="8" fill="#ffffff" stroke="#2c2722" stroke-width="2"/>';
  }
  s += '</g>';
  return s;
}

function speechBubble(x, y, width, height, text, showText) {
  var s = '<g>';
  s += '<path d="M ' + (x + 18) + ' ' + y + ' h' + (width - 36) + ' q18 0 18 18 v' + (height - 36) + ' q0 18 -18 18 h' + (width * 0.42) + ' l-22 18 l6 -18 h-' + (width * 0.36) + ' q-18 0 -18 -18 v-' + (height - 36) + ' q0 -18 18 -18 z" fill="#fffef9" stroke="#2c2722" stroke-width="2"/>';
  if (showText) {
    s += '<text class="bubbleText" text-anchor="middle">' + svgTextLines(text, x + width / 2, y + 30, Math.max(5, Math.floor(width / 18)), "bubbleText", 20) + '</text>';
  }
  s += '</g>';
  return s;
}

function cleanDialogue(dialogue) {
  return dialogue.replace(/^[^\uFF1A]+\uFF1A/, "").trim();
}

function renderBubbles(panel, x, y, panelWidth, showText) {
  var lines = panel.dialogue.map(cleanDialogue);
  if (lines.length > 1) {
    return [
      speechBubble(x + 38, y + 18, 184, 78, lines[0], showText),
      speechBubble(x + panelWidth - 228, y + 18, 188, 78, lines[1], showText)
    ].join("");
  }
  return speechBubble(x + panelWidth - 238, y + 18, 198, 82, lines[0] || "", showText);
}

function renderComic(result, withText) {
  var panelWidth = 760;
  var panelHeight = result.panels.length === 4 ? 220 : 180;
  var gap = 14;
  var top = 92;
  var pageHeight = top + result.panels.length * panelHeight + (result.panels.length - 1) * gap + 28;

  var panelParts = [];
  for (var pi = 0; pi < result.panels.length; pi++) {
    var panel = result.panels[pi];
    var px = 22;
    var py = top + pi * (panelHeight + gap);
    var part = '<g>';
    part += '<rect x="' + px + '" y="' + py + '" width="' + panelWidth + '" height="' + panelHeight + '" rx="10" fill="#fffaf0" stroke="#2c2722" stroke-width="3"/>';
    part += panelIllustration(panel, px, py, panelWidth, panelHeight, pi);
    part += '<circle cx="' + (px + 24) + '" cy="' + (py + 24) + '" r="17" fill="#fffdf7" stroke="#2c2722" stroke-width="2"/>';
    part += '<text x="' + (px + 24) + '" y="' + (py + 31) + '" text-anchor="middle" class="indexText">' + panel.index + '</text>';
    part += renderBubbles(panel, px, py, panelWidth, withText);
    part += '</g>';
    panelParts.push(part);
  }
  var panelsSvg = panelParts.join("");

  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 804 ' + pageHeight + '" role="img" aria-label="' + escapeHtml(result.episodeTitle) + '">';
  svg += '<style>';
  svg += ".titleText{font:900 34px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}";
  svg += ".bubbleText{font:900 18px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}";
  svg += ".indexText{font:900 20px 'Noto Sans SC','Microsoft YaHei',sans-serif;fill:#2c2722}";
  svg += '</style>';
  svg += '<rect width="804" height="' + pageHeight + '" fill="#fff7e8"/>';
  svg += '<rect x="22" y="18" width="760" height="54" rx="12" fill="#fffdf8" stroke="#2c2722" stroke-width="3"/>';
  svg += '<text x="402" y="55" text-anchor="middle" class="titleText">' + escapeHtml(result.episodeTitle || "\u6EE1\u6EE1\u65E5\u5E38") + '</text>';
  svg += panelsSvg;
  svg += '</svg>';
  return svg;
}

/*
 * Text slot positions for the base image (6-panel layout, 864x1821).
 * Relative coordinates (0~1) scaled to actual canvas dimensions.
 */
var baseTextSlots = [
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
  /* Replace flatMap with reduce for ES5 compatibility */
  var rawLines = text.split("\n");
  var lines = [];
  for (var ri = 0; ri < rawLines.length; ri++) {
    var wrapped = wrapText(rawLines[ri], Math.max(4, Math.floor(box.w / 32)));
    for (var wi = 0; wi < wrapped.length; wi++) {
      lines.push(wrapped[wi]);
    }
  }

  var size = 30;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#16120f";
  ctx.lineJoin = "round";

  while (size >= 18) {
    ctx.font = '900 ' + size + 'px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    var totalHeight = lines.length * size * 1.22;
    var widths = [];
    for (var mi = 0; mi < lines.length; mi++) {
      widths.push(ctx.measureText(lines[mi]).width);
    }
    var maxWidth = Math.max.apply(null, widths);
    if (totalHeight <= box.h && maxWidth <= box.w) break;
    size -= 1;
  }

  ctx.font = '900 ' + size + 'px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  var lineHeight = size * 1.22;
  var startY = box.y + box.h / 2 - ((lines.length - 1) * lineHeight) / 2;
  for (var di = 0; di < lines.length; di++) {
    var dx = box.x + box.w / 2;
    var dy = startY + di * lineHeight;
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.lineWidth = Math.max(3, size * 0.16);
    ctx.strokeText(lines[di], dx, dy);
    ctx.fillText(lines[di], dx, dy);
  }
}

function maskBubbleTextAreas(ctx, canvas, slots) {
  ctx.save();
  for (var si = 0; si < slots.length; si++) {
    var slot = slots[si];
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
  }
  ctx.restore();
}

function renderCanvasComic(result, withText) {
  if (!state.baseImage) {
    console.log("[renderCanvasComic] no base image, skipping canvas render");
    return;
  }
  var canvas = els.canvas;
  var ctx = canvas.getContext("2d");
  var image = state.baseImage;
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (!withText) return;

  var slots = getSlotTexts(result);
  maskBubbleTextAreas(ctx, canvas, slots);

  for (var si = 0; si < slots.length; si++) {
    var slot = slots[si];
    if (!slot.text) continue;
    drawWrappedCanvasText(ctx, slot.text, {
      x: slot.rx * canvas.width,
      y: slot.ry * canvas.height,
      w: slot.rw * canvas.width,
      h: slot.rh * canvas.height
    });
  }
}

function renderDialogue(result) {
  var parts = [];
  for (var i = 0; i < result.panels.length; i++) {
    var panel = result.panels[i];
    parts.push("\u7B2C " + panel.index + " \u683C\uFF5C" + panel.scene + "\n\u753B\u9762\uFF1A" + panel.action + "\n\u5BF9\u8BDD\uFF1A" + panel.dialogue.join(" / "));
  }
  return parts.join("\n\n");
}

function buildImagePrompts(result) {
  var stylePrefix = "\u65E5\u5F0F\u6CBB\u6108\u7CFB\u624B\u7ED8\u52A8\u753B\u98CE\u683C\uFF0C\u5BAB\u5D0E\u9A8F\u5409\u535C\u529B\u5DE5\u4F5C\u5BA4\u98CE\u683C\uFF0C\u6E29\u6696\u624B\u7ED8\u65E5\u7CFB\u52A8\u753B\u7535\u5F71\u611F";
  var styleDetail = [
    "\u94C5\u7B14\u611F\u67D4\u548C\u7EBF\u6761",
    "\u6C34\u5F69\u8D28\u611F\u80CC\u666F",
    "\u4F4E\u9971\u548C\u81EA\u7136\u6696\u8272\u8C03",
    "\u67D4\u548C\u81EA\u7136\u5149\uFF0C\u5E26\u8F7B\u5FAE\u5149\u6591",
    "\u5E72\u51C0\u8D5B\u7490\u7483\u4E0A\u8272",
    "\u5706\u6DA6\u4F46\u4E0D\u8FC7\u5206 Q \u7248\u7684\u4EBA\u7269\u6BD4\u4F8B\uFF08\u7EA6 1:3.5 \u5E7C\u513F\u5934\u8EAB\u6BD4\uFF09",
    "\u751F\u6D3B\u7EC6\u8282\u4E30\u5BCC",
    "\u8F7B\u7535\u5F71\u611F\u5206\u955C\u6784\u56FE",
    "\u80CC\u666F\u6709\u8F7B\u5FAE\u865A\u5316\uFF0C\u7A81\u51FA\u4EBA\u7269"
  ].join("\uFF0C");
  var negative = "\u907F\u514D 3D \u6E32\u67D3\u3001\u7167\u7247\u611F\u3001\u6B27\u7F8E\u5361\u901A\u3001\u5851\u6599\u8D28\u611F\u3001\u5F3A\u9713\u8679\u8272\u3001\u6CB9\u817B\u9AD8\u5149\u3001\u6587\u5B57\u4E71\u7801\u3001\u8FC7\u5EA6 Q \u7248\u3001\u539A\u91CD\u5199\u5B9E\u76AE\u80A4\u7EB9\u7406\u3002";

  var girlDesc = "\u6EE1\uFF08\u4E3B\u89D2\uFF09\uFF1A20 \u6708\u9F84\u4E2D\u56FD\u5C0F\u5973\u5B69\uFF0C\u5706\u8138\u8138\u988A\u9971\u6EE1\u53CC\u4E0B\u5DF4\u5706\u6DA6\uFF0C\u5927\u800C\u5706\u7684\u9ED1\u68D5\u8272\u773C\u775B\uFF08\u597D\u5947\u660E\u4EAE\uFF09\uFF0C\u6DF1\u68D5\u8272\u77ED\u53D1\u521A\u8FC7\u8033\u6735\uFF0C\u53D1\u5C3E\u5FAE\u7FC5\u3001\u5218\u6D77\u7A00\u758F\u81EA\u7136\u504F\u5206\uFF0C\u6709\u65F6\u624E\u5C0F\u9A6C\u5C3E\u3002\u76AE\u80A4\u504F\u767D\u7699\u6696\u8C03\uFF0C\u8138\u988A\u82F9\u679C\u7EA2\u3002\u5178\u578B\u5E7C\u513F\u5934\u8EAB\u6BD4\uFF08\u7EA6 1:3.5\uFF09\uFF0C\u624B\u81C2\u548C\u817F\u77ED\u800C\u5706\u6DA6\uFF0C\u624B\u80CC\u6709\u5C0F\u8089\u7A9D\u3002\u6807\u5FD7\u6027\u978B\u5B50\uFF1A\u767D\u8272\u9B54\u672F\u8D34\u8FD0\u52A8\u978B\uFF0C\u7EA2\u8272\u978B\u8DDF\u62C9\u73AF\u3001\u978B\u5E95\u7EA2\u8272\u6EDA\u8FB9\uFF0C\u978B\u4FA7\u6709\u5361\u901A\u52A8\u7269\u8D34\u5E03\u3002";
  var dadDesc = "\u7238\u7238\uFF08\u8001\u7238\uFF09\uFF1A\u5E74\u8F7B\u4E2D\u56FD\u7238\u7238\uFF0C\u4E2D\u7B49\u504F\u58EE\u5B9E\u80A9\u8180\u5BBD\uFF0C\u504F\u957F\u692D\u5706\u8138\uFF0C\u8F83\u5927\u6E29\u548C\u7684\u773C\u775B\uFF0C\u6DF1\u8272\u77ED\u53D1\u5229\u843D\u3002\u6234\u7EC6\u6846\u9ED1\u8272\u957F\u65B9\u5F62\u773C\u955C\uFF0C\u5DE6\u624B\u8155\u9ED1\u8272\u667A\u80FD\u624B\u8868\u3002\u7A7F\u7C73\u767D\u8272\u5BBD\u677E\u5706\u9886 T \u6064\uFF08\u5DE6\u80F8\u6709\u5C0F logo\uFF09\uFF0C\u6D45\u7070\u8272\u8FD0\u52A8\u77ED\u88E4\uFF0C\u767D\u8272\u7CFB\u5E26\u8FD0\u52A8\u978B\u3002\u5728\u5BB6\u7A7F\u9ED1\u8272\u6D1E\u6D1E\u978B\uFF0C\u6302\u6EE1\u5F69\u8272\u978B\u82B1\uFF08\u7235\u722A\u3001\u5C0F\u52A8\u7269\u3001baby \u5B57\u6837\uFF09\u3002\u6E29\u548C\u5168\u804C\u5976\u7238\u6C14\u8D28\u3002";
  var momDesc = "\u5988\u5988\uFF1A\u5E74\u8F7B\u4E2D\u56FD\u5988\u5988\uFF0C\u7EA4\u7EC6\u8EAB\u5F62\uFF0C\u67D4\u548C\u9E45\u86CB\u8138\uFF0C\u5927\u773C\u7B11\u8D77\u6765\u6709\u4EB2\u548C\u529B\uFF0C\u6DF1\u8272\u4E2D\u957F\u53D1\u81EA\u7136\u624E\u4F4E\u9A6C\u5C3E\u3002\u6234\u7EC6\u6846\u5706\u5F62\u773C\u955C\u3002\u7A7F\u85CF\u84DD\u8272\u77ED\u8896 T \u6064\uFF08\u9886\u53E3\u548C\u8896\u53E3\u767D\u8272\u6EDA\u8FB9\uFF0C\u80F8\u524D\u767D\u8272\u5361\u901A\u732B\u54AA\u56FE\u6848\u548C Magician Since 2006 \u767D\u8272\u5B57\u6837\uFF09\uFF0C\u6D45\u84DD\u8272\u6C34\u6D17\u725B\u4ED4\u88E4\uFF0C\u767D\u8272\u6D1E\u6D1E\u978B\uFF08\u6302\u9F99\u732B\u3001\u5496\u5561\u676F\u3001\u6E38\u620F\u673A\u7B49\u53EF\u7231\u978B\u82B1\uFF09\u3002\u5E72\u7EC3\u6E29\u67D4\u3002";

  var scene = (els.scene && els.scene.value) || "\u5BA2\u5385";
  var girlOutfit = inferGirlOutfit(scene);
  var girlFull = girlDesc + "\n\u670D\u88C5\uFF1A" + girlOutfit;

  var refNote = "";
  if (state.refImages.length > 0) {
    var byCategory = {};
    for (var ri = 0; ri < state.refImages.length; ri++) {
      var img = state.refImages[ri];
      var cat = img.category || "style";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(img.name);
    }
    var categoryNames = { style: "\u753B\u98CE\u53C2\u8003", character: "\u4EBA\u7269\u5F62\u8C61\u53C2\u8003", outfit: "\u670D\u88C5\u53C2\u8003", prop: "\u7269\u54C1\u53C2\u8003", composition: "\u6784\u56FE\u53C2\u8003" };
    var catKeys = Object.keys(byCategory);
    var refLines = [];
    for (var ci = 0; ci < catKeys.length; ci++) {
      var ck = catKeys[ci];
      refLines.push("- " + (categoryNames[ck] || "\u53C2\u8003") + "\uFF1A" + byCategory[ck].length + " \u5F20");
    }
    refNote = "\n\u3010\u53C2\u8003\u56FE\u8BF4\u660E\u3011\n" + refLines.join("\n") + "\n\u8BF7\u4E25\u683C\u53C2\u8003\u4E0A\u8FF0\u56FE\u7247\u7684\u753B\u98CE\u3001\u4EBA\u7269\u5F62\u8C61\u548C\u8272\u8C03\u6765\u751F\u6210\u753B\u9762\u3002\n";
  }

  var separator = "";
  for (var eq = 0; eq < 40; eq++) separator += "=";

  var promptParts = [];
  for (var pi = 0; pi < result.panels.length; pi++) {
    var panel = result.panels[pi];
    var sceneDesc = buildSceneDescription(scene, panel.action);
    var emotionDesc = buildEmotionDescription(panel.role);
    var charactersInScene = inferCharactersInScene(panel.action);

    var charBlock = "\u89D2\u8272\u8BBE\u5B9A\uFF1A\n" + girlFull + "\n" + dadDesc + "\n" + momDesc;
    if (charactersInScene.indexOf("\u7237\u7237") !== -1) {
      charBlock += "\n\u7237\u7237\uFF1A\u5E74\u957F\u4E2D\u56FD\u7537\u6027\uFF0C\u6148\u7965\u9762\u5BB9\uFF0C\u94F6\u7070\u8272\u77ED\u53D1\uFF0C\u7A7F\u6734\u7D20\u6D45\u8272\u886C\u886B\u548C\u6DF1\u8272\u957F\u88E4\u3002";
    }

    var prompt = [
      "===== \u7B2C " + panel.index + " \u683C | " + panel.scene + " =====",
      "",
      "\u753B\u98CE\uFF1A" + stylePrefix + "\uFF0C" + styleDetail,
      "",
      charBlock,
      "",
      "\u573A\u666F\uFF1A" + sceneDesc,
      "\u753B\u9762\u52A8\u4F5C\uFF1A" + panel.action,
      "\u60C5\u7EEA\u6C1B\u56F4\uFF1A" + emotionDesc,
      "\u51FA\u573A\u4EBA\u7269\uFF1A" + charactersInScene.join("\u3001"),
      refNote,
      "\u6784\u56FE\u8981\u6C42\uFF1A\u7AD6\u7248\u5355\u683C\u6F2B\u753B\uFF0C\u4EBA\u7269\u5C45\u4E2D\u6216\u4E09\u5206\u6CD5\u6784\u56FE\uFF0C\u4FDD\u7559\u5E72\u51C0\u7A7A\u767D\u6C14\u6CE1\u6846\uFF08\u4E0D\u8981\u751F\u6210\u53EF\u8BFB\u6587\u5B57\uFF09\uFF0C\u80CC\u666F\u6709\u4E30\u5BCC\u7684\u751F\u6D3B\u7EC6\u8282\u3002",
      "\u53CD\u5411\u7EA6\u675F\uFF1A" + negative
    ].join("\n");
    promptParts.push(prompt);
  }
  return promptParts.join("\n\n" + separator + "\n\n");
}

function inferGirlOutfit(scene) {
  if (/\u516C\u56ED|\u5C0F\u533A|\u6237\u5916|\u6B65\u9053/.test(scene)) {
    return "\u6D45\u84DD\u8272\u725B\u4ED4\u80CC\u5E26\u8FDE\u4F53\u88E4\uFF08\u767D\u8272\u957F\u8896\u5185\u642D\uFF0C\u80F8\u524D\u53E3\u888B\u6709\u6D45\u9EC4\u8272\u4E91\u6735\u3001\u9999\u8549\u3001\u5C0F\u82B1\u8D34\u5E03\u88C5\u9970\uFF0C\u80A9\u5E26\u91D1\u5C5E\u6309\u6263\uFF09\uFF0C\u642D\u914D\u7EA2\u767D\u914D\u8272\u6761\u7EB9\u889C\u548C\u767D\u8272\u9B54\u672F\u8D34\u8FD0\u52A8\u978B\uFF08\u7EA2\u8272\u978B\u8DDF\u62C9\u73AF\uFF09\u3002\u6D3B\u6CFC\u597D\u52A8\u611F\u3002";
  }
  if (/\u6D74\u5BA4|\u6D17\u6FA1/.test(scene)) {
    return "\u53EA\u7A7F\u7EB8\u5C3F\u88E4/\u5C0F\u5185\u88E4\uFF0C\u5149\u7740\u5C0F\u811A\u4E2B\uFF0C\u5706\u6DA6\u7684\u624B\u81C2\u548C\u817F\u3002";
  }
  if (/\u5367\u5BA4|\u7761/.test(scene)) {
    return "\u67D4\u8F6F\u7C89\u8272\u8FDE\u811A\u7EAF\u68C9\u7761\u8863\uFF0C\u957F\u8896\uFF0C\u8F7B\u8584\u4FDD\u6696\u3002";
  }
  if (/\u9910\u684C|\u996D\u684C|\u5403\u996D/.test(scene)) {
    return "\u767D\u8272\u7F57\u7EB9\u77ED\u8896\u4E0A\u8863\uFF08\u80F8\u524D\u6709\u9EC4\u8272\u5C0F\u67E0\u6AAC\u56FE\u6848\u548C\u7EFF\u8272\u5C0F\u53F6\u5B50\uFF09\uFF0C\u6D45\u6A44\u6984\u7EFF\u5F39\u529B\u957F\u88E4\uFF08\u88E4\u811A\u53F3\u4E0B\u89D2\u6709\u5C0F\u9ED1\u8272\u7EBF\u6761\u753B\u9CB8\u9C7C\u56FE\u6848\uFF09\u3002";
  }
  return "\u767D\u8272\u7F57\u7EB9\u77ED\u8896\u4E0A\u8863\uFF08\u80F8\u524D\u9EC4\u8272\u67E0\u6AAC + \u7EFF\u53F6\u5C0F\u56FE\u6848\uFF09\u642D\u914D\u6D45\u6A44\u6984\u7EFF\u5F39\u529B\u677E\u7D27\u8170\u957F\u88E4\uFF08\u88E4\u811A\u53F3\u4E0B\u89D2\u5C0F\u9ED1\u8272\u7EBF\u6761\u753B\u9CB8\u9C7C\uFF09\u3002\u767D\u8272\u9B54\u672F\u8D34\u8FD0\u52A8\u978B\uFF08\u7EA2\u8272\u978B\u8DDF\u62C9\u73AF\u3001\u978B\u5E95\u7EA2\u8272\u6EDA\u8FB9\uFF09\u3002\u6E05\u723D\u65E5\u5E38\u611F\u3002";
}

function buildSceneDescription(scene, action) {
  var scenes = {
    "\u5BA2\u5385": "\u6E29\u99A8\u7684\u5BB6\u5EAD\u5BA2\u5385\uFF0C\u6D45\u8272\u6728\u5730\u677F\uFF0C\u7C73\u8272\u5E03\u827A\u6C99\u53D1\uFF0C\u8336\u51E0\u4E0A\u6709\u513F\u7AE5\u7ED8\u672C\u548C\u5C0F\u73A9\u5177\uFF0C\u89D2\u843D\u6709\u7EFF\u690D\uFF0C\u7A97\u5916\u67D4\u548C\u81EA\u7136\u5149\u900F\u5165\uFF0C\u5899\u4E0A\u6302\u7740\u5BB6\u5EAD\u7167\u7247",
    "\u9910\u684C": "\u660E\u4EAE\u7684\u9910\u5385\u533A\u57DF\uFF0C\u539F\u6728\u8272\u9910\u684C\u548C\u6905\u5B50\uFF0C\u684C\u4E0A\u6709\u513F\u7AE5\u9910\u5177\u548C\u8F85\u98DF\uFF0C\u7A97\u8FB9\u6709\u7EFF\u690D\uFF0C\u6696\u8272\u706F\u5149",
    "\u7535\u8111\u684C": "\u7238\u7238\u7684\u5DE5\u4F5C\u89D2\u843D\uFF0C\u53CC\u5C4F\u663E\u793A\u5668\uFF08\u4E00\u4E2A\u663E\u793A\u4EE3\u7801/\u8BBE\u8BA1\u7A3F\uFF09\uFF0C\u9ED1\u8272\u952E\u76D8\u9F20\u6807\uFF0C\u684C\u4E0A\u6709\u5496\u5561\u676F\u548C\u4FBF\u7B7E\u7EB8\uFF0C\u684C\u4E0B\u6709\u7F20\u7ED5\u7684\u7EBF\u7F06\uFF0C\u65C1\u8FB9\u6709\u4E00\u628A\u5C0F\u6905\u5B50",
    "\u6D74\u5BA4": "\u6E29\u99A8\u7684\u6D74\u5BA4\uFF0C\u767D\u8272\u6D74\u7F38\u91CC\u6709\u6CE1\u6CE1\u548C\u6A61\u80F6\u9E2D\u5B50\u73A9\u5177\uFF0C\u74F7\u7816\u5899\u4E0A\u6709\u5C0F\u52A8\u7269\u88C5\u9970\uFF0C\u6696\u9EC4\u8272\u706F\u5149",
    "\u516C\u56ED\u6B65\u9053": "\u5C0F\u533A\u9644\u8FD1\u7684\u516C\u56ED\u6B65\u9053\uFF0C\u4E24\u65C1\u6709\u8302\u5BC6\u7684\u7EFF\u6811\uFF0C\u7EA2\u7816\u94FA\u6210\u7684\u4EBA\u884C\u9053\uFF0C\u8DEF\u8FB9\u505C\u7740\u51E0\u8F86\u8F66\uFF0C\u8FDC\u5904\u6709\u5C45\u6C11\u697C\uFF0C\u5348\u540E\u67D4\u548C\u9633\u5149\u900F\u8FC7\u6811\u53F6\u6D12\u4E0B\u6591\u9A73\u5149\u5F71",
    "\u5C0F\u533A\u697C\u4E0B": "\u4F4F\u5B85\u5C0F\u533A\u697C\u4E0B\uFF0C\u6709\u82B1\u575B\u548C\u7EFF\u5316\u5E26\uFF0C\u8FDC\u5904\u6709\u513F\u7AE5\u6E38\u4E50\u8BBE\u65BD\uFF0C\u6696\u8272\u8C03\u7684\u5C45\u6C11\u697C\u80CC\u666F",
    "\u5367\u5BA4": "\u6E29\u99A8\u7684\u5367\u5BA4\uFF0C\u67D4\u8F6F\u7684\u5927\u5E8A\uFF0C\u5E8A\u5934\u6709\u6696\u8272\u53F0\u706F\uFF0C\u7A97\u8FB9\u6709\u7A97\u5E18\uFF0C\u5730\u4E0A\u6709\u513F\u7AE5\u7ED8\u672C\u548C\u6BDB\u7ED2\u73A9\u5177"
  };
  return scenes[scene] || "\u6E29\u99A8\u7684\u5BB6\u5EAD\u5BA4\u5185\u73AF\u5883\uFF0C\u6D45\u8272\u6728\u5730\u677F\uFF0C\u67D4\u548C\u81EA\u7136\u5149\uFF0C\u751F\u6D3B\u6C14\u606F\u6D53\u539A";
}

function buildEmotionDescription(role) {
  var emotions = {
    "\u8D77\u56E0": "\u597D\u5947\u3001\u65B0\u9C9C\u3001\u773C\u775B\u53D1\u4EAE\u7684\u63A2\u7D22\u611F",
    "\u94FA\u57AB": "\u6E29\u6696\u3001\u671F\u5F85\u3001\u5927\u4EBA\u4E4B\u95F4\u7684\u9ED8\u5951",
    "\u5C55\u5F00": "\u60CA\u559C\u3001\u5174\u594B\u3001\u5C0F\u670B\u53CB\u7684\u7EAF\u7CB9\u5FEB\u4E50",
    "\u5347\u7EA7": "\u5F97\u610F\u3001\u5FB7\u746B\u3001\u60F3\u8981\u88AB\u5173\u6CE8\u7684\u53EF\u7231",
    "\u53CD\u8F6C": "\u6267\u7740\u3001\u8BA4\u771F\u3001\u5927\u4EBA\u89C9\u5F97\u597D\u7B11\u4F46\u5C0F\u670B\u53CB\u5F88\u4E25\u8083",
    "\u91D1\u53E5": "\u6E29\u99A8\u3001\u6CBB\u6108\u3001\u8BA9\u4EBA\u5FC3\u5934\u4E00\u8F6F\u7684\u6536\u5C3E"
  };
  return emotions[role] || "\u6E29\u6696\u8F7B\u677E\u7684\u65E5\u5E38\u6C1B\u56F4";
}

function inferCharactersInScene(action) {
  var chars = ["\u6EE1"];
  if (/\u7238|\u8001\u7238|\u7238\u7238/.test(action)) chars.push("\u7238\u7238");
  if (/\u5988|\u5988\u5988/.test(action)) chars.push("\u5988\u5988");
  if (/\u7237\u7237|\u7237/.test(action)) chars.push("\u7237\u7237");
  if (chars.length === 1) {
    chars.push("\u7238\u7238");
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
  if (!state.result) {
    try {
      state.result = buildResult();
    } catch (e) {
      console.error("[render] buildResult failed:", e);
      return;
    }
  }
  var withText = state.view === "lettered";
  try {
    /* If AI-generated images are available, use those instead of the base image */
    if (state.generatedImages.length > 0) {
      renderGeneratedComic(state.result, withText);
    } else {
      renderCanvasComic(state.result, withText);
    }
  } catch (e) {
    console.error("[render] renderCanvasComic error:", e);
  }
  try {
    els.dialogue.value = renderDialogue(state.result);
    els.prompts.value = buildImagePrompts(state.result);
    els.dialogue.hidden = state.view !== "dialogue";
    els.prompts.hidden = state.view !== "prompts";
    els.preview.hidden = state.view === "dialogue" || state.view === "prompts";
    updatePublish(state.result);
  } catch (e) {
    console.error("[render] render text error:", e);
  }
}

function setView(view) {
  state.view = view;
  var tabs = document.querySelectorAll(".tab");
  for (var ti = 0; ti < tabs.length; ti++) {
    var tab = tabs[ti];
    if (tab.dataset && tab.dataset.view === view) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  }
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(function () { els.toast.classList.remove("show"); }, 1700);
}

function copyText(text, label) {
  navigator.clipboard.writeText(text).then(function () {
    showToast(label + "\u5DF2\u590D\u5236");
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

/* ============ Reference image upload ============ */

function renderRefGallery() {
  var categoryNames = { style: "\u753B\u98CE", character: "\u4EBA\u7269", outfit: "\u670D\u88C5", prop: "\u7269\u54C1", composition: "\u6784\u56FE" };
  els.refGallery.innerHTML = "";
  for (var gi = 0; gi < state.refImages.length; gi++) {
    (function (index) {
      var item = state.refImages[index];
      var thumb = document.createElement("div");
      thumb.className = "ref-thumb";

      var img = document.createElement("img");
      img.src = item.url;
      img.alt = "\u53C2\u8003\u56FE " + (index + 1);
      thumb.appendChild(img);

      var catLabel = document.createElement("span");
      catLabel.className = "ref-cat-label";
      catLabel.textContent = categoryNames[item.category] || "\u753B\u98CE";
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
        showToast("\u5DF2\u79FB\u9664\u53C2\u8003\u56FE");
      });
      thumb.appendChild(removeBtn);

      els.refGallery.appendChild(thumb);
    })(gi);
  }
}

els.refImageInput.addEventListener("change", function (event) {
  var fileList = event.target.files || [];
  var files = [];
  for (var fi = 0; fi < fileList.length; fi++) {
    files.push(fileList[fi]);
  }
  if (files.length === 0) return;

  var category = els.refCategory ? els.refCategory.value : "style";

  for (var ai = 0; ai < files.length; ai++) {
    var file = files[ai];
    var url = URL.createObjectURL(file);
    state.refImages.push({ url: url, name: file.name, category: category });
  }

  renderRefGallery();

  if (state.result) {
    els.prompts.value = buildImagePrompts(state.result);
  }

  var categoryNames = { style: "\u753B\u98CE", character: "\u4EBA\u7269", outfit: "\u670D\u88C5", prop: "\u7269\u54C1", composition: "\u6784\u56FE" };
  showToast("\u5DF2\u6DFB\u52A0 " + files.length + " \u5F20" + (categoryNames[category] || "") + "\u53C2\u8003\u56FE");
  els.refImageInput.value = "";
});

/* ============ AI Image Generation ============ */

function setProgress(text) {
  console.log("[gen-progress] " + text);
  if (els.genProgress) els.genProgress.textContent = text;
}

function generateSingleImage(prompt, negativePrompt) {
  var provider = (els.apiProvider && els.apiProvider.value) || "pollinations";
  var apiKey = (els.apiKey && els.apiKey.value) || "";
  var sfModel = (els.sfModel && els.sfModel.value) || "";

  var body = {
    provider: provider,
    prompt: prompt,
    negativePrompt: negativePrompt || "",
    size: "1024x1024",
    apiKey: apiKey,
    sfModel: sfModel
  };

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/generate-image", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.timeout = 180000; /* 180 second timeout for 2K images */
    xhr.onload = function () {
      if (xhr.status !== 200) {
        reject(new Error("HTTP " + xhr.status));
        return;
      }
      try {
        var data = JSON.parse(xhr.responseText);
        if (data.error) {
          reject(new Error(data.error));
        } else if (data.image) {
          resolve(data.image);
        } else {
          reject(new Error("No image in response"));
        }
      } catch (e) {
        reject(new Error("Parse error: " + e.message));
      }
    };
    xhr.onerror = function () { reject(new Error("Network error")); };
    xhr.ontimeout = function () { reject(new Error("Request timeout (3min)")); };
    xhr.send(JSON.stringify(body));
  });
}

function loadImageFromBase64(b64) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () { resolve(img); };
    img.onerror = function () { reject(new Error("Image decode failed")); };
    img.src = "data:image/png;base64," + b64;
  });
}

function generatePanelImages() {
  if (state.generatingImages) return;
  if (!state.result) {
    state.result = buildResult();
    render();
  }

  var result = state.result;
  var panels = result.panels;
  state.generatingImages = true;
  state.generatedImages = [];

  /* Build prompts for each panel */
  var stylePrefix = "Studio Ghibli anime style, warm hand-drawn Japanese animation, soft pencil lines, watercolor texture background, low saturation warm colors, soft natural light, clean cel-shading, cute round toddler proportions 1:3.5, rich daily life details";
  var negativePrompt = "3D render, photorealistic, western cartoon, plastic texture, neon colors, text, watermark, ugly, deformed, blurry";

  /* Character descriptions with strong visual anchors for cross-panel consistency */
  var girlAnchor = "IMPORTANT: The toddler girl MUST look exactly the same in every frame — identical face shape, identical hair, identical body proportions, identical shoes. Only her pose and expression change.";
  var girlDesc = "A 20-month-old Chinese toddler girl (Man). Face: perfectly round chubby face with full rounded chin and double chin, large round dark brown eyes (diameter ~1/4 of face width), tiny button nose, small curved mouth. Hair: short dark brown hair just past ears, sometimes tied in a tiny low ponytail or left with slightly flipped-out ends, thin wispy bangs parted slightly left covering forehead. Skin: fair porcelain with warm undertone, naturally rosy apple-red cheeks. Build: typical toddler 1:3.5 head-to-body ratio, short pudgy arms and legs, small rounded hands with dimpled knuckles. Signature shoes: white velcro-strap sneakers with red heel tabs and red piping along sole edge, small cartoon animal patch on outer side near strap.";
  var dadDesc = "Young Chinese dad in his late 20s. Face: slightly elongated oval shape, gentle almond-shaped eyes behind thin black rectangular-framed glasses, calm warm smile. Hair: very short neat black hair with clean sides. Build: medium build with broad shoulders, slightly muscular arms, taller than toddler by roughly 3x. Outfit: light beige/off-white crew-neck t-shirt (small dark logo on left chest), light heather gray knee-length athletic shorts, white athletic lace-up sneakers. Black smartwatch on left wrist. At home wears black Crocs clogs decorated with colorful charms including paw prints and 'baby' text. Warm gentle full-time dad vibe.";

  /* Infer outfit based on scene */
  var scene = (els.scene && els.scene.value) || "\u5BA2\u5385";
  var outfitSuffix = "";
  if (/\u516C\u56ED|\u6237\u5916/.test(scene)) {
    outfitSuffix = " Wearing light blue denim overalls with white long-sleeve inner shirt, chest pocket has yellow cloud, banana and flower applique patches, metal snap buttons on shoulder straps. Red-and-white sneakers with velcro straps. Sometimes red-and-white striped socks visible above shoes.";
  } else if (/\u6D74\u5BA4|\u6D17\u6FA1/.test(scene)) {
    outfitSuffix = " Wearing only a diaper/underwear, bare round chubby feet.";
  } else if (/\u5367\u5BA4|\u7761/.test(scene)) {
    outfitSuffix = " Wearing soft pink footed one-piece pajamas, long sleeves, cozy and warm.";
  } else {
    outfitSuffix = " Wearing white ribbed short-sleeve top with small yellow lemon and green leaf pattern on chest, light olive-green elastic-waist pants with tiny black line-art whale drawing at lower right leg. White velcro-strap sneakers with red accents.";
  }

  var promises = [];
  for (var i = 0; i < panels.length; i++) {
    var panel = panels[i];
    var charactersInScene = inferCharactersInScene(panel.action);
    var charList = "";
    for (var ci = 0; ci < charactersInScene.length; ci++) {
      var ch = charactersInScene[ci];
      if (ch === "\u6EE1") charList += girlDesc + outfitSuffix + " ";
      else if (ch === "\u7238\u7238") charList += dadDesc + " ";
      else if (ch === "\u7237\u7237") charList += "Elderly Chinese grandfather in his 60s, kind smiling face with laugh lines, short silver-gray hair, wearing plain light beige button-up shirt and dark navy trousers, gentle warm eyes. ";
    }

    var sceneDesc = buildSceneDescription(scene, panel.action);
    var emotionDesc = buildEmotionDescription(panel.role);

    var prompt = stylePrefix + ". " + girlAnchor + " " + charList + "Scene: " + sceneDesc + ". Action: " + panel.action + ". Emotion: " + emotionDesc + ". Vertical single comic panel, characters centered or rule-of-thirds, maintain exact same character designs throughout the series, clean empty white speech bubble frames (no readable text), rich daily life details in background, soft warm ambient lighting.";

    promises.push({
      index: i,
      prompt: prompt,
      negativePrompt: negativePrompt
    });
  }

  /* Generate images sequentially */
  var chain = Promise.resolve();
  for (var pi = 0; pi < promises.length; pi++) {
    (function (idx, promptData) {
      chain = chain.then(function () {
        setProgress("\u6B63\u5728\u751F\u6210\u7B2C " + (idx + 1) + "/" + panels.length + " \u683C\u6F2B\u753B\u2026");
        return generateSingleImage(promptData.prompt, promptData.negativePrompt)
          .then(function (b64) {
            setProgress("\u7B2C " + (idx + 1) + " \u683C\u751F\u6210\u5B8C\u6210\uFF0C\u89E3\u7801\u4E2D\u2026");
            return loadImageFromBase64(b64).then(function (img) {
              state.generatedImages[idx] = img;
            });
          })
          .catch(function (err) {
            console.error("[gen] panel " + (idx + 1) + " failed:", err);
            setProgress("\u7B2C " + (idx + 1) + " \u683C\u751F\u6210\u5931\u8D25\uFF1A" + err.message);
          });
      });
    })(pi, promises[pi]);
  }

  chain.then(function () {
    state.generatingImages = false;
    var successCount = 0;
    for (var si = 0; si < state.generatedImages.length; si++) {
      if (state.generatedImages[si]) successCount++;
    }

    if (successCount === 0) {
      setProgress("\u5168\u90E8\u751F\u6210\u5931\u8D25\uFF01\u8BF7\u68C0\u67E5 API \u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002");
      alert(
        "\u5206\u955C\u6F2B\u753B\u56FE\u751F\u6210\u5931\u8D25\uFF01\n\n" +
        "\u53EF\u80FD\u7684\u539F\u56E0\uFF1A\n" +
        "1. API Key \u65E0\u6548\u6216\u672A\u586B\u5199\n" +
        "2. \u7F51\u7EDC\u65E0\u6CD5\u8FDE\u63A5\u8BE5\u670D\u52A1\uFF08\u5982 OpenAI \u53EF\u80FD\u88AB\u9632\u706B\u5899\u62E6\u622A\uFF09\n" +
        "3. API \u8D26\u6237\u4F59\u989D\u4E0D\u8DB3\n\n" +
        "\u5EFA\u8BAE\uFF1A\n" +
        "\u2022 \u5207\u6362\u5230 Together AI \u6216 Stability AI\uFF08\u7ECF\u6D4B\u8BD5\u53EF\u8FDE\u63A5\uFF09\n" +
        "\u2022 Together AI \u6CE8\u518C\u5730\u5740\uFF1Ahttps://api.together.ai\n" +
        "\u2022 \u786E\u4FDD\u5DF2\u586B\u5199\u6709\u6548\u7684 API Key"
      );
      return;
    }

    setProgress("\u5168\u90E8\u5B8C\u6210\uFF01\u6210\u529F\u751F\u6210 " + successCount + "/" + panels.length + " \u683C");

    /* Switch to generated view and render */
    state.view = "lettered";
    renderGeneratedComic(result, true);
    /* Update tab UI */
    var tabs = document.querySelectorAll(".tab");
    for (var ti = 0; ti < tabs.length; ti++) {
      var tab = tabs[ti];
      if (tab.dataset && tab.dataset.view === "lettered") {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    }
    showToast("\u6F2B\u753B\u5206\u955C\u56FE\u5DF2\u751F\u6210");
  }).catch(function (err) {
    state.generatingImages = false;
    setProgress("\u751F\u6210\u8FC7\u7A0B\u51FA\u9519\uFF1A" + err.message);
    alert("\u751F\u6210\u51FA\u9519\uFF1A" + err.message);
  });
}

/* Composite generated AI images onto canvas with text overlays */
function renderGeneratedComic(result, withText) {
  var canvas = els.canvas;
  var ctx = canvas.getContext("2d");
  var panelCount = result.panels.length;
  var images = state.generatedImages;

  /* Layout: vertical stack of panels, adapt to actual image size */
  var panelWidth = 1024;
  var panelHeight = 1024;
  if (images[0]) {
    /* Use first successful image's dimensions, scaled to max 1024 wide */
    var iw = images[0].naturalWidth || images[0].width;
    var ih = images[0].naturalHeight || images[0].height;
    if (iw > 0 && ih > 0) {
      var scale = Math.min(1, 1024 / iw);
      panelWidth = Math.round(iw * scale);
      panelHeight = Math.round(ih * scale);
    }
  }
  var gap = 8;
  var titleHeight = 80;
  var totalHeight = titleHeight + panelCount * panelHeight + (panelCount - 1) * gap + 16;

  canvas.width = panelWidth;
  canvas.height = totalHeight;

  /* Background */
  ctx.fillStyle = "#fff7e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Title bar */
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(16, 10, panelWidth - 32, 60);
  ctx.strokeStyle = "#2c2722";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 10, panelWidth - 32, 60);
  ctx.fillStyle = "#2c2722";
  ctx.font = '900 32px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(result.episodeTitle || "\u6EE1\u6EE1\u65E5\u5E38", panelWidth / 2, 42);

  /* Draw each panel */
  for (var i = 0; i < panelCount; i++) {
    var py = titleHeight + i * (panelHeight + gap);

    /* Draw generated image */
    if (images[i]) {
      ctx.drawImage(images[i], 0, py, panelWidth, panelHeight);
    } else {
      /* Placeholder for failed panels */
      ctx.fillStyle = "#e8e0d4";
      ctx.fillRect(0, py, panelWidth, panelHeight);
      ctx.fillStyle = "#999";
      ctx.font = '24px "Noto Sans SC", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("\u7B2C " + (i + 1) + " \u683C\u751F\u6210\u5931\u8D25", panelWidth / 2, py + panelHeight / 2);
    }

    /* Panel border */
    ctx.strokeStyle = "#2c2722";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, py, panelWidth, panelHeight);

    /* Panel index badge */
    ctx.fillStyle = "#fffdf7";
    ctx.beginPath();
    ctx.arc(28, py + 28, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2c2722";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#2c2722";
    ctx.font = '900 20px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), 28, py + 29);
  }

  /* Draw text overlays */
  if (withText) {
    var slots = getSlotTexts(result);
    for (var si = 0; si < slots.length; si++) {
      var slot = slots[si];
      if (!slot.text) continue;

      /* Map slot position to generated comic layout */
      var slotPanelIndex = slot.panel - 1;
      if (panelCount === 4) {
        var fourMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 3 };
        slotPanelIndex = fourMap[slot.panel - 1];
        if (slotPanelIndex === undefined) slotPanelIndex = slot.panel - 1;
      }
      if (slotPanelIndex >= panelCount) continue;

      var actualY = titleHeight + slotPanelIndex * (panelHeight + gap);
      /* Position text near the top of each panel as speech bubble */
      var textX = slot.rx * panelWidth;
      var textY = actualY + slot.ry * panelHeight * 0.5 + 30;
      var textW = slot.rw * panelWidth * 1.5;
      var textH = slot.rh * panelHeight * 2;

      /* Draw speech bubble background */
      var bx = textX - textW / 2 - 12;
      var by = textY - textH / 2 - 8;
      var bw = textW + 24;
      var bh = textH + 16;
      var br = 14;
      ctx.fillStyle = "rgba(255,254,249,0.92)";
      ctx.beginPath();
      ctx.moveTo(bx + br, by);
      ctx.lineTo(bx + bw - br, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
      ctx.lineTo(bx + bw, by + bh - br);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
      ctx.lineTo(bx + br, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
      ctx.lineTo(bx, by + br);
      ctx.quadraticCurveTo(bx, by, bx + br, by);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#2c2722";
      ctx.lineWidth = 2;
      ctx.stroke();

      /* Draw text */
      drawWrappedCanvasText(ctx, slot.text, {
        x: textX,
        y: textY,
        w: textW,
        h: textH
      });
    }
  }
}

/* ============ Button events ============ */

var inputTimer = null;
els.story.addEventListener("input", function () {
  clearTimeout(inputTimer);
  inputTimer = setTimeout(function () {
    console.log("[input handler] auto-regenerating...");
    state.result = buildResult();
    render();
  }, 400);
});

var formEls = [els.count, els.scene, els.style, els.title];
for (var fei = 0; fei < formEls.length; fei++) {
  (function (el) {
    if (el) {
      el.addEventListener("change", function () {
        state.result = buildResult();
        render();
      });
    }
  })(formEls[fei]);
}

els.generate.addEventListener("click", function () {
  console.log("[generate] clicked, story length:", els.story.value.length);
  console.log("[generate] story preview:", els.story.value.substring(0, 60));
  try {
    state.result = buildResult();
    console.log("[generate] buildResult done, panels:", state.result.panels.length);
    console.log("[generate] panel 1 action:", state.result.panels[0].action);
    try { localStorage.setItem("manman-comic-story", els.story.value); } catch (e) {}
    render();
    console.log("[generate] render done");
    /* Write a quick summary to the dialogue output so user can verify content changed */
    var summary = "=== 当前故事前60字 ===\n" + els.story.value.substring(0, 60) + "\n\n";
    summary += renderDialogue(state.result);
    els.dialogue.value = summary;
    showToast("\u6F2B\u753B\u65B9\u6848\u5DF2\u751F\u6210");
  } catch (e) {
    console.error("[generate] error:", e);
    alert("\u751F\u6210\u51FA\u9519\uFF1A" + (e.message || e));
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

var tabEls = document.querySelectorAll(".tab");
for (var tbi = 0; tbi < tabEls.length; tbi++) {
  (function (tab) {
    tab.addEventListener("click", function () { setView(tab.dataset.view); });
  })(tabEls[tbi]);
}

$("#copy-dialogue").addEventListener("click", function () { copyText(els.dialogue.value, "\u5BF9\u8BDD\u6587\u6848"); });
$("#copy-prompts").addEventListener("click", function () { copyText(els.prompts.value, "AI \u751F\u56FE\u63D0\u793A\u8BCD"); });
$("#copy-title").addEventListener("click", function () { copyText(els.publishTitle.value, "\u6807\u9898"); });
$("#copy-caption").addEventListener("click", function () { copyText(els.publishCaption.value, "\u6B63\u6587"); });
$("#copy-tags").addEventListener("click", function () { copyText(els.publishTags.value, "\u6807\u7B7E"); });
$("#copy-all").addEventListener("click", function () {
  var all = "\u6807\u9898\uFF1A\n" + els.publishTitle.value + "\n\n\u6B63\u6587\uFF1A\n" + els.publishCaption.value + "\n\n\u6807\u7B7E\uFF1A\n" + els.publishTags.value + "\n\n\u7F6E\u9876\u8BC4\u8BBA\uFF1A\n" + els.pinComment.value;
  copyText(all, "\u53D1\u5E03\u5185\u5BB9");
});

$("#download-svg").addEventListener("click", function () {
  showToast("\u5F53\u524D\u4E3A\u6210\u7A3F\u56FE\u7247\u6A21\u5F0F\uFF0C\u8BF7\u4E0B\u8F7D PNG");
});

$("#download-png").addEventListener("click", downloadPng);

els.blankImageInput.addEventListener("change", function (event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;
  if (state.baseImageUrl.indexOf("blob:") === 0) URL.revokeObjectURL(state.baseImageUrl);
  state.baseImageUrl = URL.createObjectURL(file);
  loadImage(state.baseImageUrl).then(function (image) {
    state.baseImage = image;
    render();
    showToast("\u7A7A\u767D\u6F2B\u753B\u5E95\u56FE\u5DF2\u8F7D\u5165");
  });
});

/* Generate AI panel images */
if (els.generateImages) {
  els.generateImages.addEventListener("click", function () {
    if (state.generatingImages) {
      showToast("\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u2026");
      return;
    }
    /* Rebuild result from current story text */
    state.result = buildResult();
    render();
    generatePanelImages();
  });
}

/* Show/hide model dropdown and auto-fill API key based on provider */
var defaultApiKeys = {
  "volcengine": "ark-3437a069-b0ce-4d77-8086-45302b7bf847-4380d"
};
function updateSfModelVisibility() {
  if (!els.sfModelRow || !els.apiProvider) return;
  var p = els.apiProvider.value;
  els.sfModelRow.style.display = (p === "siliconflow" || p === "volcengine") ? "" : "none";
  /* Auto-fill API key for known providers if field is empty */
  if (els.apiKey && defaultApiKeys[p] && !els.apiKey.value) {
    els.apiKey.value = defaultApiKeys[p];
  }
}
if (els.apiProvider) {
  els.apiProvider.addEventListener("change", updateSfModelVisibility);
  updateSfModelVisibility();
}

/* ============ Init ============ */

console.log("[app.js] v20260608c loaded successfully");

var savedStory;
try { savedStory = localStorage.getItem("manman-comic-story"); } catch (e) {}
els.story.value = savedStory || sampleStory;

try {
  state.result = buildResult();
  console.log("[init] buildResult success, panels:", state.result.panels.length);
} catch (e) {
  console.error("[init] buildResult failed:", e);
  alert("页面初始化出错：\n" + (e.message || e));
}

loadImage(state.baseImageUrl).then(
  function (image) {
    state.baseImage = image;
    console.log("[init] base image loaded (" + image.width + "x" + image.height + "), rendering...");
    render();
  },
  function (err) {
    console.warn("[init] base image load failed:", err);
    alert("底图加载失败，请手动上传空白漫画底图。\n\n路径：" + state.baseImageUrl);
    render();
  }
);
