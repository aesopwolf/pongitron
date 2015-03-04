var switchService = new Audio('switch.mp3');
var ping = new Audio('ping.mp3');

angular.module('app', [])
.controller('MainController', function($scope, $rootScope, $document) {
  // keybindings
  /***************************************/
  $document.bind('keyup', function(event) {$rootScope.$broadcast('keyup', event);});
  $document.bind('keydown', function(event) {$rootScope.$broadcast('keydown', event);});

  // variables
  /***************************************/
  var player1ResetCounter = 0;
  var player1Reset = false;
  var player2ResetCounter = 0;
  var player2Reset = false;

  $scope.player = {one: 0, two: 0};
  $scope.flash1 = false;
  $scope.flash2 = false;

  // reset the counter if they hold down the button
  /***************************************/
  $scope.$on('keydown', function(n, event) {
    if(event.keyCode === 49) {
      player1ResetCounter++;
      if(player1ResetCounter === 10) {
        ping.play();
        player1Reset = true;
        $scope.player.one = 0;
        $scope.$apply();
      }
    }
    if(event.keyCode === 86) {
      player2ResetCounter++;
      if(player2ResetCounter === 10) {
        ping.play();
        player2Reset = true;
        $scope.player.two = 0;
        $scope.$apply();
      }
    }
  });

  // increase the counter when they let go of the button
  /***************************************/
  $scope.$on('keyup', function(n, event) {
    // player 1
    if(event.keyCode === 49 && !player1Reset) {
      ping.play();
      $scope.flash1 = true;
      $scope.player.one += 1;
      if($scope.player.one > 20) {
        $scope.player.one = 0;
      }
      $scope.$apply();
      player1ResetCounter = 0;
    }
    else if(player1Reset) {
      player1Reset = false;
      player1ResetCounter = 0;
    }

    // player 2
    if(event.keyCode === 86 && !player2Reset) {
      ping.play();
      $scope.flash1 = true;
      $scope.player.two += 1;
      if($scope.player.two > 20) {
        $scope.player.two = 0;
      }
      $scope.$apply();
      player2ResetCounter = 0;
    }
    else if(player2Reset) {
      player2Reset = false;
      player2ResetCounter = 0;
    }

    // turn the flash background off
    setTimeout(function() {
      $scope.flash1 = false;
      $scope.flash2 = false;
      $scope.$apply();
    }, 1000);
  });

  // inform the players to switch service
  /***************************************/
  $scope.$watchCollection("player", function(player, oldValue) {
    if(((player.one + player.two) % 5) === 0) {
      if(player.one === 0 && player.two === 0 ) {
        // new game!
      }
      else {
        switchService.play();
      }
    }
  });
});
