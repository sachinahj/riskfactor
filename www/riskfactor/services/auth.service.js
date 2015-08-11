riskfactorApp.factory('authService', function (firebaseNamespace) {

  var authService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");


  authService.checkAuth = function (callback) {
    return rootFbRef.getAuth();
  }

  authService.register = function (newUser, callback) {
    rootFbRef.createUser({
      email: newUser.email,
      password: newUser.password
    }, function (error, newUserData) {
      if (error) {
        return callback(error.message, null);
      }

      var userToSave = angular.copy(newUser);
      userToSave.uid = newUserData.uid;
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
    }, function (error, authData) {
      if (error) {
        return callback(error.message, null);
      }
      return callback(null, authData);
    })
  };

  authService.loginWithFacebook = function (callback) {
    rootFbRef.authWithOAuthPopup("facebook", function (error, authData) {
      if (error) {
        return callback(error.message, null);
      }

      console.log("authData", authData);
      saveFacebookData(authData, callback);
    }, {
      scope: "email,public_profile"
    });


    function saveFacebookData (authData, callback) {
      var userToSave = {
        uid: authData.uid,
        age: authData.facebook.cachedUserProfile.age_range,
        email: authData.facebook.cachedUserProfile.email,
        gender: authData.facebook.cachedUserProfile.gender,
        location: authData.facebook.cachedUserProfile.locale
      };
      usersFbRef.child(authData.uid).set(userToSave, function (error) {
        if (error) {
          return callback(error.message, null);
        }
        return callback(null, authData);
      })
    };
  };

  authService.logout = function () {
    rootFbRef.unauth();
  }

  return authService;

});
