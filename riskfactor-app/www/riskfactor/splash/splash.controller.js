riskfactorApp.controller('SplashController', function ($scope, $state) {

  $scope.goToLogin = function () {
    $state.go('login');
  }

  $scope.goToAbout = function () {
    $state.go('about');
  }


});
