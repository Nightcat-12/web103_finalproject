import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import './App.css'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { auth, provider } from './firebase.js'
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth' // Removed getRedirectResult, GoogleAuthProvider

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // This listener handles all auth state changes, including after a successful popup sign-in
      setUser(currentUser);
      setLoading(false);
      console.log("onAuthStateChanged: ", currentUser);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleLogin = async () => { // Made async to await the popup result
    try {
      const result = await signInWithPopup(auth, provider); // Use signInWithPopup
      // The user object is in result.user
      const signedInUser = result.user;
      // You can also get credentials if needed, e.g., result.credential.accessToken
      console.log("Popup sign-in successful! User:", signedInUser);
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

  if (loading) {
    return <Typography>Loading authentication...</Typography>;
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Stack direction="row" sx={{width: "100%", alignItems: "center", justifyContent: "center"}}>
            <Typography variant='h4' align='center'>Pawmodoro</Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Stack direction={'column'} spacing={2} sx={{p: 2}}>
        <Typography variant='h1'>Hello {user ? user.displayName || user.email : 'Guest'}</Typography>

        {user ? (
          <Button onClick={handleLogout} variant="contained" color="secondary">
            Sign out
          </Button>
        ) : (
          <Button onClick={handleLogin} variant="contained">
            Sign in with Google
          </Button>
        )}
      </Stack>

      <IconButton aria-label='Shop'>
        <ShoppingCart/>
      </IconButton>
    </Box>
  );
}

export default App;
