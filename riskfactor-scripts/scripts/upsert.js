'use strict'

let async = require('async')

let fs = require('fs');
let Converter = require("csvtojson").Converter;

let csvConverter = new Converter({
  constructResult: true
});

let Database = require('../collections/Database');
let Question = require('../collections/Question');

let count = 0;
let upserted = 0;
let invalidQuestions = [];
let errorUploadingQuestions = [];

let summary = {
  "environmental": 0,
  "ethical": 0,
  "financial": 0,
  "healthandsafety": 0,
  "recreational": 0,
  "socialandpolitical": 0
};

csvConverter.on("end_parsed", function (questions) {

  count = questions.length;
  let asyncFunctions = [];

  for (let i = 0; i < count; i++) {

    let question = new Question(questions[i]);
    let asyncFunction = function (asyncCallback) {

      question.isValid(function (err, isValid) {

        if (isValid) {

          question.upsert(function (err) {

            if (err) {

              console.log("err", err);
              errorUploadingQuestions.push(i);

            } else {

              console.log("upserted:", question.id, i);
              upserted++;

            }

            asyncCallback();
          });

        } else {

          invalidQuestions.push(i);
          asyncCallback();

        }
      });
    };

    asyncFunctions.push(asyncFunction);
  }


  async.series(asyncFunctions, function (err, results) {
    console.log("-------------------------");
    console.log("total rows:", count);
    console.log("upserted:", upserted);
    console.log("invalid questions:", invalidQuestions);
    console.log("error uploading questions:", errorUploadingQuestions);
  });
});

var myArgs = process.argv.slice(2);
var fileName = myArgs[0];
Database.initialize();
Database.getTimestamp(function (timestamp) {
  let fileStream;
  let file = `./csvs/questions-${timestamp}.csv`;

  console.log("file to upload", file);

  if (fileName) {
    file = `./csvs/${fileName}.csv`;
  }

  fileStream = fs.createReadStream(file);

  fileStream.on('open', function () {
    console.log("uploading file", file);
    fileStream.pipe(csvConverter);
  });

   fileStream.on('error', function(err) {
      console.log("error no file found for", fileName || timestamp);
    });
});


