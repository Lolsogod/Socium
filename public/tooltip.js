'use strict';
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

const check = (img) => {
  let w = img.clientWidth;
  let h = img.clientHeight;
  if(h/w > 12 || w/h > 7 || img.src.match(/\.(jpeg|jpg|gif|png)$/) == null){
      img.src = 'https://www.ricoh-europe.com/img/error.jpeg';
  }
};
