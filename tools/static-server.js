/**
 * 满满漫画工坊 — 开发服务器 (静态文件 + AI 图片生成代理)
 *
 * 用法:
 *   node tools/static-server.js
 *
 * 环境变量 (可选):
 *   PORT           起始端口, 默认 4173
 *   OPENAI_API_KEY OpenAI API Key (也可在页面 UI 中输入)
 */

var fs = require("fs");
var http = require("http");
var https = require("https");
var path = require("path");

var startPort = Number(process.env.PORT || 4173);
var host = "127.0.0.1";
var root = path.resolve(__dirname, "..", "docs");

var mimeTypes = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".md": "text/markdown;charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

/* ==================== 读取请求体 ==================== */
function readBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    req.on("data", function (chunk) { chunks.push(chunk); });
    req.on("end", function () {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

/* ==================== API 代理: OpenAI DALL-E ==================== */
function proxyOpenAI(apiKey, prompt, size, callback) {
  var body = JSON.stringify({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: size || "1024x1024",
    response_format: "b64_json"
  });

  var req = https.request({
    hostname: "api.openai.com",
    path: "/v1/images/generations",
    method: "POST",
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
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
          callback(null, data.error.message || JSON.stringify(data.error));
          return;
        }
        if (data.data && data.data[0] && data.data[0].b64_json) {
          callback(data.data[0].b64_json, null);
        } else if (data.data && data.data[0] && data.data[0].url) {
          callback(null, "API returned URL instead of base64. Use b64_json format.");
        } else {
          callback(null, "Unexpected response: " + raw.substring(0, 300));
        }
      } catch (e) {
        callback(null, "Parse error: " + e.message + " | raw: " + raw.substring(0, 300));
      }
    });
  });
  req.on("error", function (e) { callback(null, e.message); });
  req.on("timeout", function () { req.destroy(); callback(null, "OpenAI API connection timeout (60s). Your network may be blocking api.openai.com. Please try Together AI or Stability AI instead."); });
  req.write(body);
  req.end();
}

/* ==================== API 代理: Stability AI ==================== */
function proxyStability(apiKey, prompt, negativePrompt, callback) {
  var body = JSON.stringify({
    text_prompts: [
      { text: prompt, weight: 1 },
      { text: negativePrompt || "", weight: -1 }
    ],
    cfg_scale: 7,
    steps: 30,
    width: 1024,
    height: 1024,
    samples: 1
  });

  var req = https.request({
    hostname: "api.stability.ai",
    path: "/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "Accept": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  }, function (res) {
    var chunks = [];
    res.on("data", function (c) { chunks.push(c); });
    res.on("end", function () {
      var raw = Buffer.concat(chunks).toString();
      try {
        var data = JSON.parse(raw);
        if (data.message) {
          callback(null, data.message);
          return;
        }
        if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
          callback(data.artifacts[0].base64, null);
        } else {
          callback(null, "Unexpected response: " + raw.substring(0, 300));
        }
      } catch (e) {
        callback(null, "Parse error: " + e.message + " | raw: " + raw.substring(0, 300));
      }
    });
  });
  req.on("error", function (e) { callback(null, e.message); });
  req.write(body);
  req.end();
}

/* ==================== API 代理: Pollinations (免费, 无需 Key) ==================== */
function proxyPollinations(prompt, callback) {
  var encoded = encodeURIComponent(prompt);
  var url = "https://image.pollinations.ai/prompt/" + encoded + "?width=1024&height=1024&nologo=true&seed=" + Math.floor(Math.random() * 99999);

  https.get(url, { headers: { "User-Agent": "ManmanComicStudio/1.0" } }, function (res) {
    if (res.statusCode === 402) {
      callback(null, "Pollinations 免费队列已满，请切换到 OpenAI 或 Stability AI（需 API Key）。");
      res.resume();
      return;
    }
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, function (res2) {
        handlePollinationsResponse(res2, callback);
      }).on("error", function (e) { callback(null, e.message); });
      return;
    }
    handlePollinationsResponse(res, callback);
  }).on("error", function (e) { callback(null, e.message); });
}

function handlePollinationsResponse(res, callback) {
  if (res.statusCode !== 200) {
    callback(null, "HTTP " + res.statusCode);
    res.resume();
    return;
  }
  var chunks = [];
  res.on("data", function (c) { chunks.push(c); });
  res.on("end", function () {
    var buf = Buffer.concat(chunks);
    var b64 = buf.toString("base64");
    callback(b64, null);
  });
  res.on("error", function (e) { callback(null, e.message); });
}

/* ==================== API 代理: 火山引擎 (豆包 Seedream) ==================== */
function proxyVolcengine(apiKey, prompt, negativePrompt, model, callback) {
  var useModel = model || "doubao-seedream-5-0-260128";
  var bodyObj = {
    model: useModel,
    prompt: prompt,
    size: "2K",
    n: 1,
    response_format: "url",
    stream: false,
    watermark: false
  };
  if (negativePrompt) {
    bodyObj.negative_prompt = negativePrompt;
  }
  var body = JSON.stringify(bodyObj);
  console.log("[Volcengine] model:", useModel);

  var req = https.request({
    hostname: "ark.cn-beijing.volces.com",
    path: "/api/v3/images/generations",
    method: "POST",
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "Content-Length": Buffer.byteLength(body)
    }
  }, function (res) {
    var chunks = [];
    res.on("data", function (c) { chunks.push(c); });
    res.on("end", function () {
      var raw = Buffer.concat(chunks).toString();
      try {
        var data = JSON.parse(raw);
        if (data.code && data.code !== 0) {
          callback(null, data.message || JSON.stringify(data));
          return;
        }
        if (data.error) {
          callback(null, data.error.message || JSON.stringify(data.error));
          return;
        }
        if (data.data && data.data[0] && data.data[0].b64_json) {
          callback(data.data[0].b64_json, null);
        } else if (data.data && data.data[0] && data.data[0].url) {
          downloadImageToBase64(data.data[0].url, callback);
        } else {
          callback(null, "Unexpected response: " + raw.substring(0, 300));
        }
      } catch (e) {
        callback(null, "Parse error: " + e.message + " | raw: " + raw.substring(0, 300));
      }
    });
  });
  req.on("error", function (e) { callback(null, e.message); });
  req.on("timeout", function () {
    req.destroy();
    callback(null, "火山引擎 API 连接超时 (120s)，请稍后重试。");
  });
  req.write(body);
  req.end();
}

/* ==================== API 代理: SiliconFlow (硅基流动, 免费额度) ==================== */
function proxySiliconFlow(apiKey, prompt, negativePrompt, model, callback) {
  var useModel = model || "Tongyi-MAI/Z-Image-Turbo";
  var bodyObj = {
    model: useModel,
    prompt: prompt,
    image_size: "1024x1024",
    num_inference_steps: 20,
    seed: Math.floor(Math.random() * 2147483647),
    response_format: "url"
  };
  if (negativePrompt) {
    bodyObj.negative_prompt = negativePrompt;
  }
  var body = JSON.stringify(bodyObj);
  console.log("[SiliconFlow] model:", useModel);

  var req = https.request({
    hostname: "api.siliconflow.cn",
    path: "/v1/images/generations",
    method: "POST",
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "Content-Length": Buffer.byteLength(body)
    }
  }, function (res) {
    var chunks = [];
    res.on("data", function (c) { chunks.push(c); });
    res.on("end", function () {
      var raw = Buffer.concat(chunks).toString();
      try {
        var data = JSON.parse(raw);
        if (data.code || data.message) {
          callback(null, data.message || JSON.stringify(data));
          return;
        }
        if (data.data && data.data[0] && data.data[0].b64_json) {
          callback(data.data[0].b64_json, null);
        } else if (data.data && data.data[0] && data.data[0].url) {
          downloadImageToBase64(data.data[0].url, callback);
        } else {
          callback(null, "Unexpected response: " + raw.substring(0, 300));
        }
      } catch (e) {
        callback(null, "Parse error: " + e.message + " | raw: " + raw.substring(0, 300));
      }
    });
  });
  req.on("error", function (e) { callback(null, e.message); });
  req.on("timeout", function () {
    req.destroy();
    callback(null, "SiliconFlow API 连接超时 (120s)，请稍后重试。");
  });
  req.write(body);
  req.end();
}

/* 从 URL 下载图片并转为 base64 */
function downloadImageToBase64(imageUrl, callback) {
  console.log("[API] Downloading image from URL:", imageUrl.substring(0, 100) + "...");
  var protocol = imageUrl.indexOf("https") === 0 ? https : http;
  protocol.get(imageUrl, { timeout: 60000 }, function (res) {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      downloadImageToBase64(res.headers.location, callback);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, "Failed to download image: HTTP " + res.statusCode);
      res.resume();
      return;
    }
    var chunks = [];
    res.on("data", function (c) { chunks.push(c); });
    res.on("end", function () {
      var buf = Buffer.concat(chunks);
      callback(buf.toString("base64"), null);
      console.log("[API] Image downloaded, base64 length:", buf.toString("base64").length);
    });
    res.on("error", function (e) { callback(null, "Download error: " + e.message); });
  }).on("error", function (e) { callback(null, "Download error: " + e.message); });
}

/* ==================== API 代理: Together AI (FLUX 模型) ==================== */
function proxyTogether(apiKey, prompt, callback) {
  var body = JSON.stringify({
    model: "black-forest-labs/FLUX.1-schnell",
    prompt: prompt,
    n: 1,
    width: 1024,
    height: 1024,
    response_format: "b64_json"
  });

  var req = https.request({
    hostname: "api.together.xyz",
    path: "/v1/images/generations",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
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
          callback(null, data.error.message || JSON.stringify(data.error));
          return;
        }
        if (data.data && data.data[0] && data.data[0].b64_json) {
          callback(data.data[0].b64_json, null);
        } else if (data.data && data.data[0] && data.data[0].url) {
          callback(null, "API returned URL instead of base64.");
        } else {
          callback(null, "Unexpected response: " + raw.substring(0, 300));
        }
      } catch (e) {
        callback(null, "Parse error: " + e.message + " | raw: " + raw.substring(0, 300));
      }
    });
  });
  req.on("error", function (e) { callback(null, e.message); });
  req.write(body);
  req.end();
}

/* ==================== HTTP 请求处理 ==================== */
function handleRequest(req, res) {
  var urlParts = req.url.split("?");
  var pathname = decodeURIComponent(urlParts[0]);

  /* --- API: 生成图片 --- */
  if (pathname === "/api/generate-image" && req.method === "POST") {
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");

    readBody(req).then(function (body) {
      var provider = body.provider || "pollinations";
      var apiKey = body.apiKey || process.env.OPENAI_API_KEY || "";
      var prompt = body.prompt || "";
      var negativePrompt = body.negativePrompt || "";
      var size = body.size || "1024x1024";

      console.log("[API] generate-image: provider=" + provider + ", prompt length=" + prompt.length);

      function sendResult(b64, error) {
        if (error) {
          res.writeHead(200);
          res.end(JSON.stringify({ error: error }));
          console.error("[API] generate-image error:", error);
        } else {
          res.writeHead(200);
          res.end(JSON.stringify({ image: b64 }));
          console.log("[API] generate-image success, base64 length:", b64.length);
        }
      }

      if (provider === "openai") {
        if (!apiKey) { sendResult(null, "请提供 OpenAI API Key"); return; }
        proxyOpenAI(apiKey, prompt, size, sendResult);
      } else if (provider === "volcengine") {
        if (!apiKey) { sendResult(null, "请提供火山引擎 API Key。获取地址: https://console.volcengine.com/ark — 创建接入点后可获取 API Key。"); return; }
        proxyVolcengine(apiKey, prompt, negativePrompt, body.sfModel, sendResult);
      } else if (provider === "siliconflow") {
        if (!apiKey) { sendResult(null, "请提供 SiliconFlow (硅基流动) API Key。注册地址: https://cloud.siliconflow.cn — 新用户有免费额度。"); return; }
        proxySiliconFlow(apiKey, prompt, negativePrompt, body.sfModel, sendResult);
      } else if (provider === "stability") {
        if (!apiKey) { sendResult(null, "请提供 Stability AI API Key"); return; }
        proxyStability(apiKey, prompt, negativePrompt, sendResult);
      } else if (provider === "together") {
        if (!apiKey) { sendResult(null, "请提供 Together AI API Key"); return; }
        proxyTogether(apiKey, prompt, sendResult);
      } else {
        proxyPollinations(prompt, sendResult);
      }
    }).catch(function (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Invalid request body: " + err.message }));
    });
    return;
  }

  /* --- CORS preflight --- */
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  /* --- 静态文件 --- */
  if (pathname === "/") pathname = "/index.html";

  var file = path.join(root, pathname);
  if (file.indexOf(root) !== 0) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.end("Not found: " + pathname);
      return;
    }
    var ext = path.extname(file);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

/* ==================== 启动服务器 ==================== */
var server = http.createServer(handleRequest);

function listen(port) {
  server.once("error", function (error) {
    if (error.code === "EADDRINUSE") {
      listen(port + 1);
      return;
    }
    throw error;
  });
  server.listen(port, host, function () {
    console.log("http://" + host + ":" + port);
    console.log("API proxy: http://" + host + ":" + port + "/api/generate-image");
    console.log("Supported providers: volcengine (Seedream), siliconflow, openai, stability, pollinations");
  });
}

listen(startPort);
