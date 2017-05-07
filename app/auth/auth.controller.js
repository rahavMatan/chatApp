angular.module('chatApp')
.controller('authCtrl',function($scope, Auth, $state){
  var authCtrl = this;

  authCtrl.user = {
    email: '',
    password: ''
  };

  authCtrl.login=function(){
    Auth.$signInWithEmailAndPassword(authCtrl.user.email,authCtrl.user.password).then(function(auth){
      $state.go('home')
    }, function(err){
      authCtrl.error = err;
    })
  }

  authCtrl.register = function (){
    Auth.$createUserWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (user){
      $state.go('home');
    }, function (error){
      authCtrl.error = error;
    });
  };
})
