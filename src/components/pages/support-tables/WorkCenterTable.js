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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkCenterTable = () => {
  const navigate = useNavigate();
  const [workCenters, setWorkCenters] = useState([]);
  const [filteredWorkCenters, setFilteredWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState(null);
  const [filters, setFilters] = useState({
    docType: '',
    docText: '',
    companyName: ''
  });
  const [newWorkCenter, setNewWorkCenter] = useState({
    companyId: '',
    docType: '',
    docText: '',
    isPassive: false
  });
  const [editWorkCenter, setEditWorkCenter] = useState({
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
    const fetchWorkCenters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/work-centers');
        console.log('Work Centers API Response:', response.data);
        
        if (response.data.status === 'OK') {
          const workCentersData = response.data.data || [];
          setWorkCenters(workCentersData);
          setFilteredWorkCenters(workCentersData);
          setError(null);
        } else {
          const errorMessage = response.data.data || 'Veri alınırken bir hata oluştu';
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

    fetchWorkCenters();
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
    const filtered = workCenters.filter(workCenter => {
      const typeMatch = workCenter.docType?.toLowerCase().includes(filters.docType.toLowerCase()) ?? true;
      const textMatch = workCenter.docText?.toLowerCase().includes(filters.docText.toLowerCase()) ?? true;
      const companyMatch = workCenter.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      return typeMatch && textMatch && companyMatch;
    });
    setFilteredWorkCenters(filtered);
  }, [filters, workCenters]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleInputChange = (field) => (event) => {
    setNewWorkCenter(prev => ({
      ...prev,
      [field]: field === 'isPassive' ? event.target.checked : event.target.value
    }));
  };

  const handleEditInputChange = (field) => (event) => {
    setEditWorkCenter(prev => ({
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

  const handleAddWorkCenter = async () => {
    try {
      const response = await axios.post('http://localhost:8080/work-centers', newWorkCenter);
      
      if (response.data.status === 'OK') {
        const updatedWorkCenters = [...workCenters, response.data.data];
        setWorkCenters(updatedWorkCenters);
        setFilteredWorkCenters(updatedWorkCenters);
        setIsAddModalOpen(false);
        setNewWorkCenter({
          companyId: '',
          docType: '',
          docText: '',
          isPassive: false
        });
        setSnackbar({
          open: true,
          message: 'İş merkezi başarıyla eklendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'İş merkezi eklenirken bir hata oluştu',
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

  const handleEditClick = (workCenter) => {
    setSelectedWorkCenter(workCenter);
    setEditWorkCenter({
      docText: workCenter.docText,
      isPassive: workCenter.isPassive
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/work-centers/${selectedWorkCenter.id}`, editWorkCenter);
      
      if (response.data.status === 'OK') {
        const updatedWorkCenters = workCenters.map(workCenter => 
          workCenter.id === selectedWorkCenter.id ? { ...workCenter, ...response.data.data } : workCenter
        );
        setWorkCenters(updatedWorkCenters);
        setFilteredWorkCenters(updatedWorkCenters);
        setIsEditModalOpen(false);
        setSnackbar({
          open: true,
          message: 'İş merkezi başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'İş merkezi güncellenirken bir hata oluştu',
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
      const response = await axios.delete(`http://localhost:8080/work-centers/${deleteItemId}`);
      
      if (response.data.status === 'OK') {
        const updatedWorkCenters = workCenters.filter(workCenter => workCenter.id !== deleteItemId);
        setWorkCenters(updatedWorkCenters);
        setFilteredWorkCenters(updatedWorkCenters);
        setSnackbar({
          open: true,
          message: 'İş merkezi başarıyla silindi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.data || 'İş merkezi silinirken bir hata oluştu',
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
            İş Merkezi Destek Tablosu
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
            İş Merkezi Destek Tablosu
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
            İş Merkezi Destek Tablosu
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
              <TableCell sx={{ fontWeight: 'bold' }}>İş Merkezi Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>İş Merkezi Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkCenters.map((workCenter) => (
              <TableRow 
                key={workCenter.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{workCenter.docType}</TableCell>
                <TableCell>{workCenter.docText}</TableCell>
                <TableCell>{workCenter.companyName || '-'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditClick(workCenter)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteClick(workCenter.id)}
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
            label="İş Merkezi Kodu"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.docType}
            onChange={handleFilterChange('docType')}
          />
          <TextField
            label="İş Merkezi Adı"
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
            Yeni İş Merkezi Ekle
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newWorkCenter.companyId}
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
              label="İş Merkezi Kodu"
              fullWidth
              value={newWorkCenter.docType}
              onChange={handleInputChange('docType')}
            />

            <TextField
              label="İş Merkezi Adı"
              fullWidth
              value={newWorkCenter.docText}
              onChange={handleInputChange('docText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newWorkCenter.isPassive}
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
                onClick={handleAddWorkCenter}
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
            İş Merkezi Düzenle
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="İş Merkezi Adı"
              fullWidth
              value={editWorkCenter.docText}
              onChange={handleEditInputChange('docText')}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editWorkCenter.isPassive}
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
            Bu iş merkezini silmek istediğinizden emin misiniz?
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

export default WorkCenterTable; 