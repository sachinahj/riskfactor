riskfactorApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $urlRouterProvider.otherwise('/');


  $stateProvider
    .state('splash', {
      url: '/splash',
      templateUrl: 'riskfactor/splash/splash.html',
      controller: 'SplashController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'riskfactor/auth/login.html',
      controller: 'LoginController'
    })
    .state('registration', {
      url: '/registration',
      templateUrl: 'riskfactor/auth/registration.html',
      controller: 'RegistrationController'
    });

});
