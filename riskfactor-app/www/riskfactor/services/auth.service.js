riskfactorApp.factory("authService", function ($state, userService, dbService) {

  var authService = {};
  var _registerInfo = null;

  authService.checkAuth = function () {
    return firebase.auth().currentUser;
  };

  authService.listenAuth = function (callback) {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(newUser) {
      var user = userService.getUser();
      console.log("authService listenAuth | newUser", newUser);
      console.log("authService listenAuth | user", user);

      if (user == undefined || newUser != user) {
        console.log("authService listenAuth | authChanged");
        userService.setUser(newUser);



        if (newUser) {

          var usersFbRef = firebase.database().ref("users");

          if (_registerInfo) {
            console.log("authService listenAuth | _registerInfo", _registerInfo);

            usersFbRef.child(newUser.uid).child('data').set({
              provider: "email",
              age: _registerInfo.age,
              email: _registerInfo.email,
              gender: _registerInfo.gender,
              location: _registerInfo.location,
              lastSeen: firebase.database.ServerValue.TIMESTAMP,
            });

            _registerInfo = null;

          } else {

            usersFbRef.child(newUser.uid).child('lastSeen').set(firebase.database.ServerValue.TIMESTAMP);

          }

          console.log("authService listenAuth | checkForQuestions");
          dbService.checkForQuestions();

        } else {

          console.log("authService listenAuth | to splash");
          $state.go('splash', {}, {reload: true});

        }
      }
    });

    return unsubscribe;
  };

  authService.logout = function () {
    console.log("authService logout | logging out");
    userService.setUser(undefined);
    $state.go('splash', {}, {reload: true});
    firebase.auth().signOut().then(function() {
    }, function(error) {
      ionic.Platform.exitApp();
    });
  };

  authService.register = function (newUser, callback) {
    _registerInfo = newUser;
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

    facebookConnectPlugin.login(
      ["public_profile", "email"],
      function (result) {
        console.log("authService loginWithFacebook facebookConnectPlugin.login | result", result);
        var provider = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);

        // facebookConnectPlugin.api(
        //   '/' + result.authResponse.userID,
        //   ["public_profile", "email"],
        //   function (result) {
        //     console.log("authService loginWithFacebook facebookConnectPlugin.api | result", result);
        //     authService.logout();

        //   },
        //   function (error) {
        //     console.log("authService loginWithFacebook facebookConnectPlugin.api | error", error);

        //   }
        // );

        firebase.auth()
          .signInWithCredential(provider)
          .then(function(result) {
            console.log("authService loginWithFacebook signInWithCredential | result", result);
            var usersFbRef = firebase.database().ref("users");
            usersFbRef.child(result.uid).child('data').set({
              provider: "facebook",
            });
          })
          .catch(function(error) {
            console.log("authService loginWithFacebook signInWithCredential | error", error);
            return callback(error.message, null);
          });

      },
      function (error) {
        return callback(error.message, null);
      }
    );
  };

  return authService;
});
