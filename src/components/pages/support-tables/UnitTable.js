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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UnitTable = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [filters, setFilters] = useState({
    unitCode: '',
    unitText: '',
    mainUnitCode: '',
    companyName: '',
    mainUnit: ''
  });
  const [newUnit, setNewUnit] = useState({
    companyId: '',
    unitCode: '',
    unitText: '',
    isMainUnit: false,
    mainUnitCode: ''
  });
  const [editUnit, setEditUnit] = useState({
    unitText: '',
    isMainUnit: false,
    mainUnitCode: ''
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost:8080/units');
        console.log('Units API Response:', response.data);
        
        if (response.data.status === 'OK') {
          setUnits(response.data.data);
          setFilteredUnits(response.data.data);
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

    fetchUnits();
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
    const filtered = units.filter(unit => {
      const codeMatch = unit.unitCode?.toLowerCase().includes(filters.unitCode.toLowerCase()) ?? true;
      const textMatch = unit.unitText?.toLowerCase().includes(filters.unitText.toLowerCase()) ?? true;
      const mainUnitCodeMatch = unit.mainUnitCode?.toLowerCase().includes(filters.mainUnitCode.toLowerCase()) ?? true;
      const companyMatch = unit.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      const mainUnitMatch = filters.mainUnit === '' || unit.mainUnit === (filters.mainUnit === 'true');
      return codeMatch && textMatch && mainUnitCodeMatch && companyMatch && mainUnitMatch;
    });
    setFilteredUnits(filtered);
  }, [filters, units]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      unitCode: '',
      unitText: '',
      mainUnitCode: '',
      companyName: '',
      mainUnit: ''
    });
  };

  const handleInputChange = (field) => (event) => {
    setNewUnit(prev => ({
      ...prev,
      [field]: field === 'isMainUnit' ? event.target.checked : event.target.value
    }));
  };

  const handleEditInputChange = (field) => (event) => {
    setEditUnit(prev => ({
      ...prev,
      [field]: field === 'isMainUnit' ? event.target.checked : event.target.value
    }));
  };

  const handleAddUnit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/units', newUnit);
      
      if (response.data.status === 'OK') {
        const updatedUnits = [...units, response.data.data];
        setUnits(updatedUnits);
        setFilteredUnits(updatedUnits);
        setIsAddModalOpen(false);
        setNewUnit({
          companyId: '',
          unitCode: '',
          unitText: '',
          isMainUnit: false,
          mainUnitCode: ''
        });
        setSnackbar({
          open: true,
          message: 'Birim başarıyla eklendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Birim eklenirken bir hata oluştu',
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

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setEditUnit({
      unitText: unit.unitText,
      isMainUnit: unit.isMainUnit,
      mainUnitCode: unit.mainUnitCode
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/unit/${selectedUnit.id}`, editUnit);
      
      if (response.data.status === 'OK') {
        const updatedUnits = units.map(unit => 
          unit.id === selectedUnit.id ? { ...unit, ...response.data.data } : unit
        );
        setUnits(updatedUnits);
        setFilteredUnits(updatedUnits);
        setIsEditModalOpen(false);
        setSnackbar({
          open: true,
          message: 'Birim başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Birim güncellenirken bir hata oluştu',
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

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/unit/${deleteItemId}`);
      
      if (response.data.status === 'OK') {
        const updatedUnits = units.filter(unit => unit.id !== deleteItemId);
        setUnits(updatedUnits);
        setFilteredUnits(updatedUnits);
        setSnackbar({
          open: true,
          message: 'Birim başarıyla silindi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Birim silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.data || 'Sunucuya bağlanırken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
    }
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
            Birim Destek Tablosu
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
              <TableCell sx={{ fontWeight: 'bold' }}>Birim Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Birim Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ana Birim Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ana Birim</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow 
                key={unit.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{unit.unitCode}</TableCell>
                <TableCell>{unit.unitText}</TableCell>
                <TableCell>{unit.mainUnitCode}</TableCell>
                <TableCell>{unit.companyName}</TableCell>
                <TableCell>{unit.mainUnit ? 'Evet' : 'Hayır'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditClick(unit)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteClick(unit.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Filtre Drawer'ı */}
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
            label="Birim Kodu"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.unitCode}
            onChange={handleFilterChange('unitCode')}
          />
          <TextField
            label="Birim Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.unitText}
            onChange={handleFilterChange('unitText')}
          />
          <TextField
            label="Ana Birim Kodu"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.mainUnitCode}
            onChange={handleFilterChange('mainUnitCode')}
          />
          <TextField
            label="Şirket Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.companyName}
            onChange={handleFilterChange('companyName')}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Ana Birim</InputLabel>
            <Select
              value={filters.mainUnit}
              label="Ana Birim"
              onChange={handleFilterChange('mainUnit')}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="true">Evet</MenuItem>
              <MenuItem value="false">Hayır</MenuItem>
            </Select>
          </FormControl>
          
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

      {/* Yeni Kayıt Modalı */}
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
            Yeni Birim Ekle
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newUnit.companyId}
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
              label="Birim Kodu"
              fullWidth
              value={newUnit.unitCode}
              onChange={handleInputChange('unitCode')}
            />

            <TextField
              label="Birim Adı"
              fullWidth
              value={newUnit.unitText}
              onChange={handleInputChange('unitText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newUnit.isMainUnit}
                  onChange={handleInputChange('isMainUnit')}
                />
              }
              label="Ana Birim"
            />

            <TextField
              label="Ana Birim Kodu"
              fullWidth
              value={newUnit.mainUnitCode}
              onChange={handleInputChange('mainUnitCode')}
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
                onClick={handleAddUnit}
              >
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Düzenleme Modalı */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
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
            Birim Düzenle
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Birim Adı"
              fullWidth
              value={editUnit.unitText}
              onChange={handleEditInputChange('unitText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editUnit.isMainUnit}
                  onChange={handleEditInputChange('isMainUnit')}
                />
              }
              label="Ana Birim"
            />

            <TextField
              label="Ana Birim Kodu"
              fullWidth
              value={editUnit.mainUnitCode}
              onChange={handleEditInputChange('mainUnitCode')}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setIsEditModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleEditSave}
              >
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Silme Onay Dialogu */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>
          Silme İşlemini Onayla
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bu birimi silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default UnitTable; 