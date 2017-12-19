// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/config.js}

const myLogoutFunc = function () {
  Router.go('/');
};

const mySubmitFunc = function(error, state) {
    if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      $('#loginModal').modal('close');
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      $('#loginModal').modal('close');
      // ...
    }
  }
};


// ===================== METEOR ACCOUNTS SETTINGS ======================

// AccountsTemplates.configure({
//     // Behavior
//     confirmPassword: true,
//     enablePasswordChange: true,
//     forbidClientAccountCreation: false,
//     overrideLoginErrors: true,
//     sendVerificationEmail: false,
//     lowercaseUsername: false,
//     focusFirstInput: true,

//     // Appearance
//     showAddRemoveServices: false,
//     showForgotPasswordLink: false,
//     showLabels: true,
//     showPlaceholders: true,
//     showResendVerificationEmailLink: false,

//     // Client-side Validation
//     continuousValidation: false,
//     negativeFeedback: false,
//     negativeValidation: true,
//     positiveValidation: true,
//     positiveFeedback: true,
//     showValidating: true,

//     // Privacy Policy and Terms of Use
//     privacyUrl: 'privacy',
//     termsUrl: 'terms-of-use',

//     // Redirects
//     homeRoutePath: '/home',
//     redirectTimeout: 4000,

//     // Hooks
//     onLogoutHook: myLogoutFunc,
//     onSubmitHook: mySubmitFunc,
//     preSignUpHook: myPreSubmitFunc,
//     postSignUpHook: myPostSubmitFunc,

    // // Texts
    // texts: {
    //   button: {
    //       signUp: "Register Now!"
    //   },
    //   socialSignUp: "Register",
    //   socialIcons: {
    //       "meteor-developer": "fa fa-rocket"
    //   },
    //   title: {
    //       forgotPwd: "Recover Your Password"
    //   },
    // },
    
    //     reCaptcha: {
    //     siteKey: YOUR SITE KEY,
    //     theme: "light",
    //     data_type: "image"
    // },
    // showReCaptcha: true
// });

AccountsTemplates.configure({
    // Layout
    defaultLayout: 'AppLayout',
    // Behavior
    confirmPassword: false,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: false,
    lowercaseUsername: true,
    focusFirstInput: true,
    showForgotPasswordLink: true,
    showValidating: true,
    negativeValidation: true,
    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 2000,
    // Privacy Policy and Terms of Use
    privacyUrl: 'terms#PrivacyPolicy',
    termsUrl: 'terms',
    // Hooks
    onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSubmitFunc,
    // postSignUpHook: myPostSubmitFunc,
    // Texts
    texts: {
      button: {
          signUp: "Join",
          changePwd: "Reset",
          enrollAccount: "Enroll",
          forgotPwd: "Retrieve",
          resetPwd: "Reset",
          signIn: "Sign In",
      },
      navSignIn: "Sign In",
      socialSignUp: "Register",
      socialIcons: {
          // "meteor-developer": "fa fa-rocket"
      },
      title: {
        forgotPwd: "Recover Your MOBB Password",
        changePwd: "Change Your MOBB Password",
        enrollAccount: "MOBB: Enroll",
        resetPwd: "Reset Your Password",
        signIn: "MOBB: Log In",
        signUp: "MOBB: Join",
        verifyEmail: "Verify Your Email",
      },
    },

});




// ===================================== ROUTER OPTIONS =======================================

Router.configure({
    layoutTemplate: 'AppLayout',
    notFoundTemplate: '404page',
    loadingTemplate: 'loadingHourglass',
    yieldRegions: {
        'nav': {to: 'nav'}
    }
});

// Router.plugin('dataNotFound', {
//   notFoundTemplate: '404page'
// });




// Router.route('/404', {
//     name: '404',
//     layoutTemplate: 'AppLayout',
//     yieldRegions: {
//       'page_404': {to: 'content'},
//       'nav': {to: 'nav'}
//     }
// });

// Meteor.startup(function () {
//   if (Meteor.isServer) {
//     // Return a 404 HTTP response if the route doesn't exist                                                                                                                
//     WebApp.connectHandlers.use("/", function(req, res, next) {
//       if( req.url == "/" || _.contains(_.keys(Router.routes), req.url.substr(1)) ){
//         next(); // Route exists, let iron router render it                                                                                                              
//       }
//       else {
//         res.writeHead(404);
//         res.end('Not Found...',function () {
//           console.log('Not Found.')
//         });
//       }
//     });  
//   }
// });

// ===================================== ORION OPTIONS =======================================
//change layout of Listings admin forms
ReactiveTemplates.set('collections.listings.update', 'orionEditForm');



// Client and Server
Comments.config({
  allowAnonymous: () => true,
  anonymousSalt: 'myRandomSalt',
  rating: 'stars',
  publishUserFields: { 
    username: 1
  }
});

if ( Meteor.isClient ) {
  // On the Client
  Comments.ui.config({
     template: 'semantic-ui',
     limit: 5,
     // loadMoreCount: 5,
     markdown: true,
  });
}


if ( Meteor.isServer ) {
  // On the server
  // Comments.config({
  //   sweetCaptcha: () => ({
  //     appId: '...',
  //     appKey: '...',
  //     appSecret: '...',
  //   }),
  // });
}