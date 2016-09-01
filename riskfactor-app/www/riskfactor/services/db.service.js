riskfactorApp.factory('dbService', function (firebaseNamespace, authService, $q, $state) {

  var dbService = {};

  // var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  // var questionsFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/questions");
  // var answersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/answers");
  // var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");

  var _questionsForDay = [];
  var _answersForDay = {};
  var lastCheck = null;

  dbService.getQuestions = function () {
    return _questionsForDay;
  };

  dbService.getAnswers = function () {
    return _answersForDay;
  };

  var getNewQuestionSet = function (callback) {
    var user = authService.getUser();
    var _answeredQuestions = {};

    var getAnsweredQuestions = function (callback) {
      console.log("answersFbRef", answersFbRef);
      console.log("user.uid", user.uid);
      answersFbRef.child(user.uid).once('value', function (snapshot) {
        console.log("snapshot", snapshot);
        console.log("snapshot.val()", snapshot.val());
        callback(null, snapshot.val() || {});
      });
    };

    var getQuestionForCategory = function (category) {
      var deferred = $q.defer();

      questionsFbRef.orderByChild('category').equalTo(category).once('value', function (snapshot) {
        var questions = snapshot.val();
        console.log("=======================getQuestionForCategory=======================");
        console.log("questions for category:", category, questions);
        console.log("size for category:", category, Object.keys(questions).length);
        console.log("_answeredQuestions", _answeredQuestions);
        var possibleQuestions = [];
        for (var questionId in questions) {
          if (!_answeredQuestions.hasOwnProperty(questionId)) {
            possibleQuestions.push(questions[questionId]);
          }
        }
        var question = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
        console.log("chosen question", question);
        console.log("---------------");
        deferred.resolve(question);
      });

      return deferred.promise;
    };



    getAnsweredQuestions(function (err, answeredQuestions) {
      _answeredQuestions = answeredQuestions;
      console.log("err", err);
      console.log("_answeredQuestions", _answeredQuestions);

      var promises = [];
      promises.push(getQuestionForCategory("environmental"));
      promises.push(getQuestionForCategory("ethical"));
      promises.push(getQuestionForCategory("financial"));
      promises.push(getQuestionForCategory("healthandsafety"));
      promises.push(getQuestionForCategory("recreational"));
      promises.push(getQuestionForCategory("socialandpolitical"));

      $q.all(promises).then(function (results) {
        questionSet = results;
        _answersForDay = {};

        var hasNull = function (array) {
          for (var i = 0; i < array.length; i++) {
            if (!array[i]) {
              return true;
            }
          }
          return false;
        };
        if (questionSet.length == 6 && !hasNull(questionSet)) {
          return callback(null, questionSet);
        } else {
          callback('no questionSet possible', null);
        }
      });
    });
  };

  var saveQuestionSetData = function (questionSet, callback) {
    var user = authService.getUser();

    var currentQuestionSetData = {
      questions: questionSet,
      dateGrabbed: Firebase.ServerValue.TIMESTAMP,
      answers: {},
    };

    usersFbRef.child(user.uid).child('currentQuestionSetData').set(currentQuestionSetData);
  };

  var getOldQuestionSet = function (callback) {
    var user = authService.getUser();

    usersFbRef.child(user.uid).child('currentQuestionSetData').once('value', function (snapshot) {
      var questionSet = snapshot.val() || {};
      callback(null, questionSet);
    });
  };

  dbService.checkForQuestions = function () {
    var user = authService.getUser();

    console.log("============checkForQuestions===================");
    console.log("user", user);

    var getLastCheckTimestamp = function (callback) {
      usersFbRef.child(user.uid).child('currentQuestionSetData').child('dateGrabbed').once('value', function (snapshot) {
        var lastCheck = snapshot.val();
        callback(null, lastCheck);
      });
    };

    var showStatus = function (type) {
      $state.go('status', {
        type: type
      });
    };

    getLastCheckTimestamp(function (err, lastCheck) {

      var tz = jstz.determine();

      var lastDate = moment(lastCheck).tz(tz.name());
      var nowDate = moment().tz(tz.name());
      var dateDiff = nowDate.diff(lastDate, 'days');

      console.log("tz", tz);
      console.log("lastCheck", lastCheck);
      console.log("lastDate", lastDate);
      console.log("nowDate", nowDate);
      console.log("dateDiff", dateDiff);

      if (
        isNaN(dateDiff) ||
        dateDiff >= 1
      ) {
        console.log("GETTING NEW QUESTIONS");

        getNewQuestionSet(function (err, questionSet) {
          if (err) {
            return showStatus("none");
          }
          console.log("getNewQuestionSet err", err);
          console.log("getNewQuestionSet questionSet", questionSet);

          _questionsForDay = questionSet;
          _answersForDay = {};

          saveQuestionSetData(_questionsForDay);
          showStatus("new");
        });


      } else {

        getOldQuestionSet(function (err, currentQuestionSetData) {
          if (
            err ||
            !currentQuestionSetData.questions ||
            currentQuestionSetData.questions.length != 6
          ) {
            usersFbRef.child(user.uid).child('currentQuestionSetData').remove();
            return dbService.checkForQuestions();
          }
          console.log("getOldQuestionSet err", err);
          console.log("getOldQuestionSet currentQuestionSetData", currentQuestionSetData);

          _questionsForDay = currentQuestionSetData.questions;
          _answersForDay = currentQuestionSetData.answers || {};

          console.log("_questionsForDay.length", _questionsForDay.length);
          console.log("Object.keys(_answersForDay).length", Object.keys(_answersForDay).length);

          if (_questionsForDay.length <= Object.keys(_answersForDay).length) {
            showStatus("done");
          } else {
            showStatus("next");
          }
        });
      }

    });
  };

  dbService.getNextQuestion = function (callback) {
    console.log("============getNextQuestion============");
    console.log("_questionsForDay", JSON.stringify(_questionsForDay));
    console.log("_answersForDay", _answersForDay);
    console.log("----------------------------------");
    for (var i = 0; i < _questionsForDay.length; i++) {
      if (!_answersForDay.hasOwnProperty(_questionsForDay[i].id)) {
        return callback(_questionsForDay[i]);
      }
    }
    return callback(null)
  };

  dbService.saveAnswer = function (question, answer) {
    console.log("============saveAnswer============");
    console.log("questionId", question.id);
    console.log("answer", answer);
    console.log("----------------------------------");

    var user = authService.getUser();

    var answerData = {
      questionId: question.id,
      answerIndex: answer,
      answerDisplay: question.answers[answer] || null,
      dateAnswered: Firebase.ServerValue.TIMESTAMP
    };

    _answersForDay[question.id] = answerData;

    usersFbRef.child(user.uid).child('currentQuestionSetData').child('answers').child(question.id).set(answerData);

    if (answer != undefined) {

      answersFbRef.child(user.uid).child(question.id).set(answerData);

      questionsFbRef.child(question.id).child('responses').child(answer).transaction(function (answerCount) {
        return answerCount + 1;
      });
      questionsFbRef.child(question.id).child('responses').child('total').transaction(function (answerCount) {
        return answerCount + 1;
      });
    }
  };


  return dbService;

});
