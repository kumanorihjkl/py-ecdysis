# Py-Ecdysis - インストール不要で動くPython学習環境

100%クライアントサイドで動作するPython学習環境です。Pyodide (CPython 3.12 WASM) を使用してブラウザ上でPythonコードを実行できます。
[こちら](https://py-ecdysis.pages.dev/)から利用可能です。

![Py-Ecdysis Screenshot](./screenshot.png)

## 主な機能

### 1. コード編集 & 実行
- **Monaco Editor** による高度なコード編集機能
- **Pyright LSP** (WebWorker) による補完・診断
- **Pyodide v0.27** による Python 3.12 実行環境
- `micropip` による pure-Python パッケージの動的インストール

### 2. 学習支援
- **ステップ実行** と変数の可視化（Python Tutor風）
- **Markdownベースのチュートリアル** - 段階的な学習コンテンツ
- **pytest** による自動テスト結果表示
- 10種類の包括的なチュートリアル（基礎から応用まで）

### 3. ファイル管理
- **仮想ファイルシステム** (Emscripten) + **IndexedDB** による自動保存
- ドラッグ&ドロップによるファイル読み込み
- ローカルファイルへのエクスポート機能

### 4. 共有機能
- コードとファイル名を **Base64+gzip** でURLに埋め込む共有機能
- ワンクリックでコピー可能な共有URL生成
- 外部サービス不要の完全クライアントサイド実装

### 5. UI/UX
- **React + TypeScript + Tailwind CSS** によるモダンなUI
- **リサイズ可能なパネル** - チュートリアル、エディター、出力パネルのサイズをドラッグで調整可能
- **独立したスクロール** - 各パネルが独立してスクロール、画面全体のスクロールは無効化
- **分割表示モード** - チュートリアル、エディター、出力を3カラムで同時表示
- ダーク/ライトテーマ切り替え
- 完全なキーボード操作対応（Cmd/Ctrl + Enter で実行など）
- ARIA対応によるアクセシビリティ

### 6. PWA対応
- **Service Worker** によるオフライン実行
- インストール可能なWebアプリケーション
- 高速な起動（Cold-start < 3秒を目標）

## セットアップ

### 必要な環境
- Node.js 18以上
- pnpm 8以上

### インストール手順

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

以下のnpmコマンドでも同様の操作が可能:
```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 開発

### プロジェクト構成

```
py-ecdysis/
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── Editor.tsx   # コードエディタ
│   │   ├── OutputPanel.tsx # 出力パネル
│   │   ├── TutorialPanel.tsx # チュートリアル
│   │   ├── ResizablePanel.tsx # リサイズ可能なパネル
│   │   └── ...
│   ├── hooks/          # カスタムフック
│   │   ├── usePyodide.ts # Pyodide管理
│   │   ├── useFileSystem.ts # ファイルシステム
│   │   └── ...
│   ├── store/          # 状態管理
│   │   └── useStore.ts # Zustand store
│   ├── utils/          # ユーティリティ
│   │   ├── shareUrl.ts  # URL共有機能
│   │   └── editorEvents.ts # エディタリサイズイベント
│   └── data/           # 静的データ
│       └── tutorials.ts # チュートリアルコンテンツ
├── public/             # 静的ファイル
└── index.html         # エントリーポイント
```

### 技術スタック

- **フレームワーク**: React 18 + TypeScript 5
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **UIコンポーネント**: Radix UI
- **コードエディタ**: Monaco Editor
- **Python実行環境**: Pyodide v0.27
- **PWA**: vite-plugin-pwa

### 開発時の注意事項

1. **CORS設定**: Pyodideを使用するため、開発サーバーでCORS設定が必要です（vite.config.tsで設定済み）
2. **SharedArrayBuffer**: モバイルSafariでは無効な場合があるため、自動的に単一スレッドモードにフォールバックします
3. **メモリ制限**: WASMメモリ上限256MBを超える処理は実行不可として警告表示されます

## ライセンス

MIT License

Copyright (c) 2025 Py-Ecdysis Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 貢献

プルリクエストを歓迎します。大きな変更を行う場合は、まずissueを開いて変更内容について議論してください。

## サポート

問題が発生した場合は、GitHubのissueトラッカーで報告してください。
