'use strict';

angular
.module('gameApp')
.service('socketService', function($rootScope) {

    var service = this;
    var socket = io('http://localhost');

    this.socketConnected = false;
    this.cpuConnected = false;
    this.socketId = null;

    this.sendUserName = function(name) {
      socket.emit('setUserName', name);
    };

    this.getCpuName = function() {
      socket.emit('getCpuName');
    };

    this.sendNewInitialNumber = function(number) {
      socket.emit('newInitialNumber', number);
    };

    this.sendMove = function(move) {
      socket.emit('move', move);
    };

    socket.on('connect', function () {
      service.socketId = socket.id;
      service.socketConnected = true;
      socket.on('cpuConnected', cpuConnected);
      socket.on('cpuName', cpuName);
      socket.on('newInitialNumber', newInitialNumber);
      socket.on('cpuMove', cpuMove);
      socket.on('cpuDisconnected', cpuDisconnected);
      $rootScope.$digest();
    });

    function cpuConnected(data) {
      if (data.id === service.socketId) {
        console.log('cpu connected');
        service.cpuConnected = true;
        $rootScope.$broadcast('cpuConnected', data);
        $rootScope.$digest();
      }
    }

    function cpuName (data) {
      if (data.id === service.socketId) {
        $rootScope.$broadcast('cpuName', data.name);
      }
    }

    function newInitialNumber (data) {
      if (data.id === service.socketId) {
        $rootScope.$broadcast('newInitialNumber', data.number);
      }
    }

    function cpuMove (data) {
      if (data.id === service.socketId) {
        $rootScope.$broadcast('cpuMove', data.move);
      }
    }

    function cpuDisconnected(data) {
      if (data.id === service.socketId) {
        console.log('cpu disconnected');
        service.cpuConnected = false;
        $rootScope.$broadcast('cpuDisconnected');
        socket.removeListener('cpuName');
        socket.removeListener('newInitialNumber');
        socket.removeListener('cpuMove');
        socket.removeListener('cpuDisconnected');
        $rootScope.$digest();
      }
    }
});
