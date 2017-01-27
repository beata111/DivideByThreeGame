'use strict';

/**
 * @ngdoc function
 * @name gameApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gameApp
 */
angular
.module('gameApp')
.controller('GameCtrl', function ($scope, socketService, $timeout, $interval) {

  var $ctrl = this;
  this.userName = '';

  this.init = init;
  this.initUser = initUser;
  this.startNewGame = startNewGame;
  this.processMove = processMove;

  function init (initialNumber){
    $ctrl.game = {
      userReady: false,
      gameReady: false,
      cpuDisconnected: false,
      moves: 0,
      number: initialNumber || 0,
      currentChange: 0,
      user1: {
        active: true,
        name: 'player 1'
      },
      user2: {
        active: false,
        name: 'player 2'
      },
      won: false,
      winner: ''
    };
  }

  init();

  function initUser(e) {
    var userName = $ctrl.userName.trim();
    if ((!e || e.keyCode === 13) && userName) {
      $ctrl.game.userReady = true;
      $ctrl.game.user1.name = userName;
      socketService.sendUserName(userName);
    }
  }

  $scope.$on('cpuConnected', function (e, data) {
    $ctrl.game.number = data.number;
    setUser1Active(!!data.priority);
    $ctrl.game.gameReady = true;
    $ctrl.game.cpuDisconnected = false;
    getOpponentName();
  });

  $scope.$on('cpuName', function (e, name) {
    $ctrl.game.user2.name = name;
  });

  $scope.$on('newInitialNumber', function (e, number) {
    console.log(number);
    reinit(number);
  });

  $scope.$on('cpuMove', function (e, move) {
    console.log(move);
    setUser1Active(true);
    $ctrl.game.currentChange = move;
    $timeout(function () {
      $ctrl.game.moves++;
      $scope.$broadcast('doCpuMove', move);
    }, 50);
  });

  $scope.$on('cpuDisconnected', function () {
    $ctrl.game.gameReady = false;
    $ctrl.game.cpuDisconnected = true;
  });

  function getOpponentName () {
    var interval = $interval(function () {
      if ($ctrl.game.user2.name && $ctrl.game.user2.name !== 'player 2') {
        $interval.cancel(interval);
      }
      socketService.getCpuName();
    }, 1000);
  }

  function processMove() {
    setUser1Active(false);
    $timeout(function () {
      $ctrl.game.moves++;
      socketService.sendMove($ctrl.game.currentChange);
    }, 50);
  }

  function startNewGame () {
    if ($ctrl.game.winner === $ctrl.game.user1.name) {
      var initialNumber = Math.round((Math.random() * 100) + 50);
      socketService.sendNewInitialNumber(initialNumber);
      reinit(initialNumber);
      setUser1Active(true);
    } else {
      $ctrl.game.gameReady = false;
      $ctrl.game.won = false;
    }
  }

  function reinit (number) {
    var opponentName = $ctrl.game.user2.name;
    init();
    $ctrl.game.number = number;
    $ctrl.game.userReady = true;
    $ctrl.game.gameReady = true;
    $ctrl.game.user1.name = $ctrl.userName;
    $ctrl.game.user2.name = opponentName;
    setUser1Active(false);
    $timeout(function () {
      $scope.$apply();
    }, 100);
  }

  function setUser1Active (bool) {
    $ctrl.game.user1.active = bool;
    $ctrl.game.user2.active = !bool;
  }

});
