var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngFitText', 'ngIOS9UIWebViewPatch', 'ngCordova'])

.run(function ($ionicPlatform, $state, authService, $rootScope, userService) {

  _unsubscribe = null;

  $ionicPlatform.ready(function () {
    var config = {
      apiKey: "AIzaSyD48siItTa-45gc1OkJhUjeh-4AnarfHYQ",
      authDomain: "uthoughttoday.firebaseapp.com",
      databaseURL: "https://uthoughttoday.firebaseio.com",
    };

    firebase.initializeApp(config);

    if (!window.cordova && !$rootScope.fbInitiated) {
        $rootScope.fbInitiated = true;
        facebookConnectPlugin.browserInit("1609083659371250");
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    $state.go('splash', {}, {reload: true});
    _unsubscribe = authService.listenAuth();
  });

  $ionicPlatform.on('resume', function () {
    alert("resuming");
    console.log("app.js | resuming");
    _unsubscribe = authService.listenAuth();
  });

  $ionicPlatform.on('pause', function () {
    alert("pausing");
    console.log("app.js | pausing");
    userService.setUser(undefined);
    _unsubscribe();
  });

})

.constant('firebaseNamespace', "uthoughttoday")

.filter('capitalize', function () {
  return function (input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  }
});
