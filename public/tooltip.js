'use strict';
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

const check = (img) => {
  let w = img.clientWidth;
  let h = img.clientHeight;
  if(w/h > 19 || w/h < 0.4){
      img.src = 'https://www.ricoh-europe.com/img/error.jpeg';
  }
};
