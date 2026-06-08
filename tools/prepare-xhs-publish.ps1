param(
  [string]$PublishFile = "episodes/2026-06-01-liuyi-crocs-publish.md",
  [ValidateSet("all", "title", "body", "tags", "comment")]
  [string]$Mode = "all",
  [ValidateSet("main", "short", "casual")]
  [string]$Body = "main",
  [switch]$Open
)

$ErrorActionPreference = "Stop"

function Read-Utf8File($path) {
  return [System.IO.File]::ReadAllText((Resolve-Path $path), [System.Text.Encoding]::UTF8)
}

function Get-Section($content, $heading) {
  $pattern = "(?ms)^##\s+" + [regex]::Escape($heading) + "\s*\r?\n(?<body>.*?)(?=^\s*##\s+|\z)"
  $match = [regex]::Match($content, $pattern)
  if (-not $match.Success) {
    throw "Cannot find section: $heading"
  }
  return $match.Groups["body"].Value.Trim()
}

function Clean-ListSection($text) {
  return ($text -split "\r?\n" | ForEach-Object {
    $_.Trim() -replace "^- ", ""
  } | Where-Object {
    $_
  }) -join "`n"
}

function T($base64) {
  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($base64))
}

$content = Read-Utf8File $PublishFile

$title = Get-Section $content (T "5Li75o6o5qCH6aKY")
$bodyHeading = switch ($Body) {
  "main" { T "5q2j5paH5Li75o6o54mI" }
  "short" { T "5q2j5paH55+t54mI" }
  "casual" { T "5q2j5paH5pu05Y+j6K+t54mI" }
}
$bodyText = Get-Section $content $bodyHeading
$tags = Get-Section $content (T "6K+d6aKY5qCH562+")
$comment = Get-Section $content (T "572u6aG26K+E6K66")

$payload = switch ($Mode) {
  "title" { $title }
  "body" { $bodyText }
  "tags" { $tags }
  "comment" { $comment }
  default {
    @(
      (T "5qCH6aKY77ya")
      $title
      ""
      (T "5q2j5paH77ya")
      $bodyText
      ""
      (T "6K+d6aKY77ya")
      $tags
      ""
      (T "572u6aG26K+E6K6677ya")
      $comment
    ) -join "`r`n"
  }
}

Set-Clipboard -Value $payload

if ($Open) {
  Start-Process "https://creator.xiaohongshu.com/publish/publish"
}

Write-Output "Copied $Mode content to clipboard."
Write-Output "Title: $title"
Write-Output "Body version: $Body"
Write-Output "Publish file: $PublishFile"
