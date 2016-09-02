var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngFitText', 'ngIOS9UIWebViewPatch', 'ngCordova'])

.run(function ($ionicPlatform, $state, authService, $rootScope) {

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
    var authData = authService.listenAuth();
  });

  $ionicPlatform.on('resume', function () {
    console.log("app.js | resuming");
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
