riskfactorApp.factory('dbService', function (firebaseNamespace) {

  var dbService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var _answers = [];

  dbService.getQuestions = function (callback) {
    var questions = [
      {
        id: "1",
        question: "Do you think the air you breathe is clean?",
        category: "environmental",
        result: {
          stat: "According to a 2014 report by the American Lung Association, almost half o f the U.S. population lives in areas where air pollution levels are dangerously high.",
          source: "http://riskfactor.com/"
        },
        answers: ["yes", "no"],
        responses: {
          yes: 88,
          no: 12,
          total: 100
        }
      },
      {
        id: "2",
        question: "If you know you would not get caught cheating on your significant other, would you do it?",
        category: "ethical",
        result: {
          stat: "According to a 2014 report in the Journal of Marital and Family Therapy, 74% of men and 68% of women say that they would have an affair if they knew they would never get caught.",
          source: "http://riskfactor.com/"
        },
        answers: ["yes", "no"],
        responses: {
          yes: 61,
          no: 39,
          total: 100
        }
      },
      {
        id: "3",
        question: "Would you say you are living paycheck to paycheck?",
        category: "financial",
        result: {
          stat: "According to Healthways.com, 70% of Americans are living paycheck to paycheck",
          source: "http://riskfactor.com/"
        },
        answers: ["yes", "no"],
        responses: {
          yes: 64,
          no: 36,
          total: 100
        }
      },
      {
        id: "4",
        question: "Who do you think is more likely to be a victim of a weather related fatality in the U.S., men or women?",
        category: "healthandsafety",
        result: {
          stat: "In 2013, 306 ales were victims of weather related fatalities, compared to 125 females (71% to 29%, respectively)",
          source: "http://riskfactor.com/"
        },
        answers: ["men", "women"],
        responses: {
          men: 67,
          women: 33,
          total: 100
        }
      },
      {
        id: "5",
        question: "Would you every try stand-up paddleboarding (SUP)?",
        category: "recreational",
        result: {
          stat: "In 2013 Outdoor Foundation report, the sport boasted the highest rate of first-time participation out of 42 activities surveyed. The median age for stand up paddling in 2013 was 28.",
          source: "http://riskfactor.com/"
        },
        answers: ["yes", "no"],
        responses: {
          yes: 88,
          no: 12,
          total: 100
        }
      },
      {
        id: "6",
        question: "Would you consider Austin a city that supports the lesbian, gay, bisexual and transgendet (LGBT) community?",
        category: "socialandpolitical",
        result: {
          stat: "According to NerdWallet, Austin ranks 7th among the country's top 10 most LBGT-friendly cities",
          source: "http://riskfactor.com/"
        },
        answers: ["yes", "no"],
        responses: {
          yes: 75,
          no: 25,
          total: 100
        }
      }
    ];


    callback(null, questions);
  };


  dbService.saveAnswers = function (answers) {
    _answers = answers;
  };

  dbService.getAnswers = function (callback) {
    callback(null, _answers)
  };

  return dbService;

});
