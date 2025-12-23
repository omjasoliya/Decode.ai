# Decode AI: Pattern-to-Code Architect Suite

**Decode AI** is a professional "Pattern-to-Code" architect suite designed to help developers and students bridge the gap between visual character patterns (ASCII art) and scalable algorithmic logic. The application uses an innovative workflow that transforms hand-drawn grids into production-ready source code by leveraging AI and spatial analysis.

---

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [5-Stage Studio Workflow](#5-stage-studio-workflow)
3. [Technical Highlights](#technical-highlights)
4. [Integrated Insights (Blog)](#integrated-insights-blog)
5. [Installation](#installation)
6. [Setting up GEMINI_API_KEY](#setting-up-gemini_api_key)
7. [Usage](#usage)
8. [License](#license)

---

## Core Architecture

The Decode AI app follows a **Modular React** structure with a clean separation of concerns:

- **State Management (App.tsx)**: Manages the step-based studio workflow (Steps 0–5) and switches between the Studio and Insights (Blog) views.
- **Intelligence Layer (gemini_services.tsx)**: Integrates the Gemini API using a **Coordinate Mapping** technique, transforming ASCII art into algorithmic logic by analyzing symbol coordinates.
- **Rendering Layer (MatrixPreview.tsx)**: A custom syntax highlighter that uses **Regex** to colorize AI-generated code in real-time (supports Python, JS, C++, etc.).
- **Utility Layer (exportUtils.ts)**: Uses the **HTML5 Canvas API** to rasterize the text-based grid into a downloadable PNG image.

---

## 5-Stage Studio Workflow

Decode AI guides users through a **5-Stage Studio Workflow**:

1. **Geometry (Stage 1)**: Define the resolution of the canvas (4x4 to 20x20) with a "Square Lock" feature to maintain aspect ratios.
2. **Toolkit (Stage 2)**: Select which characters (standard symbols, alphabets, numbers) will be available in the brush palette.
3. **The Lab (Stage 3)**: High-performance drawing environment supporting mouse-drag painting, touch-move interaction, and dynamic zooming (24px to 84px per cell).
4. **Validation (Stage 4)**: A pre-flight check that renders an ASCII version of the drawing to ensure proper spatial relationships.
5. **Synthesis (Stage 5)**: AI executes and produces:
   - **The Code**: A dynamic function that scales (e.g., if you drew an 'X', it works for any size).
   - **The Logic**: A natural language explanation of the derived geometry.
   - **The Simulation**: A text-based preview of the pattern at a different scale.

---

## Technical Highlights

- **Performance**: Extensively uses `useCallback` and `useMemo` hooks to prevent unnecessary re-renders of the 400-cell grid during the drawing process.
- **UX/UI**: Features a "Neural Vision" aesthetic using **Tailwind CSS**, custom keyframe animations (e.g., tubelight and scan-fast effects), and a fully responsive layout.
- **Persistence**: Deep back-navigation allows users to return to previous stages without breaking the synthesis pipeline.

---

## Integrated Insights (Blog)

Decode AI comes with an integrated **Insights** section. This acts as an educational hub, providing:
- Context on **ASCII logic** and **AI synthesis**.
- A full **search engine** and **category tagging** system.
- A **reading-optimized prose layout** for an engaging learning experience.

---

## Installation

To get started with **Decode AI**, follow these steps to set up your development environment.

1. Clone the repository:

```bash
git clone https://github.com/omjasoliya/decode-ai.git
```

2. Install dependencies:
```bash
npm install
```
4. Set up the Gemini API Key

You must have a Gemini API Key to use the core features of the application. Follow these steps:

For Linux/macOS/Windows:
```bash
Create a .env.local file in the root directory of the project.

Add your Gemini API Key as follows:

GEMINI_API_KEY=your-gemini-api-key
```
4. Get a Free Gemini API Key

To get your free Gemini API key, follow these steps:

Visit this GitHub URL
.

Follow the instructions to redeem your API key.

5. Run the app

Once everything is set up, you can run the app locally using the following command:
```bash
npm run dev
```

This will start the app in development mode. Open your browser and navigate to http://localhost:3000 to see the app in action.

Usage :
App Workflow:

Decode AI guides you through a 5-stage studio workflow to convert your hand-drawn ASCII art into scalable algorithmic code:

Geometry: Define the resolution of your canvas (from 4x4 to 20x20).

Toolkit: Choose which characters (standard symbols, alphabets, or numbers) will be available in your brush palette.

The Lab: Draw your pattern interactively using the mouse or touch input.

Validation: Preview the ASCII version of the drawing to ensure proper spatial relationships before sending it to the AI.

Synthesis: The AI generates the code, a logic explanation, and a simulation preview at a different scale.

Integrated Insights:

The Insights section provides educational articles, guides, and a full search engine.

Learn more about ASCII logic and how the AI synthesis works.

App Architecture
1. Core Architecture:

State Management (App.tsx): Centralized state machine manages the studio workflow (Steps 0-5).

Intelligence Layer (gemini_services.tsx): Integrates Gemini API with a Coordinate Mapping technique to derive a mathematical formula.

Rendering Layer (MatrixPreview.tsx): Custom syntax highlighter using Regex to colorize AI-generated code (Python, JS, C++, etc.).

Utility Layer (exportUtils.ts): Uses HTML5 Canvas API to rasterize the text-based grid into a PNG for download.

2. 5-Stage Studio Workflow:

Geometry, Toolkit, The Lab, Validation, and Synthesis.

3. Integrated Insights:

Educational hub with articles and guides, along with a fully search-enabled blog.

Technical Highlights

Performance: Uses useCallback and useMemo extensively to prevent unnecessary re-renders of the 400-cell grid during the drawing process.

UX/UI: Features a "Neural Vision" aesthetic using Tailwind CSS, custom animations (like tubelight and scan-fast effects), and a fully responsive layout.

Persistence: Includes Deep Back-Navigation, allowing users to adjust geometry or tools without breaking the synthesis pipeline.

Contributing

Contributions are welcome! If you'd like to improve the app, feel free to fork the repository and submit a pull request. For bug reports or feature requests, open an issue on the GitHub repo.

To contribute:

Fork the repo

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature-name)

Open a pull request

License

This project is licensed under the MIT License - see the LICENSE
 file for details.
