/* global google:true */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    var pos = getPosition(),
        positions = getPositions();

    initMap(pos.lat, pos.lng, 10);
    addMarker(pos.lat, pos.lng, pos.loc);

    positions.forEach(function(posit){
      addMarker(posit.lat, posit.lng, posit.name);
    });
  });

  function addMarker(lat, lng, loc){
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP});
  }

  function getPosition(){
    var $user = $('table'),
        loc       = $user.attr('data-user-name'),
        lat       = $user.attr('data-user-lat'),
        lng       = $user.attr('data-user-lng'),
        pos       = {loc:loc, lat:parseFloat(lat), lng:parseFloat(lng)};
    return pos;
  }

  function getPositions(){
    var positions = $('table tbody tr').toArray().map(function(tr){
      var name = $(tr).attr('data-name'),
          lat  = $(tr).attr('data-lat'),
          lng  = $(tr).attr('data-lng'),
          posit  = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
      return posit;
    });
    return positions;
  }

  function initMap(lat, lng, zoom){
    var styles     = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#ffdfa6'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#b52127'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#c5531b'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#74001b'},{'lightness':-10}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#74001b'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'#990c19'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#74001b'},{'lightness':-8}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#6a0d10'},{'visibility':'on'}]},{'featureType':'administrative','elementType':'geometry','stylers':[{'color':'#ffdfa6'},{'weight':0.4}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]}],
    mapOptions     = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.HYBRID, styles:styles};
    map            = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
})();
