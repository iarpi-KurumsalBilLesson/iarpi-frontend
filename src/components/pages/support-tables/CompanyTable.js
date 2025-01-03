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
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Snackbar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyTable = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    comCode: '',
    comText: ''
  });
  const [newCompany, setNewCompany] = useState({
    comCode: '',
    comText: '',
    countryId: '',
    cityId: '',
    address: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/companies');
        
        if (response.data.status === 'OK') {
          setCompanies(response.data.data);
          setFilteredCompanies(response.data.data);
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

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filtreleme işlemi
    const filtered = companies.filter(company => {
      const codeMatch = company.comCode.toLowerCase().includes(filters.comCode.toLowerCase());
      const textMatch = company.comText.toLowerCase().includes(filters.comText.toLowerCase());
      return codeMatch && textMatch;
    });
    setFilteredCompanies(filtered);
  }, [filters, companies]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      comCode: '',
      comText: ''
    });
  };

  const handleDetailClick = (event, id) => {
    event.stopPropagation(); // Event'in parent elementlere yayılmasını engelle
    navigate(`/tables/company/${id}`);
  };

  // Ülke ve şehir verilerini çekme
  useEffect(() => {
    const fetchCountriesAndCities = async () => {
      try {
        const [countriesResponse, citiesResponse] = await Promise.all([
          axios.get('http://localhost:8080/countries'),
          axios.get('http://localhost:8080/cities')
        ]);

        if (countriesResponse.data.status === 'OK') {
          setCountries(countriesResponse.data.data);
        }
        if (citiesResponse.data.status === 'OK') {
          setCities(citiesResponse.data.data);
        }
      } catch (err) {
        console.error('Ülke ve şehir verileri alınırken hata oluştu:', err);
      }
    };

    fetchCountriesAndCities();
  }, []);

  const handleAddCompany = async () => {
    try {
      const response = await axios.post('http://localhost:8080/companies', newCompany);
      
      if (response.data.status === 'OK') {
        const updatedCompanies = [...companies, response.data.data];
        setCompanies(updatedCompanies);
        setFilteredCompanies(updatedCompanies);
        setIsAddModalOpen(false);
        setNewCompany({
          comCode: '',
          comText: '',
          countryId: '',
          cityId: '',
          address: ''
        });
        // Başarı mesajı göster
        setSnackbar({
          open: true,
          message: 'Şirket başarıyla eklendi',
          severity: 'success'
        });
      } else {
        // API'den gelen hata mesajını göster
        setSnackbar({
          open: true,
          message: response.data.data || 'Şirket eklenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      // API'den gelen hata mesajını göster
      setSnackbar({
        open: true,
        message: err.response?.data?.data || 'Sunucuya bağlanırken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    setNewCompany(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
            Şirket Destek Tablosu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Şirket Ekle
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
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow 
                key={company.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{company.comCode}</TableCell>
                <TableCell>{company.comText}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Detay Görüntüle" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDetailClick(e, company.id)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
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
            label="Şirket Kodu"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.comCode}
            onChange={handleFilterChange('comCode')}
          />
          <TextField
            label="Şirket Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.comText}
            onChange={handleFilterChange('comText')}
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
            Yeni Şirket Ekle
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Şirket Kodu"
              fullWidth
              value={newCompany.comCode}
              onChange={handleInputChange('comCode')}
            />

            <TextField
              label="Şirket Adı"
              fullWidth
              value={newCompany.comText}
              onChange={handleInputChange('comText')}
            />

            <FormControl fullWidth>
              <InputLabel>Ülke</InputLabel>
              <Select
                value={newCompany.countryId}
                label="Ülke"
                onChange={handleInputChange('countryId')}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.countryText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Şehir</InputLabel>
              <Select
                value={newCompany.cityId}
                label="Şehir"
                onChange={handleInputChange('cityId')}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.cityText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Adres"
              fullWidth
              multiline
              rows={3}
              value={newCompany.address}
              onChange={handleInputChange('address')}
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
                onClick={handleAddCompany}
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

export default CompanyTable; 