var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngFitText', 'ngIOS9UIWebViewPatch', 'ngCordova', 'firebase'])

// .config(function ($cordovaFacebookProvider, $ionicPlatform) {
//   $ionicPlatform.ready(function () {
//     var appID = 1609083659371250;
//     var version = "v2.0"; // or leave blank and default is v2.0
//     $cordovaFacebookProvider.browserInit(appID, version);
//   });
// })

.run(function ($ionicPlatform, $state, authService, dbService, $rootScope) {

  $ionicPlatform.ready(function () {
    alert();
    if (!window.cordova && !$rootScope.fbInitiated) {
        $rootScope.fbInitiated = true;
        facebookConnectPlugin.browserInit("1609083659371250");
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    authService.logout();
    $state.go('splash');
    var authData = authService.checkAuth();
    console.log("app.js | authData", authData);
    if (authData) {
      dbService.checkForQuestions();
    } else {
      return $state.go('splash');
    }

  });

  $ionicPlatform.on('resume', function () {
    console.log("app.js | resuming");
    var authData = authService.checkAuth();
    console.log("app.js | authData", authData);
    if (authData) {
      dbService.checkForQuestions();
    } else {
      $state.go('splash');
    }
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
