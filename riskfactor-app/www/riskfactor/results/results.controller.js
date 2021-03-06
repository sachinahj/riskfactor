riskfactorApp.controller('ResultsController', function ($scope, $state, $q, $timeout, authService, userService, dbService) {

  var user = userService.getUser();
  if (!user) {
    $state.go('splash', {}, {reload: true});
    return;
  }

  var _answers = {};
  var currentQuestionIndex = 0;
  var totalQuestionsCount = 0;
  $scope.currentQuestion = {};
  $scope.currentAnswer;
  $scope.questions = [];

  init();

  function init() {
    currentQuestionIndex = 0;
    $scope.questions = dbService.getQuestions()
    totalQuestionsCount = $scope.questions.length;
    _answers = dbService.getAnswers();
    updateResult();
  };

  function updateResult() {
    $timeout(function () {
      $scope.currentQuestion = $scope.questions[currentQuestionIndex];
      $scope.currentAnswer = _answers[$scope.currentQuestion.id];

      console.log("$scope.currentQuestion", $scope.currentQuestion);
      console.log("$scope.currentAnswer", $scope.currentAnswer);
    });
  };

  $scope.goToQuestion = function (index) {
    currentQuestionIndex = index;
    updateResult();
  };

  $scope.rightSwipe = function () {
    if (currentQuestionIndex == 0) {
      return;
    }
    currentQuestionIndex--;
    updateResult();
  };

  $scope.leftSwipe = function () {
    if (currentQuestionIndex == (totalQuestionsCount - 1)) {
      return;
    }
    currentQuestionIndex++;
    updateResult();
  };

  $scope.logout = function () {
    authService.logout();
  };

});
