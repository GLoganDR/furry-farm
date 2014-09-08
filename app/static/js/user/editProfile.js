/* jshint camelcase:false */
/* global google:true */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#editProfileForm').submit(editLocation);

    $('.profilePhotos').hover(
      function(){ //Show on hover
        $(this).closest('.photoMinor').find('button').show();
      },
      function(){
      }
    );

  });


  function editLocation(e){
    var lat = $('#lat').val();
    if(!lat){
      var name = $('#locName').val();
      geocode(name);
      e.preventDefault();
    }
  }

  function geocode(address){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      var name = results[0].formatted_address,
          lat  = results[0].geometry.location.lat(),
          lng  = results[0].geometry.location.lng();

      $('#locName').val(name);
      $('#lat').val(lat);
      $('#lng').val(lng);

      $('#editProfileForm').submit();
    });
  }
})();

