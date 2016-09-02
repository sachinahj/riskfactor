riskfactorApp.factory("authService", function ($state, userService, dbService) {

  var authService = {};

  authService.checkAuth = function () {
    return firebase.auth().currentUser;
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
          console.log("authService listenAuth | checkForQuestions");
          dbService.checkForQuestions();
        } else {
          console.log("authService listenAuth | to splash");
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
      ionic.Platform.exitApp();
    }, function(error) {
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

  return authService;
});
