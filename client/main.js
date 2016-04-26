//Only start if this is a cordova project
if (Meteor.isCordova) {
  //Only run commands after cordova has finished device Ready
  Meteor.startup(function() {
    //Configure Plugin
    BackgroundLocation.configure({
      desiredAccuracy: 5, // Desired Accuracy of the location updates (lower = more accurate).
      distanceFilter: 1, // (Meters) Distance between points aquired.
      debug: true, // Show debugging info on device.
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
      location = JSON.stringify(location);
      Session.set('location', location);
      console.log("We got a Background Update" + location);
    }, function (err) {
      console.log("Error: Didnt get an update", err);
    });

    //[Android Only]
    //Register a callback for activity updates
    //If you set the option useActivityDetection to true you will recieve
    //periodic activity updates, see below for more information
    BackgroundLocation.registerForActivityUpdates(function (activities) {
      console.log("We got an activity Update" + activites);
    }, function (err) {
      console.log("Error:", err);
    });

    //Start the Background Tracker.
    //When you enter the background tracking will start.
    BackgroundLocation.start();

  });
}

Template.hello.helpers({
  location(){
    if(!Session.get('location')){
      return 'No location data has been set';
    } else {
      return Session.get('location');
    }
  }
});
