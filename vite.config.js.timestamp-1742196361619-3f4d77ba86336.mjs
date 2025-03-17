// vite.config.js
import { defineConfig } from "file:///C:/web/mo/node_modules/vite/dist/node/index.js";
import handlebars from "file:///C:/web/mo/node_modules/vite-plugin-handlebars/dist/index.js";
import autoprefixer from "file:///C:/web/mo/node_modules/autoprefixer/lib/autoprefixer.js";
import fs from "fs";
import path, { resolve } from "path";
import pxtorem from "file:///C:/web/mo/node_modules/postcss-pxtorem/index.js";
var __vite_injected_original_dirname = "C:\\web\\mo";
var partialPath = "src/_partials";
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
console.log(getEntries("src"));
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
        console.log("test2---");
        console.log(pageData);
        console.log(pagePath);
        return pageData[pagePath];
      }
      // helpers, // helpers 등록
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
    open: "index.html",
    port: 8081
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3ZWJcXFxcbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdlYlxcXFxtb1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2ViL21vL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBoYW5kbGViYXJzIGZyb20gJ3ZpdGUtcGx1Z2luLWhhbmRsZWJhcnMnO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5cclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5pbXBvcnQgcHh0b3JlbSBmcm9tICdwb3N0Y3NzLXB4dG9yZW0nOyAvLyBweHRvcmVtIFx1RDUwQ1x1QjdFQ1x1QURGOFx1Qzc3OCBcdUFDMDBcdUM4MzhcdUM2MjRcdUFFMzBcclxuXHJcbi8vIHNyYyBcdUIwQjQgXHVCRTRDXHVCNERDIFx1RDMwQ1x1Qzc3QyBcdUM1RDRcdUQyQjhcdUI5QUMoaHRtbCwganMsIGNzcykgXHVCOUNDXHVCNEU0XHVBRTMwXHJcblxyXG4vLyBjb25zdCBwYXJ0aWFsUGF0aCA9ICdzcmMvX3BhcnRpYWxzJzsgIC8vIHBhcnRpYWxzIFx1QUNCRFx1Qjg1Q1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7ICAvLyBoZWxwZXJzIFx1QUNCRFx1Qjg1QyAoXHVDNUQ0XHVEMkI4XHVCOUFDIFx1QzYwOFx1QzY3OFx1Q0M5OFx1QjlBQylcclxuXHJcbmNvbnN0IHBhcnRpYWxQYXRoID0gJ3NyYy9fcGFydGlhbHMnO1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7XHJcblxyXG5jb25zdCBnZXRFbnRyaWVzID0gZGlyID0+IHtcclxuICBjb25zdCBodG1sRW50cmllcyA9IHt9O1xyXG5cclxuICAvLyBpZihkaXIubGVuZ3RoID09PSBkaXIucmVwbGFjZShwYXJ0aWFsUGF0aCwgJycpLmxlbmd0aCAmJiBkaXIubGVuZ3RoID09PSBkaXIucmVwbGFjZShoZWxwZXJQYXRoLCAnJykubGVuZ3RoICkge1xyXG4gIGlmKGRpci5sZW5ndGggPT09IGRpci5yZXBsYWNlKHBhcnRpYWxQYXRoLCAnJykubGVuZ3RoICYmIGRpci5sZW5ndGggKSB7XHJcbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXRoID0gcGF0aC5qb2luKGRpciwgaXRlbSk7XHJcbiAgXHJcbiAgICAgIGlmKGZzLnN0YXRTeW5jKGl0ZW1QYXRoKS5pc0ZpbGUoKSkge1xyXG4gICAgICAgIGlmKHBhdGguZXh0bmFtZShpdGVtKSA9PSAnLmh0bWwnIHx8IHBhdGguZXh0bmFtZShpdGVtKSA9PSAnLmpzJyB8fCBwYXRoLmV4dG5hbWUoaXRlbSkgPT0gJy5jc3MnKSB7XHJcbiAgICAgICAgICBodG1sRW50cmllc1tpdGVtUGF0aF0gPSByZXNvbHZlKF9fZGlybmFtZSwgaXRlbVBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGh0bWxFbnRyaWVzLCBnZXRFbnRyaWVzKGl0ZW1QYXRoKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGh0bWxFbnRyaWVzO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0Q29udGV4dHMgPSBkaXIgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHRzID0ge307XHJcblxyXG4gIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGNvbnN0IGl0ZW1QYXRoID0gcGF0aC5qb2luKGRpciwgaXRlbSk7XHJcblxyXG4gICAgaWYoZnMuc3RhdFN5bmMoaXRlbVBhdGgpLmlzRmlsZSgpKSB7XHJcbiAgICAgIGlmKHBhdGguZXh0bmFtZShpdGVtKSA9PSAnLmpzb24nKSB7XHJcbiAgICAgICAgY29udGV4dHNbaXRlbVBhdGgucmVwbGFjZSgnc3JjJywnJykucmVwbGFjZSgnY29uZmlnLmpzb24nLCAnaHRtbCcpXSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGl0ZW1QYXRoKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dHMsIGdldENvbnRleHRzKGl0ZW1QYXRoKSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBjb250ZXh0cztcclxufVxyXG5cclxuY29uc3QgcGFnZURhdGEgPSBnZXRDb250ZXh0cygnc3JjJyk7XHJcbmNvbnNvbGUubG9nKGdldEVudHJpZXMoJ3NyYycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuLy8gZXhwb3J0IGRlZmF1bHQge1xyXG4gIHJvb3Q6ICdzcmMnLFxyXG4gIC8vIGJhc2U6ICcvJyxcclxuICBwdWJsaWNEaXI6ICcuLi9wdWJsaWMnLFxyXG4gIC8vIHB1YmxpY0RpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvd2ViL3B1Yi9pbWdcIiksXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIG91dERpcjogJy4uL2Rpc3QnLFxyXG4gICAgb3V0RGlyOiAnLi4vZGlzdCcsXHJcbiAgICBhc3NldHNEaXI6ICcuLycsXHJcbiAgICBjc3NNaW5pZnk6IGZhbHNlLFxyXG4gICAgLy8gY3NzTWluaWZ5OiB0cnVlLFxyXG4gICAgb3ZlcndyaXRlOiB0cnVlLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgICBpbnB1dDogZ2V0RW50cmllcygnc3JjJyksXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoZW50cnkpID0+IHtcclxuICAgICAgICAgIGlmKHBhdGguZXh0bmFtZShlbnRyeS5uYW1lKSA9PSAnLmNzcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUucmVwbGFjZSgnc3JjLycsICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBlbnRyeS5uYW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IChlbnRyeSkgPT4ge1xyXG4gICAgICAgICAgaWYocGF0aC5leHRuYW1lKGVudHJ5Lm5hbWUpID09ICcuanMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKFwic3JjXCIsIGVudHJ5Lm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGVudHJ5Lm5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgaGFuZGxlYmFycyh7XHJcbiAgICAgIC8vIHBhcnRpYWxEaXJlY3Rvcnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL19wYXJ0aWFscycpLCAvL3BhcnRpYWxzIFx1QUNCRFx1Qjg1QyBcdUMxMjRcdUM4MTVcclxuICAgICAgLy9wYXJ0aWFscyBcdUFDQkRcdUI4NUMgXHVDMTI0XHVDODE1XHJcbiAgICAgIHBhcnRpYWxEaXJlY3Rvcnk6IFtcclxuICAgICAgICAvLyByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMvY29tbW9uJyksXHJcbiAgICAgICAgLy8gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvX3BhcnRpYWxzL2lucHV0JyksXHJcbiAgICAgICAgLy8gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvX3BhcnRpYWxzL2NvbnRlbnRzJyksXHJcbiAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvX3BhcnRpYWxzJyksXHJcbiAgICAgIF0sXHJcbiAgICAgIGNvbnRleHQocGFnZVBhdGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndGVzdDItLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwYWdlRGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocGFnZVBhdGgpO1xyXG4gICAgICAgIHJldHVybiBwYWdlRGF0YVtwYWdlUGF0aF07XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIGhlbHBlcnMsIC8vIGhlbHBlcnMgXHVCNEYxXHVCODVEXHJcbiAgICB9KSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2h0bWwtdHJhbnNmb3JtJywgLy8gXHVENTBDXHVCN0VDXHVBREY4XHVDNzc4IFx1Qzc3NFx1Qjk4NFxyXG4gICAgICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbCkge1xyXG4gICAgICAgIC8vIFx1QzVFQ1x1QjdFQyBcdUI5QzFcdUQwNkMgXHVEMERDXHVBREY4XHVDNzU4IGhyZWYgXHVDMThEXHVDMTMxIFx1QkNDMFx1QUNCRFxyXG4gICAgICAgICAgcmV0dXJuIGh0bWxcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL3Jlc2V0XFwuY3NzXCIvZyxcclxuICAgICAgICAgICAgJ2hyZWY9XCIuLi8uLi8uLi9jc3MvcmVzZXQuY3NzXCInXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgL2Nyb3Nzb3JpZ2luIGhyZWY9XCJcXC9jc3NcXC9jb21tb25cXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cIi4uLy4uLy4uL2Nzcy9jb21tb24uY3NzXCInXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgL2Nyb3Nzb3JpZ2luIGhyZWY9XCJcXC9jc3NcXC9jb250ZW50c1xcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiLi4vLi4vLi4vY3NzL2NvbnRlbnRzLmNzc1wiJ1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC9jcm9zc29yaWdpbiBocmVmPVwiXFwvY3NzXFwvcG9wdXBcXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cIi4uLy4uLy4uL2Nzcy9wb3B1cC5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2h0bWxcXC9ndWlkZVxcL2d1aWRlXFwvZ3VpZGVcXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cImd1aWRlLmNzc1wiJ1xyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHRcdHtcclxuICAgICAgbmFtZTogJ2RlbGV0ZS1zdm4tZm9sZGVyLXJlY3Vyc2l2ZWx5JyxcclxuICAgICAgY2xvc2VCdW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlU1ZORm9sZGVyUmVjdXJzaXZlbHkgPSAoZGlyKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpcik7XHJcbiAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoY3VycmVudFBhdGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgICAgIGlmIChmaWxlID09PSAnLnN2bicpIHtcclxuICAgICAgICAgICAgICAgIGZzLnJtU3luYyhjdXJyZW50UGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYERlbGV0ZWQgJHtjdXJyZW50UGF0aH1gKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlU1ZORm9sZGVyUmVjdXJzaXZlbHkoY3VycmVudFBhdGgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gJ2Rpc3QnIFx1QjUxNFx1QjgwOVx1RDFBMFx1QjlBQyBcdUIwQjQgXHVCQUE4XHVCNEUwIFx1QzExQ1x1QkUwQ1x1QjUxNFx1QjgwOVx1RDFBMFx1QjlBQ1x1Qjk3QyBcdUQwRDBcdUMwQzlcdUQ1NThcdUM1RUMgLnN2biBcdUQzRjRcdUIzNTQgXHVDMEFEXHVDODFDXHJcbiAgICAgICAgZGVsZXRlU1ZORm9sZGVyUmVjdXJzaXZlbHkocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBkZXZTb3VyY2VtYXA6IHRydWUsXHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsIC8vIFNDU1MgXHVEMzBDXHVDNzdDXHVDNUQwIFx1QjMwMFx1RDU1QyBTb3VyY2VtYXAgXHVDMEREXHVDMTMxIFx1RDY1Q1x1QzEzMVx1RDY1NFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIGF1dG9wcmVmaXhlcigpXHJcbiAgICAgICAgYXV0b3ByZWZpeGVyKHtcclxuICAgICAgICAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAyIHZlcnNpb25zJywgJ0ZpcmVmb3ggRVNSJ10sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy8gcHh0b3JlbSBcdUQ1MENcdUI3RUNcdUFERjhcdUM3NzggXHVDRDk0XHVBQzAwIChidWlsZCBcdUMyRENcdUM1RDBcdUI5Q0MgXHVDODAxXHVDNkE5KVxyXG4gICAgICAgIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXHJcbiAgICAgICAgICA/IFtcclxuICAgICAgICAgICAgICBweHRvcmVtKHtcclxuICAgICAgICAgICAgICAgIHJvb3RWYWx1ZTogMTAsIC8vIFx1QUUzMFx1QzkwMCByb290IFx1RDNGMFx1RDJCOCBcdUQwNkNcdUFFMzBcclxuICAgICAgICAgICAgICAgIHByb3BMaXN0OiBbJyonXSwgLy8gXHVCQ0MwXHVENjU4XHVENTYwIFx1QzE4RFx1QzEzMSBcdUJBQTlcdUI4NURcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSwgLy8gXHVCQ0MwXHVENjU4XHVENTU4XHVDOUMwIFx1QzU0QVx1Qzc0NCBcdUMxMjBcdUQwRERcdUM3OTAgXHVCQUE5XHVCODVEXHJcbiAgICAgICAgICAgICAgICBtaW5QaXhlbFZhbHVlOiAyLCAvLyBcdUJDQzBcdUQ2NThcdUQ1NjAgXHVDRDVDXHVDMThDIFx1RDUzRFx1QzE0MCBcdUFDMTJcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgOiBbXSksIC8vIFx1QkNDMFx1QUNCRFx1QjQxQyBcdUFENkNcdUFDMDQ6IGJ1aWxkIFx1QzJEQ1x1QzVEMFx1QjlDQyBweHRvcmVtIFx1QzgwMVx1QzZBOVxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgb3BlbjogJ2luZGV4Lmh0bWwnLFxyXG4gICAgcG9ydDogODA4MSxcclxuICB9XHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBbU4sU0FBUyxvQkFBb0I7QUFDaFAsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxRQUFRLGVBQWU7QUFJOUIsT0FBTyxhQUFhO0FBUnBCLElBQU0sbUNBQW1DO0FBZXpDLElBQU0sY0FBYztBQUdwQixJQUFNLGFBQWEsU0FBTztBQUN4QixRQUFNLGNBQWMsQ0FBQztBQUdyQixNQUFHLElBQUksV0FBVyxJQUFJLFFBQVEsYUFBYSxFQUFFLEVBQUUsVUFBVSxJQUFJLFFBQVM7QUFDcEUsT0FBRyxZQUFZLEdBQUcsRUFBRSxRQUFRLFVBQVE7QUFDbEMsWUFBTSxXQUFXLEtBQUssS0FBSyxLQUFLLElBQUk7QUFFcEMsVUFBRyxHQUFHLFNBQVMsUUFBUSxFQUFFLE9BQU8sR0FBRztBQUNqQyxZQUFHLEtBQUssUUFBUSxJQUFJLEtBQUssV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLFNBQVMsS0FBSyxRQUFRLElBQUksS0FBSyxRQUFRO0FBQy9GLHNCQUFZLFFBQVEsSUFBSSxRQUFRLGtDQUFXLFFBQVE7QUFBQSxRQUNyRDtBQUFBLE1BQ0YsT0FBTztBQUNMLGVBQU8sT0FBTyxhQUFhLFdBQVcsUUFBUSxDQUFDO0FBQUEsTUFDakQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRUEsU0FBTztBQUNUO0FBRUEsSUFBTSxjQUFjLFNBQU87QUFDekIsUUFBTSxXQUFXLENBQUM7QUFFbEIsS0FBRyxZQUFZLEdBQUcsRUFBRSxRQUFRLFVBQVE7QUFDbEMsVUFBTSxXQUFXLEtBQUssS0FBSyxLQUFLLElBQUk7QUFFcEMsUUFBRyxHQUFHLFNBQVMsUUFBUSxFQUFFLE9BQU8sR0FBRztBQUNqQyxVQUFHLEtBQUssUUFBUSxJQUFJLEtBQUssU0FBUztBQUNoQyxpQkFBUyxTQUFTLFFBQVEsT0FBTSxFQUFFLEVBQUUsUUFBUSxlQUFlLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxHQUFHLGFBQWEsUUFBUSxDQUFDO0FBQUEsTUFDNUc7QUFBQSxJQUNGLE9BQU87QUFDTCxhQUFPLE9BQU8sVUFBVSxZQUFZLFFBQVEsQ0FBQztBQUFBLElBQy9DO0FBQUEsRUFDRixDQUFDO0FBRUQsU0FBTztBQUNUO0FBRUEsSUFBTSxXQUFXLFlBQVksS0FBSztBQUNsQyxRQUFRLElBQUksV0FBVyxLQUFLLENBQUM7QUFDN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixNQUFNO0FBQUE7QUFBQSxFQUVOLFdBQVc7QUFBQTtBQUFBLEVBRVgsT0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxNQUNSLE9BQU8sV0FBVyxLQUFLO0FBQUEsTUFDdkIsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCLENBQUMsVUFBVTtBQUN6QixjQUFHLEtBQUssUUFBUSxNQUFNLElBQUksS0FBSyxRQUFRO0FBQ3JDLG1CQUFPLE1BQU0sS0FBSyxRQUFRLFFBQVEsRUFBRTtBQUFBLFVBQ3RDO0FBQ0EsaUJBQU8sTUFBTTtBQUFBLFFBQ2Y7QUFBQSxRQUNBLGdCQUFnQixDQUFDLFVBQVU7QUFDekIsY0FBRyxLQUFLLFFBQVEsTUFBTSxJQUFJLEtBQUssT0FBTztBQUNwQyxtQkFBTyxLQUFLLFNBQVMsT0FBTyxNQUFNLElBQUk7QUFBQSxVQUN4QztBQUNBLGlCQUFPLE1BQU07QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR1Qsa0JBQWtCO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJaEIsUUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDcEM7QUFBQSxNQUNBLFFBQVEsVUFBVTtBQUNoQixnQkFBUSxJQUFJLFVBQVU7QUFDdEIsZ0JBQVEsSUFBSSxRQUFRO0FBQ3BCLGdCQUFRLElBQUksUUFBUTtBQUNwQixlQUFPLFNBQVMsUUFBUTtBQUFBLE1BQzFCO0FBQUE7QUFBQSxJQUVGLENBQUM7QUFBQSxJQUNEO0FBQUEsTUFDRSxNQUFNO0FBQUE7QUFBQSxNQUNOLG1CQUFtQixNQUFNO0FBRXJCLGVBQU8sS0FDTjtBQUFBLFVBQ0M7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUNDO0FBQUEsVUFDQztBQUFBLFVBQ0E7QUFBQSxRQUNGLEVBQ0M7QUFBQSxVQUNDO0FBQUEsVUFDQTtBQUFBLFFBQ0YsRUFDQztBQUFBLFVBQ0M7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUNDO0FBQUEsVUFDQztBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsTUFDSjtBQUFBLElBQ0Y7QUFBQSxJQUNGO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixjQUFjO0FBQ1osY0FBTSw2QkFBNkIsQ0FBQyxRQUFRO0FBQzFDLGdCQUFNLFFBQVEsR0FBRyxZQUFZLEdBQUc7QUFDaEMsZ0JBQU0sUUFBUSxVQUFRO0FBQ3BCLGtCQUFNLGNBQWMsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUN2QyxrQkFBTSxPQUFPLEdBQUcsU0FBUyxXQUFXO0FBRXBDLGdCQUFJLEtBQUssWUFBWSxHQUFHO0FBQ3RCLGtCQUFJLFNBQVMsUUFBUTtBQUNuQixtQkFBRyxPQUFPLGFBQWEsRUFBRSxXQUFXLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFDdkQsd0JBQVEsSUFBSSxXQUFXLFdBQVcsRUFBRTtBQUFBLGNBQ3RDLE9BQU87QUFDTCwyQ0FBMkIsV0FBVztBQUFBLGNBQ3hDO0FBQUEsWUFDRjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFHQSxtQ0FBMkIsS0FBSyxRQUFRLGtDQUFXLE1BQU0sQ0FBQztBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxJQUNkLHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLFdBQVc7QUFBQTtBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUE7QUFBQSxRQUVQLGFBQWE7QUFBQSxVQUNYLHNCQUFzQixDQUFDLFFBQVEsbUJBQW1CLGFBQWE7QUFBQSxRQUNqRSxDQUFDO0FBQUE7QUFBQSxRQUVELEdBQUksUUFBUSxJQUFJLGFBQWEsZUFDekI7QUFBQSxVQUNFLFFBQVE7QUFBQSxZQUNOLFdBQVc7QUFBQTtBQUFBLFlBQ1gsVUFBVSxDQUFDLEdBQUc7QUFBQTtBQUFBLFlBQ2QsbUJBQW1CLENBQUM7QUFBQTtBQUFBLFlBQ3BCLGVBQWU7QUFBQTtBQUFBLFVBQ2pCLENBQUM7QUFBQSxRQUNILElBQ0EsQ0FBQztBQUFBO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
