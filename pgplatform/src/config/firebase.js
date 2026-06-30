import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey:       import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:   import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:    import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:        import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    });
  }
  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  try {
    const verifier = setupRecaptcha();
    const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
    window.confirmationResult = confirmation;
    return { success: true };
  } catch (err) {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    return { success: false, error: err.message };
  }
};

export const verifyOTP = async (otp) => {
  try {
    if (!window.confirmationResult) {
      return { success: false, error: 'No OTP session — request OTP again' };
    }
    const result = await window.confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    return { success: true, idToken, user: result.user };
  } catch {
    return { success: false, error: 'Invalid OTP — please try again' };
  }
};
