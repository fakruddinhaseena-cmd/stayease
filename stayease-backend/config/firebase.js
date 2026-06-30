// Firebase is not used in this deployment (phone OTP disabled).
// This is a stub so authController.js doesn't crash on import.
const verifyFirebaseToken = async (idToken) => {
  return { success: false, error: 'Firebase auth is disabled' };
};

module.exports = { verifyFirebaseToken };