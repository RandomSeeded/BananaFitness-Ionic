var contollers = angular.module('CovalentFitness.controllers', ['timer', 'chart.js'])

contollers.controller('AppCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

})

contollers.controller('SignupCtrl', function($scope, $location, Auth) {

  $scope.signupData = {};

  $scope.doSignup = function() {
    Auth.signup($scope.signupData)
      .then(function() {
        $location.path('/tab/workouts');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('LoginCtrl', function($scope, $location, Auth) {

  // Form data for the login
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    Auth.login($scope.loginData)
      .then(function() {
        $location.path('/tab/workouts');
        window.open('https://penguin-banana-fitness-api.herokuapp.com/auth/fitbit/authorize');
      })
      .catch(function(error) {
        console.error(error);
      });

  };
})

contollers.controller('LogoutCtrl', function($scope, $location, Auth) {

  $scope.doLogout = function() {
    Auth.logout()
      .then(function() {
        $location.path('/signuplogin');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('ProfileCtrl', function($scope, $location, $http, Auth) {

  $scope.personalData = [];

  $http({
      method: 'GET',
      url: 'https://penguin-banana-fitness-api.herokuapp.com/auth/fitbit/request'
    }).then(function(resp) {
      console.log(resp);
    });

  $scope.getPersonalInfo = function() {
    Auth.getPersonalInfo()
      .then(function(personalData) {
        $scope.personalData = personalData
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.navigate = function() {
    $location.path('/tab/settings')
  };

  $scope.getPersonalInfo()

})

contollers.controller('GraphCtrl', function($scope, $location) {
  $scope.graph = {};

  $scope.graph.data = [                     // Add bar data, this will set your bars height in the graph
      //Awake
      [16, 15, 20, 12, 16, 12, 8],
      //Asleep
      [8, 9, 4, 12, 8, 12, 14]
    ];
    $scope.graph.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];    // Add labels for the X-axis
    $scope.graph.series = ['Awake', 'Asleep'];  // Add information for the hover/touch effect
})

contollers.controller('UniversalFeedCtrl', function($scope, $location, Feed) {

  $scope.UniversalFeed = [];

  $scope.loadUniversalFeed = function() {
    Feed.getUniversalFeed()
      .then(function(feed) {
        console.log(feed);
        $scope.UniversalFeed = feed;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.selectWorkout = function(wrkt) {
    $location.path('/tab/workout');
  };

  $scope.loadUniversalFeed();
})

contollers.controller('FollowingFeedCtrl', function($scope, $location, Feed, WorkoutServices) {

  $scope.FollowingFeed = [];

  $scope.loadFollowingFeed = function() {
    Feed.getFollowingFeed()
      .then(function(feed) {
        $scope.FollowingFeed = feed;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // $scope.selectWorkout = function(wrkt) {
  //   WorkoutServices.setWorkout(wrkt);
  //   $location.path('/tab/workout');
  // };

  $scope.loadFollowingFeed();

});

contollers.controller('FollowingCtrl', function($scope, $location, Following) {

  $scope.followingUsers = [];

  $scope.loadFollowing = function() {
    Following.getFollowing()
      .then(function(followingUsers) {
        $scope.followingUsers = followingUsers;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.loadUser = function(id) {
    Following.getUser(id)
      .then(function(user) {
        $location.path()
      })
      .catch(function(error) {
        console.error(error);
      });
  };
})

contollers.controller('WorkoutsCtrl', function($scope, $location, $ionicPopup, WorkoutServices) {
  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;
  $scope.workoutList = [];

  //functions for Workouts Controller ==========

  $scope.loadWorkoutList = function() {
    WorkoutServices.getAllWorkouts()
      .then(function(allWorkouts) {
        $scope.workoutList = allWorkouts;
      });
  };

  $scope.selectWorkout = function(wrkt) {
    console.log("here is the workout id being selected: ", wrkt);
    WorkoutServices.getSpecificWorkout(wrkt)
      .then(function(specWorkout) {
        console.log('loaded the workout: ', specWorkout);
        WorkoutServices.setNewWorkout({
          name: $scope.newWorkout.name,
          id: null
        });
        $location.path('/tab/editWorkout');
      });
  };



  $scope.deleteWorkout = function(wrkt) {
    console.log(wrkt);
    WorkoutServices.setWorkout(wrkt);
    WorkoutServices.deleteWorkout(wrkt);
  };

  $scope.addWorkout = function() {
    $scope.showPopup() // removed .then()
  };

  $scope.templateWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt)
      .then($location.path('/tab/editWorkout'));
  };

  $scope.editWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt);
  };

  //==========

  $scope.showPopup = function() {
    $scope.newWorkout = {};

    var buttonCancel = {
      text: 'Cancel', 
      onTap: function (e) {
        return true;
      }
    };

    var buttonCreateWorkout = {
      text: 'Work Out',
      type: 'button-positive',
      onTap: function(e) {
// Not making a database call here anymore. Instead we're setting the current workout to have our newly-chosen name, and id of null.
        WorkoutServices.setNewWorkout({
          name: $scope.newWorkout.name,
          id: null
        });

        console.log('WorkoutServices.selectedWorkout: ', WorkoutServices.selectedWorkout);
        $location.path('/tab/editWorkout');
      }
    };

    var workoutPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newWorkout.name" required>',
      title: 'Enter New Workout Name',
      scope: $scope,
      buttons: [buttonCancel, buttonCreateWorkout]
    });

    // workoutPopup.then(function(res) {
    //   workoutPopup.close();

    // });
  };

})


contollers.controller('WorkoutCtrl', function($scope, $location, WorkoutServices) {

  $scope.workout = null;

  //functions for Workout Controller ==========

  $scope.loadWorkout = function() {
    WorkoutServices.getSpecificWorkout()
      .then(function(specWorkout) {
        $scope.workout = specWorkout;
        console.log('loaded the workout: ', $scope.workout);
      });
  };


  $scope.editWorkout = function(wrkt) {
    WorkoutServices.setWorkout(wrkt);
    $location.path('/tab/editWorkout');
  };


  $scope.loadWorkout();

})

contollers.controller('WorkoutEditsCtrl', function($scope, $location, $ionicModal, WorkoutServices) {
  $scope.startTime;
  $scope.endTime;
   
  $scope.startTimer = function () {
    $scope.$broadcast('timer-start');
    $scope.startTime = moment()._d;
    $scope.timerRunning = true;
    console.log($scope.startTime);
  };

  $scope.stopTimer = function () {
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
  };

  $scope.currentWorkout = WorkoutServices.selectedWorkout;
  $scope.currentWorkout.moves = [];
  $scope.currentMove = {};

  // button func ==========
  // $scope.shouldShowDelete = false;

  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.id = 1;

  console.log("this is the workout object for the workout we are editing ($scope.currentWorkout): ", $scope.currentWorkout);

  //*****NOTE the modal is unfinished*****

  // modal for collection edit info ==========
  $ionicModal.fromTemplateUrl('workoutAddModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('workoutAddModal.html template has been opened by the WorkoutEditsCtrl');
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();

  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //workoutedits controller vars and functions ==========

  //right now edits send to server each time, maybe we can accumulate these here and send to server on 'save' or 'exit'.  We should talk about which we want.

  $scope.addEx = function() {
    $scope.openModal();
  };

  $scope.createMove = function(name, weight, reps) {
    // move.workoutid = $scope.id++;
    // WorkoutServices.addMoveToWorkout(move)
    //   .then(function() {
    //     $scope.loadCurrentWorkout();
    //   });
    // console.log(name);
    $scope.currentWorkout.moves.push({name:name, weight: weight, reps: reps, time: moment()._d});
    console.log($scope.currentWorkout.moves);
    // $scope.closeModal();
  };


  $scope.stopWorkout = function () {
    $scope.endTime = moment()._d;
    $scope.closeModal();
    console.log($scope.endTime);
    if ($scope.currentWorkout.name !== null) {
      WorkoutServices.addNewWorkout({
        name: $scope.currentWorkout.name,
      })
      .then(function (resp) {
        console.log('got this response from the db: ', resp);
        console.log('here is the id of the workout we added: ', resp.id);
        // Right now we are making a separate database call for each move. 
        // We will need to change the server to call bulkCreate instead of findOrCreate at that route, 
        // so that we only have to contact the server once. 

        $scope.currentWorkout.moves.forEach(function (move) {
          move.workoutid = resp.id;
          WorkoutServices.addMoveToWorkout(move)
          .then(function (resp) {
            console.log("this move got added to the db: ", resp);
          });
        });

        //Takes users back to the page with all their workouts. Can later take the user to, e.g., a workout summary page, etc.
        $location.path('/tab/workouts');
      });
      
    } else {
      console.log("$scope.currentWorkout may be null. Here is $scope.currentWorkout: ", $scope.currentWorkout);
    }
  };

  // $scope.deleteEx = function(move) {
  //   WorkoutServices.deleteMoveFromWorkout(move)
  //     .then($scope.loadCurrentWorkout());
  // };

});
