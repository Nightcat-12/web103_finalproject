import { useState } from 'react'
import Box from '@mui/material/Box'
import './App.css'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton'

function App() {

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Stack direction="row" sx={{width: "100%", alignItems: "center", justifyContent: "center"}}>
            <Typography variant='h4' align='center'>Pawmodoro</Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Stack direction={'row'} spacing={10}>
        <Typography variant='h1'>Hello</Typography>
        <Typography variant='h1'>Hi</Typography>
        <Typography variant='h1'>Bye</Typography>
      </Stack>

      <IconButton aria-label='Shop'>
        <ShoppingCart/>
      </IconButton>

    </Box>
  )
}

export default App
