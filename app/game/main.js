'use strict';

/**
 * @ngdoc function
 * @name gameApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gameApp
 */
angular.
module('gameApp')
.controller('MainCtrl', function ($timeout, $scope) {
  var $ctrl = this;
  this.init = init;
  this.update = update;

  this.game = {};
  init();


  function init (){
    $ctrl.game = {
      moves: 0,
      number: Math.round((Math.random()*100)+50),
      currentChange: 5,
      user1:{
        active: true,
        name: 'player 1'
      },
      user2:{
        active: false,
        name: 'cpu'
      },
      won: false
    };
  }

  function update() {
    $ctrl.game.user1.active = !$ctrl.game.user1.active;
    $ctrl.game.user2.active = !$ctrl.game.user2.active;
    $timeout(function () {
      $ctrl.game.moves++;
    }, 50);
  }

});
