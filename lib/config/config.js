// ================= atFORMS SETTINGS ==================

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,
    });
// =========== DB METHODS =============
Options.set('forbidClientAccountCreation', false);

Options.set('defaultRoles', ['role1', 'role2']);


ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
