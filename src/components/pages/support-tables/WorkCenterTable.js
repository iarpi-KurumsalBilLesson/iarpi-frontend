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
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Drawer,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Modal,
  Stack,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkCenterTable = () => {
  const navigate = useNavigate();
  const [workCenters, setWorkCenters] = useState([]);
  const [filteredWorkCenters, setFilteredWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    workCenterType: '',
    wcmDocNumber: '',
    wcmDocFrom: '',
    wcmDocUntil: '',
    companyName: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    baseCostCenterId: null,
    shortText: '',
    longText: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchWorkCenters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/work-center/head');
        
        if (response.data.status === 'OK') {
          setWorkCenters(response.data.data);
          setFilteredWorkCenters(response.data.data);
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

    fetchWorkCenters();
  }, []);

  useEffect(() => {
    const filtered = workCenters.filter(workCenter => {
      return (
        workCenter.workCenterType?.toLowerCase().includes(filters.workCenterType.toLowerCase()) &&
        workCenter.wcmDocNumber?.toLowerCase().includes(filters.wcmDocNumber.toLowerCase()) &&
        workCenter.wcmDocFrom?.toLowerCase().includes(filters.wcmDocFrom.toLowerCase()) &&
        workCenter.wcmDocUntil?.toLowerCase().includes(filters.wcmDocUntil.toLowerCase()) &&
        workCenter.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    });
    setFilteredWorkCenters(filtered);
  }, [filters, workCenters]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      workCenterType: '',
      wcmDocNumber: '',
      wcmDocFrom: '',
      wcmDocUntil: '',
      companyName: ''
    });
  };

  const handleDetailClick = (id) => {
    navigate(`/work-center/head/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/work-center/head/${selectedId}`);
      
      if (response.data.status === 'OK') {
        setWorkCenters(prevWorkCenters => 
          prevWorkCenters.filter(wc => wc.id !== selectedId)
        );
        setFilteredWorkCenters(prevFiltered => 
          prevFiltered.filter(wc => wc.id !== selectedId)
        );
        setSnackbar({
          open: true,
          message: 'İş merkezi başarıyla silindi',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Silme işlemi başarısız oldu',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  const handleEditClick = (workCenter) => {
    setSelectedId(workCenter.id);
    setEditData({
      baseCostCenterId: workCenter.baseCostCenterId,
      shortText: workCenter.shortText || '',
      longText: workCenter.longText || ''
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/work-center/head/${selectedId}`, editData);
      
      if (response.data.status === 'OK') {
        setWorkCenters(prevWorkCenters =>
          prevWorkCenters.map(wc =>
            wc.id === selectedId ? { ...wc, ...response.data.data } : wc
          )
        );
        setFilteredWorkCenters(prevFiltered =>
          prevFiltered.map(wc =>
            wc.id === selectedId ? { ...wc, ...response.data.data } : wc
          )
        );
        setSnackbar({
          open: true,
          message: 'İş merkezi başarıyla güncellendi',
          severity: 'success'
        });
        setEditModalOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Güncelleme işlemi başarısız oldu',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Güncelleme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            onClick={() => navigate('/')}
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
            İş Merkezi Listesi
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
            onClick={() => navigate('/')}
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
            İş Merkezi Listesi
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
            onClick={() => navigate('/')}
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
            İş Merkezi Listesi
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
              <TableCell sx={{ fontWeight: 'bold' }}>İş Merkezi Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Belge Numarası</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Başlangıç Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bitiş Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkCenters.map((workCenter) => (
              <TableRow key={workCenter.id}>
                <TableCell>{workCenter.workCenterType}</TableCell>
                <TableCell>{workCenter.wcmDocNumber}</TableCell>
                <TableCell>{workCenter.wcmDocFrom}</TableCell>
                <TableCell>{workCenter.wcmDocUntil}</TableCell>
                <TableCell>{workCenter.companyName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Detay">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDetailClick(workCenter.id)}
                        sx={{ color: 'primary.main' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
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

      <Drawer
        anchor="right"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        PaperProps={{
          sx: { width: '400px', p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Filtreleme
          </Typography>
          <IconButton onClick={() => setIsFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="İş Merkezi Tipi"
            value={filters.workCenterType}
            onChange={handleFilterChange('workCenterType')}
            size="small"
            fullWidth
          />
          <TextField
            label="Belge Numarası"
            value={filters.wcmDocNumber}
            onChange={handleFilterChange('wcmDocNumber')}
            size="small"
            fullWidth
          />
          <TextField
            label="Başlangıç Tarihi"
            value={filters.wcmDocFrom}
            onChange={handleFilterChange('wcmDocFrom')}
            size="small"
            fullWidth
          />
          <TextField
            label="Bitiş Tarihi"
            value={filters.wcmDocUntil}
            onChange={handleFilterChange('wcmDocUntil')}
            size="small"
            fullWidth
          />
          <TextField
            label="Şirket Adı"
            value={filters.companyName}
            onChange={handleFilterChange('companyName')}
            size="small"
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            fullWidth
          >
            Filtreleri Temizle
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsFilterOpen(false)}
            fullWidth
          >
            Kapat
          </Button>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Silme İşlemini Onayla</DialogTitle>
        <DialogContent>
          <Typography>
            Bu iş merkezini silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: '400px',
          borderRadius: 1
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            İş Merkezi Düzenle
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Kısa Açıklama"
              value={editData.shortText}
              onChange={(e) => setEditData(prev => ({ ...prev, shortText: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Uzun Açıklama"
              value={editData.longText}
              onChange={(e) => setEditData(prev => ({ ...prev, longText: e.target.value }))}
              fullWidth
              multiline
              rows={4}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditModalOpen(false)}>
                İptal
              </Button>
              <Button variant="contained" onClick={handleEditSave}>
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorkCenterTable; 