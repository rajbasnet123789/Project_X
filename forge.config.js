import { VitePlugin } from "@electron-forge/plugin-vite";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";

export default {
  makers: [
    new MakerSquirrel({
      authors: "Edge Node",
      description: "Edge worker desktop node"
    }),
    new MakerZIP({})
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "./src/main.js",
          config: "./vite.main.config.js"
        },
        {
          entry: "./src/preload.js",
          config: "./vite.preload.config.js"
        }
      ],
      renderer: [
        {
          name: "renderer",
          config: "./vite.renderer.config.js"
        }
      ]
    })
  ]
};
