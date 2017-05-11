angular.module('chatApp')
.controller('profileCtrl', function($state, md5, auth, profile){
  var profileCtrl = this;
  profileCtrl.profile = profile;
  profileCtrl.updateProfile = function(){
    profileCtrl.profile.emailHash = md5.createHash(auth.email);
    profileCtrl.profile.gravatar = 'https://www.gravatar.com/avatar/' + profileCtrl.profile.emailHash+'?d=wavatar';
    profileCtrl.profile.$save().then(function(){
      $state.go('channels');
    });
  };
})
