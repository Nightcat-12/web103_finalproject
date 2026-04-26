import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Box from "@mui/material/Box";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { Toolbar } from "@mui/material";

export default function Layout() {

    useAuthRedirect('/splash')

    return (
        <Box>
            <NavBar/>
            <Box sx={{ height: 75 }} />
            <Box>
                <Outlet/>
            </Box>
        </Box>
    )
}