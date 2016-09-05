riskfactorApp.controller('StatusController', function ($scope, $state, $stateParams, $ionicHistory, $timeout) {

  $scope.view = $stateParams.type;

  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  if ($scope.view == 'done') {
    $timeout(function () {
      $state.go('results', {}, {reload: true});
    }, 1500)
  }

  $scope.nextQuestions = function () {
    $scope.view = null;
    $state.go('questions', {}, {reload: true});
  };

  $scope.results = function () {
    $scope.view = null;
    $state.go('results', {}, {reload: true});
  };

});
