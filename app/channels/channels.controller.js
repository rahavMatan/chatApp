angular.module('chatApp')
.controller('channelsCtrl',function($state, Auth, Users, profile, channels){
  var channelsCtrl=this;
  channelsCtrl.users = Users.all;
  channelsCtrl.newChannel={
    name:''
  };
  channelsCtrl.createChannel = function(){
    channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref){
      $state.go('channels.messages', {channelId: ref.key});
    })
  }
  channelsCtrl.profile = profile;
  channelsCtrl.channels = channels;
  channelsCtrl.getDisplayName = Users.getDisplayName;
  channelsCtrl.getGravatar = Users.getGravatar;
  this.logout=function(){
    Auth.$signOut().then(function(){
      $state.go('home');
    })
  }
})
