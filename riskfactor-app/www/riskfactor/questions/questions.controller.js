riskfactorApp.controller('QuestionsController', function ($scope, $state, $timeout, $ionicHistory, authService, dbService) {

  var authData = authService.checkAuth();
  if (!authData) {
    $state.go('splash');
    return;
  }


  // var _questions = [];
  // var _answers = {};
  // var currentQuestionIndex = -1;
  // var totalQuestionsCount = 0;
  $scope.currentQuestion = {};
  $scope.nextQuestion = {};
  var timerInterval;
  var timerTime;
  $scope.countdown = 0;

  dbService.getNextQuestion(function (question) {
    $scope.currentQuestion = question;
    $scope.nextQuestion = question;
    console.log("$scope.currentQuestion", $scope.currentQuestion);
  });

  $scope.$on('$ionicView.enter', function () {
    $scope.currentQuestion = $scope.nextQuestion;
    // resetTimer();
  });

  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  $scope.answerQuestion = function (questionId, answer) {
    dbService.saveAnswer(questionId, answer);
    clearInterval(timerInterval);
    dbService.getNextQuestion(function (question) {
      $scope.nextQuestion = question;
      console.log("$scope.nextQuestion", $scope.nextQuestion);
      if ($scope.nextQuestion) {
        disableTransition();
        $state.go('status', {
          type: 'next'
        });
      } else {
        disableTransition();
        $state.go('status', {
          type: 'done'
        });
      }
      console.log("$scope.currentQuestion", $scope.currentQuestion);
    });
  };

  function resetTimer() {
    timerTime = 300;
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


  function disableTransition() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
  };


});
