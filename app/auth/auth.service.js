angular.module('chatApp')
.factory('Auth',function($firebaseAuth){
  var auth = $firebaseAuth();

   return auth;
})
