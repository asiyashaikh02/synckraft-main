
import { useState, useEffect } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "../types";

/**
 * Hook to manage and provide current authentication state and user profile.
 */
export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('synckraft_user_profile');
    return cached ? JSON.parse(cached) : null;
  });
  // If we have a cached user, we can assume not loading to prevent initial UI flicker
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // Subscribe to auth state and token changes (handles silent refreshes)
    return onIdTokenChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch profile data from Firestore on successful auth
        const unsub = onSnapshot(
          doc(db, "users", fbUser.uid),
          (snap) => {
            if (!snap.exists()) {
              console.error('User document not found for uid', fbUser.uid);
              setUser(null);
              localStorage.removeItem('synckraft_user_profile');
              setLoading(false);
              // Self-healing: if the user document is deleted or missing, log out the Firebase session
              signOut(auth).catch(console.error);
              return;
            }
            const profileData = snap.data() as UserProfile;
            if (JSON.stringify(user) !== JSON.stringify(profileData)) {
                setUser(profileData);
                localStorage.setItem('synckraft_user_profile', JSON.stringify(profileData));
            }
            setLoading(false);
          },
          (err) => {
            // Map common offline message to a clearer message during debugging
            const msg = err?.message || String(err);
            if (msg.toLowerCase().includes('client is offline')) {
              console.error('Firestore snapshot error (useAuth): User profile not found (client offline)');
            } else {
              console.error('Firestore snapshot error (useAuth):', err);
            }
            setLoading(false);
          }
        );
        return unsub;
      } else {
        setUser(null);
        localStorage.removeItem('synckraft_user_profile');
        setLoading(false);
      }
    });
  }, []);

  return { user, loading };
}
