riskfactorApp.controller('ContactController', function ($scope, $state, $timeout, $cordovaSocialSharing) {

  $scope.feedbackSent = null;

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
            $timeout(function () {
              $scope.feedbackSent = "Thanks for the feedback!";
            });
          },
          function (err) {
            // An error occurred. Show a message to the user
            console.log("shareViaEmail | err", err);
            $timeout(function () {
              $scope.feedbackSent = "Please install email app and try again";
            });
          }
        )

      return true;
    } else {
      $scope.feedbackSent = "Not a device";
      return false;
    }
  };
});
