/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
        "./app/**/*.{js,vue,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1A1A7A',
                secondary: '#FDD1E0',
                tertiary: '#807C9C',
                neutral: '#F4F6F9',
                text: '#1A1A2E',
            }
        },
    },
    plugins: [],
}
