riskfactorApp.controller('SplashController', function ($scope, $state, userService) {

  $scope.$on('$ionicView.enter', function () {
    var user = userService.getUser();
    console.log("SplashController | user", user);
    if (user === undefined) {
      $scope.showButtons = false;
    } else {
      $scope.showButtons = true;
    }
  });

});
