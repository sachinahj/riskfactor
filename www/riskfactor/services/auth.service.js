riskfactorApp.factory('authService', function (firebaseNamespace) {

  var authService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");


  authService.register = function (newUser, callback) {
    rootFbRef.createUser({
      email: newUser.email,
      password: newUser.password
    }, function (error, newUserData) {
      if (error) {
        return callback(error.message, null);
      }

      var userToSave = angular.copy(newUser);
      delete userToSave.password;
      delete userToSave.passwordagain;

      usersFbRef.child(newUserData.uid).set(userToSave, function (error) {
        if (error) {
          return callback(error.message, null);
        }
        newUser.uid = newUserData.uid;
        return callback(null, newUser)
      });
    });
  };


  authService.login = function (user, callback) {
    rootFbRef.authWithPassword({
      email: user.email,
      password: user.password
    } , function (error, authData) {
      if (error) {
        return callback(error.message, null);
      }
      return callback(null, authData);
    })
  };

  return authService;

});
