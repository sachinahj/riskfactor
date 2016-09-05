riskfactorApp.controller('RegistrationController', function ($scope, $timeout, authService) {

  $scope.newUser = {};
  $scope.feedback = {};
  $scope.loading = false;

  $scope.ageOptions = [];
  $scope.locationOptions = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  var createAgeOptions = function () {
    for (var i = 1; i < 100; i++) {
      $scope.ageOptions.push(i);
    }
  };

  createAgeOptions();

  // $scope.newUser.email = "sachinahj@gmail.com";
  // $scope.newUser.password = "riskfactor";
  // $scope.newUser.passwordagain = "riskfactor";
  // $scope.newUser.age = 24;
  // $scope.newUser.gender = "male";
  // $scope.newUser.location = "Louisiana";

  $scope.register = function () {
    if (window.cordova) {
      window.cordova.plugins.Keyboard.close();
    }
    $scope.loading = true;
    $scope.feedback = {};


    var setErrorMssage = function (message) {
      $timeout(function () {
        $scope.newUser.password = "";
        $scope.newUser.passwordagain = "";
        $scope.feedback = {
          message: message,
          type: "error"
        }
      }, 0)
    }

    var validateEmail = function (email) {
      var afterAt = email.split('@')[1];
      if (email && email.indexOf('@') > -1 && afterAt.indexOf('@') == -1 && afterAt.indexOf('.') > -1) {
        return true;
      }
      return false;
    };


    if (!$scope.newUser.email) {
      $scope.loading = false;
      return setErrorMssage("Please make sure you entered an email address");
    }

    if (!$scope.newUser.age) {
      $scope.loading = false;
      return setErrorMssage("Please select your age");
    }

    if (!$scope.newUser.gender) {
      $scope.loading = false;
      return setErrorMssage("Please select your gender");
    }

    if (!$scope.newUser.location) {
      $scope.loading = false;
      return setErrorMssage("Please select your location");
    }

    if (!$scope.newUser.password || !$scope.newUser.passwordagain || $scope.newUser.password != $scope.newUser.passwordagain) {
      $scope.loading = false;
      return setErrorMssage("Please make sure you entered matching passwords");
    }

    var isValid = validateEmail($scope.newUser.email);

    if (isValid) {

      authService.register($scope.newUser, function (error) {
        if (error) {
          $scope.loading = false;
          return setErrorMssage(error);
        }
      });

    } else {

      return setErrorMssage("Please make sure you entered a valid email address");

    }
  };



});
