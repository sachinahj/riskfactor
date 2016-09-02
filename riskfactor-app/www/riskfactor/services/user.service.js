riskfactorApp.factory('userService', function (firebaseNamespace, $cordovaFacebook, $state, $window) {

  var userService = {};
  var _user = undefined;

  userService.getUser = function () {
    return _user;
  };

  userService.setUser = function (user) {
    _user = user;
  }


  return userService;
});
