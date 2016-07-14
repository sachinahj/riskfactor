let fs = require("fs");
let jsonConverter = require('json2csv');

let Database = require('../collections/Database');


Database.getAll(function (questions) {
  let timestamp = new Date().getTime();
  let fileName = 'questions-' + timestamp + '.csv';
  let questionsCsv = [];

  for (let questionId in questions) {
    questions[questionId].dateUpdated = new Date(questions[questionId].dateUpdated);
    questions[questionId].dateCreated = new Date(questions[questionId].dateCreated);
    questionsCsv.push(questions[questionId]);
  }

  let fieldNames = [
    'id',
    'category',
    'question',
    'answer1',
    'answer2',
    'response1',
    'response2',
    'responses',
    'stat',
    'source',
    'url',
    'created',
    'updated'
  ];

  let fields = [
    'id',
    'category',
    'question',
    'answers.0',
    'answers.1',
    'responses.0',
    'responses.1',
    'responses.total',
    'stat',
    'source',
    'url',
    'dateCreated',
    'dateUpdated'
  ];

  jsonConverter({
    data: questionsCsv,
    fieldNames: fieldNames,
    fields: fields,
    nested: true
  }, function (err, csv) {
    if (err) {
      console.log(err);
    }

    fs.writeFile('./csvs/questions-' + timestamp + '.csv', csv, function (err) {
      if (err) throw err;
      Database.setTimestamp(timestamp);
      console.log('file saved');
    });

  });
});
