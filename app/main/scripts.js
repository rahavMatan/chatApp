angular.module('chatApp',['ui.router','firebase','angular-md5'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'home/home.html'
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

  $urlRouterProvider.otherwise('/');

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
.controller('profileCtrl', function($state, md5, auth, profile){
  
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
    all: users
  };

  return Users;
})
