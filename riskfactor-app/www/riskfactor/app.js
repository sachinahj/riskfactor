var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngIOS9UIWebViewPatch', 'ngCordova'])

.run(function ($ionicPlatform, $state, $timeout, authService, $rootScope, $ionicConfig, userService) {
  $rootScope.appVersion = "1.0.1";

  var _unsubscribe = null;

  $ionicPlatform.ready(function () {
    var config = {
      apiKey: "AIzaSyD48siItTa-45gc1OkJhUjeh-4AnarfHYQ",
      authDomain: "uthoughttoday.firebaseapp.com",
      databaseURL: "https://uthoughttoday.firebaseio.com",
    };

    firebase.initializeApp(config);

    $ionicConfig.views.transition('none');

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
    console.log("app.js | resuming");

    firebase.database().goOnline();

    $state.go('status', {
      type: 'loading',
    }, {}, {reload: true});

    $timeout(function () {
      _unsubscribe = authService.listenAuth();
    });
  });

  $ionicPlatform.on('pause', function () {
    console.log("app.js | pausing");

    userService.setUser(undefined);
    _unsubscribe();
    firebase.database().goOffline();
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
