'use strict';

angular
.module('gameApp')
.directive('userPanelButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'game/userPanel/userPanelButton/userPanelButton.tpl.html',
    scope: {
      text: '=',
      disabled: '=',
      clickBtn: '&'
    }
  };
});
