riskfactorApp.controller('StatusController', function ($scope, $state, $stateParams, $ionicHistory) {

  $scope.view = $stateParams.type;


  $scope.nextQuestions = function () {
    disableTransition();
    $state.go('questions');
  }

  $scope.results = function () {
    console.log("go");
    disableTransition();
    $state.go('results');
  }

  function disableTransition() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
  }
});
