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

  $scope.$on('keypress', function(n, event) {
    console.log(event.keyCode);
    if(event.keyCode === 49) {
      $scope.player1.score += 1;
      if($scope.player1.score > 9) {
        $scope.player1.score = 0;
      }
      $scope.$apply();
    }

    if(event.keyCode === 86) {
      $scope.player2.score += 1;
      if($scope.player2.score > 9) {
        $scope.player2.score = 0;
      }
      $scope.$apply();
    }
  });

  $scope.player1 = {
    score: 0
  };
  $scope.player2 = {
    score: 0
  };
});
