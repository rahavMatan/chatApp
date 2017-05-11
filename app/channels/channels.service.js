angular.module('chatApp')
.factory('Channels',function($firebaseArray){

  var channels = {
    connect: function(){
      var ref=firebase.database().ref('channels');
      var channels = $firebaseArray(ref);
      return channels;
    }
  }
  return channels;

})
