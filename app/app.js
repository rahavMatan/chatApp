angular.module('chatApp',['ui.router','firebase','angular-md5'])
.run(function($rootScope, $state, $transitions, $trace){
  //$trace.enable('TRANSITION');
  // $state.defaultErrorHandler(function(error) {
  //   console.log('default error');
  // });

  $transitions.onBefore({}, function(trans) {
      var Auth = trans.injector().get('Auth');
      if(trans.$to().name == 'home'){
        console.log('going home');
        Auth.$requireSignIn().then(function(auth){
          console.log('redirecting to channels');
          return trans.router.stateService.target('channels');
        }).catch(function(err){
          return false;
        })
      }
  });
  $transitions.onError({}, function(trans){
    //console.log(trans.error());
  })
})
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'home/home.html'
  })
  .state('channels',{
    url:'/channels',
    controller:'channelsCtrl as channelsCtrl',
    templateUrl:'channels/channelsIndex.html',
    redirectTo:function(trans){
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().then(function(auth){
        var Users = trans.injector().get('Users');
        return Users.connect().$loaded().then(function(usersArray){
          return Users.getProfile(auth.uid).$loaded().then(function(profile){
            if(!profile.displayName){
              return 'profile';
            }
          })
        })
      }).catch(function(er){
        return 'home';
      })
    },
    resolve:{
      channels: function(Channels){
        return Channels.connect().$loaded();
      },
      profile:function($state,Auth,Users){
        return Users.getProfile(Auth.$getAuth().uid).$loaded().then(function(profile){
          return profile;
        });
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
        return Users.connect().$loaded().then(function(usersArray){
          return 'chatting with @'+Users.getDisplayName($stateParams.uid);
        })
      }
    }
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
  .state('login', {
    url: '/login',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/login.html',
    redirectTo:function(trans){
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().then(function(auth){
        return 'home';
      }, function(error){

      });
    }
  })
  .state('register', {
    url: '/register',
    controller: 'authCtrl as authCtrl',
    templateUrl: 'auth/register.html',
    redirectTo:function(trans){
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().then(function(auth){
        return 'home';
      }).catch(function(err){

      });
    },
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'users/profile.html',
    controller:'profileCtrl as profileCtrl',
    redirectTo:function(trans){
      var Auth = trans.injector().get('Auth');
      return Auth.$requireSignIn().catch(function(){
        return 'home';
      });
    },
    resolve: {
      profile: function(Users, Auth){
        return Auth.$requireSignIn().then(function(auth){
          return Users.connect().$loaded(function(usersArray){
            return Users.getProfile(auth.uid).$loaded();
          })
        });
      }
    }
  })
  .state('channels.create',{
    url:'/create',
    templateUrl:'channels/create.html',
    controller:'channelsCtrl as channelsCtrl'
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
