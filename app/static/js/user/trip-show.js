/* global google, createMap, async, geocode */

(function(){
  'use strict';

  var map,
      origin,
      destination,
      waypoints = [];

  $(document).ready(function(){
    map = createMap('map', 39, -95, 4);
    origin      = $('tbody tr').attr('data-lat1') + ',' + $('tbody tr').attr('data-lng1');
    destination = $('tbody tr').attr('data-lat2') + ',' + $('tbody tr').attr('data-lng2');
    waypoints = getWaypoints();

    displayDirections();
    //calculateDistances();

    $('#add-stop').click(addStop);
    $('button[type=submit]').click(geoAndSubmit);
  });

  function getWaypoints(){
    return $('#stops li').toArray().map(function(li){
      var lat = $(li).attr('data-lat'),
          lng = $(li).attr('data-lng');
      return {location: lat + ',' + lng, stopover: true};
    });
  }

  function geoAndSubmit(e){
    var places = $('input').toArray().map(function(input){
      return $(input).val();
    });

    async.map(places, iterator, result);

    e.preventDefault();
  }

  function iterator(place, cb){
    geocode(place, function(name, lat, lng){
      cb(null, {name:name, lat:lat, lng:lng});
    });
  }

  function result(err, places){

    places.forEach(function(place, index){
      $('form').prepend('<input name="places['+index+'][name]" value="'+place.name+'" type="hidden">');
      $('form').prepend('<input name="places['+index+'][lat]" value="'+place.lat+'" type="hidden">');
      $('form').prepend('<input name="places['+index+'][lng]" value="'+place.lng+'" type="hidden">');
      $('form').prepend('<input name="places['+index+'][tripId]" value="'+$('tbody tr').attr('data-tripId')+'" type="hidden">');
    });

    $('form').submit();
  }

  function addStop(){
    var $last  = $('form > .stop-group:last-of-type'),
        $clone = $last.clone();

    $last.after($clone);
  }

  function displayDirections(){
    var directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));

    var request = {
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status){
      if(status === google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }
    });
  }

  function calculateDistances(){
    var service = new google.maps.DistanceMatrixService();

    var request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    };

    service.getDistanceMatrix(request, function(response, status){
      if(status === google.maps.DistanceMatrix.Status.OK){
        console.log(response);
      }
    });
  }

})();

