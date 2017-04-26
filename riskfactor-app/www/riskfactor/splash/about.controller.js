riskfactorApp.controller('AboutController', function ($scope, $state) {

  $scope.goToSplash = function () {
    $state.go('login', {}, {reload: true});
  }

});
