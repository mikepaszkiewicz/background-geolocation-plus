//Only start if this is a cordova project
if (Meteor.isCordova) {
  //Only run commands after cordova has finished device Ready
  Meteor.startup(function() {
    //Configure Plugin
    BackgroundLocation.configure({
      desiredAccuracy: 5, // Desired Accuracy of the location updates (lower = more accurate).
      distanceFilter: 1, // (Meters) Distance between points aquired.
      debug: false, // Show debugging info on device.
      interval: 9000, // (Milliseconds) Requested Interval in between location updates.
      //[Android Only Below]
      notificationTitle: 'BG Plugin', // Customize the title of the notification.
      notificationText: 'Tracking', // Customize the text of the notification.
      fastestInterval: 5000, //(Milliseconds) - Fastest interval OS will give updates.
      useActivityDetection : true // Shuts off GPS when your phone is still, increasing battery life enormously
    });

    //Register a callback for location updates.
    //this is where location objects will be sent in the background
    BackgroundLocation.registerForLocationUpdates(function (location) {
      // { @location looks like dis
      //  "latitude":47.000000,
      //  "longitude":-122.000000,
      //  "accuracy":20,
      //  "altitude":0,
      //  "speed":0
      //  "timestamp":1446873979589,
      //  "heading":0
      // }

      Session.set('backgroundRunning', true);
      //won't need these, just for proof of concept...
      Session.set('latitude', location.latitude);
      Session.set('longitude', location.longitude);
      //in reality, we want to update the runner position
      // Meteor.call('updateRunnerPosition', location);


    }, function (err) {
      Session.set('backgroundRunning', false);
      console.log("Error: Didnt get an update", err);
    });

    //[Android Only]
    //Register a callback for activity updates
    //If you set the option useActivityDetection to true you will recieve
    //periodic activity updates, see below for more information
    // BackgroundLocation.registerForActivityUpdates(function (activities) {
    //   console.log("We got an activity Update" + activites);
    // }, function (err) {
    //   console.log("Error:", err);
    // });

  });
}
