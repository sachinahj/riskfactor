riskfactorApp.controller('ContactController', function ($scope, $state, $cordovaSocialSharing) {

  $scope.feedbackSent = false;

  $scope.sendFeedback = function (feedbackText) {
    console.log("feedbackText", feedbackText);
    if (feedbackText && window.cordova) {
      window.plugins.socialsharing
        .shareViaEmail(
          feedbackText,
          'uThought Feedback',
          ['team@riskfactor.info'],
          [],
          [],
          [],
          function (result) {
            // Success!
            console.log("shareViaEmail | result", result);
            $scope.feedbackSent = true;
          },
          function (err) {
            // An error occurred. Show a message to the user
            console.log("shareViaEmail | err", err);
            $scope.feedbackSent = true;
          }
        )

      return true;
    } else {
      $scope.feedbackSent = true;
      return false;
    }
  };
});
