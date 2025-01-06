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

const MaterialHeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materialHead, setMaterialHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterialHead = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/material/head/${id}`);
        
        if (response.data.status === 'OK') {
          setMaterialHead(response.data.data);
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

    fetchMaterialHead();
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

  if (!materialHead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Malzeme bilgisi bulunamadı.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/material/head')}
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
          Malzeme Detayı
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
              {materialHead.matDocNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Başlangıç Tarihi
            </Typography>
            <Typography variant="body1">
              {materialHead.matDocFrom}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Bitiş Tarihi
            </Typography>
            <Typography variant="body1">
              {materialHead.matDocUntil}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Şirket Adı
            </Typography>
            <Typography variant="body1">
              {materialHead.companyName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Malzeme Tipi
            </Typography>
            <Typography variant="body1">
              {materialHead.materialTypeName}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Ağırlık Bilgileri
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Net Ağırlık
            </Typography>
            <Typography variant="body1">
              {materialHead.netWeight} {materialHead.newWeightUnitCode}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Brüt Ağırlık
            </Typography>
            <Typography variant="body1">
              {materialHead.brutWeight} {materialHead.brutWeightUnitCode}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Stok Birimi
            </Typography>
            <Typography variant="body1">
              {materialHead.stockUnitCode}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Durum Bilgileri
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Tedarik Tipi
            </Typography>
            <Typography variant="body1">
              {materialHead.supplyType === 0 ? 'İç' : 'Dış'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {materialHead.isBom === 1 && (
                <Chip label="Ürün Ağacı" color="primary" size="small" />
              )}
              {materialHead.isRoute === 1 && (
                <Chip label="Rota" color="primary" size="small" />
              )}
              {materialHead.isDeleted && (
                <Chip label="Silinmiş" color="error" size="small" />
              )}
              {materialHead.isPassive && (
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
              {materialHead.shortText}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Uzun Açıklama
            </Typography>
            <Typography variant="body1">
              {materialHead.longText}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MaterialHeadDetail; 