/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button').click(addTrip);
  });

  function addTrip(e){
    var origin      = $('#origin').val(),
        destination = $('#destination').val();

    geocode(origin, function(name, lat, lng){
      console.log(name, lat, lng);
      $('#origin').val(name);
      $('#originLat').val(lat);
      $('#originLng').val(lng);

      geocode(destination, function(name, lat, lng){
        console.log(name, lat, lng);
        $('#destination').val(name);
        $('#destinationLat').val(lat);
        $('#destinationLng').val(lng);

        $('form').submit();
      });
    });

    e.preventDefault();

  }

})();

