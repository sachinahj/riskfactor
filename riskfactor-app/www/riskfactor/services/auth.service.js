riskfactorApp.factory('authService', function (firebaseNamespace, $firebaseAuth, $cordovaFacebook) {

  var authService = {};
  var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");
  var authFb = $firebaseAuth(rootFbRef);
  var _authData = null;


  authService.checkAuth = function (callback) {
    _authData = rootFbRef.getAuth();
    return _authData;
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
      _authData = authData;
      return callback(null, authData);
    })
  };

  authService.getUser = function () {
    return _authData;
  };

  authService.loginWithFacebook = function (callback) {
    console.log("loginWithFacebook");
    console.log("$cordovaFacebook", $cordovaFacebook);
    $cordovaFacebook.login(["email", "public_profile"]).then(function (success) {
      console.log("success", success);
      console.log("success.authResponse.access_token", success.authResponse.accessToken);

      authFb.$authWithOAuthToken("facebook", success.authResponse.accessToken).then(function (authData) {
      console.log("authData", authData);
      _authData = authData;
      saveFacebookData(authData, callback);

      }, function (error) {
        console.error("ERROR inside: " + error);
      });
    }, function (error) {
      console.log("ERROR outside: " + error);
    });


    // rootFbRef.authWithOAuthPopup("facebook", function (error, authData) {
    //   if (error) {
    //     return callback(error.message, null);
    //   }

    //   console.log("authData", authData);
    //   _authData = authData;
    //   saveFacebookData(authData, callback);
    // }, {
    //   scope: "email,public_profile"
    // });


    function saveFacebookData(authData, callback) {
      var userToSave = {
        uid: authData.uid,
        age: authData.facebook.cachedUserProfile.age_range,
        email: authData.facebook.cachedUserProfile.email,
        gender: authData.facebook.cachedUserProfile.gender,
        location: authData.facebook.cachedUserProfile.locale
      };

      console.log("userToSave", userToSave);
      usersFbRef.child(userToSave.uid).set(userToSave, function (error) {
        if (error) {
          return callback(error.message, null);
        }
        return callback(null, userToSave);
      })
    };
  };

  authService.logout = function () {
    rootFbRef.unauth();
  }

  return authService;

});
