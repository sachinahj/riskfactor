riskfactorApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $urlRouterProvider.otherwise('/');


  $stateProvider
    .state('splash', {
      url: '/splash',
      templateUrl: 'riskfactor/splash/splash.html',
      controller: 'SplashController'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'riskfactor/splash/about.html',
      controller: 'AboutController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'riskfactor/auth/login.html',
      controller: 'LoginController'
    })
    .state('loginfacebook', {
      url: '/loginfacebook',
      templateUrl: 'riskfactor/auth/loginfacebook.html',
      controller: 'LoginFacebookController'
    })
    .state('registration', {
      url: '/registration',
      templateUrl: 'riskfactor/auth/registration.html',
      controller: 'RegistrationController'
    })
    .state('questions', {
      url: '/questions',
      templateUrl: 'riskfactor/questions/questions.html',
      controller: 'QuestionsController'
    })
    .state('results', {
      url: '/results',
      templateUrl: 'riskfactor/results/results.html',
      controller: 'ResultsController'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'riskfactor/splash/contact.html',
      controller: 'ContactController'
    });

});
