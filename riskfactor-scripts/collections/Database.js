let Database = module.exports;

let Firebase = require("firebase");

const firebaseKey = "2hFUpJ0cCyeUtA8vG6Dsa7wvnc65ByovpLM94CaW";
const firebaseUrl = "https://uthoughttoday.firebaseio.com";

const fbConfigRef = new Firebase(firebaseUrl).child('config');
const fbQuestionsRef = new Firebase(firebaseUrl).child('questions');

Database.checkQuestionId = function (id, callback) {
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
  fbQuestionsRef.child(question.id).set(question, callback);
};

Database.updateQuestion = function (question, callback) {
  fbQuestionsRef.child(question.id).update(question, callback);
};

Database.getAll = function (callback) {
  fbQuestionsRef.once('value', function (snapshot) {
    let questions = snapshot.val();
    callback(questions);
  });
};


Database.getTimestamp = function (callback) {
  fbConfigRef.child('questionFileHash').once('value', function (snapshot) {
    let timestamp = snapshot.val();
    callback(timestamp);
  });
};

Database.setTimestamp = function (timestamp) {
  fbConfigRef.child('questionFileHash').set(timestamp);
};
