#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const characterFile = path.join(projectRoot, "config", "characters.json");

function loadCharacterData() {
  return JSON.parse(fs.readFileSync(characterFile, "utf8"));
}

function parseArgs(argv) {
  const result = {};

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];

    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      result[key] = true;
      continue;
    }

    result[key] = next;
    i += 1;
  }

  return result;
}

function splitCsv(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCharactersByIds(data, ids) {
  const map = {};
  data.characters.forEach((character) => {
    map[character.id] = character;
  });

  return ids.map((id) => map[id]).filter(Boolean);
}

function collectOutfits(characters, outfitIds) {
  const byId = {};

  characters.forEach((character) => {
    const outfits = character.default_outfits || [];
    outfits.forEach((outfit) => {
      byId[outfit.id] = {
        characterName: character.name,
        outfit: outfit
      };
    });
  });

  return outfitIds.map((id) => byId[id]).filter(Boolean);
}

function formatCharacterSummary(characters) {
  return characters
    .map((character) => {
      const summary = [];
      summary.push("角色：" + character.name);

      if (character.role_in_family) {
        summary.push("家庭定位：" + character.role_in_family);
      }

      if (character.age_months) {
        summary.push("年龄：" + character.age_months + " 月龄");
      }

      if (character.visual_signature) {
        const visual = [];
        Object.keys(character.visual_signature).forEach((key) => {
          const value = character.visual_signature[key];
          if (Array.isArray(value)) {
            visual.push(value.join("、"));
          } else {
            visual.push(value);
          }
        });
        if (visual.length > 0) {
          summary.push("视觉特征：" + visual.join("；"));
        }
      }

      if (character.speech_style) {
        summary.push(
          "说话风格：" +
            character.speech_style.voice +
            "，常用词有 " +
            character.speech_style.common_words.join("、")
        );
      }

      return summary.join("\n");
    })
    .join("\n\n");
}

function formatOutfitSummary(items) {
  if (items.length === 0) {
    return "未指定具体服装，默认使用角色主穿搭。";
  }

  return items
    .map((entry) => {
      return (
        entry.characterName +
        " 使用 " +
        entry.outfit.name +
        "：" +
        entry.outfit.description
      );
    })
    .join("\n");
}

function buildStoryPrompt(data, options) {
  const characters = getCharactersByIds(data, splitCsv(options.characters));
  const scene = options.scene || "客厅";
  const rawStory = options["raw-story"] || "";

  return [
    "请把下面的人物设定和原始素材，改写成适合小红书发布的 4 格家庭日常小漫画。",
    "",
    "要求：",
    "- 角色必须保持统一人设",
    "- 小女孩说话要有婴儿奶音感，词短、直球、可爱",
    "- 内容要像真实家庭片段，不要像段子硬拗",
    "- 每格只推进一个小动作或一个笑点",
    "- 结尾要有轻反转或温柔收尾",
    "- 不要写成说教内容",
    "",
    "家庭风格：",
    "- 主题：" + data.project.theme,
    "- 气质：" + data.family_style.tone.join("、"),
    "- 画面方向：" + data.family_style.art_direction.join("、"),
    "",
    "角色设定：",
    formatCharacterSummary(characters),
    "",
    "重点场景：" + scene,
    "原始素材：" + rawStory,
    "",
    "输出格式：",
    "{",
    '  "theme": "",',
    '  "summary": "",',
    '  "panels": [',
    "    {",
    '      "index": 1,',
    '      "scene": "",',
    '      "action": "",',
    '      "dialogue": "",',
    '      "emotion": ""',
    "    }",
    "  ],",
    '  "cover_text": "",',
    '  "title_candidates": ["", "", ""]',
    "}"
  ].join("\n");
}

function buildImagePrompt(data, options) {
  const characterIds = splitCsv(options.characters);
  const outfitIds = splitCsv(options.outfits);
  const characters = getCharactersByIds(data, characterIds);
  const outfits = collectOutfits(characters, outfitIds);

  return [
    "请根据以下设定，生成单张漫画分镜的中文出图提示词。",
    "",
    "要求：",
    "- 保持统一家庭角色特征",
    "- 画面为温暖手绘日系动画电影感",
    "- 使用铅笔感线条、水彩质感背景、低饱和自然色",
    "- 柔和自然光",
    "- 颜色干净，轮廓清晰，干净赛璐璐上色",
    "- 人物圆润但不过分 Q 版，表情自然可爱",
    "- 强调日常生活感，不做夸张奇幻背景",
    "- 人物比例要符合 20 月龄幼儿和年轻父母的家庭场景",
    "- 避免 3D 渲染、照片感、欧美卡通、塑料质感、强霓虹色",
    "",
    "角色设定：",
    formatCharacterSummary(characters),
    "",
    "服装方案：",
    formatOutfitSummary(outfits),
    "",
    "分镜场景：" + (options.scene || "客厅"),
    "分镜动作：" + (options.action || ""),
    "分镜情绪：" + (options.emotion || ""),
    "",
    "输出格式：",
    "一幅温暖手绘日系动画电影感的家庭日常漫画分镜，场景是" +
      (options.scene || "客厅") +
      "。画面中有" +
      characters.map((item) => item.name).join("、") +
      "，正在" +
      (options.action || "进行家庭互动") +
      "，情绪是" +
      (options.emotion || "温暖轻松") +
      "。角色外形遵循既定设定，服装使用上述方案。铅笔感线条，水彩质感背景，低饱和自然色，柔和自然光，干净赛璐璐上色，圆润但不过分 Q 版的人物比例，童趣表情，家庭生活细节丰富，轻电影感分镜，适合竖版漫画单格。避免 3D 渲染、照片感、欧美卡通、塑料质感、强霓虹色。"
  ].join("\n");
}

function buildTitlePrompt(data, options) {
  return [
    "请基于下面的漫画信息生成 5 个适合小红书的标题。",
    "",
    "要求：",
    "- 像真实宝妈宝爸账号，不要营销味",
    "- 突出小孩童言童语或家庭反差",
    "- 标题长度控制在 14 到 24 字左右",
    "- 可以带轻微口语感",
    "",
    "家庭主题：" + data.project.theme,
    "故事摘要：" + (options.summary || ""),
    "结尾反转：" + (options.twist || ""),
    "",
    "输出：",
    "- 5 个标题候选"
  ].join("\n");
}

function printHelp() {
  const lines = [
    "Usage:",
    "  node tools/prompt-builder.js --mode story --characters girl,dad --scene 客厅 --raw-story \"今天女儿问我为什么困了还玩手机\"",
    "  node tools/prompt-builder.js --mode image --characters girl,dad --outfits girl_outfit_02,dad_outfit_01 --scene 公园步道 --action \"爸爸追着戴墨镜的小女孩跑\" --emotion 欢乐",
    "  node tools/prompt-builder.js --mode title --summary \"女儿看到爸爸熬夜玩手机\" --twist \"最后她一本正经让爸爸睡觉\"",
    "",
    "Options:",
    "  --mode story|image|title",
    "  --characters girl,dad,mom",
    "  --outfits girl_outfit_01,dad_outfit_01",
    "  --scene 场景名",
    "  --raw-story 原始素材",
    "  --action 分镜动作",
    "  --emotion 分镜情绪",
    "  --summary 故事摘要",
    "  --twist 结尾反转"
  ];

  console.log(lines.join("\n"));
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h || !args.mode) {
    printHelp();
    return;
  }

  const data = loadCharacterData();
  let output = "";

  if (args.mode === "story") {
    output = buildStoryPrompt(data, args);
  } else if (args.mode === "image") {
    output = buildImagePrompt(data, args);
  } else if (args.mode === "title") {
    output = buildTitlePrompt(data, args);
  } else {
    console.error("Unknown mode: " + args.mode);
    process.exitCode = 1;
    return;
  }

  console.log(output);
}

main();
