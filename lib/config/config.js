import { Accounts } from 'meteor/accounts-base';


// ================= Accounts & Forms SETTINGS ==================

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
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

// Accounts.ui.config({
//   passwordSignupFields: 'USERNAME_ONLY',
// });

// =========== DB METHODS =============
Options.set('forbidClientAccountCreation', false);

Options.set('defaultRoles', ['user', 'owner']);


ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}