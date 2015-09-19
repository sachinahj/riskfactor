riskfactorApp.factory('dbService', function (firebaseNamespace, authService, $q) {

  var dbService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var questionsFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/questions");
  var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");
  var _questionsForDay = null;
  var _answers = null;

  dbService.checkForQuestions = function (callback) {

    var user = authService.getUser();
    console.log("user", user);

    usersFbRef.child(user.uid).child('answered').once('value', function (snapshot) {
      var answeredQuestions = snapshot.val() || {};

      var promises = [];
      promises.push(getQuestionForCategory("environmental", answeredQuestions));
      promises.push(getQuestionForCategory("ethical", answeredQuestions));
      promises.push(getQuestionForCategory("financial", answeredQuestions));
      promises.push(getQuestionForCategory("healthandsafety", answeredQuestions));
      promises.push(getQuestionForCategory("recreational", answeredQuestions));
      promises.push(getQuestionForCategory("socialandpolitical", answeredQuestions));

      $q.all(promises).then(function (results) {
        _questionsForDay = results;
        callback(null, _questionsForDay);
      });
    });


    function getQuestionForCategory(category, answeredQuestions) {
      var deferred = $q.defer();

      questionsFbRef.orderByChild('category').equalTo(category).once('value', function (snapshot) {
        var questions = snapshot.val();
        console.log("questions", questions);
        console.log("size", Object.keys(questions).length);
        var possibleQuestions = [];
        for (var questionId in questions) {
          if (!answeredQuestions[questionId]) {
            possibleQuestions.push(questions[questionId])
          }
        }
        var question = possibleQuestions[Math.floor(Math.random()*possibleQuestions.length)];
        deferred.resolve(question)
      });

      return deferred.promise;
    };
  };

  dbService.getQuestions = function (callback) {
    if (!_questionsForDay) {
      dbService.checkForQuestions(callback);
    } else {
      callback(null, _questionsForDay);
    }
  };


  dbService.saveAnswers = function (answers) {
    _answers = answers;
  };

  dbService.getAnswers = function (callback) {
    callback(null, _answers)
  };

  return dbService;

});
