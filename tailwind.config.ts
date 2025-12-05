import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        "./app/components/**/*.{js,vue,ts}",
        "./app/layouts/**/*.vue",
        "./app/pages/**/*.vue",
        "./app/plugins/**/*.{js,ts}",
        "./app/app.vue",
        "./app/error.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1A1A7A', // Deep Royal Blue
                secondary: '#FDD1E0', // Blush Pink
                tertiary: '#807C9C', // Muted Grape
                neutral: '#F4F6F9', // Cool Grey
                text: '#1A1A2E', // Dark Slate
            }
        },
    },
    plugins: [],
}
