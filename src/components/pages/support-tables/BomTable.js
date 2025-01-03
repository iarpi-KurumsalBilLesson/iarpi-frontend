import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
  Button,
  TextField,
  Divider,
  Tooltip,
  Snackbar,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormControlLabel,
  Switch
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BomTable = () => {
  const navigate = useNavigate();
  const [boms, setBoms] = useState([]);
  const [filteredBoms, setFilteredBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    docType: '',
    docText: '',
    companyName: ''
  });
  const [newBom, setNewBom] = useState({
    companyId: '',
    docType: '',
    docText: '',
    isPassive: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/boms');
        console.log('Boms API Response:', response.data);
        
        if (response.data.status === 'OK') {
          const bomsData = response.data.data || [];
          console.log('Boms Data:', bomsData);
          setBoms(bomsData);
          setFilteredBoms(bomsData);
          setError(null);
        } else {
          const errorMessage = response.data.data || 'Veri alınırken bir hata oluştu';
          console.error('API Error:', errorMessage);
          setError(errorMessage);
          setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error'
          });
        }
      } catch (err) {
        console.error('API Error Details:', err);
        const errorMessage = err.response?.data?.data || 'Sunucuya bağlanırken bir hata oluştu';
        setError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/companies');
        if (response.data.status === 'OK') {
          setCompanies(response.data.data);
        }
      } catch (err) {
        console.error('Şirketler alınırken hata oluştu:', err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = boms.filter(bom => {
      const typeMatch = bom.docType?.toLowerCase().includes(filters.docType.toLowerCase()) ?? true;
      const textMatch = bom.docText?.toLowerCase().includes(filters.docText.toLowerCase()) ?? true;
      const companyMatch = bom.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      return typeMatch && textMatch && companyMatch;
    });
    setFilteredBoms(filtered);
  }, [filters, boms]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleInputChange = (field) => (event) => {
    setNewBom(prev => ({
      ...prev,
      [field]: field === 'isPassive' ? event.target.checked : event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      docType: '',
      docText: '',
      companyName: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAddBom = async () => {
    try {
      const response = await axios.post('http://localhost:8080/boms', newBom);
      
      if (response.data.status === 'OK') {
        const updatedBoms = [...boms, response.data.data];
        setBoms(updatedBoms);
        setFilteredBoms(updatedBoms);
        setIsAddModalOpen(false);
        setNewBom({
          companyId: '',
          docType: '',
          docText: '',
          isPassive: false
        });
        setSnackbar({
          open: true,
          message: 'Ürün ağacı başarıyla eklendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Ürün ağacı eklenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.data || 'Sunucuya bağlanırken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            onClick={() => navigate('/tables')}
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
            Ürün Ağacı Destek Tablosu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            onClick={() => navigate('/tables')}
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
            Ürün Ağacı Destek Tablosu
          </Typography>
        </Box>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Yeniden Dene
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/tables')}
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
            Ürün Ağacı Destek Tablosu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Kayıt Ekle
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setIsFilterOpen(true)}
          >
            Filtrele
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Ürün Ağacı Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ürün Ağacı Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBoms.map((bom) => (
              <TableRow 
                key={bom.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{bom.docType}</TableCell>
                <TableCell>{bom.docText}</TableCell>
                <TableCell>{bom.companyName || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer
        anchor="right"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Filtreler</Typography>
          <IconButton onClick={() => setIsFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Ürün Ağacı Tipi"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.docType}
            onChange={handleFilterChange('docType')}
          />
          <TextField
            label="Ürün Ağacı Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.docText}
            onChange={handleFilterChange('docText')}
          />
          <TextField
            label="Şirket Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.companyName}
            onChange={handleFilterChange('companyName')}
          />
          
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={clearFilters}
              sx={{ mb: 1 }}
            >
              Filtreleri Temizle
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setIsFilterOpen(false)}
            >
              Kapat
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: '400px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Yeni Ürün Ağacı Ekle
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newBom.companyId}
                label="Şirket"
                onChange={handleInputChange('companyId')}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.comCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Ürün Ağacı Tipi"
              fullWidth
              value={newBom.docType}
              onChange={handleInputChange('docType')}
            />

            <TextField
              label="Ürün Ağacı Adı"
              fullWidth
              value={newBom.docText}
              onChange={handleInputChange('docText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newBom.isPassive}
                  onChange={handleInputChange('isPassive')}
                />
              }
              label="Pasif"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setIsAddModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleAddBom}
              >
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BomTable; 