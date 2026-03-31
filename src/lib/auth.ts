import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserRole, UserStatus } from "../types";

// 🔐 Roles are now managed exclusively in Firestore (sales_users collection)

/**
 * Register new user
 */export const registerUser = async (
  email: string,
  pass: string,
  name: string,
  selectedRole: UserRole
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);

  const profile = {
    uid: cred.user.uid,
    email,
    displayName: name,
    role: selectedRole,
    status: UserStatus.PENDING, // All new users start as PENDING
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "sales_users", cred.user.uid), profile);
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
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const uid = cred.user.uid;

  const ref = doc(db, "sales_users", uid);
  const snap = await getDoc(ref);

  // 🔥 AUTO-HEAL: If profile is missing, create a PENDING one
  if (!snap.exists()) {
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
