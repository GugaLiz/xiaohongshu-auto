# 小红书发布辅助流程

## 当前推荐

采用半自动发布：

1. 打开小红书创作服务平台
2. 手动登录或扫码
3. 上传漫画图片
4. 粘贴标题、正文和话题
5. 人工预览后发布

这样能保留账号安全和最终审核，不依赖非官方接口。

## 准备本篇发布内容

复制完整发布包并打开发布页：

```powershell
.\tools\prepare-xhs-publish.ps1 -Open
```

只复制标题：

```powershell
.\tools\prepare-xhs-publish.ps1 -Mode title
```

只复制正文：

```powershell
.\tools\prepare-xhs-publish.ps1 -Mode body
```

复制短版正文：

```powershell
.\tools\prepare-xhs-publish.ps1 -Mode body -Body short
```

只复制话题：

```powershell
.\tools\prepare-xhs-publish.ps1 -Mode tags
```

只复制置顶评论：

```powershell
.\tools\prepare-xhs-publish.ps1 -Mode comment
```

## 本篇素材

- 漫画发布稿：`episodes/2026-06-01-liuyi-crocs-publish.md`
- 本地带字备份图：`episodes/2026-06-01-liuyi-crocs-lettered.png`
- 用户手动改字图：`G:/wechat/record/xwechat_files/wxid_9ado4cnz9t8y11_d596/temp/RWTemp/2026-06/8def5cc0550f302ce9b421668a5f3b1f.jpg`

## 建议发布内容

标题：

给满买了第一双洞洞鞋，她开心到洗澡都要穿

正文建议使用 `正文主推版`。

标签：

`#六一儿童节 #宝宝日常 #童言童语 #育儿日常 #亲子漫画 #小朋友的快乐 #洞洞鞋 #全职奶爸`
