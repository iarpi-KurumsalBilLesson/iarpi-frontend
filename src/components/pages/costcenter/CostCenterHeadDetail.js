import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CostCenterHeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [costCenterHead, setCostCenterHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCostCenterHead = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/costCenter/head/${id}`);
        
        if (response.data.status === 'OK') {
          setCostCenterHead(response.data.data);
          setError(null);
        } else {
          setError('Veri alınırken bir hata oluştu');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.error || 'Sunucuya bağlanırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCostCenterHead();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!costCenterHead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Maliyet merkezi bilgisi bulunamadı.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/costCenter/head')}
          sx={{ 
            backgroundColor: 'primary.light',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          Maliyet Merkezi Detayı
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Temel Bilgiler
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Belge Numarası
            </Typography>
            <Typography variant="body1">
              {costCenterHead.docNum}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Başlangıç Tarihi
            </Typography>
            <Typography variant="body1">
              {costCenterHead.ccmDocFrom}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Bitiş Tarihi
            </Typography>
            <Typography variant="body1">
              {costCenterHead.ccmDocUntil}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Şirket Adı
            </Typography>
            <Typography variant="body1">
              {costCenterHead.companyName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Maliyet Merkezi Tipi
            </Typography>
            <Typography variant="body1">
              {costCenterHead.ccmType}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Durum Bilgileri
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {costCenterHead.isDeleted && (
                <Chip label="Silinmiş" color="error" size="small" />
              )}
              {costCenterHead.isPassive && (
                <Chip label="Pasif" color="warning" size="small" />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Açıklamalar
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Kısa Açıklama
            </Typography>
            <Typography variant="body1">
              {costCenterHead.shortText}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Uzun Açıklama
            </Typography>
            <Typography variant="body1">
              {costCenterHead.longText}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CostCenterHeadDetail; 