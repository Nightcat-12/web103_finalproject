import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import GoogleIcon from '@mui/icons-material/Google';
import Stack from "@mui/material/Stack";

export default function SignInWithGoogleButton() {
	const { user, handleLogin, handleLogout } = useContext(AuthContext);

	return (
		<>
			{user ? (
				<Button onClick={handleLogout} variant="contained" color="secondary">
					Sign out
				</Button>
			) : (
				<Button onClick={handleLogin} variant="contained">
					<Stack direction="row" spacing={1}>
						<GoogleIcon/>
						<Typography>
							Sign in with Google
						</Typography>
					</Stack>
				</Button>
			)}
		</>
	);
}
