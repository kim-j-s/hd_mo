import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path, { resolve } from 'path';
// import helpers from './src/_helpers/index';

// import helpers from './src/_helpers/index';
import pxtorem from 'postcss-pxtorem'; // pxtorem 플러그인 가져오기

// src 내 빌드 파일 엔트리(html, js, css) 만들기

// const partialPath = 'src/_partials';  // partials 경로
// const helperPath = 'src/_helpers';  // helpers 경로 (엔트리 예외처리)

const partialPath = 'src/_partials';
// const helperPath = 'src/_helpers';

const getEntries = dir => {
  const htmlEntries = {};

  // if(dir.length === dir.replace(partialPath, '').length && dir.length === dir.replace(helperPath, '').length ) {
  if(dir.length === dir.replace(partialPath, '').length && dir.length ) {
    fs.readdirSync(dir).forEach(item => {
      const itemPath = path.join(dir, item);
  
      if(fs.statSync(itemPath).isFile()) {
        if(path.extname(item) == '.html' || path.extname(item) == '.js' || path.extname(item) == '.css') {
          htmlEntries[itemPath] = resolve(__dirname, itemPath);
        }
      } else {
        Object.assign(htmlEntries, getEntries(itemPath));
      }
    });
  }

  return htmlEntries;
};

const getContexts = dir => {
  const contexts = {};

  fs.readdirSync(dir).forEach(item => {
    const itemPath = path.join(dir, item);

    if(fs.statSync(itemPath).isFile()) {
      if(path.extname(item) == '.json') {
        contexts[itemPath.replace('src','').replace('config.json', 'html')] = JSON.parse(fs.readFileSync(itemPath));
      }
    } else {
      Object.assign(contexts, getContexts(itemPath));
    }
  });

  return contexts;
}

const pageData = getContexts('src');
console.log(getEntries('src'));
export default defineConfig({
// export default {
  root: 'src',
  // base: '/',
  publicDir: '../public',
  // publicDir: path.resolve(__dirname, "src/web/pub/img"),
  build: {
    // outDir: '../dist',
    outDir: '../dist',
    assetsDir: './',
    cssMinify: false,
    // cssMinify: true,
    overwrite: true,
    rollupOptions: {
      minify: false,
      input: getEntries('src'),
      output: {
        assetFileNames: (entry) => {
          if(path.extname(entry.name) == '.css') {
            return entry.name.replace('src/', '');
          }
          return entry.name;
        },
        entryFileNames: (entry) => {
          if(path.extname(entry.name) == '.js') {
            return path.relative("src", entry.name);
          }
          return entry.name;
        },
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
        resolve(__dirname, 'src/_partials'),
      ],
      context(pagePath) {
        console.log('test2---');
        console.log(pageData);
        console.log(pagePath);
        return pageData[pagePath];
      },
      // helpers, // helpers 등록
    }),
    {
      name: 'html-transform', // 플러그인 이름
      transformIndexHtml(html) {
        // 여러 링크 태그의 href 속성 변경
          return html
          .replace(
            /crossorigin href="\/css\/reset\.css"/g,
            'href="../../../css/reset.css"'
          )
          .replace(
            /crossorigin href="\/css\/common\.css"/g,
            'href="../../../css/common.css"'
          )
          .replace(
            /crossorigin href="\/css\/contents\.css"/g,
            'href="../../../css/contents.css"'
          )
          .replace(
            /crossorigin href="\/css\/popup\.css"/g,
            'href="../../../css/popup.css"'
          )
          .replace(
            /crossorigin href="\/html\/guide\/guide\/guide\.css"/g,
            'href="guide.css"'
          );
      }
    },
		{
      name: 'delete-svn-folder-recursively',
      closeBundle() {
        const deleteSVNFolderRecursively = (dir) => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const currentPath = path.join(dir, file);
            const stat = fs.statSync(currentPath);

            if (stat.isDirectory()) {
              if (file === '.svn') {
                fs.rmSync(currentPath, { recursive: true, force: true });
                console.log(`Deleted ${currentPath}`);
              } else {
                deleteSVNFolderRecursively(currentPath);
              }
            }
          });
        };

        // 'dist' 디렉토리 내 모든 서브디렉토리를 탐색하여 .svn 폴더 삭제
        deleteSVNFolderRecursively(path.resolve(__dirname, 'dist'));
      },
    },
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true, // SCSS 파일에 대한 Sourcemap 생성 활성화
      },
    },
    postcss: {
      plugins: [
        // autoprefixer()
        autoprefixer({
          overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
        }),
        // pxtorem 플러그인 추가 (build 시에만 적용)
        ...(process.env.NODE_ENV === 'production'
          ? [
              pxtorem({
                rootValue: 10, // 기준 root 폰트 크기
                propList: ['*'], // 변환할 속성 목록
                selectorBlackList: [], // 변환하지 않을 선택자 목록
                minPixelValue: 2, // 변환할 최소 픽셀 값
              }),
            ]
          : []), // 변경된 구간: build 시에만 pxtorem 적용
      ],
    },
  },
  server: {
    open: 'index.html',
    port: 8081,
  }
});