import { CardActionArea, IconButton, Typography } from "@mui/material";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardCover from '@mui/joy/CardCover'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";

export default function ShopCard({ shopItem }){

    const navigate = useNavigate();

    return (
    <Card variant='soft' 
        sx={{ 
                maxWidth: 345, 
                //cute idea but a little too much
                // backgroundImage: "url('/patternSopItems.svg')", 
                backgroundColor: "rgb(253, 246, 236)", 
                border:"0.5px solid rgb(145, 136, 123)",
                '&:hover': { 
                    border:"0.5px solid #74B8FC",
                    boxShadow: 2,
                    cursor: 'pointer', 
                    transition: 'background-color 0.1s ease' 
                    }
            }}>
        <CardActionArea onClick={() => navigate(`/shop/${shopItem.id}`)}>
            <CardMedia
                component="img"
                alt={shopItem.name}
                height="140"
                image= {shopItem.image}
                sx={{objectFit: 'cover', height: 200, width: '100%'}}
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

