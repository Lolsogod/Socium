'use strict';
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

const check = (img) => {
  let w = img.clientWidth;
  let h = img.clientHeight;
  if(h/w > 8 || w/h > 8){
      img.src = 'https://www.ricoh-europe.com/img/error.jpeg';
  }
};