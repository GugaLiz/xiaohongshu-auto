/* Mock DOM for Node.js testing of app.js */
var fs = require("fs");
var path = require("path");

// Mock DOM elements
function mockEl(value) {
  return {
    value: value || "",
    hidden: false,
    textContent: "",
    innerHTML: "",
    classList: { add: function(){}, remove: function(){}, toggle: function(){} },
    appendChild: function(){},
    addEventListener: function(){},
    dataset: {}
  };
}

// Provide global document and window
global.document = {
  querySelector: function(sel) {
    var map = {
      "#story-input": mockEl("\u300A\u516D\u4E00\u513F\u7AE5\u8282\u793C\u7269\u300B\uFF1A\u56E0\u4E3A\u7238\u7238\u5988\u5988\u90FD\u6709\u4E00\u53CC\u6D1E\u6D1E\u978B\uFF0C\u7136\u540E\u6EE1\u53D1\u73B0\u8EAB\u8FB9\u6709\u597D\u591A\u4EBA\u4E5F\u7A7F\u6D1E\u6D1E\u978B\u3002\u6628\u665A\u6D1E\u6D1E\u978B\u5FEB\u9012\u5230\u4E86\uFF0C\u6EE1\u8D85\u7EA7\u9AD8\u5174\u3002"),
      "#episode-title": mockEl("\u6EE1\u6EE1\u65E5\u5E38\u5C0F\u6F2B\u753B"),
      "#scene-select": mockEl("\u5BA2\u5385"),
      "#panel-count": mockEl("4"),
      "#caption-style": mockEl("warm"),
      "#generate": mockEl(),
      "#reset": mockEl(),
      "#load-sample": mockEl(),
      "#comic-preview": mockEl(),
      "#comic-canvas": { getContext: function() { return { save: function(){}, restore: function(){}, clearRect: function(){}, drawImage: function(){}, beginPath: function(){}, moveTo: function(){}, lineTo: function(){}, quadraticCurveTo: function(){}, closePath: function(){}, fill: function(){}, strokeText: function(){}, fillText: function(){}, measureText: function(t) { return {width: t.length * 20}; } }; }, width: 864, height: 1821 },
      "#blank-image-input": mockEl(),
      "#ref-image-input": mockEl(),
      "#ref-image-gallery": mockEl(),
      "#ref-category-select": mockEl("style"),
      "#dialogue-output": mockEl(),
      "#prompt-output": mockEl(),
      "#publish-title": mockEl(),
      "#publish-caption": mockEl(),
      "#publish-tags": mockEl(),
      "#pin-comment": mockEl(),
      "#toast": mockEl(),
      "#copy-dialogue": mockEl(),
      "#copy-prompts": mockEl(),
      "#copy-title": mockEl(),
      "#copy-caption": mockEl(),
      "#copy-tags": mockEl(),
      "#copy-all": mockEl(),
      "#download-svg": mockEl(),
      "#download-png": mockEl()
    };
    return map[sel] || mockEl();
  },
  querySelectorAll: function() { return []; },
  createElement: function(tag) {
    return {
      className: "",
      src: "",
      alt: "",
      type: "",
      textContent: "",
      href: "",
      download: "",
      appendChild: function(){},
      addEventListener: function(){},
      click: function(){}
    };
  }
};

global.window = { setTimeout: setTimeout, clearTimeout: clearTimeout };
global.URL = { createObjectURL: function(){return "blob:test";}, revokeObjectURL: function(){} };
global.navigator = { clipboard: { writeText: function() { return Promise.resolve(); } } };
global.Image = function() {
  this.width = 100;
  this.height = 100;
  this.naturalWidth = 100;
  this.naturalHeight = 100;
  setTimeout(function() { if (this.onload) this.onload(); }.bind(this), 10);
};
global.Blob = function(parts, opts) { return {}; };
global.localStorage = {
  _data: {},
  getItem: function(k) { return this._data[k] || null; },
  setItem: function(k, v) { this._data[k] = v; }
};
global.Promise = Promise;

// Load app.js
var appCode = fs.readFileSync(path.join(__dirname, "..", "docs", "app.js"), "utf8");
// Remove the init section that tries to load images
var testCode = appCode.replace(/\/\* ============ Init ============ \*\/[\s\S]*$/, "");
eval(testCode);

// Now test buildResult
console.log("\n=== Testing buildResult ===");
try {
  var result = buildResult();
  console.log("OK - buildResult succeeded");
  console.log("  episodeTitle:", result.episodeTitle);
  console.log("  panels:", result.panels.length);
  for (var i = 0; i < result.panels.length; i++) {
    var p = result.panels[i];
    console.log("  Panel " + p.index + " [" + p.scene + "/" + p.role + "]: " + p.action.substring(0, 40) + "...");
    console.log("    dialogue:", p.dialogue.join(" | "));
  }
} catch (e) {
  console.error("FAIL - buildResult error:", e.message);
  console.error(e.stack);
  process.exit(1);
}

// Test renderDialogue
console.log("\n=== Testing renderDialogue ===");
try {
  var dialogue = renderDialogue(result);
  console.log("OK - renderDialogue succeeded, length:", dialogue.length);
  console.log(dialogue.substring(0, 200) + "...");
} catch (e) {
  console.error("FAIL - renderDialogue error:", e.message);
  process.exit(1);
}

// Test buildImagePrompts
console.log("\n=== Testing buildImagePrompts ===");
try {
  var prompts = buildImagePrompts(result);
  console.log("OK - buildImagePrompts succeeded, length:", prompts.length);
  console.log(prompts.substring(0, 200) + "...");
} catch (e) {
  console.error("FAIL - buildImagePrompts error:", e.message);
  process.exit(1);
}

// Test with different story
console.log("\n=== Testing with NEW story ===");
// Simulate changing the textarea
var newStory = "\u4ECA\u5929\u5E26\u6EE1\u53BB\u516C\u56ED\u73A9\uFF0C\u6EE1\u770B\u5230\u4E86\u4E00\u53EA\u8774\u8776\uFF0C\u8FFD\u7740\u8774\u8776\u8DD1\u4E86\u597D\u8FDC\u3002\u540E\u6765\u53C8\u770B\u5230\u4E86\u5C0F\u72D7\uFF0C\u6EE1\u5F88\u5F00\u5FC3\u5730\u53EB\u8D77\u6765\u3002\u6700\u540E\u5728\u6ED1\u68AF\u4E0A\u73A9\u4E86\u5F88\u4E45\uFF0C\u4E0D\u80AF\u56DE\u5BB6\u3002\u665A\u4E0A\u7761\u524D\u8FD8\u5728\u53EE\u5FF5\u8774\u8776\u3002";
document.querySelector("#story-input").value = newStory;

try {
  var result2 = buildResult();
  console.log("OK - buildResult with new story succeeded");
  console.log("  panels:", result2.panels.length);
  for (var j = 0; j < result2.panels.length; j++) {
    var p2 = result2.panels[j];
    console.log("  Panel " + p2.index + ": " + p2.action.substring(0, 40) + "...");
    console.log("    dialogue:", p2.dialogue.join(" | "));
  }
  // Verify panels are different
  var actions = result2.panels.map(function(p) { return p.action; });
  var uniqueActions = actions.filter(function(a, i, arr) { return arr.indexOf(a) === i; });
  if (uniqueActions.length === actions.length) {
    console.log("  OK - All panels have unique actions");
  } else {
    console.warn("  WARN - Some panels have duplicate actions");
  }
} catch (e) {
  console.error("FAIL - buildResult with new story error:", e.message);
  process.exit(1);
}

// Test wrapText
console.log("\n=== Testing wrapText ===");
try {
  var wrapped = wrapText("\u6EE1\uFF1A\u8774\u8776\uFF01\u8774\u8776\uFF01\u597D\u6F02\u4EAE\u7684\u8774\u8776\u554A\uFF01", 8);
  console.log("OK - wrapText succeeded:", wrapped);
} catch (e) {
  console.error("FAIL - wrapText error:", e.message);
  process.exit(1);
}

// Test svgTextLines
console.log("\n=== Testing svgTextLines ===");
try {
  var svg = svgTextLines("\u6EE1\uFF1A\u8774\u8776\uFF01", 100, 50, 6);
  console.log("OK - svgTextLines succeeded:", svg);
} catch (e) {
  console.error("FAIL - svgTextLines error:", e.message);
  process.exit(1);
}

// Test renderComic (SVG generation)
console.log("\n=== Testing renderComic ===");
try {
  var svgComic = renderComic(result, true);
  console.log("OK - renderComic succeeded, SVG length:", svgComic.length);
} catch (e) {
  console.error("FAIL - renderComic error:", e.message);
  process.exit(1);
}

console.log("\n=== ALL TESTS PASSED ===");
