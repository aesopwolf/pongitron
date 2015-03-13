var switchService = new Audio('switch.mp3');
var ping = new Audio('ping.mp3');
var win = new Audio('win.mp3');
var duece = new Audio('duece.mp3');

angular.module('app', ['ngFitText'])
.controller('MainController', function($scope, $rootScope, $document) {
  // keybindings
  /***************************************/
  $document.bind('keyup', function(event) {$rootScope.$broadcast('keyup', event);});
  $document.bind('keydown', function(event) {$rootScope.$broadcast('keydown', event);});

  // variables
  /***************************************/
  var meta = {
    one: {
      resetCounter: 0,
      reset: false,
      lastTime: null,
    },
    two: {
      resetCounter: 0,
      reset: false,
      lastTime: null
    }
  };

  $scope.player = {one: 0, two: 0};
  $scope.flash1 = false;
  $scope.flash2 = false;
  $scope.keydown;
  $scope.keyup;

  function resetListeners() {
    $scope.keydown();
    $scope.keyup();
  }

  function startGame() {
    // reset the counter if they hold down the button
    /***************************************/
    $scope.keydown = $scope.$on('keydown', function(n, event) {
      if(event.keyCode === 49) {
        meta.one.resetCounter++;
        if(meta.one.resetCounter === 10) {
          ping.play();
          meta.one.reset = true;
          $scope.player.one = 0;
          $scope.$apply();
        }
      }
      if(event.keyCode === 86) {
        meta.two.resetCounter++;
        if(meta.two.resetCounter === 10) {
          ping.play();
          meta.two.reset = true;
          $scope.player.two = 0;
          $scope.$apply();
        }
      }
    });

    // increase the counter when they let go of the button
    /***************************************/
    $scope.keyup = $scope.$on('keyup', function(n, event) {
      // player 1
      //-----------------
      if((Date.now() - meta.one.lastTime) < 500) {
        // do nothing: prevents them hitting it twice on accident
      }
      else if(event.keyCode === 49 && !meta.one.reset) {
        ping.play();
        $scope.flash1 = true;
        $scope.player.one += 1;
        if($scope.player.one > 20) {
          $scope.player.one = 0;
        }
        $scope.$apply();
        meta.one.lastTime = Date.now();
        meta.one.resetCounter = 0;
      }
      else if(meta.one.reset) {
        meta.one.reset = false;
        meta.one.resetCounter = 0;
      }

      // player 2
      //-----------------
      if((Date.now() - meta.two.lastTime) < 500) {
        // do nothing: prevents them hitting it twice on accident
      }
      else if(event.keyCode === 86 && !meta.two.reset) {
        ping.play();
        $scope.flash2 = true;
        $scope.player.two += 1;
        if($scope.player.two > 20) {
          $scope.player.two = 0;
        }
        $scope.$apply();
        meta.two.lastTime = Date.now();
        meta.two.resetCounter = 0;
      }
      else if(meta.two.reset) {
        meta.two.reset = false;
        meta.two.resetCounter = 0;
      }

      // turn the flash background off
      //-----------------
      setTimeout(function() {
        $scope.flash1 = false;
        $scope.flash2 = false;
        $scope.$apply();
      }, 1000);
    });
  }

  function startDuece() {
      $scope.player = {one: 'D', two: 'D'};
      $scope.$apply();

      // reset the counter if they hold down the button
      /***************************************/
      $scope.keydown = $scope.$on('keydown', function(n, event) {
        if(event.keyCode === 49 || event.keyCode === 86) {
          meta.one.resetCounter++;
          meta.two.resetCounter++;
          if(meta.one.resetCounter === 10 || meta.two.resetCounter === 10) {
            ping.play();
            meta.one.reset = true;
            meta.two.reset = true;
            $scope.player = {one: 0, two: 0};
            $scope.duece = false;
            $scope.$apply();
            resetListeners();
            startGame();
          }
        }
      });

      // increase the counter when they let go of the button
      /***************************************/
      $scope.keyup = $scope.$on('keyup', function(n, event) {
        // player 1
        //-----------------
        if((Date.now() - meta.one.lastTime) < 500) {
          // do nothing: prevents them hitting it twice on accident
        }
        else if(event.keyCode === 49 && !meta.one.reset) {
          ping.play();
          $scope.flash1 = true;
          if($scope.player.one === "D" && $scope.player.two === "D") {
            $scope.player.one = "A";
          } else if ($scope.player.one === "D" && $scope.player.two === "A") {
            $scope.player.two = "D";
          } else {
            win.play();
            $scope.player = {one: 0, two: 0};
            resetListeners();
            startGame();
          }
          $scope.$apply();
          meta.one.lastTime = Date.now();
          meta.one.resetCounter = 0;
        }
        else if(meta.one.reset) {
          meta.one.reset = false;
          meta.one.resetCounter = 0;
        }

        // player 2
        //-----------------
        if((Date.now() - meta.two.lastTime) < 500) {
          // do nothing: prevents them hitting it twice on accident
        }
        else if(event.keyCode === 86 && !meta.two.reset) {
          ping.play();
          $scope.flash2 = true;
          if($scope.player.two === "D" && $scope.player.one === "D") {
            $scope.player.two = "A";
          } else if ($scope.player.two === "D" && $scope.player.one === "A") {
            $scope.player.one = "D";
          } else {
            win.play();
            $scope.player = {one: 0, two: 0};
            resetListeners();
            startGame();
          }
          $scope.$apply();
          meta.two.lastTime = Date.now();
          meta.two.resetCounter = 0;
        }
        else if(meta.two.reset) {
          meta.two.reset = false;
          meta.two.resetCounter = 0;
        }

        // turn the flash background off
        //-----------------
        setTimeout(function() {
          $scope.flash1 = false;
          $scope.flash2 = false;
          $scope.$apply();
        }, 1000);
      });
  }

  // inform the players to switch service
  /***************************************/
  $scope.$watchCollection("player", function(player, oldValue) {
    if (player.one === 20 && player.two === 20) {
      duece.play();
      resetListeners();
      startDuece();
    } else if(((player.one + player.two) % 5) === 0) {
      if(player.one === 0 && player.two === 0 ) {
        // new game!
      }
      else {
        switchService.play();
      }
    }
  });

  startGame();
});
