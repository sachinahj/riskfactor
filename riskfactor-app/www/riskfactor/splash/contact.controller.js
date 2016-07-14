riskfactorApp.controller('ContactController', function ($scope, $state, $cordovaSocialSharing) {

  $scope.feedbackSent = false;

  $scope.sendFeedback = function (feedbackText) {
    console.log("feedbackText", feedbackText);
    if (feedbackText) {
      $cordovaSocialSharing
        .shareViaEmail(feedbackText, 'uThought Feedback', ['sachinahj@gmail.com'], [], [], [])
        .then(function (result) {
          // Success!
          $scope.feedbackSent = true;
        }, function (err) {
          // An error occurred. Show a message to the user
        });

      return true;
    } else {
      return false;
    }
  };
});
