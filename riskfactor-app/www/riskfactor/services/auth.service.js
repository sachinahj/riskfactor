riskfactorApp.factory("authService", function (firebaseNamespace, $cordovaFacebook, $state, $window, userService, dbService) {

  var authService = {};
  // var updateLastSeen = function (userId) {
  //   usersFbRef.child(userId).child('lastSeen').set(Firebase.ServerValue.TIMESTAMP);
  // };

  authService.checkAuth = function () {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      _authData = currentUser;
    }
    return _authData;
  };

  authService.listenAuth = function (callback) {
    firebase.auth().onAuthStateChanged(function(newUser) {
      var user = userService.getUser();
      console.log("authService listenAuth | newUser", newUser);
      console.log("authService listenAuth | user", user);

      if (user == undefined || newUser != user) {
        console.log("authService listenAuth | authChanged");
        userService.setUser(newUser);
        if (newUser) {
          console.log("checkForQuestions");
          // authService.logout();
          try {
            dbService.checkForQuestions();
          } catch(e) {
            console.log("e", e);
          }
        } else {
          $state.go("splash", {}, {reload: true});
        }
      }
    });
  };

  authService.logout = function () {
    console.log("authService logout | logging out");
    userService.setUser(undefined);
    $state.go("splash");
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      ionic.Platform.exitApp();
    }, function(error) {
      // An error happened.
      ionic.Platform.exitApp();
    });
  };

  authService.register = function (newUser, callback) {
    console.log("authService register |  newUser", angular.copy(newUser));
    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    )
    .catch(function (error) {
      console.log("authService register | error", error);
      return callback(error.message, null);
    });
  };

  authService.login = function (user, callback) {
    console.log("authService login |  user", angular.copy(user));

    firebase.auth().signInWithEmailAndPassword(
      user.email,
      user.password
    )
    .catch(function (error) {
      console.log("authService login | error", error);
      return callback(error.message, null);
    });
  };

  authService.loginWithFacebook = function (callback) {
    var provider = new firebase.auth.FacebookAuthProvider();

    provider.addScope('email, public_profile');

    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("authService loginWithFacebook | result", result);
    }).catch(function(error) {
      console.log("authService loginWithFacebook | error", error);
      return callback(error.message, null);
    });

  };

  // authService.loginWithFacebook = function (callback) {
  //   console.log("loginWithFacebook");
  //   console.log("$cordovaFacebook", $cordovaFacebook);
  //   $cordovaFacebook.login(["email", "public_profile"]).then(function (success) {
  //     console.log("success", success);
  //     console.log("success.authResponse.access_token", success.authResponse.accessToken);

  //     authFb.$authWithOAuthToken("facebook", success.authResponse.accessToken).then(function (authData) {
  //       console.log("authData", authData);
  //       _authData = authData;
  //       saveFacebookData(authData, callback);

  //     }, function (error) {
  //       console.error("ERROR inside: " + error);
  //     });
  //   }, function (error) {
  //     console.log("ERROR outside: " + error);
  //   });

    // function saveFacebookData(authData, callback) {
    //   var userToSave = {
    //     uid: authData.uid,
    //     age: authData.facebook.cachedUserProfile.age_range,
    //     email: authData.facebook.cachedUserProfile.email,
    //     gender: authData.facebook.cachedUserProfile.gender,
    //     location: authData.facebook.cachedUserProfile.locale
    //   };

    //   console.log("userToSave", userToSave);
    //   usersFbRef.child(userToSave.uid).set(userToSave, function (error) {
    //     if (error) {
    //       return callback(error.message, null);
    //     }
    //     // updateLastSeen(authData.uid);
    //     return callback(null, userToSave);
    //   })
    // };
  // };

  return authService;
});
