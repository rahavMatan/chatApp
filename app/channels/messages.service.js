angular.module('chatApp')
.factory('Messages', function($firebaseArray){
  var chanMsgRef = firebase.database().ref('channelMessages');
  var userMsgRef = firebase.database().ref('userMessages');

  return {
    forChannel: function(chanId){
      return $firebaseArray(chanMsgRef.child(chanId));
    },
    forUsers: function(uid1, uid2){
      var path = uid1>uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;
      return $firebaseArray(userMsgRef.child(path));
    }

  }
})
