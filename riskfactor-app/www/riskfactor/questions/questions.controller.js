riskfactorApp.controller('QuestionsController', function ($scope, $state, $timeout, $ionicHistory, authService, dbService) {

  var authData = authService.checkAuth();
  if (!authData) {
    $state.go('splash');
    return;
  }

  $scope.currentQuestion = {};
  $scope.nextQuestion = {};
  var timerInterval;
  var timerTime;
  $scope.countdown = 0;

  dbService.getNextQuestion(function (question) {
    console.log("firstQuestion!", question);
    $timeout(function () {
      $scope.currentQuestion = question;
      resetTimer();
    });
  });

  $scope.answerQuestion = function (questionId, answer) {
    dbService.saveAnswer(questionId, answer);
    clearInterval(timerInterval);
    dbService.getNextQuestion(function (question) {
      console.log("nextQuestion", question);
      if (question) {
        $scope.currentQuestion = question;
        resetTimer();
      } else {
        $state.go('status', {
          type: 'done'
        });
      }
    });
  };

  function resetTimer() {
    timerTime = 1000;
    timerInterval = setInterval(timer, 10);

    function timer() {
      if (timerTime <= 0) {
        clearInterval(timerInterval);
        $timeout(function () {
          $scope.countdown = "00.00";
        }, 0);
        $scope.answerQuestion($scope.currentQuestion.id, null);;
      }
      timerTime--;
      updateCountdownDisplay();
    };

    function updateCountdownDisplay() {
      $timeout(function () {
        $scope.countdown = "0" + (timerTime / 100).toFixed(2);
      }, 0)
    }
  };
});
