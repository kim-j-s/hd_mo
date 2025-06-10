// vite.config.js
import { defineConfig } from "file:///C:/web/mo/node_modules/vite/dist/node/index.js";
import handlebars from "file:///C:/web/mo/node_modules/vite-plugin-handlebars/dist/index.js";
import autoprefixer from "file:///C:/web/mo/node_modules/autoprefixer/lib/autoprefixer.js";
import fs from "fs";
import path, { resolve } from "path";
import pxtorem from "file:///C:/web/mo/node_modules/postcss-pxtorem/index.js";
var __vite_injected_original_dirname = "C:\\web\\mo";
var partialPath = "src/_partials";
var helpers = {
  stripHtml: (text) => {
    if (typeof text !== "string") return text;
    return text.replace(/(<([^>]+)>)/gi, "");
  }
};
var getEntries = (dir) => {
  const htmlEntries = {};
  if (dir.length === dir.replace(partialPath, "").length && dir.length) {
    fs.readdirSync(dir).forEach((item) => {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isFile()) {
        if (path.extname(item) == ".html" || path.extname(item) == ".js" || path.extname(item) == ".css") {
          htmlEntries[itemPath] = resolve(__vite_injected_original_dirname, itemPath);
        }
      } else {
        Object.assign(htmlEntries, getEntries(itemPath));
      }
    });
  }
  return htmlEntries;
};
var getContexts = (dir) => {
  const contexts = {};
  fs.readdirSync(dir).forEach((item) => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isFile()) {
      if (path.extname(item) == ".json") {
        contexts[itemPath.replace("src", "").replace("config.json", "html")] = JSON.parse(fs.readFileSync(itemPath));
      }
    } else {
      Object.assign(contexts, getContexts(itemPath));
    }
  });
  return contexts;
};
var pageData = getContexts("src");
var vite_config_default = defineConfig({
  // export default {
  root: "src",
  // base: '/',
  publicDir: "../public",
  // publicDir: path.resolve(__dirname, "src/web/pub/img"),
  build: {
    // outDir: '../dist',
    outDir: "../dist",
    assetsDir: "./",
    cssMinify: false,
    // cssMinify: true,
    overwrite: true,
    minify: false,
    terserOptions: {
      output: {
        comments: true
        // 주석을 보존하도록 설정
      }
    },
    rollupOptions: {
      minify: false,
      input: getEntries("src"),
      output: {
        assetFileNames: (entry) => {
          if (path.extname(entry.name) == ".css") {
            return entry.name.replace("src/", "");
          }
          return entry.name;
        },
        entryFileNames: (entry) => {
          if (path.extname(entry.name) == ".js") {
            return path.relative("src", entry.name);
          }
          return entry.name;
        }
      }
    }
  },
  plugins: [
    handlebars({
      // partialDirectory: resolve(__dirname, 'src/_partials'), //partials 경로 설정
      //partials 경로 설정
      partialDirectory: [
        // resolve(__dirname, 'src/_partials/common'),
        // resolve(__dirname, 'src/_partials/input'),
        // resolve(__dirname, 'src/_partials/contents'),
        resolve(__vite_injected_original_dirname, "src/_partials")
      ],
      context(pagePath) {
        return pageData[pagePath];
      },
      helpers
      // helpers 등록
    }),
    {
      name: "html-transform",
      // 플러그인 이름
      transformIndexHtml(html) {
        return html.replace(
          /crossorigin href="\/css\/reset\.css"/g,
          'href="../../../css/reset.css"'
        ).replace(
          /crossorigin href="\/css\/common\.css"/g,
          'href="../../../css/common.css"'
        ).replace(
          /crossorigin href="\/css\/contents\.css"/g,
          'href="../../../css/contents.css"'
        ).replace(
          /crossorigin href="\/css\/popup\.css"/g,
          'href="../../../css/popup.css"'
        ).replace(
          /crossorigin href="\/html\/guide\/guide\/guide\.css"/g,
          'href="guide.css"'
        );
      }
    },
    {
      name: "delete-svn-folder-recursively",
      closeBundle() {
        const deleteSVNFolderRecursively = (dir) => {
          const files = fs.readdirSync(dir);
          files.forEach((file) => {
            const currentPath = path.join(dir, file);
            const stat = fs.statSync(currentPath);
            if (stat.isDirectory()) {
              if (file === ".svn") {
                fs.rmSync(currentPath, { recursive: true, force: true });
                console.log(`Deleted ${currentPath}`);
              } else {
                deleteSVNFolderRecursively(currentPath);
              }
            }
          });
        };
        deleteSVNFolderRecursively(path.resolve(__vite_injected_original_dirname, "dist"));
      }
    }
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true
        // SCSS 파일에 대한 Sourcemap 생성 활성화
      }
    },
    postcss: {
      plugins: [
        // autoprefixer()
        autoprefixer({
          overrideBrowserslist: ["> 1%", "last 2 versions", "Firefox ESR"]
        }),
        // pxtorem 플러그인 추가 (build 시에만 적용)
        ...process.env.NODE_ENV === "production" ? [
          pxtorem({
            rootValue: 10,
            // 기준 root 폰트 크기
            propList: ["*"],
            // 변환할 속성 목록
            selectorBlackList: [],
            // 변환하지 않을 선택자 목록
            minPixelValue: 2
            // 변환할 최소 픽셀 값
          })
        ] : []
        // 변경된 구간: build 시에만 pxtorem 적용
      ]
    }
  },
  server: {
    // host: 'localhost',
    host: "0.0.0.0",
    open: "index.html",
    port: 8081,
    hmr: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3ZWJcXFxcbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdlYlxcXFxtb1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2ViL21vL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBoYW5kbGViYXJzIGZyb20gJ3ZpdGUtcGx1Z2luLWhhbmRsZWJhcnMnO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5cclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5pbXBvcnQgcHh0b3JlbSBmcm9tICdwb3N0Y3NzLXB4dG9yZW0nOyAvLyBweHRvcmVtIFx1RDUwQ1x1QjdFQ1x1QURGOFx1Qzc3OCBcdUFDMDBcdUM4MzhcdUM2MjRcdUFFMzBcclxuXHJcbi8vIHNyYyBcdUIwQjQgXHVCRTRDXHVCNERDIFx1RDMwQ1x1Qzc3QyBcdUM1RDRcdUQyQjhcdUI5QUMoaHRtbCwganMsIGNzcykgXHVCOUNDXHVCNEU0XHVBRTMwXHJcblxyXG4vLyBjb25zdCBwYXJ0aWFsUGF0aCA9ICdzcmMvX3BhcnRpYWxzJzsgIC8vIHBhcnRpYWxzIFx1QUNCRFx1Qjg1Q1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7ICAvLyBoZWxwZXJzIFx1QUNCRFx1Qjg1QyAoXHVDNUQ0XHVEMkI4XHVCOUFDIFx1QzYwOFx1QzY3OFx1Q0M5OFx1QjlBQylcclxuXHJcbmNvbnN0IHBhcnRpYWxQYXRoID0gJ3NyYy9fcGFydGlhbHMnO1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7XHJcblxyXG5cclxuY29uc3QgaGVscGVycyA9IHtcclxuICBzdHJpcEh0bWw6ICh0ZXh0KSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRleHQgIT09ICdzdHJpbmcnKSByZXR1cm4gdGV4dDtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyg8KFtePl0rKT4pL2dpLCAnJyk7XHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IGdldEVudHJpZXMgPSBkaXIgPT4ge1xyXG4gIGNvbnN0IGh0bWxFbnRyaWVzID0ge307XHJcblxyXG4gIC8vIGlmKGRpci5sZW5ndGggPT09IGRpci5yZXBsYWNlKHBhcnRpYWxQYXRoLCAnJykubGVuZ3RoICYmIGRpci5sZW5ndGggPT09IGRpci5yZXBsYWNlKGhlbHBlclBhdGgsICcnKS5sZW5ndGggKSB7XHJcbiAgaWYoZGlyLmxlbmd0aCA9PT0gZGlyLnJlcGxhY2UocGFydGlhbFBhdGgsICcnKS5sZW5ndGggJiYgZGlyLmxlbmd0aCApIHtcclxuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oZGlyLCBpdGVtKTtcclxuICBcclxuICAgICAgaWYoZnMuc3RhdFN5bmMoaXRlbVBhdGgpLmlzRmlsZSgpKSB7XHJcbiAgICAgICAgaWYocGF0aC5leHRuYW1lKGl0ZW0pID09ICcuaHRtbCcgfHwgcGF0aC5leHRuYW1lKGl0ZW0pID09ICcuanMnIHx8IHBhdGguZXh0bmFtZShpdGVtKSA9PSAnLmNzcycpIHtcclxuICAgICAgICAgIGh0bWxFbnRyaWVzW2l0ZW1QYXRoXSA9IHJlc29sdmUoX19kaXJuYW1lLCBpdGVtUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaHRtbEVudHJpZXMsIGdldEVudHJpZXMoaXRlbVBhdGgpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaHRtbEVudHJpZXM7XHJcbn07XHJcblxyXG5jb25zdCBnZXRDb250ZXh0cyA9IGRpciA9PiB7XHJcbiAgY29uc3QgY29udGV4dHMgPSB7fTtcclxuXHJcbiAgZnMucmVhZGRpclN5bmMoZGlyKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oZGlyLCBpdGVtKTtcclxuXHJcbiAgICBpZihmcy5zdGF0U3luYyhpdGVtUGF0aCkuaXNGaWxlKCkpIHtcclxuICAgICAgaWYocGF0aC5leHRuYW1lKGl0ZW0pID09ICcuanNvbicpIHtcclxuICAgICAgICBjb250ZXh0c1tpdGVtUGF0aC5yZXBsYWNlKCdzcmMnLCcnKS5yZXBsYWNlKCdjb25maWcuanNvbicsICdodG1sJyldID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoaXRlbVBhdGgpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgT2JqZWN0LmFzc2lnbihjb250ZXh0cywgZ2V0Q29udGV4dHMoaXRlbVBhdGgpKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGNvbnRleHRzO1xyXG59XHJcblxyXG5jb25zdCBwYWdlRGF0YSA9IGdldENvbnRleHRzKCdzcmMnKTtcclxuLy8gY29uc29sZS5sb2coZ2V0RW50cmllcygnc3JjJykpO1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4vLyBleHBvcnQgZGVmYXVsdCB7XHJcbiAgcm9vdDogJ3NyYycsXHJcbiAgLy8gYmFzZTogJy8nLFxyXG4gIHB1YmxpY0RpcjogJy4uL3B1YmxpYycsXHJcbiAgLy8gcHVibGljRGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy93ZWIvcHViL2ltZ1wiKSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gb3V0RGlyOiAnLi4vZGlzdCcsXHJcbiAgICBvdXREaXI6ICcuLi9kaXN0JyxcclxuICAgIGFzc2V0c0RpcjogJy4vJyxcclxuICAgIGNzc01pbmlmeTogZmFsc2UsXHJcbiAgICAvLyBjc3NNaW5pZnk6IHRydWUsXHJcbiAgICBvdmVyd3JpdGU6IHRydWUsXHJcblx0XHRtaW5pZnk6IGZhbHNlLFxyXG5cdFx0dGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjb21tZW50czogdHJ1ZSwgLy8gXHVDOEZDXHVDMTFEXHVDNzQ0IFx1QkNGNFx1Qzg3NFx1RDU1OFx1QjNDNFx1Qjg1RCBcdUMxMjRcdUM4MTVcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG1pbmlmeTogZmFsc2UsXHJcbiAgICAgIGlucHV0OiBnZXRFbnRyaWVzKCdzcmMnKSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChlbnRyeSkgPT4ge1xyXG4gICAgICAgICAgaWYocGF0aC5leHRuYW1lKGVudHJ5Lm5hbWUpID09ICcuY3NzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZW50cnkubmFtZS5yZXBsYWNlKCdzcmMvJywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGVudHJ5Lm5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGVudHJ5KSA9PiB7XHJcbiAgICAgICAgICBpZihwYXRoLmV4dG5hbWUoZW50cnkubmFtZSkgPT0gJy5qcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoXCJzcmNcIiwgZW50cnkubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZW50cnkubmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBoYW5kbGViYXJzKHtcclxuICAgICAgLy8gcGFydGlhbERpcmVjdG9yeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvX3BhcnRpYWxzJyksIC8vcGFydGlhbHMgXHVBQ0JEXHVCODVDIFx1QzEyNFx1QzgxNVxyXG4gICAgICAvL3BhcnRpYWxzIFx1QUNCRFx1Qjg1QyBcdUMxMjRcdUM4MTVcclxuICAgICAgcGFydGlhbERpcmVjdG9yeTogW1xyXG4gICAgICAgIC8vIHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL19wYXJ0aWFscy9jb21tb24nKSxcclxuICAgICAgICAvLyByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMvaW5wdXQnKSxcclxuICAgICAgICAvLyByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMvY29udGVudHMnKSxcclxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMnKSxcclxuICAgICAgXSxcclxuICAgICAgY29udGV4dChwYWdlUGF0aCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0Mi0tLScpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2VEYXRhKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWdlUGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhW3BhZ2VQYXRoXTtcclxuICAgICAgfSxcclxuICAgICAgaGVscGVycywgLy8gaGVscGVycyBcdUI0RjFcdUI4NURcclxuICAgIH0pLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaHRtbC10cmFuc2Zvcm0nLCAvLyBcdUQ1MENcdUI3RUNcdUFERjhcdUM3NzggXHVDNzc0XHVCOTg0XHJcbiAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcbiAgICAgICAgLy8gXHVDNUVDXHVCN0VDIFx1QjlDMVx1RDA2QyBcdUQwRENcdUFERjhcdUM3NTggaHJlZiBcdUMxOERcdUMxMzEgXHVCQ0MwXHVBQ0JEXHJcbiAgICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC9jcm9zc29yaWdpbiBocmVmPVwiXFwvY3NzXFwvcmVzZXRcXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cIi4uLy4uLy4uL2Nzcy9yZXNldC5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL2NvbW1vblxcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiLi4vLi4vLi4vY3NzL2NvbW1vbi5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL2NvbnRlbnRzXFwuY3NzXCIvZyxcclxuICAgICAgICAgICAgJ2hyZWY9XCIuLi8uLi8uLi9jc3MvY29udGVudHMuY3NzXCInXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgL2Nyb3Nzb3JpZ2luIGhyZWY9XCJcXC9jc3NcXC9wb3B1cFxcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiLi4vLi4vLi4vY3NzL3BvcHVwLmNzc1wiJ1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC9jcm9zc29yaWdpbiBocmVmPVwiXFwvaHRtbFxcL2d1aWRlXFwvZ3VpZGVcXC9ndWlkZVxcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiZ3VpZGUuY3NzXCInXHJcbiAgICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cdFx0e1xyXG4gICAgICBuYW1lOiAnZGVsZXRlLXN2bi1mb2xkZXItcmVjdXJzaXZlbHknLFxyXG4gICAgICBjbG9zZUJ1bmRsZSgpIHtcclxuICAgICAgICBjb25zdCBkZWxldGVTVk5Gb2xkZXJSZWN1cnNpdmVseSA9IChkaXIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGlyKTtcclxuICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aC5qb2luKGRpciwgZmlsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhjdXJyZW50UGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGZpbGUgPT09ICcuc3ZuJykge1xyXG4gICAgICAgICAgICAgICAgZnMucm1TeW5jKGN1cnJlbnRQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRGVsZXRlZCAke2N1cnJlbnRQYXRofWApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVTVk5Gb2xkZXJSZWN1cnNpdmVseShjdXJyZW50UGF0aCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAnZGlzdCcgXHVCNTE0XHVCODA5XHVEMUEwXHVCOUFDIFx1QjBCNCBcdUJBQThcdUI0RTAgXHVDMTFDXHVCRTBDXHVCNTE0XHVCODA5XHVEMUEwXHVCOUFDXHVCOTdDIFx1RDBEMFx1QzBDOVx1RDU1OFx1QzVFQyAuc3ZuIFx1RDNGNFx1QjM1NCBcdUMwQURcdUM4MUNcclxuICAgICAgICBkZWxldGVTVk5Gb2xkZXJSZWN1cnNpdmVseShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpKTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxuICBjc3M6IHtcclxuICAgIGRldlNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIHNvdXJjZU1hcDogdHJ1ZSwgLy8gU0NTUyBcdUQzMENcdUM3N0NcdUM1RDAgXHVCMzAwXHVENTVDIFNvdXJjZW1hcCBcdUMwRERcdUMxMzEgXHVENjVDXHVDMTMxXHVENjU0XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcG9zdGNzczoge1xyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gYXV0b3ByZWZpeGVyKClcclxuICAgICAgICBhdXRvcHJlZml4ZXIoe1xyXG4gICAgICAgICAgb3ZlcnJpZGVCcm93c2Vyc2xpc3Q6IFsnPiAxJScsICdsYXN0IDIgdmVyc2lvbnMnLCAnRmlyZWZveCBFU1InXSxcclxuICAgICAgICB9KSxcclxuICAgICAgICAvLyBweHRvcmVtIFx1RDUwQ1x1QjdFQ1x1QURGOFx1Qzc3OCBcdUNEOTRcdUFDMDAgKGJ1aWxkIFx1QzJEQ1x1QzVEMFx1QjlDQyBcdUM4MDFcdUM2QTkpXHJcbiAgICAgICAgLi4uKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcclxuICAgICAgICAgID8gW1xyXG4gICAgICAgICAgICAgIHB4dG9yZW0oe1xyXG4gICAgICAgICAgICAgICAgcm9vdFZhbHVlOiAxMCwgLy8gXHVBRTMwXHVDOTAwIHJvb3QgXHVEM0YwXHVEMkI4IFx1RDA2Q1x1QUUzMFxyXG4gICAgICAgICAgICAgICAgcHJvcExpc3Q6IFsnKiddLCAvLyBcdUJDQzBcdUQ2NThcdUQ1NjAgXHVDMThEXHVDMTMxIFx1QkFBOVx1Qjg1RFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3JCbGFja0xpc3Q6IFtdLCAvLyBcdUJDQzBcdUQ2NThcdUQ1NThcdUM5QzAgXHVDNTRBXHVDNzQ0IFx1QzEyMFx1RDBERFx1Qzc5MCBcdUJBQTlcdUI4NURcclxuICAgICAgICAgICAgICAgIG1pblBpeGVsVmFsdWU6IDIsIC8vIFx1QkNDMFx1RDY1OFx1RDU2MCBcdUNENUNcdUMxOEMgXHVENTNEXHVDMTQwIFx1QUMxMlxyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICA6IFtdKSwgLy8gXHVCQ0MwXHVBQ0JEXHVCNDFDIFx1QUQ2Q1x1QUMwNDogYnVpbGQgXHVDMkRDXHVDNUQwXHVCOUNDIHB4dG9yZW0gXHVDODAxXHVDNkE5XHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICAvLyBob3N0OiAnbG9jYWxob3N0JyxcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIG9wZW46ICdpbmRleC5odG1sJyxcclxuICAgIHBvcnQ6IDgwODEsXHJcblx0XHRobXI6IHRydWUsXHJcbiAgfVxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1OLFNBQVMsb0JBQW9CO0FBQ2hQLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sUUFBUTtBQUNmLE9BQU8sUUFBUSxlQUFlO0FBSTlCLE9BQU8sYUFBYTtBQVJwQixJQUFNLG1DQUFtQztBQWV6QyxJQUFNLGNBQWM7QUFJcEIsSUFBTSxVQUFVO0FBQUEsRUFDZCxXQUFXLENBQUMsU0FBUztBQUNuQixRQUFJLE9BQU8sU0FBUyxTQUFVLFFBQU87QUFDckMsV0FBTyxLQUFLLFFBQVEsaUJBQWlCLEVBQUU7QUFBQSxFQUN6QztBQUNGO0FBRUEsSUFBTSxhQUFhLFNBQU87QUFDeEIsUUFBTSxjQUFjLENBQUM7QUFHckIsTUFBRyxJQUFJLFdBQVcsSUFBSSxRQUFRLGFBQWEsRUFBRSxFQUFFLFVBQVUsSUFBSSxRQUFTO0FBQ3BFLE9BQUcsWUFBWSxHQUFHLEVBQUUsUUFBUSxVQUFRO0FBQ2xDLFlBQU0sV0FBVyxLQUFLLEtBQUssS0FBSyxJQUFJO0FBRXBDLFVBQUcsR0FBRyxT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
