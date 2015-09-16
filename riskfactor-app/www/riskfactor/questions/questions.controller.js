riskfactorApp.controller('QuestionsController', function ($scope, $state, $timeout, authService, dbService) {

  var authData = authService.checkAuth();
  if (!authData) {
    $state.go('splash');
    return;
  }

  var _questions = [];
  var _answers = {};
  var currentQuestionIndex = -1;
  var totalQuestionsCount = 0;
  $scope.currentQuestion = {};

  var timerInterval;
  var timerTime;
  $scope.countdown = 0;

  dbService.getQuestions(function (error, questions) {
    _questions = questions;
    totalQuestionsCount = _questions.length;
    startQuestions();
  });

  $scope.answerQuestion = function (questionId, answer) {
    _answers[questionId] = answer;
    nextQuestion();
  };

  function startQuestions() {
    currentQuestionIndex = -1;
    nextQuestion();
  };

  function nextQuestion() {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestionsCount) {
      angular.extend($scope.currentQuestion, _questions[currentQuestionIndex]);
      resetTimer();
    } else {
      dbService.saveAnswers(_answers);
      $state.go('results');
    }
  };

  function resetTimer () {
    timerTime = 1000;
    timerInterval = setInterval(timer, 10);

    function timer () {
      if (timerTime <= 0) {
          clearInterval(timerInterval);
          $timeout(function () {
            $scope.countdown = "00.00";
          },0);
          $scope.answerQuestion($scope.currentQuestion.id, null);;
       }
       timerTime--;
       updateCountdownDisplay();
    };

    function updateCountdownDisplay() {
      $timeout(function () {
        $scope.countdown = "0" + (timerTime/100).toFixed(2);
      },0)
    }
  };



});
