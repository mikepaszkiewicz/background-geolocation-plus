var source, map;

Template.selectAddressMap.onRendered(function () {
  Mapbox.debug = false;
  Mapbox.load({
    gl: true,
    plugins: ['geocoder', 'turf']
  });

  this.autorun(function() {
    if (Mapbox.loaded()) {
      //test token given on mapbox examples
      mapboxgl.accessToken = 'pk.eyJ1IjoiaGFiaXRhdG1pa2UiLCJhIjoiY2lsdHVpMWQxMDBjdnVza3NyNnV6Y3N3NCJ9.dWupCOy48vAo8BocejIdtg';

      //set initial source data...still haven't found a meteor workaround
      //need an inital source for map.addSource onLoad
      source = new mapboxgl.GeoJSONSource({
        data: 'https://wanderdrone.appspot.com/'
      });

      map = new mapboxgl.Map({
          container: 'map',  //div id of map container
          style: 'mapbox://styles/mapbox/streets-v8', //pick mapbox style
          center: student.center, //geoJSON of center (not just lng, lat)
          zoom: 12, //zoom
          pitch: 0, //angle of tilt from directly downward
          bearing: 0, // offset from 'true north'
      }).on('load', function () {
        render.schoolBounds(map);
        render.runnerLocation(map, source);
        render.students(map);
      });

      map.addControl(new mapboxgl.Geocoder({position: 'top-right'}));
      map.addControl(new mapboxgl.Geolocate({position: 'top-left'}));
      map.addSource('single-point', {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": []
          }
      });
      geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);
      });
    }
  });

  Meteor.setInterval(function() {
    var lngLat = {};
    if(Meteor.isCordova && !Session.get('longitude') ||
      !Meteor.isCordova && !Geolocation.currentLocation()){
      console.log('nothing yet');
    } else {
      lngLat.lng = Session.get('longitude') || Geolocation.currentLocation().coords.longitude;
      lngLat.lat = Session.get('latitude') || Geolocation.currentLocation().coords.latitude;
    }

    source.setData(transformToGJSON(lngLat));
  }, 5000);
});
//using window.setInterval per docs
//https://www.mapbox.com/mapbox-gl-js/example/live-geojson/

//With actual data, this would be a Tracker observing changes
//on the runner's position. Position would be update in method call
//like seen in geoloc.init.js

transformToGJSON = function(coords) {
  return {
    "geometry": {
      "type": "Point",
      "coordinates": [
        coords.lng,
        coords.lat
      ]
    },
    "type": "Feature",
    "properties": {}
  };
};

onSuccess = function(position) {
    Session.set('accepted', true);
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
onError = function(error) {
  if(error.code === 1){
    alert('permission denied');
  } else if (error.code === 2){
    alert('position unavailable');
  } else if (error.code === 3){
    alert('sorry, timeout');
  }
  console.log(error);
};
