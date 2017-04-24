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

      userService.setUser(newUser);

      if (newUser) {

        var usersFbRef = firebase.database().ref("users");

        if (_registerInfo) {
          console.log("authService listenAuth | _registerInfo", _registerInfo);

          usersFbRef.child(newUser.uid).set({
            provider: _registerInfo.provider,
            data: _registerInfo.data,
            lastSeen: firebase.database.ServerValue.TIMESTAMP,
          });

          _registerInfo = null;

        } else {

          usersFbRef.child(newUser.uid).child('lastSeen').set(firebase.database.ServerValue.TIMESTAMP);

        }

        console.log("authService listenAuth | checkForQuestions");
        $state.go('status', {
          type: 'loading',
        }, {reload: true});
        dbService.checkForQuestions();

      } else {

        console.log("authService listenAuth | to splash");
        $state.go('splash', {}, {reload: true});

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
    _registerInfo = {
      provider: "email",
      data: JSON.parse(JSON.stringify(newUser))
    };
    delete _registerInfo.data.password;
    delete _registerInfo.data.passwordagain;

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

  authService.skip = function (callback) {
    console.log("authService skip | ");
  };

  authService.loginWithFacebook = function (callback) {

    facebookConnectPlugin.login(
      ["public_profile", "email"],
      function (result) {
        console.log("authService loginWithFacebook facebookConnectPlugin.login | result", result);
        var provider = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);

        facebookConnectPlugin.api(
          '/' + result.authResponse.userID + "?fields=id,email,name,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified",
          ["public_profile", "email"],
          function (result) {
            console.log("authService loginWithFacebook facebookConnectPlugin.api | result", result);
            _registerInfo = {
              provider: "facebook",
              data: result
            };

            firebase.auth()
              .signInWithCredential(provider)
              .then(function(result) {
                console.log("authService loginWithFacebook signInWithCredential | result", result);
              })
              .catch(function(error) {
                console.log("authService loginWithFacebook signInWithCredential | error", error);
                return callback(error.message, null);
              });
          },
          function (error) {
            console.log("authService loginWithFacebook facebookConnectPlugin.api | error", error);
            return callback(error.message, null);
          }
        );
      },
      function (error) {
        console.log("authService loginWithFacebook facebookConnectPlugin.login | error", error);
        return callback(error.message, null);
      }
    );
  };

  return authService;
});
