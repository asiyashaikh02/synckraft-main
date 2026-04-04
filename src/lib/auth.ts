import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserRole, UserStatus } from "../types";

// 🔐 Roles are now managed exclusively in Firestore (`users` collection)

/**
 * Register new user
 */export const registerUser = async (
  email: string,
  pass: string,
  name: string,
  selectedRole: UserRole,
  companyName?: string,
  phoneNumber?: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);

  const profile = {
    uid: cred.user.uid,
    email,
    displayName: name,
    role: selectedRole,
    companyName: companyName || "",
    phoneNumber: phoneNumber || "",
    status: UserStatus.PENDING, // All new users start as PENDING
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", cred.user.uid), profile);
  return profile;
};

// export const registerUser = async (
//   email: string,
//   pass: string,
//   name: string,
//   role: UserRole
// ) => {
//   const cred = await createUserWithEmailAndPassword(auth, email, pass);

//   const isMasterAdmin = email === MASTER_ADMIN_EMAIL;

//   const profile = {
//     uid: cred.user.uid,
//     email,
//     displayName: name,
//     role: isMasterAdmin ? UserRole.MASTER_ADMIN : role,
//     status: isMasterAdmin ? UserStatus.ACTIVE : UserStatus.PENDING,
//     createdAt: Date.now(),
//   };

//   await setDoc(doc(db, "sales_users", cred.user.uid), profile);
//   return profile;
// };

/**
 * Login user
 * - Auto-creates Firestore profile if missing
 * - Blocks non-approved users
 */
export const loginUser = async (email: string, pass: string) => {
  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, email, pass);
  } catch (error: any) {
    console.error('Login failed:', error);
    try {
      // show a user-friendly alert in the browser during debugging
      // (UI should handle errors in production)
      // eslint-disable-next-line no-alert
      alert(error?.message || 'Login failed');
    } catch (e) {
      // ignore if alert is unavailable
    }
    throw error;
  }

  const uid = cred.user.uid;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  // 🔥 AUTO-HEAL: If profile is missing, create a PENDING one
  if (!snap.exists()) {
    console.error('User document not found for uid', uid);
    const profile = {
      uid,
      email,
      displayName: cred.user.displayName || "",
      role: UserRole.SALES_USER,
      status: UserStatus.PENDING,
      createdAt: Date.now(),
    };

    await setDoc(ref, profile);
    throw new Error("Account Pending Approval");
  }

  const data = snap.data();

  if (data.status !== UserStatus.ACTIVE) {
    throw new Error("Account Pending Approval");
  }

  return data;
};

/**
 * Logout
 */
export const logoutUser = async () => {
  await fbSignOut(auth);
};
