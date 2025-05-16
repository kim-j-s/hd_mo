# 현대해상 다이렉트 - 모바일

## dist url

https://kim-j-s.github.io/hd_mo/dist/index.html

## git ssl 오류 시 - openssl로 변경

- git config --global http.sslBackend openssl

## z-index 순서

- tooltip : 10
- nav : 100
- popup(bottom, layer, full 공통) : 1000
- loading : 1500
- pageTop : 미정
- toast : 1001

## 스타일 토큰 관련

- 추출한 json 파일 위치 : /scripts/design-tokens.json
- css변환 명령어 : `node scripts/build-style-tokens.js`
- 토큰 추출 파일 위치 : /src/css/theme.scss
