'use strict';

angular
.module('gameApp')
.directive('gameMainView', function($timeout) {
  return {
    restrict: 'E',
    templateUrl: 'game/gameMainView/gameMainView.tpl.html',
    scope: {
      game: '='
    },
    link: function (scope, elem) {

      var div = elem.find('div');

      scope.$watch('game.moves', function () {
        scope.game.prevNumber = scope.game.number;
        if (scope.game.moves > 0) {
          scope.game.number += scope.game.currentChange;
          updateNumber();
        }
      });

      scope.$on('doCpuMove', function (e, move) {
        var buttonNumber = 4 + move; // opponents buttons are [3][4][5]
        var button = angular.element('.my-btn')[buttonNumber];
        button.classList.toggle('activated');
        $timeout(function () {
          button.classList.toggle('activated');
        }, 400);
      });

      function updateNumber () {
        div.removeClass("active");
        div.addClass("active");
        $timeout(function () {
          div.removeClass("active");
          $timeout(function () {
            checkModulo3();
          }, 200);
        }, 500);
      }

      function checkModulo3 () {
        if (scope.game.number !== 1 && scope.game.number % 3 === 0) {
          animateDivision();
          scope.game.prevNumber = scope.game.number;
          scope.game.number = scope.game.number / 3;
          updateNumber();
        } else if (scope.game.number === 1) {
          scope.game.winner = !scope.game.user1.active ? scope.game.user1.name : scope.game.user2.name;
          animateWinning();
        }
      }

      function animateDivision() {
        div.removeClass("division");
        div.addClass("division");
        $timeout(function () {
          div.removeClass("division");
        }, 1500);
      }

      function animateWinning () {
        $timeout(function () {
          scope.game.won = true;
        }, 200);
      }
    }
  };
});
