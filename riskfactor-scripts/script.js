var Firebase = require("firebase");
var fs = require("fs");
var Converter = require("csvtojson").Converter;
var jsonConverter = require('json2csv');
var uid = require('uid');


var firebaseNamespace = "uthoughttoday";
var firebaseKey = "2hFUpJ0cCyeUtA8vG6Dsa7wvnc65ByovpLM94CaW";
var firebaseUrl = "https://" + firebaseNamespace + ".firebaseio.com";
var fbConfigRef = new Firebase(firebaseUrl).child('config');
var fbQuestionsRef = new Firebase(firebaseUrl).child('questions');

var csvConverter = new Converter({
  constructResult: true
});

console.log("firebaseUrl", firebaseUrl);

// insertAndUpdateQuestions();
// getLatestCSV();
validateCSV();


function getLatestCSV() {
  fbQuestionsRef.once('value', function (snapshot) {
    var timestamp = new Date().getTime();
    var key = snapshot.key();
    var questions = snapshot.val();
    var fileName = 'questions-' + timestamp + '.csv';
    // console.log("fbRef key", key);
    // console.log("fbRef val", val);

    var questionsArray = [];
    for (var questionId in questions) {
      questions[questionId].date_updated = new Date(questions[questionId].date_updated);
      questions[questionId].date_created = new Date(questions[questionId].date_created);
      questions[questionId].response0 = questions[questionId].responses[questions[questionId].answers[0]];
      questions[questionId].response1 = questions[questionId].responses[questions[questionId].answers[1]];

      questionsArray.push(questions[questionId]);
    }
    var fieldNames = ['id', 'question', 'category', 'stat', 'source', 'answer1Choice', 'answer2Choice', 'answer1Response', 'answer2Response', 'totalResponse', 'created', 'updated'];
    var fields = ['id', 'question', 'category', 'stat', 'source', 'answers.0', 'answers.1', 'response0', 'response1', 'responses.total', 'date_created', 'date_updated'];
    console.log("questionsArray", questionsArray);


    jsonConverter({
      data: questionsArray,
      fieldNames: fieldNames,
      fields: fields,
      nested: true
    }, function (err, csv) {
      if (err) {
        console.log(err);
      }

      fs.writeFile('./questions-' + timestamp + '.csv', csv, function (err) {
        if (err) throw err;
        fbConfigRef.child('questionFileHash').set(timestamp);
        console.log('file saved');
      });

    });
  });
};

function validateCSV() {
  var fileStream = fs.createReadStream("./csvs/production_db.csv");
  csvConverter.on("end_parsed", function (questions) {

    var summary = {
      "environmental": 0,
      "ethical": 0,
      "financial": 0,
      "healthandsafety": 0,
      "recreational": 0,
      "socialandpolitical": 0
    };
    var actual = 0;
    var length = questions.length;

    for (var i = 0; i < length; i++) {
      var question = questions[i];
      var isValid = true;

      console.log("============================ " + "Row " + (i + 1) + " ============================");
      console.log("question:", question.question);
      console.log("category:", question.category);
      console.log("stat:", question.stat);
      console.log("source:", question.source);
      console.log("answer1Choice:", question.answer1Choice);
      console.log("answer2Choice:", question.answer2Choice);
      console.log("-------------------------------------------------");

      if (!question.question) {
        console.log("BAD question");
        isValid = false;
      }
      if (!(
          question.category == "environmental" ||
          question.category == "ethical" ||
          question.category == "financial" ||
          question.category == "healthandsafety" ||
          question.category == "recreational" ||
          question.category == "socialandpolitical"
        )) {
        console.log("BAD category");
        isValid = false;
      }

      if (!question.stat) {
        console.log("BAD stat");
        isValid = false;
      }

      if (!question.answer1Choice || !question.answer2Choice) {
        console.log("BAD answer choices");
        isValid = false;
      }

      if (isValid) {
        console.log("GOOD");
        actual++;
        summary[question.category] += 1;
      }
    }

    console.log("\n");
    console.log("||||||||||||||||||||summary||||||||||||||||||||||||");

    console.log("---------questions count by category---------");
    for (var category in summary) {
      console.log(category, "--->", summary[category]);
    }
    console.log("total rows:", length);
    console.log("valid questions:", actual);
  });

  fileStream.pipe(csvConverter);
}



function insertAndUpdateQuestions() {

  var fileStream = fs.createReadStream("./csvs/production_db.csv");
  csvConverter.on("end_parsed", function (questions) {

    var inserted = 0;
    var actual = 0;
    var length = questions.length;

    var summary = {
      "environmental": 0,
      "ethical": 0,
      "financial": 0,
      "healthandsafety": 0,
      "recreational": 0,
      "socialandpolitical": 0
    };

    for (var i = 0; i < length; i++) {
      var question = questions[i];

      if (
        question.question &&
        (
          question.category == "environmental" ||
          question.category == "ethical" ||
          question.category == "financial" ||
          question.category == "healthandsafety" ||
          question.category == "recreational" ||
          question.category == "socialandpolitical"
        ) &&
        question.stat
      ) {
        if (!question.id) {
          if (question.answer1Choice && question.answer2Choice) {
            insertQuestion(question);
            actual++;
          }
        } else {
          updateQuestion(question);
          actual++;
        }
      }
    }

    console.log("total rows:", length);
    console.log("valid questions:", actual);
  });

  fileStream.pipe(csvConverter);

  function insertQuestion(question) {
    var id = uid(10);
    question.answer1Choice = String(question.answer1Choice).toLowerCase();
    question.answer2Choice = String(question.answer2Choice).toLowerCase();

    var responses = {};
    responses['0'] = 0;
    responses['1'] = 0;
    responses.total = 0;

    var questionToInsert = {
      id: id,
      category: question.category,
      question: question.question,
      stat: question.stat,
      source: question.source,
      answers: [question.answer1Choice, question.answer2Choice],
      responses: responses,
      date_created: Firebase.ServerValue.TIMESTAMP,
      date_updated: Firebase.ServerValue.TIMESTAMP
    }

    console.log("id", id);
    console.log("questionToInsert", questionToInsert);

    fbQuestionsRef.child(id).set(questionToInsert, function () {
      console.log("inser");
    });
    return questionToInsert;
  }

  function updateQuestion(question) {

    var questionToUpdate = {
      category: question.category,
      question: question.question,
      stat: question.stat,
      date_updated: Firebase.ServerValue.TIMESTAMP
    }

    fbQuestionsRef.child(question.id).update(questionToUpdate);
    return questionToUpdate;
  }
};
