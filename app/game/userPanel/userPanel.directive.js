'use strict';

angular
.module('gameApp')
.directive('userPanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'game/userPanel/userPanel.tpl.html',
    scope: {
      click: '&',
      currentNumber: '=',
      user: '='
    },
    controller: function ($scope) {
      $scope.list = ['+1', '0', '-1'];
      $scope.update = function (number) {
        $scope.currentNumber = Number(number);
        $scope.click();
      };
    }
  };
});

