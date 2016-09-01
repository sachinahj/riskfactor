riskfactorApp.factory('authService', function (firebaseNamespace, $cordovaFacebook, $state, $window) {

  var authService = {};
  // var rootFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com");
  // var usersFbRef = new Firebase("https://" + firebaseNamespace + ".firebaseio.com/users");
  // var authFb = $firebaseAuth(rootFbRef);
  var _authData = undefined;

  // var updateLastSeen = function (userId) {
  //   usersFbRef.child(userId).child('lastSeen').set(Firebase.ServerValue.TIMESTAMP);
  // };

  authService.getUser = function () {
    return _authData;
  };

  authService.checkAuth = function () {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      _authData = currentUser;
    }
    return _authData;
  };

  authService.listenAuth = function (callback) {
    firebase.auth().onAuthStateChanged(function(user) {
      console.log("authChanged", user);
      if (_authData == undefined || _authData != user) {
        console.log("authChanged true");
        _authData = user;
        $state.go('splash', {}, {reload: true});
      }
    });
  };

  authService.logout = function () {
    $state.go("splash");
    rootFbRef.unauth();
    ionic.Platform.exitApp();
  };

  authService.register = function (newUser, callback) {

    console.log('newUser', angular.copy(newUser));
    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    )
    .catch(function (error) {
      console.log("error", error);
      return callback(error.message, null);
    })
    // .then(function(newUserData) {
    //   console.log('newUserData', angular.copy(newUserData));

    //   // var userToSave = angular.copy(newUser);
    //   // userToSave.uid = newUserData.uid;
    //   // delete userToSave.password;
    //   // delete userToSave.passwordagain;

    //   // usersFbRef.child(newUserData.uid).set(userToSave, function (error) {

    //   //   if (error) {
    //   //     return callback(error.message, null);
    //   //   }

    //   //   newUser.uid = newUserData.uid;
    //   //   authService.login(newUser, callback);
    //   // });
    // })
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
      // updateLastSeen(authData.uid);
      return callback(null, authData);
    });
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
        // updateLastSeen(authData.uid);
        return callback(null, userToSave);
      })
    };
  };

  return authService;
});
