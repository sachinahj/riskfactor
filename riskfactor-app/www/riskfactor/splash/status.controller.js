riskfactorApp.controller('StatusController', function ($scope, $state, $stateParams, $ionicHistory) {

  $scope.view = $stateParams.type;

  $scope.nextQuestions = function () {
    $scope.view = null;
    $state.go('questions');
  };

  $scope.results = function () {
    $scope.view = null;
    $state.go('results');
  };

  $scope.$on('$ionicView.enter', function () {
    $scope.view = $stateParams.type;
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
  });
});
