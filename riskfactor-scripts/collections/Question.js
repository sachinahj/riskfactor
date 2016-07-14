let Firebase = require("firebase");
let uid = require('uid');

let Database = require('./Database');

class Question {

  constructor(question = {}) {
      this.question = question.question;
      this.category = question.category;
      this.stat = question.stat;
      this.source = question.source;
      this.url = question.url;

      if (question.id) {
        this.id = question.id;
      } else {
        this.answer1 = question.answer1;
        this.answer2 = question.answer2;
      }
    } // constructor


  upsert(callback) {
      if (this.id) {
        this._update(callback);
      } else {
        this._insert(callback);
      }
    } // upsert


  isValid(callback) {
      let validCategories = {
        "environmental": true,
        "ethical": true,
        "financial": true,
        "healthandsafety": true,
        "recreational": true,
        "socialandpolitical": true
      };

      if (this.question && validCategories[this.category]) {
        if (this.id) {

          Database.checkQuestionId(this.id, callback);

        } else {

          if (this.answer1 && this.answer2) {
            callback(null, true)
          } else {
            callback(null, false);
          }

        }
      }
    } // isValid

  print() {
    console.log("-------------------------------------------------");
    if (this.id) {
      console.log("id:", this.id);
    }
    console.log("question:", this.question);
    console.log("category:", this.category);
    if (!this.id) {
      console.log("answer1:", this.answer1);
      console.log("answer2:", this.answer2);
    }
    console.log("stat:", this.stat);
    console.log("source:", this.source);
    console.log("-------------------------------------------------");
  }

  _insert(callback) {
    let id = uid(10);

    let responses = {};
    responses['0'] = 0;
    responses['1'] = 0;
    responses.total = 0;

    let questionToInsert = {
      id: id,
      question: this.question,
      category: this.category,
      stat: this.stat,
      source: this.source,
      url: this.url,
      answers: [this.answer1, this.answer2],
      responses: responses,
      dateCreated: Firebase.ServerValue.TIMESTAMP,
      dateUpdated: Firebase.ServerValue.TIMESTAMP
    }

    Database.insertQuestion(questionToInsert, (err) => {
      if (!err) {
        this.id = id
      }
      callback(err);
    });
  }

  _update(callback) {
    let questionToUpdate = {
      id: this.id,
      question: this.question,
      category: this.category,
      stat: this.stat,
      source: this.source,
      url: this.url,
      dateUpdated: Firebase.ServerValue.TIMESTAMP
    }

    Database.updateQuestion(questionToUpdate, callback);
  }

}


module.exports = Question;
