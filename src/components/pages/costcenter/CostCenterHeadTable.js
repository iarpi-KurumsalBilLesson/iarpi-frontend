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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Modal,
  FormControlLabel,
  Switch
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CostCenterHeadTable = () => {
  const navigate = useNavigate();
  const [costCenterHeads, setCostCenterHeads] = useState([]);
  const [filteredCostCenterHeads, setFilteredCostCenterHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    docNum: '',
    ccmDocFrom: '',
    ccmDocUntil: '',
    companyName: '',
    ccmType: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [newCostCenter, setNewCostCenter] = useState({
    companyId: '',
    costCenterTypeId: '',
    ccmDocNumber: '',
    ccmDocFrom: '',
    ccmDocUntil: '',
    baseCostCenterId: null,
    shortText: '',
    longText: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [editCostCenter, setEditCostCenter] = useState({
    docText: '',
    isPassive: false
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [costCenterToDelete, setCostCenterToDelete] = useState(null);

  useEffect(() => {
    const fetchCostCenterHeads = async () => {
      try {
        const response = await axios.get('http://localhost:8080/costCenter/head');
        console.log('Cost Center Heads API Response:', response.data);
        
        if (response.data.status === 'OK') {
          setCostCenterHeads(response.data.data);
          setFilteredCostCenterHeads(response.data.data);
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

    fetchCostCenterHeads();
  }, []);

  useEffect(() => {
    const filtered = costCenterHeads.filter(head => {
      const docNumMatch = head.docNum?.toLowerCase().includes(filters.docNum.toLowerCase()) ?? true;
      const fromMatch = head.ccmDocFrom?.includes(filters.ccmDocFrom) ?? true;
      const untilMatch = head.ccmDocUntil?.includes(filters.ccmDocUntil) ?? true;
      const companyMatch = head.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      const typeMatch = head.ccmType?.toLowerCase().includes(filters.ccmType.toLowerCase()) ?? true;
      return docNumMatch && fromMatch && untilMatch && companyMatch && typeMatch;
    });
    setFilteredCostCenterHeads(filtered);
  }, [filters, costCenterHeads]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      docNum: '',
      ccmDocFrom: '',
      ccmDocUntil: '',
      companyName: '',
      ccmType: ''
    });
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [companiesRes, costCentersRes] = await Promise.all([
          axios.get('http://localhost:8080/companies'),
          axios.get('http://localhost:8080/cost-centers')
        ]);

        if (companiesRes.data.status === 'OK') {
          setCompanies(companiesRes.data.data);
        }
        if (costCentersRes.data.status === 'OK') {
          setCostCenters(costCentersRes.data.data);
        }
      } catch (err) {
        console.error('Dropdown data fetch error:', err);
        setSnackbar({
          open: true,
          message: 'Seçenek verileri yüklenirken hata oluştu',
          severity: 'error'
        });
      }
    };

    fetchDropdownData();
  }, []);

  const handleAddCostCenter = async () => {
    try {
      const response = await axios.post('http://localhost:8080/costCenter/head', newCostCenter);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Yeni kayıt başarıyla eklendi',
          severity: 'success'
        });
        setIsAddModalOpen(false);
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/costCenter/head');
        if (refreshResponse.data.status === 'OK') {
          setCostCenterHeads(refreshResponse.data.data);
          setFilteredCostCenterHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt eklenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Add cost center error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    setNewCostCenter(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleEditClick = (costCenter, event) => {
    event.stopPropagation();
    setSelectedCostCenter(costCenter);
    setEditCostCenter({
      docText: costCenter.docText || '',
      isPassive: costCenter.isPassive || false
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/costCenter/head/${selectedCostCenter.id}`, editCostCenter);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Kayıt başarıyla güncellendi',
          severity: 'success'
        });
        setIsEditModalOpen(false);
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/costCenter/head');
        if (refreshResponse.data.status === 'OK') {
          setCostCenterHeads(refreshResponse.data.data);
          setFilteredCostCenterHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt güncellenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Update cost center error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt güncellenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (costCenter, event) => {
    event.stopPropagation();
    setCostCenterToDelete(costCenter);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/costCenter/head/${costCenterToDelete.id}`);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Kayıt başarıyla silindi',
          severity: 'success'
        });
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/costCenter/head');
        if (refreshResponse.data.status === 'OK') {
          setCostCenterHeads(refreshResponse.data.data);
          setFilteredCostCenterHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Delete cost center error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt silinirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setCostCenterToDelete(null);
    }
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
            Maliyet Merkezleri
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
              <TableCell sx={{ fontWeight: 'bold' }}>Belge Numarası</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Başlangıç Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bitiş Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Maliyet Merkezi Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCostCenterHeads.map((head) => (
              <TableRow 
                key={head.id} 
                hover
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell>{head.docNum}</TableCell>
                <TableCell>{head.ccmDocFrom}</TableCell>
                <TableCell>{head.ccmDocUntil}</TableCell>
                <TableCell>{head.companyName}</TableCell>
                <TableCell>{head.ccmType}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Detay Görüntüle">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/costCenter/head/${head.id}`)}
                        sx={{ color: '#2196f3' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Düzenle">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEditClick(head, e)}
                        sx={{ color: '#4caf50' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteClick(head, e)}
                        sx={{ color: '#f44336' }}
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

      {/* Yeni Kayıt Ekleme Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        aria-labelledby="add-cost-center-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Yeni Maliyet Merkezi Ekle
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newCostCenter.companyId}
                onChange={handleInputChange('companyId')}
                label="Şirket"
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.comCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Maliyet Merkezi Tipi</InputLabel>
              <Select
                value={newCostCenter.costCenterTypeId}
                onChange={handleInputChange('costCenterTypeId')}
                label="Maliyet Merkezi Tipi"
              >
                {costCenters.map((costCenter) => (
                  <MenuItem key={costCenter.id} value={costCenter.id}>
                    {costCenter.docType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Belge Numarası"
              size="small"
              fullWidth
              value={newCostCenter.ccmDocNumber}
              onChange={handleInputChange('ccmDocNumber')}
            />

            <TextField
              label="Başlangıç Tarihi"
              type="date"
              size="small"
              fullWidth
              value={newCostCenter.ccmDocFrom}
              onChange={handleInputChange('ccmDocFrom')}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Bitiş Tarihi"
              type="date"
              size="small"
              fullWidth
              value={newCostCenter.ccmDocUntil}
              onChange={handleInputChange('ccmDocUntil')}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Kısa Açıklama"
              size="small"
              fullWidth
              value={newCostCenter.shortText}
              onChange={handleInputChange('shortText')}
            />

            <TextField
              label="Uzun Açıklama"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={newCostCenter.longText}
              onChange={handleInputChange('longText')}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
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

      {/* Güncelleme Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="edit-cost-center-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Maliyet Merkezi Güncelle
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Açıklama"
              size="small"
              fullWidth
              value={editCostCenter.docText}
              onChange={(e) => setEditCostCenter(prev => ({ ...prev, docText: e.target.value }))}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editCostCenter.isPassive}
                  onChange={(e) => setEditCostCenter(prev => ({
                    ...prev,
                    isPassive: e.target.checked
                  }))}
                />
              }
              label="Pasif"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
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
                Güncelle
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Silme Onay Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>
          Silme Onayı
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bu kaydı silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

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
            label="Belge Numarası"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.docNum}
            onChange={handleFilterChange('docNum')}
          />
          <TextField
            label="Başlangıç Tarihi"
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            value={filters.ccmDocFrom}
            onChange={handleFilterChange('ccmDocFrom')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Bitiş Tarihi"
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            value={filters.ccmDocUntil}
            onChange={handleFilterChange('ccmDocUntil')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Şirket Adı"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.companyName}
            onChange={handleFilterChange('companyName')}
          />
          <TextField
            label="Maliyet Merkezi Tipi"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.ccmType}
            onChange={handleFilterChange('ccmType')}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CostCenterHeadTable; 