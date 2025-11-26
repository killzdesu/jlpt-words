# JLPT Master

A modern, PWA-ready Japanese language learning application designed to help you prepare for the JLPT (Japanese-Language Proficiency Test). Built with Nuxt 4 and Tailwind CSS.

## 🌟 Features

-   **🎯 Interactive Quizzes**:
    -   Multiple modes: Japanese ↔ English, Kanji Reading.
    -   Filter by JLPT Level (N5-N1).
    -   Customizable question count.
    -   Detailed feedback and Kanji breakdown.
-   **📖 Comprehensive Dictionary**:
    -   Search thousands of words and Kanji.
    -   Filter by level and meaning.
-   **📜 History Tracking**:
    -   Review your recent quiz questions.
    -   Track correct/incorrect answers.
-   **⭐ Personalization**:
    -   **Favorites**: Save words for quick access.
    -   **Blocked**: Exclude known words from quizzes.
    -   **Settings**: Toggle Furigana/Meanings hints.
-   **📱 PWA Support**: Installable on mobile and desktop for offline learning.

## 🛠️ Tech Stack

-   **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **PWA**: [Vite PWA](https://vite-pwa-org.netlify.app/)
-   **Icons**: Emoji & CSS-styled UI

## 📂 Data Sources

The application uses open-source JLPT word and Kanji lists (CSV format) located in the `public/jlpt` directory:
-   `n1.csv` - `n5.csv`: Vocabulary lists.
-   `joyo.csv`: Kanji data.

## 🚀 Setup & Development

Make sure to install dependencies:

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## 📝 License

[GPLv3](LICENSE)
