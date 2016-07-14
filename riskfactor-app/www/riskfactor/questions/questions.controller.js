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

  $scope.categoryDisplayText = {
    "environmental": "Environmental",
    "ethical": "Ethical",
    "financial": "Financial",
    "healthandsafety": "Health & Safety",
    "recreational": "Recreational",
    "socialandpolitical": "Social/Political"
  }

  dbService.getNextQuestion(function (question) {
    console.log("firstQuestion!", question);
    $timeout(function () {
      $scope.currentQuestion = question;
      resetTimer();
    });
  });

  $scope.answerQuestion = function (question, answer) {
    dbService.saveAnswer(question, answer);
    clearInterval(timerInterval);
    dbService.getNextQuestion(function (nextQuestion) {
      console.log("nextQuestion", nextQuestion);
      if (nextQuestion) {
        $scope.currentQuestion = nextQuestion;
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
        $scope.answerQuestion($scope.currentQuestion, null);;
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
