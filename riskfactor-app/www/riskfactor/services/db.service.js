riskfactorApp.factory('dbService', function (firebaseNamespace, authService, $q) {

  var dbService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var questionsFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/questions");
  var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");
  var _questionsForDay = [];
  var _answers = {};
  var lastCheck = null;

  var isNewSetOfQuestions = true;

  dbService.isNewSet = function () {
    return isNewSetOfQuestions;
  }

  dbService.checkForQuestions = function (callback) {
    if (!callback) {
      return;
    }
    var user = authService.getUser();
    var now = new Date();
    console.log("============checkForQuestions===================");
    console.log("user", user);

    usersFbRef.child(user.uid).child('lastCheck').once('value', function (snapshot) {
      var lastCheck = snapshot.val();
      var lastDate = new Date(lastCheck);

      console.log("now", now);
      console.log("lastDate", lastDate);

      if (
        !lastCheck ||
        now.getYear() >= lastDate.getYear() &&
        now.getMonth() >= lastDate.getMonth() &&
        now.getDate() > lastDate.getDate()
      ) {
        console.log("GETTING NEW QUESTIONS");

        // usersFbRef.child(user.uid).child('lastCheck').set(now.getTime());

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
            _answers = {};

            // console.log("_questionsForDay", _questionsForDay);

            if (_questionsForDay.length == 6 && !hasNull(_questionsForDay)) {
              isNewSetOfQuestions = true;
              return callback(null, true);
            } else {
              return callback(null, false);
            }
          });
        });

      } else {

        if (
          _questionsForDay.length == 6 &&
          !hasNull(_questionsForDay) &&
          _questionsForDay.length > Object.keys(_answers).length
        ) {
          return callback(null, true)
        } else {
          return callback(null, false)
        }
      }

    });

    function getQuestionForCategory(category, answeredQuestions) {
      var deferred = $q.defer();

      questionsFbRef.orderByChild('category').equalTo(category).once('value', function (snapshot) {
        var questions = snapshot.val();
        console.log("=======================getQuestionForCategory=======================");
        console.log("questions for category:", category, questions);
        console.log("size for category:", category, Object.keys(questions).length);
        var possibleQuestions = [];
        for (var questionId in questions) {
          if (!answeredQuestions.hasOwnProperty(questionId)) {
            possibleQuestions.push(questions[questionId]);
          }
        }
        var question = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
        console.log("chosen question", question);
        console.log("---------------");
        deferred.resolve(question);
      });
      return deferred.promise;
    }

    function hasNull(array) {
      for (var i = 0; i < array.length; i++) {
        if (!array[i]) {
          return true;
        }
      }
      return false;
    }
  };

  dbService.getNextQuestion = function (callback) {
    console.log("============getNextQuestion============");
    console.log("_questionsForDay", JSON.stringify(_questionsForDay));
    console.log("_answers", _answers);
    console.log("----------------------------------");
    for (var i = 0; i < _questionsForDay.length; i++) {
      if (!_answers.hasOwnProperty(_questionsForDay[i].id)) {
        return callback(_questionsForDay[i]);
      }
    }
    return callback(null)
  };

  dbService.getQuestions = function () {
    return _questionsForDay;
  };

  dbService.saveAnswer = function (questionId, answer) {
    console.log("============saveAnswer============");
    console.log("questionId", questionId);
    console.log("answer", answer);
    console.log("----------------------------------");
    var user = authService.getUser();
    isNewSetOfQuestions = false;
    _answers[questionId] = answer;
    // usersFbRef.child(user.uid).child('answered').child(questionId).set(answer);

    if (answer != null) {
      questionsFbRef.child(questionId).child('responses').child(answer).transaction(function (answerCount) {
        return answerCount + 1;
      });
      questionsFbRef.child(questionId).child('responses').child('total').transaction(function (answerCount) {
        return answerCount + 1;
      });
    }
  };

  dbService.getAnswers = function () {
    return _answers;
  };

  return dbService;

});
