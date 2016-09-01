riskfactorApp.controller('SplashController', function ($scope, $state, authService, dbService) {

  $scope.$on('$ionicView.enter', function () {
    var authData = authService.checkAuth();
    console.log("SplashController: authData", authData);
    if (authData) {
      dbService.checkForQuestions();
    } else if (authData === undefined) {
      $scope.showButtons = false;
    } else {
      $scope.showButtons = true;
    }
  });

});
