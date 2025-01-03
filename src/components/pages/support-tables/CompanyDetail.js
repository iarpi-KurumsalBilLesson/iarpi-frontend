import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/companies/${id}`);
        
        if (response.data.status === 'OK') {
          setCompany(response.data.data);
          setError(null);
        } else {
          setError('Veri alınırken bir hata oluştu');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Sunucuya bağlanırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tables/company')}
          variant="outlined"
        >
          Geri Dön
        </Button>
        <Typography variant="h5">
          Şirket Detayları
        </Typography>
      </Box>

      <Paper sx={{ p: 3, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Şirket Kodu
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company?.comCode}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Şirket Adı
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company?.comText}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Adres Bilgileri
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ülke
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company?.country || '-'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Şehir
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company?.city || '-'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              backgroundColor: '#f8fafc', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Adres
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company?.address || '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CompanyDetail; 