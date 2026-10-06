import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/event-rsvp-manager/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
