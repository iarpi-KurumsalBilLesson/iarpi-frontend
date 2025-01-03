import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, backUrl }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <IconButton
        onClick={() => navigate(backUrl)}
        sx={{
          mr: 2,
          backgroundColor: theme.palette.primary.light,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
          },
          transition: 'all 0.2s',
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader; 