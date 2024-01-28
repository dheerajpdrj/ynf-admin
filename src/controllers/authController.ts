// controllers/authController.ts
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseConfig";

export const LOGIN_ERRORS = {
  USER_NOT_FOUND: "auth/user-not-found",
  WRONG_PASSWORD: "auth/wrong-password",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = doc(firestore, "user", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists() && userSnapshot.data().role === "admin") {
      return userSnapshot.data();
    }
  } catch (error: any) {
    if (
      error.code === LOGIN_ERRORS.USER_NOT_FOUND ||
      error.code === LOGIN_ERRORS.WRONG_PASSWORD
    ) {
      throw LOGIN_ERRORS.INVALID_CREDENTIALS;
    } else {
      throw LOGIN_ERRORS.UNKNOWN_ERROR;
    }
  }
};

export const updateUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  profileImageUrl: string
) => {
  const userRef = doc(firestore, "user", userId);

  const updatedData = {
    first_name: firstName,
    last_name: lastName,
    profile_image: profileImageUrl,
  };

  await updateDoc(userRef, updatedData);
};

export const updateNewPassword = async (
  user: any,
  oldPassword: string,
  newPassword: string
) => {
  const credential = EmailAuthProvider.credential(user.email, oldPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
