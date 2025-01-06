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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BomHeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bomHead, setBomHead] = useState(null);
  const [bomContents, setBomContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBomDetails = async () => {
      try {
        const [headResponse, contentsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/bom/head/${id}`),
          axios.get(`http://localhost:8080/bom/head/contents/${id}`)
        ]);
        
        if (headResponse.data.status === 'OK') {
          setBomHead(headResponse.data.data);
        } else {
          setError('Ürün ağacı detayları alınırken bir hata oluştu');
        }

        if (contentsResponse.data.status === 'OK') {
          setBomContents(contentsResponse.data.data);
        } else {
          setError('Ürün ağacı içerikleri alınırken bir hata oluştu');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.error || 'Veriler alınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBomDetails();
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!bomHead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Ürün ağacı bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/bom/head')}
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
          Ürün Ağacı Detayı
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
              {bomHead.bomDocNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Başlangıç Tarihi
            </Typography>
            <Typography variant="body1">
              {bomHead.bomDocFrom}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Bitiş Tarihi
            </Typography>
            <Typography variant="body1">
              {bomHead.bomDocUntil}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Miktar
            </Typography>
            <Typography variant="body1">
              {bomHead.quantity}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Çizim Numarası
            </Typography>
            <Typography variant="body1">
              {bomHead.drawNum}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Şirket
            </Typography>
            <Typography variant="body1">
              {bomHead.companyName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Malzeme Tipi
            </Typography>
            <Typography variant="body1">
              {bomHead.materialTypeName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Ürün Ağacı Tipi
            </Typography>
            <Typography variant="body1">
              {bomHead.bomTypeName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ürün Ağacı İçerikleri
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Malzeme</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Miktar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Birim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bomContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.materialName}</TableCell>
                  <TableCell>{content.quantity}</TableCell>
                  <TableCell>{content.unitCode}</TableCell>
                  <TableCell>{content.description}</TableCell>
                </TableRow>
              ))}
              {bomContents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    İçerik bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BomHeadDetail; 