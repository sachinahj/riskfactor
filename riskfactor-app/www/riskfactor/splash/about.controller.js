riskfactorApp.controller('AboutController', function ($scope, $state) {

  $scope.goToSplash = function () {
    $scope.user = {};
    $state.go('splash');
  }

});
