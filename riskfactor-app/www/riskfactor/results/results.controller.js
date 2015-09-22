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

  $scope.questions = dbService.getQuestions()
  totalQuestionsCount = $scope.questions.length;
  _answers = dbService.getAnswers();
  updateResult();


  function updateResult() {
    $scope.currentQuestion = $scope.questions[currentQuestionIndex];
    $scope.currentAnswer = _answers[$scope.currentQuestion.id];

    console.log("$scope.currentQuestion", $scope.currentQuestion);
    console.log("$scope.currentAnswer", $scope.currentAnswer);
  };

  $scope.goToQuestion = function (index) {
    currentQuestionIndex = index;
    updateResult();
  };

  $scope.goToContact = function (index) {
    $state.go('contact');
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

});
