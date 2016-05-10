FlowRouter.route('/', {
  action: function(params) {
    FlowLayout.render('Layout', {content: 'GL'});
  }
});

if (Meteor.isClient) {
  var source,
      map;

  Template.GL.onRendered(function () {
    Mapbox.debug = false;
    Mapbox.load({ gl: true });

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
            center: temple.center, //geoJSON of center (not just lng, lat)
            zoom: 12, //zoom
            pitch: 60, //angle of tilt from directly downward
            bearing: -3, // offset from 'true north'
        }).on('load', function () {

          render.schoolBounds(map);

          //render live runner marker, need to pass inital source up AFAIK (this is just proof of concept)
          render.runnerLocation(map, source);

          //render an inside and outside student
          //is static fixture data now ->
            //for the delivery address selector, want to use a tracker on student's coords
          render.students(map);
        });
      }
    });
  });

  //using window.setInterval per docs
  //https://www.mapbox.com/mapbox-gl-js/example/live-geojson/

  //With actual data, this would be a Tracker observing changes
  //on the runner's position. Position would be update in method call
  //like seen in geoloc.init.js
  window.setInterval(function() {
    var lngLat = {};
    if(Meteor.isCordova && !Session.get('longitude') ||
      !Meteor.isCordova && !Geolocation.currentLocation()){
      console.log('nothing yet');
    } else {
      debugger;
      lngLat.lng = Session.get('longitude') || Geolocation.currentLocation().coords.longitude;
      lngLat.lat = Session.get('latitude') || Geolocation.currentLocation().coords.latitude;
    }

    source.setData(transformToGJSON(lngLat));
  }, 2000);
}
