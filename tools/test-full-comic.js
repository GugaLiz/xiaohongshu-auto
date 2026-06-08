/**
 * 模拟完整的 6 格漫画生成流程
 * 用法: node tools/test-full-comic.js
 */

var http = require("http");
var fs = require("fs");
var path = require("path");

var PORT = 4178;
var API_KEY = "ark-3437a069-b0ce-4d77-8086-45302b7bf847-4380d";
var MODEL = "doubao-seedream-5-0-260128";
var OUT_DIR = path.resolve(__dirname, "..", "test-output");

var stylePrefix = "Studio Ghibli anime style, warm hand-drawn Japanese animation, soft pencil lines, watercolor texture background, low saturation warm colors, soft natural light, clean cel-shading, cute round toddler proportions 1:3.5, rich daily life details";
var negativePrompt = "3D render, photorealistic, western cartoon, plastic texture, neon colors, text, watermark, ugly, deformed, blurry";

var girlDesc = "A 20-month-old Chinese toddler girl named Man, round chubby face, big dark brown eyes, short dark brown hair with slightly flipped ends, sparse natural bangs. Fair warm-toned skin, slightly pink cheeks. Short round arms and legs. Red and white striped socks.";
var dadDesc = "Young Chinese dad, medium build broad shoulders, oval face, gentle eyes, short dark hair, thin square glasses. White crew-neck t-shirt, light gray athletic shorts, white sneakers.";
var outfitDesc = " Wearing white short-sleeve top with small lemon pattern, light olive green stretchy pants with small whale drawing at ankle.";

/* 模拟 6 格漫画的场景 */
var panels = [
  {
    action: "Dad brings a wrapped gift box into the living room, Man sees it and her eyes light up with excitement",
    chars: [girlDesc + outfitDesc, dadDesc],
    scene: "Cozy living room with sofa, wooden coffee table, afternoon sunlight through curtains"
  },
  {
    action: "Man runs towards Dad with arms stretched out, trying to reach the gift box",
    chars: [girlDesc + outfitDesc, dadDesc],
    scene: "Living room, Dad standing near the door holding a colorful gift box"
  },
  {
    action: "Dad kneels down to Man's level, helping her tear the wrapping paper off the gift box",
    chars: [girlDesc + outfitDesc, dadDesc],
    scene: "Living room floor, colorful wrapping paper scattered around"
  },
  {
    action: "The gift box is opened revealing a pair of yellow crocs shoes with giraffe pattern, Man's mouth forms a big O shape in surprise",
    chars: [girlDesc + outfitDesc],
    scene: "Close-up view, gift box on the floor with yellow crocs shoes visible inside"
  },
  {
    action: "Man puts the yellow crocs on her feet proudly, stomping around the living room",
    chars: [girlDesc + " Wearing yellow crocs shoes with giraffe pattern, red and white striped socks visible"],
    scene: "Living room floor, Man walking proudly in her new shoes"
  },
  {
    action: "Man shows off her new shoes to the cat figurine on the shelf, pointing at her feet with a big smile",
    chars: [girlDesc + " Wearing yellow crocs shoes with giraffe pattern"],
    scene: "Living room, bookshelf with a small cat figurine, warm golden hour lighting"
  }
];

function generateImage(prompt, panelIndex) {
  return new Promise(function (resolve, reject) {
    var body = JSON.stringify({
      provider: "volcengine",
      prompt: prompt,
      negativePrompt: negativePrompt,
      apiKey: API_KEY,
      sfModel: MODEL,
      size: "2K"
    });

    var req = http.request({
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/generate-image",
      method: "POST",
      timeout: 180000,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    }, function (res) {
      var chunks = [];
      res.on("data", function (c) { chunks.push(c); });
      res.on("end", function () {
        var raw = Buffer.concat(chunks).toString();
        try {
          var data = JSON.parse(raw);
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
      });
    });
    req.on("error", reject);
    req.on("timeout", function () { req.destroy(); reject(new Error("timeout")); });
    req.write(body);
    req.end();
  });
}

/* Ensure output directory */
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log("=== Manman Comic Studio - Full 6-Panel Test ===");
console.log("Model:", MODEL);
console.log("Output dir:", OUT_DIR);
console.log("");

var chain = Promise.resolve();
var results = [];

panels.forEach(function (panel, i) {
  chain = chain.then(function () {
    var charList = panel.chars.join(" ");
    var prompt = stylePrefix + ". " + charList +
      " Scene: " + panel.scene +
      ". Action: " + panel.action +
      ". Vertical single comic panel, characters centered or rule-of-thirds composition, clean empty speech bubble frames (no readable text inside), rich life details in background.";

    console.log("[Panel " + (i + 1) + "/6] Generating... (prompt length: " + prompt.length + ")");
    var startTime = Date.now();

    return generateImage(prompt, i).then(function (b64) {
      var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      var buf = Buffer.from(b64, "base64");
      var filename = "panel-" + (i + 1) + ".png";
      var filepath = path.join(OUT_DIR, filename);
      fs.writeFileSync(filepath, buf);
      console.log("[Panel " + (i + 1) + "/6] OK! " + elapsed + "s, " + (buf.length / 1024).toFixed(0) + "KB -> " + filepath);
      results.push({ index: i, success: true, file: filename, time: elapsed });
    }).catch(function (err) {
      var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log("[Panel " + (i + 1) + "/6] FAILED (" + elapsed + "s): " + err.message);
      results.push({ index: i, success: false, error: err.message, time: elapsed });
    });
  });
});

chain.then(function () {
  console.log("");
  console.log("=== Summary ===");
  var ok = results.filter(function (r) { return r.success; });
  var fail = results.filter(function (r) { return !r.success; });
  console.log("Success: " + ok.length + "/6, Failed: " + fail.length + "/6");
  if (ok.length > 0) {
    var totalTime = ok.reduce(function (s, r) { return s + parseFloat(r.time); }, 0);
    console.log("Avg time per panel: " + (totalTime / ok.length).toFixed(1) + "s");
  }
  if (fail.length > 0) {
    fail.forEach(function (r) {
      console.log("  Panel " + (r.index + 1) + " error: " + r.error);
    });
  }
  console.log("");
  console.log("Output files in:", OUT_DIR);
}).catch(function (err) {
  console.error("Fatal error:", err);
});
