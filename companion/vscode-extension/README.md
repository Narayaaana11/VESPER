# QEVRA Context Companion (VS Code & Cursor)

This companion extension streams real-time IDE context to your local **QEVRA** desktop assistant:
* Active file name and full workspace path.
* Exact cursor line and column number.
* Currently highlighted / selected code snippet.
* Active project / repository name.

## How It Works
1. When you move your cursor or switch files, the extension sends a lightweight JSON payload to `http://127.0.0.1:32123/api/context/feed`.
2. QEVRA indexes this context into its SQLite event store and vector memory in <1ms.
3. When you speak commands like *"fix this function"* or *"refactor line 42"*, QEVRA acts with precision context.

## Installation in VS Code / Cursor
You can load this extension directly into VS Code or Cursor:
1. Open VS Code / Cursor.
2. Press `F1` or `Ctrl+Shift+P` and choose **Extensions: Install from VSIX...**
3. Or copy this folder into your `.vscode/extensions/` directory.
