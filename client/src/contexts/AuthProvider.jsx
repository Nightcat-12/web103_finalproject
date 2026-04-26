import { useEffect, useState } from "react";
import AuthContext from "./AuthContext.js";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true)

  const createTraceId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `trace-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  
  const handleLogin = async () => {
    // Made async to await the popup result
    try {
      const result = await signInWithPopup(auth, provider); // Use signInWithPopup
      // The user object is in result.user
      const signedInUser = result.user;
      const traceId = createTraceId();
      // You can also get credentials if needed, e.g., result.credential.accessToken
      console.log(`[AuthTrace:${traceId}] Popup sign-in successful`, {
        uid: signedInUser?.uid,
        hasName: Boolean(signedInUser?.displayName),
        hasPhoto: Boolean(signedInUser?.photoURL),
      });
      
      const signInOnBackend = async () => {
        const payload = {
          uid: signedInUser.uid,
          name: signedInUser.displayName,
          profilePicture: signedInUser.photoURL,
        };

        console.log(`[AuthTrace:${traceId}] Posting /api/users`, {
          uid: payload.uid,
          hasName: Boolean(payload.name),
          hasPhoto: Boolean(payload.profilePicture),
        });
    
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-trace-id': traceId,
          },
          body: JSON.stringify(payload)
        }
    
        const results = await fetch('/api/users/', options)
        const data = await results.json()

        console.log(`[AuthTrace:${traceId}] /api/users response`, {
          status: results.status,
          ok: results.ok,
          newUser: data?.newUser,
          returnedUid: data?.user?.uid,
        });

        if (!results.ok) {
          throw new Error(`Backend sign-in failed with status ${results.status}`);
        }

        console.log("Is new user?: ", data.newUser)
        setIsNewUser(data.newUser)
      }

      await signInOnBackend()

      // The onAuthStateChanged listener will also fire and update your user state
    } catch (error) {
      console.error("Error during popup sign-in: ", error);
      if (error.code) console.error("Error Code:", error.code);
      if (error.message) console.error("Error Message:", error.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // This listener handles all auth state changes, including after a successful popup sign-in
      setUser(currentUser);
      setLoading(false);
      //console.log("onAuthStateChanged: ", currentUser);
    });

    return () => unsubscribe(); // Clean up the listener on unmount

  }, []);


  
  return (
    <AuthContext.Provider value={{handleLogin, handleLogout, user, loading, isNewUser}}>
        {children}
    </AuthContext.Provider>
  );
}
