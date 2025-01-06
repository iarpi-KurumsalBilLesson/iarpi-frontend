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

const WorkCenterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workCenter, setWorkCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkCenter = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/work-center/head/${id}`);
        
        if (response.data.status === 'OK') {
          setWorkCenter(response.data.data);
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

    fetchWorkCenter();
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

  if (!workCenter) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          İş merkezi bilgisi bulunamadı.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/work-center')}
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
          İş Merkezi Detayı
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
              İş Merkezi Tipi
            </Typography>
            <Typography variant="body1">
              {workCenter.workCenterType}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Belge Numarası
            </Typography>
            <Typography variant="body1">
              {workCenter.wcmDocNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Başlangıç Tarihi
            </Typography>
            <Typography variant="body1">
              {workCenter.wcmDocFrom}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Bitiş Tarihi
            </Typography>
            <Typography variant="body1">
              {workCenter.wcmDocUntil}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Şirket Adı
            </Typography>
            <Typography variant="body1">
              {workCenter.companyName}
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
              {workCenter.isDeleted && (
                <Chip label="Silinmiş" color="error" size="small" />
              )}
              {workCenter.isPassive && (
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
              {workCenter.shortText}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Uzun Açıklama
            </Typography>
            <Typography variant="body1">
              {workCenter.longText}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WorkCenterDetail; 