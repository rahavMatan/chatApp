angular.module('chatApp')
.factory('Channels',function($firebaseArray){
  var ref=firebase.database().ref('channels');
  var channels = $firebaseArray(ref);

  return channels;
})
