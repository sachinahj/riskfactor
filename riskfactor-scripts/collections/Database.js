'use strict'

let Database = module.exports;

let Firebase = require("firebase");

Database.initialize = function () {
  var config = {
    apiKey: "AIzaSyD48siItTa-45gc1OkJhUjeh-4AnarfHYQ",
    authDomain: "uthoughttoday.firebaseapp.com",
    databaseURL: "https://uthoughttoday.firebaseio.com",
  };
  Firebase.initializeApp(config);
};

Database.checkQuestionId = function (id, callback) {
  const fbQuestionsRef = Firebase.database().ref('questions');
  fbQuestionsRef.child(id).once('value', function (snapshot) {
    let question = snapshot.val();
    if (question && question.id == id) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}; // checkQuestionId

Database.insertQuestion = function (question, callback) {
  const fbQuestionsRef = Firebase.database().ref('questions');
  fbQuestionsRef.child(question.id).set(question, callback);
};

Database.updateQuestion = function (question, callback) {
  const fbQuestionsRef = Firebase.database().ref('questions');
  fbQuestionsRef.child(question.id).update(question, callback);
};

Database.getAll = function (callback) {
  const fbQuestionsRef = Firebase.database().ref('questions');
  fbQuestionsRef.once('value', function (snapshot) {
    let questions = snapshot.val();
    callback(questions);
  });
};


Database.getTimestamp = function (callback) {
  const fbConfigRef = Firebase.database().ref('config');
  fbConfigRef.child('questionFileHash').once('value', function (snapshot) {
    let timestamp = snapshot.val();
    callback(timestamp);
  });
};

Database.setTimestamp = function (timestamp) {
  const fbConfigRef = Firebase.database().ref('config');
  fbConfigRef.child('questionFileHash').set(timestamp);
};
