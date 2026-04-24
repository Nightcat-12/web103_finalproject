import {
    Button,
    Stack,
    Paper,
    Grid,
    Typography,
    Box,
    Container,
    CircularProgress
} from "@mui/material";

import ShopCard from "../../components/ShopCard.jsx";
import { useState, useEffect } from "react";

export default function Shop() {

    const [shopItems, setShopItems] = useState([])
    const [filteredShopItems, setFilteredShopItems] = useState([])
    const [activeFilter, setActiveFilter] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchShopItems = async() => {
            const res = await fetch('/api/shop_items')
            const data = await res.json()
            setShopItems(data)
            setLoading(false)
        }

        fetchShopItems()
    }, [])

    var lamps = shopItems.filter(e => e.category == 'Lamps')
    var desks = shopItems.filter(e => e.category == 'Desks')
    var plants = shopItems.filter(e => e.category == 'Plants')

    function filterByLamps() {
        setFilteredShopItems(lamps)
    }

    function filterByDesks() {
        setFilteredShopItems(desks)
    }

    function filterByPlants() {
        setFilteredShopItems(plants)
    }
    
    function handleFilterClick(category) {
        if (activeFilter === category) {
            setActiveFilter(null)
        }
        else {
            setActiveFilter(category)
        }
    }

    const displayShopItems = activeFilter ? shopItems.filter(e => e.category === activeFilter) : shopItems

    return (
        <Box sx={{ pt: 4, pb: 10, px: { xs: 2, sm: 3, md: 4 } }}>
           {/* title of the page + filter buttons based on categories */}
           <Box sx={{ pb: 5 }}>
                <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} 
                    sx={{ 
                        justifyContent: { xs: 'flex-start', md: 'space-between'}, 
                        alignItems: {xs: 'flex-start', md: 'center'},
                    }}
                >
                    <Typography variant="h2" sx={{ paddingLeft: 4 }}>
                       ⋆˚꩜｡ PawMart ⋆˚꩜｡
                    </Typography>
                    <Box sx={{ 
                        alignContent:'center', 
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        gap: 1,
                        p: 2,
                        m: 2,
                        }}
                    >
                        <Button
                            variant= {activeFilter === 'Lamps' ? 'contained': 'outlined'} 
                            onClick={() => handleFilterClick('Lamps')}
                        >Lamps</Button>
                        <Button
                            variant= {activeFilter === 'Desks' ? 'contained': 'outlined'} 
                            onClick={() => handleFilterClick('Desks')}
                        >Desks</Button>
                        <Button 
                            variant= {activeFilter === 'Plants' ? 'contained': 'outlined'} 
                            onClick={() => handleFilterClick('Plants')}
                        >Plants</Button>                        
                    </Box>

                </Stack>               
            </Box>
            {/* displaying data on grid format, all shop items on display unless a filter button is clicked */}
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: 'center', pt: 25 }}>
                        <CircularProgress size={100}/>
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        {displayShopItems.map(shopItem => (
                            <Grid key={shopItem.id} size={{ xs: 12, sm: 6, md:3, lg: 2}}>
                                <ShopCard shopItem={shopItem}/>
                            </Grid>
                        ))}
                    </Grid>                      
                )}
            </Box>
        </Box>
    )
}