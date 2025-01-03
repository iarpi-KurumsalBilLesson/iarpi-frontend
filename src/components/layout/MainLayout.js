import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import TableChartIcon from '@mui/icons-material/TableChart';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Ana Sayfa', icon: <DashboardCustomizeIcon />, path: '/' },
  { text: 'Destek Tabloları', icon: <TableChartIcon />, path: '/tables' },
  { text: 'İletişim', icon: <ConnectWithoutContactIcon />, path: '/contact' },
];

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: theme.palette.background.default }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Box
          component="img"
          sx={{ 
            height: 35,
            width: 35,
            mr: 1,
            filter: 'invert(1)'
          }}
          alt="Iarpi Logo"
          src="/logo.png"
        />
        <Typography variant="h6" noWrap component="div">
          Iarpi
        </Typography>
      </Box>
      <Divider />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: '8px',
                backgroundColor: isSelected ? theme.palette.primary.light : 'transparent',
                color: isSelected ? theme.palette.primary.main : 'inherit',
                '&:hover': {
                  backgroundColor: isSelected 
                    ? theme.palette.primary.light 
                    : theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isSelected ? theme.palette.primary.main : 'inherit',
                minWidth: '40px' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isSelected ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{ 
              height: 35,
              width: 35,
              mr: 2,
              filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
            }}
            alt="Iarpi Logo"
            src="/logo.png"
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Iarpi Danışmanlık
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 