import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FactoryIcon from '@mui/icons-material/Factory';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RouteIcon from '@mui/icons-material/Route';
import InventoryIcon from '@mui/icons-material/Inventory';

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Malzeme Bilgileri',
      icon: <InventoryIcon />,
      path: '/material/head',
      description: 'Malzeme bilgilerini görüntüle ve yönet'
    },
    {
      title: 'Maliyet Merkezleri',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/costCenter/head',
      description: 'Maliyet merkezlerini görüntüle ve yönet'
    },
    {
      title: 'İş Merkezleri',
      icon: <FactoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/work-center',
      description: 'İş merkezlerini görüntüle ve yönet'
    },
    {
      title: 'Ürün Ağaçları',
      icon: <AccountTreeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/bom/head',
      description: 'Ürün ağaçlarını görüntüle ve yönet'
    },
    {
      title: 'Rota',
      icon: <RouteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/route-type',
      description: 'Rota bilgilerini görüntüle ve yönet'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Ana Sayfa
      </Typography>
      
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}
            >
              <CardActionArea 
                onClick={() => navigate(card.path)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 2,
                  p: 3
                }}>
                  {card.icon}
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 