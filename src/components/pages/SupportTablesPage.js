import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  CardActionArea,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RouteIcon from '@mui/icons-material/Route';
import FactoryIcon from '@mui/icons-material/Factory';
import SettingsIcon from '@mui/icons-material/Settings';

const supportCards = [
  {
    title: 'Şirket Destek Tablosu',
    description: 'Şirket bilgileri ve yapılandırma ayarları',
    icon: BusinessIcon,
    color: '#0891b2',
    path: '/tables/company'
  },
  {
    title: 'Birim Destek Tablosu',
    description: 'Birim tanımlamaları ve yönetimi',
    icon: GroupWorkIcon,
    color: '#2563eb',
    path: '/tables/unit'
  },
  {
    title: 'Malzeme Destek Tablosu',
    description: 'Malzeme kayıtları ve stok yönetimi',
    icon: InventoryIcon,
    color: '#7c3aed',
    path: '/tables/material'
  },
  {
    title: 'Maliyet Merkezi Destek Tablosu',
    description: 'Maliyet merkezi tanımları ve takibi',
    icon: AccountBalanceWalletIcon,
    color: '#c026d3',
    path: '/tables/cost-center'
  },
  {
    title: 'Ürün Ağacı Destek Tablosu',
    description: 'Ürün ağacı kayıtları ve yönetimi',
    icon: AccountTreeIcon,
    color: '#0891b2',
    path: '/tables/bom'
  },
  {
    title: 'Rota Tipi Destek Tablosu',
    description: 'Üretim rotası tipleri ve planlaması',
    icon: RouteIcon,
    color: '#dc2626',
    path: '/tables/route-type'
  },
  {
    title: 'İş Merkezi Destek Tablosu',
    description: 'İş merkezi tanımları ve kapasite yönetimi',
    icon: FactoryIcon,
    color: '#ea580c',
    path: '/tables/work-center'
  },
  {
    title: 'Operasyon Destek Tablosu',
    description: 'Operasyon süreçleri ve iş akışları',
    icon: SettingsIcon,
    color: '#65a30d',
    path: '/tables/operation'
  }
];

const SupportTablesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: 'center'
        }}
      >
        Destek Tabloları
      </Typography>
      <Grid container spacing={3}>
        {supportCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(card.path)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: `${card.color}15`,
                          borderRadius: '12px',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent
                          sx={{
                            color: card.color,
                            fontSize: '2rem',
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.5,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SupportTablesPage; 