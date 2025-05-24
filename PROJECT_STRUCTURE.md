# プロジェクト構成ツリー

```
py-ecdysis/
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── robots.txt
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── Editor.tsx
    │   ├── Header.tsx
    │   ├── LoadingScreen.tsx
    │   ├── OutputPanel.tsx
    │   ├── ShareButton.tsx
    │   └── TutorialPanel.tsx
    ├── data/
    │   └── tutorials.ts
    ├── hooks/
    │   ├── useFileSystem.ts
    │   ├── useKeyboardShortcuts.ts
    │   └── usePyodide.ts
    ├── store/
    │   └── useStore.ts
    ├── styles/
    │   └── index.css
    └── utils/
        └── shareUrl.ts
```

## ファイル数
- TypeScript/TSX ファイル: 15
- 設定ファイル: 10
- スタイルファイル: 1
- ドキュメント: 2
- その他: 2

合計: 30ファイル
