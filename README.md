# NEUROSCREEN AI — Website Prototype

Frontend prototype for the NEUROSCREEN AI PKM-KC project.

## Important scope

This project is an interactive frontend prototype only. It does **not** contain:
- a trained depression screening model;
- BeyondSmile data processing;
- IndoBERT inference;
- multimodal fusion or XAI inference;
- webcam recording or video upload;
- server-side transcription;
- a database or user account system.

The demo text and transcript remain in browser memory and are not submitted to a server. Browser Web Speech API behavior depends on browser support, permissions, and network conditions.

NEUROSCREEN AI is a research/screening concept, not a diagnostic service.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open a terminal in that folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm start
```

## Project structure

```text
neuroscreen-ai/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Next development stages

1. Confirm and document the linguistic dataset and its license/terms of use.
2. Develop and evaluate the linguistic model in Google Colab.
3. Validate the visual pipeline with participant-wise splits.
4. Collect ethically approved paired visual + text data if multimodal fusion is required.
5. Implement FastAPI endpoints only after model interfaces and privacy requirements are specified.
6. Conduct security, usability, bias, and clinical-safety reviews before any real-world deployment.
