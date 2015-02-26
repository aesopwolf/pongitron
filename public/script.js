angular.module('app', [])
// .directive('onKeyDown', function() {
//   return {
//     restrict: 'A',
//     link: function(scope, elem, attrs) {
//       // this next line will convert the string
//       // function name into an actual function
//       var functionToCall = scope.$eval(attrs.ngKeydown);
//       elem.on('keydown', function(e){
//         console.log(e);
//         // on the keydown event, call my function
//         // and pass it the keycode of the key
//         // that was pressed
//         // ex: if ENTER was pressed, e.which == 13
//         // functionToCall(e.which);
//       });
//     }
//   };
// })
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
      var audio = new Audio('/ping.mp3');
      audio.play();
      if((($scope.player1.score + $scope.player2.score) % 5) === 0 ) {
        var audio = new Audio('/switch.mp3');
        audio.play();
      }
    }

    if(event.keyCode === 86) {
      $scope.flash2 = true;
      $scope.player2.score += 1;
      if($scope.player2.score > 20) {
        $scope.player2.score = 0;
      }
      $scope.$apply();
      var audio = new Audio('/ping.mp3');
      audio.play();
      if((($scope.player1.score + $scope.player2.score) % 5) === 0 ) {
        var audio = new Audio('/switch.mp3');
        audio.play();
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
