import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";
import Button from "@mui/material/Button";

export default function SignInWithGoogleButton() {

    const {user, handleLogin, handleLogout} = useContext(AuthContext)

	return (
		<>
			{user ? (
				<Button onClick={handleLogout} variant="contained" color="secondary">
					Sign out
				</Button>
			) : (
				<Button onClick={handleLogin} variant="contained">
					Sign in with Google
				</Button>
			)}
		</>
	);
}
