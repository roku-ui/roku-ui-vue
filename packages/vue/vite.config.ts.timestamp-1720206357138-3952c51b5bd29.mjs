// vite.config.ts
import { defineConfig } from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.9_terser@5.31.1/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_@types+node@20.14.9_terser@5.31.1__vue@3.4.31_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/unocss@0.61.2_@unocss+webpack@0.61.2_webpack@5.92.1_esbuild@0.23.0___postcss@8.4.39_vite@5.3._63n6h7u3yd2h6ufcb7idot4nhi/node_modules/unocss/dist/vite.mjs";
import Components from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/unplugin-vue-components@0.27.2_@babel+parser@7.24.7_@nuxt+kit@3.12.3_vue@3.4.31_typescript@5.5.3_/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/unplugin-auto-import@0.17.6_@nuxt+kit@3.12.3_@vueuse+core@10.11.0_vue@3.4.31_typescript@5.5.3__/node_modules/unplugin-auto-import/dist/vite.js";
import AutoExport from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/unplugin-auto-export@1.0.2_@nuxt+kit@3.12.3_@nuxt+schema@3.12.3_esbuild@0.23.0_vite@5.3.3_@ty_7b2k4bf3jh2cx6uinhfizyjepy/node_modules/unplugin-auto-export/dist/vite.mjs";
import dts from "file:///C:/Code/roku-ui-vue/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.14.9_typescript@5.5.3_vite@5.3.3_@types+node@20.14.9_terser@5.31.1_/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts(),
    Components({
      dirs: ["./src/components"],
      dts: "./src/components.d.ts"
    }),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core"
      ],
      dirs: [
        "./src/composables",
        "./src/locale"
      ],
      dts: "./src/auto-import.d.ts"
    }),
    AutoExport({
      path: ["./src/components/**/*"],
      extname: "ts"
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "roku-ui",
      fileName: "index"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue"
        }
      }
    },
    target: "modules"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXHJva3UtdWktdnVlXFxcXHBhY2thZ2VzXFxcXHZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ29kZVxcXFxyb2t1LXVpLXZ1ZVxcXFxwYWNrYWdlc1xcXFx2dWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NvZGUvcm9rdS11aS12dWUvcGFja2FnZXMvdnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBBdXRvRXhwb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8tZXhwb3J0L3ZpdGUnXHJcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIFVub0NTUygpLFxyXG4gICAgZHRzKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZGlyczogWycuL3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICAgIGR0czogJy4vc3JjL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICB9KSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgIF0sXHJcbiAgICAgIGRpcnM6IFtcclxuICAgICAgICAnLi9zcmMvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICcuL3NyYy9sb2NhbGUnLFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6ICcuL3NyYy9hdXRvLWltcG9ydC5kLnRzJyxcclxuICAgIH0pLFxyXG4gICAgQXV0b0V4cG9ydCh7XHJcbiAgICAgIHBhdGg6IFsnLi9zcmMvY29tcG9uZW50cy8qKi8qJ10sXHJcbiAgICAgIGV4dG5hbWU6ICd0cycsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6ICdzcmMvaW5kZXgudHMnLFxyXG4gICAgICBuYW1lOiAncm9rdS11aScsXHJcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGV4cG9ydHM6ICduYW1lZCcsXHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgdnVlOiAnVnVlJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRhcmdldDogJ21vZHVsZXMnLFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFIsU0FBUyxvQkFBb0I7QUFDelQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFNBQVM7QUFHaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsTUFBTSxDQUFDLGtCQUFrQjtBQUFBLE1BQ3pCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyx1QkFBdUI7QUFBQSxNQUM5QixTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
