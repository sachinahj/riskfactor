riskfactorApp.controller('ContactController', function ($scope, $state) {

  $scope.feedbackSent = false;
  $scope.feedback = "";

  $scope.goToResults = function () {
    $state.go('results');
  };

  $scope.sendFeedback = function () {
    console.log("$scope.feedback", $scope.feedback);
    $scope.feedback = "";
    $scope.feedbackSent = true;
  }
});
