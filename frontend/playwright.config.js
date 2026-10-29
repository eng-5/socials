import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:5173'
    },
    timeout: 30000,

    webServer: {
        command: 'npm run dev -- --port 5173 --strictPort', // command to start frontend
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000 // 2 mins to booth up

    }
});