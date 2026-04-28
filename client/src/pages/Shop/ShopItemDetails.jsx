import { Box, Stack, Typography, Button, IconButton, Snackbar } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { green } from "@mui/material/colors"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from "@mui/material/CircularProgress"
import BuyButton from '../../components/BuyButton'
import PawCoin from '../../components/PawCoin'

export default function ShopItemDetails() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [item, setItem] = useState(null)
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' })
    const [coins, setCoins] = useState(location?.state?.coins ?? 0)

    useEffect(() => {
        const onCoinsUpdated = (e) => {
            if (e?.detail?.coins != null) setCoins(Number(e.detail.coins))
        }
        window.addEventListener('userCoinsUpdated', onCoinsUpdated)
        return () => window.removeEventListener('userCoinsUpdated', onCoinsUpdated)
    }, [])

    useEffect(() => {
        const fetchShopItemDetails = async () => {
            const res = await fetch(`/api/shop_items/${id}`)
            const data = await res.json()
            setItem(data)
        }
        fetchShopItemDetails()
    }, [id])

    if (!item) return (
        <Box sx={{ display: "flex", justifyContent: 'center', pt: 25 }}>
            <CircularProgress size={100}/>          
        </Box>

    )

    return (
    <Box sx={{ pt: 10, pb: 5, px: { xs: 2, md: 8 }, maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ pb: 2}}>
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2, color: "#312613" }}>
                <ArrowBackIcon />
            </IconButton>                
        </Box>        
        <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={{ xs: -14, md: 6}} 
            alignItems={{ xs: 'center', md: 'flex-start' }}
        >

            {/* Image with border overlay */}
            <Box sx={{ 
                position: 'relative',
                width: { xs: '80%', sm: '60%', md: '60%' },
            }}>
                {/* actual item image */}
                <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ 
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                />
                {/* border png layered on top */}
                <Box
                    component="img"
                    src="/itemFrame3.png"
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',  
                        pointerEvents: 'none' 
                    }}
                />
            </Box>

            {/* Info + Buy button */}
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ flex: 1, pt: 15 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: "#312613" }}>
                    {item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" >
                    Category: {item.category}
                </Typography>
                <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                    <PawCoin />
                    <Typography variant="body1">{coins ?? 0}</Typography>
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#3d8ddd" }}>
                    ${item.price}
                </Typography>
                <BuyButton
                    shopItemId={item.id}
                    size="large"
                    sx={{ mt: 2, px: 4, py: 1.5 }}
                    onSuccess={() => setFeedback({ open: true, message: 'Added to inventory', severity: 'success' })}
                    onError={(err) => setFeedback({ open: true, message: err?.message || 'Failed to add', severity: 'error' })}
                />
                <Snackbar
                    open={feedback.open}
                    autoHideDuration={3000}
                    onClose={() => setFeedback((s) => ({ ...s, open: false }))}
                    message={feedback.message}
                />
            </Stack>

        </Stack>
    </Box>
    )
}