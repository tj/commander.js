Problem: Readme_zh-CN.md documents the old `.addHelpCommand()` API and is missing two sections present in the English README: "Help Groups" and "npm run-script".
Fix: Update §.addHelpCommand() → §.helpCommand() with correct usage; add translated "Help Groups" and "npm run-script" sections.
Test: Verify Readme_zh-CN.md no longer contains `.addHelpCommand(` usage patterns (only `.helpCommand()`), and that both new sections exist.
