import { CardActionArea, IconButton, Typography } from "@mui/material";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";

export default function ShopCard({ shopItem }){

    const navigate = useNavigate();

    return (
    <Card variant='soft' 
        sx={{ 
                maxWidth: 345, 
                border: "2px solid #e0e0e0",
                borderRadius: 5,
                backgroundColor: "white",
                transition: "all 0.4s ease",
                '&:hover': { 
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    cursor: 'pointer', 
                    boxShadow: 2,
                    '& .MuiTypography-root': {
                        color: 'white',
                    },
                    '& .MuiCardContent-root .MuiTypography-root': {
                        color: 'white',
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                    }
                }
            }}>
        <CardActionArea onClick={() => navigate(`/shop/${shopItem.id}`)}>
            <CardMedia
                component="img"
                alt={shopItem.name}
                height="140"
                image= {shopItem.image}
                sx={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    height: 230,
                    width: '100%',
                    p: 1,
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                }}
            />
            <CardContent>
                <Typography align="left" gutterBottom variant="h5" component="div">
                    {shopItem.name}
                </Typography>
                <Typography align="left" variant="body2" sx={{ color: 'text.secondary' }}>
                    {shopItem.category}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                        ${shopItem.price}
                    </Typography>
                    {/* <IconButton aria-label="purchase item" size="small"> */}
                        <ShoppingCartIcon />
                    {/* </IconButton> */}
                </Box>
            </CardContent>            
        </CardActionArea>

    </Card>
    )
}

