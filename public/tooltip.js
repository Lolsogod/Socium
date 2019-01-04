'use strict';
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
const check = (img) => {
  let w = img.clientWidth;
  let h = img.clientHeight;
  if(w/h > 19 || w/h < 0.4){
      img.src = 'https://www.ricoh-europe.com/img/error.jpeg';
  }};
/*const check = (img) => {
  let w = img.clientWidth;
  let h = img.clientHeight;
  if(w/h > 19 || w/h < 0.4){
      img.src = 'https://www.ricoh-europe.com/img/error.jpeg';
  }
};*/
/*function loadImage(img) {
  let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let iw = img.naturalWidth;
  let ih = img.naturalHeight;
  alert('hey');
  console.log(iw);
  console.log(ih);
  if(w/(0.7 * h) < iw/ih){
    alert("yes");//img.classList.remove('card-img')
  }
};
*/
