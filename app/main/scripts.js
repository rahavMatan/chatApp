angular.module('chatApp',['ui.router','firebase','angular-md5'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
    resolve:{
      requireNoAuth:function($state,Auth){
        return Auth.$requireSignIn().then(function(auth){
          $state.go('channels');
        }, function(err){
            return;
        })
      }
    }
  })
  .state('login', {
    url: '/login',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/login.html',
    resolve: {
      requireNoAuth: function($state, Auth){
        return Auth.$requireSignIn().then(function(auth){
          $state.go('home');
        }, function(error){
          return;
        });
      }
   }
  })
  .state('register', {
    url: '/register',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/register.html',
    resolve: {
      requireNoAuth: function($state, Auth){
        return Auth.$requireSignIn().then(function(auth){
          $state.go('home');
        }, function(error){
          return;
        });
      }
   }
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'users/profile.html',
    controller:'profileCtrl as profileCtrl',
    resolve: {
      auth: function($state, Users, Auth){
        return Auth.$requireSignIn().catch(function(){
          $state.go('home');
        });
      },
      profile: function(Users, Auth){
        return Auth.$requireSignIn().then(function(auth){
          return Users.getProfile(auth.uid).$loaded();
        });
      }
    }
  })
  .state('channels',{
    url:'/channels',
    controller:'channelsCtrl as channelsCtrl',
    templateUrl:'channels/channelsIndex.html',
    resolve:{
      channels: function(Channels){
        return Channels.$loaded();
      },
      profile:function($state,Auth,Users){
        return Auth.$requireSignIn().then(function(auth){
          return Users.getProfile(auth.uid).$loaded().then(function(profile){
            if(profile.displayName){
              return profile
            } else {
              $state.go('profile');
            }
          })
        }).catch(function(error){
          $state.go('home')
        })
      }
    }
  })
  .state('channels.create',{
    url:'/create',
    templateUrl:'channels/create.html',
    controller:'channelsCtrl as channelsCtrl'
  })
  .state('channels.messages',{
    url:'/{channelId}/messages',
    templateUrl:'channels/messages.html',
    controller:'messagesCtrl as messagesCtrl',
    resolve:{
      messages:function($stateParams, Messages){
        return Messages.forChannel($stateParams.channelId).$loaded();
      },
      channelName: function($stateParams, channels){         // channels is inherited from 'channels' state. it's not the Channels service.
        return '#'+channels.$getRecord($stateParams.channelId).name;
      }
    }
  })
  .state('channels.direct', {
    url:'/{uid}/messages/direct',
    templateUrl:'channels/messages.html',
    controller:'messagesCtrl as messagesCtrl',
    resolve: {
      messages: function($stateParams, Messages, profile){
        return Messages.forUsers($stateParams.uid, profile.$id).$loaded()
      },
      channelName: function($stateParams, Users){
        return Users.all.$loaded().then(function(){
          return '@'+Users.getDisplayName($stateParams.uid);
        })
      }
    }
  })


  $urlRouterProvider.otherwise('/home');

  var config = {
    apiKey: "AIzaSyCyJCB-trnwWZ8KNB1fZIMj3tFwFyZzdoA",
    authDomain: "chatapp-7bcfc.firebaseapp.com",
    databaseURL: "https://chatapp-7bcfc.firebaseio.com",
    projectId: "chatapp-7bcfc",
    storageBucket: "chatapp-7bcfc.appspot.com",
    messagingSenderId: "905240895252"
 };
 firebase.initializeApp(config);
})

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

angular.module('chatApp')
.factory('Auth',function($firebaseAuth){
  var auth = $firebaseAuth();

  return auth;
})

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

angular.module('chatApp')
.factory('Channels',function($firebaseArray){
  var ref=firebase.database().ref('channels');
  var channels = $firebaseArray(ref);

  return channels;
})

angular.module('chatApp')
.controller("messagesCtrl", function(profile,channelName,messages){
  var messagesCtrl = this;
  messagesCtrl.messages = messages;
  messagesCtrl.channelName = channelName;
  messagesCtrl.message = '';

  this.sendMessage=function(){
    if(messagesCtrl.message.length > 0){
      messagesCtrl.messages.$add({
        uid:profile.$id,
        body:messagesCtrl.message,
        timestamp:firebase.database.ServerValue.TIMESTAMP
      }).then(function(){
        messagesCtrl.message='';
      })
    }
  }

})

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

angular.module('chatApp')
.controller('profileCtrl', function($state, md5, auth, profile){
  var profileCtrl = this;
  profileCtrl.profile = profile;
  profileCtrl.updateProfile = function(){
    profileCtrl.profile.emailHash = md5.createHash(auth.email);    
    profileCtrl.profile.$save().then(function(){
      $state.go('channels');
    });
  };
})

angular.module('chatApp')
.factory('Users',function($firebaseArray, $firebaseObject){
  var usersRef = firebase.database().ref('users');
  var users = $firebaseArray(usersRef);
  var Users = {
    getProfile: function(uid){
      return $firebaseObject(usersRef.child(uid));
    },
    getDisplayName: function(uid){
      return users.$getRecord(uid).displayName;
    },
    all: users,
    getGravatar: function(uid){
      return 'https://www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash+'?d=wavatar';
    },
  };

  return Users;
})
