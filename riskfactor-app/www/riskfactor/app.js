// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngFitText'])

.run(function ($ionicPlatform, $state, authService, dbService) {
  if (window.location.hostname != "localhost") {
    alert('go');
  }

  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    authService.logout();
    var authData = authService.checkAuth();
    if (authData) {
      dbService.checkForQuestions(function (error, isQuestions) {
        if (error) {
          return $state.go('splash');
        }
        if (isQuestions) {
          $state.go('status', {
            type: "new"
          });
        } else {
          $state.go('status', {
            type: "none"
          });
        }
      });
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
