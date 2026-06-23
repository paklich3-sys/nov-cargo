import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const verification = [
    env.VITE_YANDEX_VERIFICATION ? `<meta name="yandex-verification" content="${env.VITE_YANDEX_VERIFICATION}" />` : "",
    env.VITE_GOOGLE_VERIFICATION ? `<meta name="google-site-verification" content="${env.VITE_GOOGLE_VERIFICATION}" />` : "",
  ].filter(Boolean).join("\n    ");

  return {
    plugins: [
      react(),
      {
        name: "inject-verification-meta",
        transformIndexHtml(html) {
          return verification ? html.replace("</head>", `    ${verification}\n  </head>`) : html;
        },
      },
    ],
    server: {
      host: "127.0.0.1",
      port: 5174,
      proxy: { "/api": "http://127.0.0.1:4173" },
    },
  };
});
