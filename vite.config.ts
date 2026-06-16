// import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// export default defineConfig({
//   tanstackStart: {
//     server: { entry: "server" },
//   },
//   vite: {
//     server: {
//       allowedHosts: ["all"],
//     },
//   },
// });

//chatgpt improvisiation to deploy on vercel
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,

  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    server: {
      allowedHosts: ["all"],
    },
  },
});
