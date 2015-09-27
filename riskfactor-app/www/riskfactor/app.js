var riskfactorApp = angular.module('riskfactor', ['ionic', 'ngFitText', 'ngIOS9UIWebViewPatch', 'ngCordova', 'firebase'])

.run(function ($ionicPlatform, $state, authService, dbService) {

  $ionicPlatform.ready(function () {

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    authService.logout();
    var authData = authService.checkAuth();
    if (authData) {
      dbService.checkForQuestions(function (error, isQuestions) {
        if (error) {
          return $state.go('login');
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
      return $state.go('splash');
    }

  });

  $ionicPlatform.on('resume', function () {
    console.log("resuming");
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
