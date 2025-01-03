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

const CostCenterTable = () => {
  const navigate = useNavigate();
  const [costCenters, setCostCenters] = useState([]);
  const [filteredCostCenters, setFilteredCostCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [filters, setFilters] = useState({
    docType: '',
    docText: '',
    companyName: ''
  });
  const [newCostCenter, setNewCostCenter] = useState({
    companyId: '',
    docType: '',
    docText: '',
    isPassive: false
  });
  const [editCostCenter, setEditCostCenter] = useState({
    docText: '',
    isPassive: false
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchCostCenters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/cost-centers');
        console.log('Cost Centers API Response:', response.data);
        
        if (response.data.status === 'OK') {
          setCostCenters(response.data.data);
          setFilteredCostCenters(response.data.data);
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

    fetchCostCenters();
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
    const filtered = costCenters.filter(costCenter => {
      const typeMatch = costCenter.docType?.toLowerCase().includes(filters.docType.toLowerCase()) ?? true;
      const textMatch = costCenter.docText?.toLowerCase().includes(filters.docText.toLowerCase()) ?? true;
      const companyMatch = costCenter.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      return typeMatch && textMatch && companyMatch;
    });
    setFilteredCostCenters(filtered);
  }, [filters, costCenters]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      docType: '',
      docText: '',
      companyName: ''
    });
  };

  const handleInputChange = (field) => (event) => {
    setNewCostCenter(prev => ({
      ...prev,
      [field]: field === 'isPassive' ? event.target.checked : event.target.value
    }));
  };

  const handleEditInputChange = (field) => (event) => {
    setEditCostCenter(prev => ({
      ...prev,
      [field]: field === 'isPassive' ? event.target.checked : event.target.value
    }));
  };

  const handleAddCostCenter = async () => {
    try {
      const response = await axios.post('http://localhost:8080/cost-centers', newCostCenter);
      
      if (response.data.status === 'OK') {
        const updatedCostCenters = [...costCenters, response.data.data];
        setCostCenters(updatedCostCenters);
        setFilteredCostCenters(updatedCostCenters);
        setIsAddModalOpen(false);
        setNewCostCenter({
          companyId: '',
          docType: '',
          docText: '',
          isPassive: false
        });
        setSnackbar({
          open: true,
          message: 'Maliyet merkezi başarıyla eklendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Maliyet merkezi eklenirken bir hata oluştu',
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

  const handleEditClick = (costCenter) => {
    setSelectedCostCenter(costCenter);
    setEditCostCenter({
      docText: costCenter.docText,
      isPassive: costCenter.isPassive
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/cost-centers/${selectedCostCenter.id}`, editCostCenter);
      
      if (response.data.status === 'OK') {
        const updatedCostCenters = costCenters.map(costCenter => 
          costCenter.id === selectedCostCenter.id ? { ...costCenter, ...response.data.data } : costCenter
        );
        setCostCenters(updatedCostCenters);
        setFilteredCostCenters(updatedCostCenters);
        setIsEditModalOpen(false);
        setSnackbar({
          open: true,
          message: 'Maliyet merkezi başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Maliyet merkezi güncellenirken bir hata oluştu',
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
      const response = await axios.delete(`http://localhost:8080/cost-centers/${deleteItemId}`);
      
      if (response.data.status === 'OK') {
        const updatedCostCenters = costCenters.filter(costCenter => costCenter.id !== deleteItemId);
        setCostCenters(updatedCostCenters);
        setFilteredCostCenters(updatedCostCenters);
        setSnackbar({
          open: true,
          message: 'Maliyet merkezi başarıyla silindi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'Maliyet merkezi silinirken bir hata oluştu',
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
            Maliyet Merkezi Destek Tablosu
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
              <TableCell sx={{ fontWeight: 'bold' }}>Maliyet Merkezi Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Maliyet Merkezi Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCostCenters.map((costCenter) => (
              <TableRow 
                key={costCenter.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{costCenter.docType}</TableCell>
                <TableCell>{costCenter.docText}</TableCell>
                <TableCell>{costCenter.companyName}</TableCell>
                <TableCell>{costCenter.isPassive ? 'Pasif' : 'Aktif'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditClick(costCenter)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteClick(costCenter.id)}
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
            label="Maliyet Merkezi Kodu"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.docType}
            onChange={handleFilterChange('docType')}
          />
          <TextField
            label="Maliyet Merkezi Adı"
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
            Yeni Maliyet Merkezi Ekle
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newCostCenter.companyId}
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
              label="Maliyet Merkezi Kodu"
              fullWidth
              value={newCostCenter.docType}
              onChange={handleInputChange('docType')}
            />

            <TextField
              label="Maliyet Merkezi Adı"
              fullWidth
              value={newCostCenter.docText}
              onChange={handleInputChange('docText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newCostCenter.isPassive}
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
                onClick={handleAddCostCenter}
              >
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

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
            Maliyet Merkezi Düzenle
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Maliyet Merkezi Adı"
              fullWidth
              value={editCostCenter.docText}
              onChange={handleEditInputChange('docText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editCostCenter.isPassive}
                  onChange={handleEditInputChange('isPassive')}
                />
              }
              label="Pasif"
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>
          Silme İşlemini Onayla
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bu maliyet merkezini silmek istediğinizden emin misiniz?
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

export default CostCenterTable; 