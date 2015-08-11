// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var riskfactorApp = angular.module('riskfactor', ['ionic'])

.run(function($ionicPlatform, $state, authService) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    authService.logout();
    // $state.go('results');
    var authData = authService.checkAuth();
    if (authData) {
      $state.go('questions');
    } else {
      $state.go('splash');
    }


  });
})


.constant('firebaseNamespace', "uthoughttoday");
