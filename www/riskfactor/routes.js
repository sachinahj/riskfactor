riskfactorApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $urlRouterProvider.otherwise('/');


  $stateProvider.state('splash', {
    url: '/splash',
    templateUrl: 'riskfactor/splash/splash.controller.html',
    controller: 'SplashController'
  });

});
