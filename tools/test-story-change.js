/* Quick test: simulate user changing story text */
var fs = require("fs");
var path = require("path");

function mockEl(val) {
  return {
    value: val || "",
    hidden: false, textContent: "", innerHTML: "",
    classList: { add:function(){}, remove:function(){}, toggle:function(){} },
    appendChild: function(){}, addEventListener: function(){}, dataset: {}
  };
}

var storyEl = mockEl("\u4ECA\u5929\u5E26\u6EE1\u53BB\u516C\u56ED\u73A9\uFF0C\u6EE1\u770B\u5230\u4E86\u4E00\u53EA\u8774\u8776\uFF0C\u8FFD\u7740\u8774\u8776\u8DD1\u4E86\u597D\u8FDC\u3002\u540E\u6765\u53C8\u770B\u5230\u4E86\u5C0F\u72D7\uFF0C\u6EE1\u5F88\u5F00\u5FC3\u5730\u53EB\u8D77\u6765\u3002\u6700\u540E\u5728\u6ED1\u68AF\u4E0A\u73A9\u4E86\u5F88\u4E45\uFF0C\u4E0D\u80AF\u56DE\u5BB6\u3002\u665A\u4E0A\u7761\u524D\u8FD8\u5728\u53EE\u5FF5\u8774\u8776\u3002");

global.document = {
  querySelector: function(sel) {
    if (sel === "#story-input") return storyEl;
    if (sel === "#episode-title") return mockEl("");
    if (sel === "#scene-select") return mockEl("\u516C\u56ED\u6B65\u9053");
    if (sel === "#panel-count") return mockEl("4");
    if (sel === "#caption-style") return mockEl("warm");
    return mockEl();
  },
  querySelectorAll: function() { return []; },
  createElement: function() { return mockEl(); }
};
global.window = { setTimeout: setTimeout, clearTimeout: clearTimeout };
global.URL = { createObjectURL: function(){return "";}, revokeObjectURL: function(){} };
global.navigator = { clipboard: { writeText: function() { return Promise.resolve(); } } };
global.Image = function() { this.width=100; this.height=100; setTimeout(function(){if(this.onload)this.onload();}.bind(this),10); };
global.Blob = function(){};
global.localStorage = { getItem: function(){return null;}, setItem: function(){} };
global.Promise = Promise;

var appCode = fs.readFileSync(path.join(__dirname, "..", "docs", "app.js"), "utf8");
var testCode = appCode.replace(/\/\* ============ Init ============ \*\/[\s\S]*$/, "");
eval(testCode);

console.log("=== Story: park + butterfly ===");
console.log("Story text:", storyEl.value);
console.log("");

var result = buildResult();
console.log("Title:", result.episodeTitle);
console.log("Panels:", result.panels.length);
for (var i = 0; i < result.panels.length; i++) {
  var p = result.panels[i];
  console.log("  [" + p.index + "] " + p.scene + "/" + p.role + ": " + p.action);
  console.log("      dialogue: " + p.dialogue.join(" | "));
}

console.log("\n=== Changing story to ball story ===");
storyEl.value = "\u6EE1\u5728\u5BA2\u5385\u73A9\u7403\uFF0C\u7403\u6EDA\u5230\u4E86\u6C99\u53D1\u4E0B\u9762\u3002\u7238\u7238\u5E2E\u6EE1\u627E\u7403\uFF0C\u6EE1\u4E5F\u8D76\u7D27\u8DDF\u7740\u627E\u3002\u627E\u5230\u4E86\u4EE5\u540E\u6EE1\u5F00\u5FC3\u5F97\u53C8\u8DF3\u53C8\u53EB\u3002\u540E\u6765\u6EE1\u81EA\u5DF1\u62FF\u7740\u7403\u53BB\u627E\u7237\u7237\u70AB\u8000\u3002\u665A\u4E0A\u7761\u89C9\u4E5F\u8981\u62B1\u7740\u7403\u7761\u3002";
console.log("New story:", storyEl.value);
console.log("");

var result2 = buildResult();
console.log("Title:", result2.episodeTitle);
console.log("Panels:", result2.panels.length);
for (var j = 0; j < result2.panels.length; j++) {
  var p2 = result2.panels[j];
  console.log("  [" + p2.index + "] " + p2.scene + "/" + p2.role + ": " + p2.action);
  console.log("      dialogue: " + p2.dialogue.join(" | "));
}

// Verify the two results are different
var same = (result.panels[0].action === result2.panels[0].action);
console.log("\nFirst panel same?", same);
if (!same) {
  console.log("SUCCESS - Different stories produce different panels!");
} else {
  console.log("FAILURE - Panels did not change with new story");
}
