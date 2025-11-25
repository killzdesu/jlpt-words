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
                primary: '#2D2363',
                secondary: '#F5C7E2',
            }
        },
    },
    plugins: [],
}
