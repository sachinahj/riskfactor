riskfactorApp.factory('userService', function () {

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
