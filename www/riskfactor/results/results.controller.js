riskfactorApp.controller('ResultsController', function ($scope, $state, $q, authService, dbService) {

  var authData = authService.checkAuth();
  if (!authData) {
    $state.go('splash');
    return;
  }

  $scope.questions = [];
  var _answers = {};
  var currentQuestionIndex = 0;
  var totalQuestionsCount = 0;
  $scope.currentQuestion = {};
  $scope.currentAnswer;

  var questionsDeferred = $q.defer();
  var answersDeferred = $q.defer();

  dbService.getQuestions(function (error, questions) {
    if (error) {
      questionsDeferred.reject();
    }
    $scope.questions = questions;
    totalQuestionsCount = $scope.questions.length;
    return questionsDeferred.resolve();
  });

  dbService.getAnswers(function (error, answers) {
    if (error) {
      answersDeferred.reject();
    }
    _answers = answers;
    return answersDeferred.resolve();
  });

  $q.all([$scope.questions.promise, _answers.promise]).then(function () {
    updateResult();
  });

  function updateResult() {
    $scope.currentQuestion = $scope.questions[currentQuestionIndex];
    $scope.currentAnswer = _answers[$scope.currentQuestion.id];
  };

  $scope.goToQuestion = function (index) {
    currentQuestionIndex = index;
    updateResult();
  };

  $scope.leftSwipe = function () {
    if (currentQuestionIndex == 0) {
      return;
    }
    currentQuestionIndex--;
    updateResult();
  };

  $scope.rightSwipe = function () {
    if (currentQuestionIndex == (totalQuestionsCount - 1)) {
      return;
    }
    currentQuestionIndex++;
    updateResult();
  };

});
