'use strict';

angular
.module('gameApp')
.directive('gameMainView', function($compile, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'game/gameMainView/gameMainView.tpl.html',
    scope: {
      game: '='
    },
    link: function (scope, elem) {
      scope.game.prevNumber = scope.game.number;
      scope.$watch('game.moves', function () {
        scope.game.prevNumber = scope.game.number;
        if (scope.game.moves > 0) {
          scope.game.number += scope.game.currentChange;
          updateNumber();
        }
      });

      function updateNumber () {
        elem.find('div').removeClass("active");
        if (timeout) {timeout();}
        elem.find('div').addClass("active");
        var timeout = $timeout(function () {
          elem.find('div').removeClass("active");
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
          animateWinning();
        } else {
          if (scope.game.user2.active && !scope.game.won) {
            doCpuMove();
          }
        }
      }

      function animateDivision() {
        elem.find('div').removeClass("division");
        elem.find('div').addClass("division");
        $timeout(function () {
          elem.find('div').removeClass("division");
        }, 1500);
      }

      function doCpuMove() {
        var buttonNumber = Math.ceil((Math.random() * 3) + 2);
        var button = $('.my-btn')[buttonNumber];
        $timeout(function () {
          button.classList.toggle('hovered');
        }, 1000);
        $timeout(function () {
          button.click();
          button.classList.toggle('activated');
          button.classList.toggle('hovered');
          $timeout(function () {
            button.classList.toggle('activated');
          }, 500);
        }, 1500);
      }

      function animateWinning () {
        $timeout(function () {
          scope.game.won = true;
        }, 500);
      }
    }
  }
});
