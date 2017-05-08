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
