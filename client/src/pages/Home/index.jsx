import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Testing from "../Testing";
import TasksDrawer from "./TasksDrawer";
import VirtualRoom from "./VirtualRoom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import CatSelect from "./CatSelect";

export default function Home() {

    const {user, isNewUser} = useContext(AuthContext)
    const [catDialogOpen, setCatDialogOpen] = useState(false)
    const [hasCat, setHasCat] = useState(false)

    useEffect(() => {
        const getCatInfo = async () => {
            const results = await fetch(`/api/cats/${user.uid}`)
            const data = await results.json()

            console.log("Data: ", data)
            setHasCat(data.length > 0)
            setCatDialogOpen(data.length == 0)
        }

        getCatInfo()
    }, [user, hasCat])

    return (
        <Box>
            {/* <Typography variant="h1">
                Home Page
            </Typography> */}
            {
                user && (
                    <CatSelect open={catDialogOpen} handleClose={() => setCatDialogOpen(false)}/>
                )
            }

            <VirtualRoom/>
        </Box>
    )
}