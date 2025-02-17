/* 
태그 반복 그리기
{{#repeat 반복횟수}}반복태그{{/repeat}}

ex.-------------------------------------------------------
{{#repeat 5}}
<img src="/img/abc/logo.svg" alt="">
{{/repeat}}
----------------------------------------------------------
 */
export default (n, block) => {
  let accum = '';
  for (let i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
}