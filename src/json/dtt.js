const fs = require('fs'); // 파일 시스템 모듈

// JSON 파일과 출력할 Sass 파일 경로 설정
const jsonFile = 'dtt.json'; // 입력 JSON 파일
const sassFile = 'dtt.scss'; // 출력 Sass 파일

// JSON 파일 읽기
fs.readFile(jsonFile, 'utf8', (err, data) => {
  if (err) {
    console.error('JSON 파일을 읽을 수 없습니다:', err);
    return;
  }

  try {
    const tokens = JSON.parse(data); // JSON 파싱
    let sassContent = ''; // 결과를 저장할 문자열

    // JSON 객체를 Sass 변수로 변환하는 함수
    function jsonToSass(obj, prefix = '') {
      for (const key in obj) {
        // if (typeof obj[key] === 'object') {
        //   // 객체일 경우 재귀적으로 처리
        //   jsonToSass(obj[key], `${prefix}-${key}`);
        // } else {
        //   // 단일 값일 경우 Sass 변수로 변환
        //   sassContent += `$${prefix}-${key}: ${obj[key]};\n`;
        // }

        if (typeof obj[key] === 'object') {
          if (obj[key].value !== undefined) {
            // 'value' 속성이 있을 경우 Sass 변수로 변환
            // console.log();
            sassContent += `$${prefix}-${key}: ${obj[key].value};\n`;
          } else {
            // 객체일 경우 재귀적으로 처리
            jsonToSass(obj[key], `${prefix}-${key}`);
          }
        }

      }
    }

    jsonToSass(tokens); // 변환 실행

    // Sass 파일로 저장
    fs.writeFile(sassFile, sassContent, (err) => {
      if (err) {
        console.error('Sass 파일을 생성할 수 없습니다:', err);
      } else {
        console.log('Sass 파일이 성공적으로 생성되었습니다:', sassFile);
      }
    });
  } catch (err) {
    console.error('JSON 데이터를 파싱할 수 없습니다:', err);
  }
});
