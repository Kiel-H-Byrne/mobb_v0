import { Accounts } from 'meteor/accounts-base';


// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/config.js}


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
    sendVerificationEmail: true,
    lowercaseUsername: true,
    focusFirstInput: true,
    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 2000,
    // Privacy Policy and Terms of Use
    privacyUrl: 'terms#PrivacyPolicy',
    termsUrl: 'terms',
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
          "meteor-developer": "fa fa-rocket"
      },
      title: {
        forgotPwd: "Recover Your Password",
        changePwd: "Password Title",
        enrollAccount: "Enroll",
        resetPwd: "Reset Your Password",
        signIn: "Sign In",
        signUp: "Join KIBU",
        verifyEmail: "Verify Your Email",
      },
    },

});


// ===================================== ORION SETTINGS =======================================
// Options.set('forbidClientAccountCreation', false);

Options.set('defaultRoles', ['user']);

ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
};