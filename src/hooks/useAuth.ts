
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "../types";

/**
 * Hook to manage and provide current authentication state and user profile.
 */
export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    return onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Fetch profile data from Firestore on successful auth
        const unsub = onSnapshot(
          doc(db, "users", fbUser.uid),
          (snap) => {
            if (!snap.exists()) {
              console.error('User document not found for uid', fbUser.uid);
              try {
                // eslint-disable-next-line no-alert
                alert('User profile not found');
              } catch (e) {}
              setUser(null);
              setLoading(false);
              return;
            }
            setUser(snap.data() as UserProfile);
            setLoading(false);
          },
          (err) => {
            // Map common offline message to a clearer message during debugging
            const msg = err?.message || String(err);
            if (msg.toLowerCase().includes('client is offline')) {
              console.error('Firestore snapshot error (useAuth): User profile not found (client offline)');
              try { alert('User profile not found'); } catch (e) {}
            } else {
              console.error('Firestore snapshot error (useAuth):', err);
              try { alert('Firestore error: ' + msg); } catch (e) {}
            }
            setLoading(false);
          }
        );
        return unsub;
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  return { user, loading };
}
