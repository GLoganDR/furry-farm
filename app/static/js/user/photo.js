(function(){
  'use strict';

  $(document).ready(function(){
    var primary = $('#primaryPhoto').css('background-image');

    $('.minorPhoto').on({
      mouseenter: function(){
        var $photo = $(this).css('background-image');
        $('#primaryPhoto').css('background-image', $photo);
      },
      mouseleave: function(){
        $('#primaryPhoto').css('background-image', primary);
      }
    });
  });

})();

