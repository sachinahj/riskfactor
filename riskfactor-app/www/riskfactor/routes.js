riskfactorApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
    .state('splash', {
      cache: false,
      url: '/splash',
      templateUrl: 'riskfactor/splash/splash.html',
      controller: 'SplashController'
    })
    .state('about', {
      cache: false,
      url: '/about',
      templateUrl: 'riskfactor/splash/about.html',
      controller: 'AboutController'
    })
    .state('status', {
      cache: false,
      url: '/status',
      templateUrl: 'riskfactor/splash/status.html',
      controller: 'StatusController',
      params: {'type': true}
    })
    .state('login', {
      cache: false,
      url: '/login',
      templateUrl: 'riskfactor/auth/login.html',
      controller: 'LoginController'
    })
    .state('registration', {
      cache: false,
      url: '/registration',
      templateUrl: 'riskfactor/auth/registration.html',
      controller: 'RegistrationController'
    })
    .state('questions', {
      cache: false,
      url: '/questions',
      templateUrl: 'riskfactor/questions/questions.html',
      controller: 'QuestionsController'
    })
    .state('results', {
      cache: false,
      url: '/results',
      templateUrl: 'riskfactor/results/results.html',
      controller: 'ResultsController'
    })
    .state('contact', {
      cache: false,
      url: '/contact',
      templateUrl: 'riskfactor/splash/contact.html',
      controller: 'ContactController'
    });

  $urlRouterProvider.otherwise('splash');
});
