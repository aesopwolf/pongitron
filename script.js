var switchService = new Audio('switch.mp3');
var ping = new Audio('ping.mp3');

angular.module('app', [])
.controller('MainController', function($scope, $rootScope, $document) {
  $document.bind('keyup', function(event) {
    $rootScope.$broadcast('keypress', event);
  });

  $scope.flash1 = false;
  $scope.flash2 = false;

  $scope.$on('keypress', function(n, event) {
    if(event.keyCode === 49) {
      $scope.flash1 = true;
      $scope.player1.score += 1;
      if($scope.player1.score > 20) {
        $scope.player1.score = 0;
      }
      $scope.$apply();

      ping.play();
      if((($scope.player1.score + $scope.player2.score) % 5) === 0 ) {
        switchService.play();
      }
    }

    if(event.keyCode === 86) {
      $scope.flash2 = true;
      $scope.player2.score += 1;
      if($scope.player2.score > 20) {
        $scope.player2.score = 0;
      }
      $scope.$apply();
      ping.play();
      if((($scope.player1.score + $scope.player2.score) % 5) === 0 ) {
        switchService.play();
      }
    }

    setTimeout(function() {
      $scope.flash1 = false;
      $scope.flash2 = false;
      $scope.$apply();
    }, 1000);
  });

  $scope.player1 = {
    score: 0
  };
  $scope.player2 = {
    score: 0
  };
});
