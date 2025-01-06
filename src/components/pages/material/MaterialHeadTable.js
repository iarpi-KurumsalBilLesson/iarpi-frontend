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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MaterialHeadTable = () => {
  const navigate = useNavigate();
  const [materialHeads, setMaterialHeads] = useState([]);
  const [filteredMaterialHeads, setFilteredMaterialHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    docNum: '',
    matDocFrom: '',
    matDocUntil: '',
    companyName: '',
    materialTypeName: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [units, setUnits] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newMaterial, setNewMaterial] = useState({
    companyId: '',
    materialId: '',
    matDocNumber: '',
    matDocFrom: '',
    matDocUntil: '',
    supplyType: 0,
    newWeightId: '',
    netWeight: '',
    brutWeightId: '',
    brutWeight: '',
    stockUnitId: '',
    isBom: 1,
    isRoute: 1,
    isDeleted: false,
    isPassive: false,
    stUnitId: '',
    nwUnitId: '',
    bwUnitId: '',
    lanId: 1,
    shortText: '',
    longText: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [editMaterial, setEditMaterial] = useState({
    supplyType: 1,
    netWeightId: '',
    netWeight: '',
    brutWeightId: '',
    brutWeight: '',
    stockUnitId: '',
    isBom: 1,
    isRoute: 1,
    isDeleted: false,
    isPassive: false,
    shortText: '',
    longText: ''
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [companiesRes, materialsRes, unitsRes] = await Promise.all([
          axios.get('http://localhost:8080/companies'),
          axios.get('http://localhost:8080/materials'),
          axios.get('http://localhost:8080/units')
        ]);

        if (companiesRes.data.status === 'OK') {
          setCompanies(companiesRes.data.data);
        }
        if (materialsRes.data.status === 'OK') {
          setMaterials(materialsRes.data.data);
        }
        if (unitsRes.data.status === 'OK') {
          setUnits(unitsRes.data.data);
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

  const handleAddMaterial = async () => {
    try {
      const response = await axios.post('http://localhost:8080/material/head', newMaterial);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Yeni kayıt başarıyla eklendi',
          severity: 'success'
        });
        setIsAddModalOpen(false);
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/material/head');
        if (refreshResponse.data.status === 'OK') {
          setMaterialHeads(refreshResponse.data.data);
          setFilteredMaterialHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt eklenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Add material error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    setNewMaterial(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  useEffect(() => {
    const fetchMaterialHeads = async () => {
      try {
        const response = await axios.get('http://localhost:8080/material/head');
        console.log('Material Heads API Response:', response.data);
        
        if (response.data.status === 'OK') {
          setMaterialHeads(response.data.data);
          setFilteredMaterialHeads(response.data.data);
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

    fetchMaterialHeads();
  }, []);

  useEffect(() => {
    const filtered = materialHeads.filter(head => {
      const docNumMatch = head.docNum?.toLowerCase().includes(filters.docNum.toLowerCase()) ?? true;
      const fromMatch = head.matDocFrom?.includes(filters.matDocFrom) ?? true;
      const untilMatch = head.matDocUntil?.includes(filters.matDocUntil) ?? true;
      const companyMatch = head.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ?? true;
      const materialTypeMatch = head.materialTypeName?.toLowerCase().includes(filters.materialTypeName.toLowerCase()) ?? true;
      return docNumMatch && fromMatch && untilMatch && companyMatch && materialTypeMatch;
    });
    setFilteredMaterialHeads(filtered);
  }, [filters, materialHeads]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      docNum: '',
      matDocFrom: '',
      matDocUntil: '',
      companyName: '',
      materialTypeName: ''
    });
  };

  const handleEditClick = (material, event) => {
    event.stopPropagation();
    setSelectedMaterial(material);
    setEditMaterial({
      supplyType: material.supplyType || 1,
      netWeightId: material.netWeightId || '',
      netWeight: material.netWeight || '',
      brutWeightId: material.brutWeightId || '',
      brutWeight: material.brutWeight || '',
      stockUnitId: material.stockUnitId || '',
      isBom: material.isBom || 1,
      isRoute: material.isRoute || 1,
      isDeleted: material.isDeleted || false,
      isPassive: material.isPassive || false,
      shortText: material.shortText || '',
      longText: material.longText || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/material/head/${selectedMaterial.id}`, editMaterial);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Kayıt başarıyla güncellendi',
          severity: 'success'
        });
        setIsEditModalOpen(false);
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/material/head');
        if (refreshResponse.data.status === 'OK') {
          setMaterialHeads(refreshResponse.data.data);
          setFilteredMaterialHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt güncellenirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Update material error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt güncellenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (material, event) => {
    event.stopPropagation();
    setMaterialToDelete(material);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/material/head/${materialToDelete.id}`);
      
      if (response.data.status === 'OK') {
        setSnackbar({
          open: true,
          message: 'Kayıt başarıyla silindi',
          severity: 'success'
        });
        // Tabloyu yenile
        const refreshResponse = await axios.get('http://localhost:8080/material/head');
        if (refreshResponse.data.status === 'OK') {
          setMaterialHeads(refreshResponse.data.data);
          setFilteredMaterialHeads(refreshResponse.data.data);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Kayıt silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Delete material error:', err);
      setSnackbar({
        open: true,
        message: 'Kayıt silinirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setMaterialToDelete(null);
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
            Malzeme Bilgileri
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
              <TableCell sx={{ fontWeight: 'bold' }}>Malzeme Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterialHeads.map((head) => (
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
                <TableCell>{head.matDocFrom}</TableCell>
                <TableCell>{head.matDocUntil}</TableCell>
                <TableCell>{head.companyName}</TableCell>
                <TableCell>{head.materialTypeName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Detay Görüntüle">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/material/head/${head.id}`)}
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
        aria-labelledby="add-material-modal"
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
            Yeni Malzeme Bilgisi Ekle
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newMaterial.companyId}
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
              <InputLabel>Malzeme</InputLabel>
              <Select
                value={newMaterial.materialId}
                onChange={handleInputChange('materialId')}
                label="Malzeme"
              >
                {materials.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.docType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Belge Numarası"
              size="small"
              fullWidth
              value={newMaterial.matDocNumber}
              onChange={handleInputChange('matDocNumber')}
            />

            <TextField
              label="Başlangıç Tarihi"
              type="date"
              size="small"
              fullWidth
              value={newMaterial.matDocFrom}
              onChange={handleInputChange('matDocFrom')}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Bitiş Tarihi"
              type="date"
              size="small"
              fullWidth
              value={newMaterial.matDocUntil}
              onChange={handleInputChange('matDocUntil')}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Net Ağırlık Birimi</InputLabel>
              <Select
                value={newMaterial.newWeightId}
                onChange={handleInputChange('newWeightId')}
                label="Net Ağırlık Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Net Ağırlık"
              size="small"
              fullWidth
              value={newMaterial.netWeight}
              onChange={handleInputChange('netWeight')}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Brüt Ağırlık Birimi</InputLabel>
              <Select
                value={newMaterial.brutWeightId}
                onChange={handleInputChange('brutWeightId')}
                label="Brüt Ağırlık Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Brüt Ağırlık"
              size="small"
              fullWidth
              value={newMaterial.brutWeight}
              onChange={handleInputChange('brutWeight')}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Stok Birimi</InputLabel>
              <Select
                value={newMaterial.stockUnitId}
                onChange={handleInputChange('stockUnitId')}
                label="Stok Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newMaterial.isBom === 1}
                  onChange={(e) => setNewMaterial(prev => ({
                    ...prev,
                    isBom: e.target.checked ? 1 : 0
                  }))}
                />
              }
              label="Ürün Ağacı"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newMaterial.isRoute === 1}
                  onChange={(e) => setNewMaterial(prev => ({
                    ...prev,
                    isRoute: e.target.checked ? 1 : 0
                  }))}
                />
              }
              label="Rota"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newMaterial.isDeleted}
                  onChange={(e) => setNewMaterial(prev => ({
                    ...prev,
                    isDeleted: e.target.checked
                  }))}
                />
              }
              label="Silinmiş"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newMaterial.isPassive}
                  onChange={(e) => setNewMaterial(prev => ({
                    ...prev,
                    isPassive: e.target.checked
                  }))}
                />
              }
              label="Pasif"
            />

            <TextField
              label="Kısa Açıklama"
              size="small"
              fullWidth
              value={newMaterial.shortText}
              onChange={handleInputChange('shortText')}
            />

            <TextField
              label="Uzun Açıklama"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={newMaterial.longText}
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
                onClick={handleAddMaterial}
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
        aria-labelledby="edit-material-modal"
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
            Malzeme Bilgisi Güncelle
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tedarik Tipi</InputLabel>
              <Select
                value={editMaterial.supplyType}
                onChange={(e) => setEditMaterial(prev => ({ ...prev, supplyType: e.target.value }))}
                label="Tedarik Tipi"
              >
                <MenuItem value={0}>İç</MenuItem>
                <MenuItem value={1}>Dış</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Net Ağırlık Birimi</InputLabel>
              <Select
                value={editMaterial.netWeightId}
                onChange={(e) => setEditMaterial(prev => ({ ...prev, netWeightId: e.target.value }))}
                label="Net Ağırlık Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Net Ağırlık"
              size="small"
              fullWidth
              value={editMaterial.netWeight}
              onChange={(e) => setEditMaterial(prev => ({ ...prev, netWeight: e.target.value }))}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Brüt Ağırlık Birimi</InputLabel>
              <Select
                value={editMaterial.brutWeightId}
                onChange={(e) => setEditMaterial(prev => ({ ...prev, brutWeightId: e.target.value }))}
                label="Brüt Ağırlık Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Brüt Ağırlık"
              size="small"
              fullWidth
              value={editMaterial.brutWeight}
              onChange={(e) => setEditMaterial(prev => ({ ...prev, brutWeight: e.target.value }))}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Stok Birimi</InputLabel>
              <Select
                value={editMaterial.stockUnitId}
                onChange={(e) => setEditMaterial(prev => ({ ...prev, stockUnitId: e.target.value }))}
                label="Stok Birimi"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unitCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={editMaterial.isBom === 1}
                  onChange={(e) => setEditMaterial(prev => ({
                    ...prev,
                    isBom: e.target.checked ? 1 : 0
                  }))}
                />
              }
              label="Ürün Ağacı"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editMaterial.isRoute === 1}
                  onChange={(e) => setEditMaterial(prev => ({
                    ...prev,
                    isRoute: e.target.checked ? 1 : 0
                  }))}
                />
              }
              label="Rota"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editMaterial.isDeleted}
                  onChange={(e) => setEditMaterial(prev => ({
                    ...prev,
                    isDeleted: e.target.checked
                  }))}
                />
              }
              label="Silinmiş"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editMaterial.isPassive}
                  onChange={(e) => setEditMaterial(prev => ({
                    ...prev,
                    isPassive: e.target.checked
                  }))}
                />
              }
              label="Pasif"
            />

            <TextField
              label="Kısa Açıklama"
              size="small"
              fullWidth
              value={editMaterial.shortText}
              onChange={(e) => setEditMaterial(prev => ({ ...prev, shortText: e.target.value }))}
            />

            <TextField
              label="Uzun Açıklama"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={editMaterial.longText}
              onChange={(e) => setEditMaterial(prev => ({ ...prev, longText: e.target.value }))}
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
            value={filters.matDocFrom}
            onChange={handleFilterChange('matDocFrom')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Bitiş Tarihi"
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            value={filters.matDocUntil}
            onChange={handleFilterChange('matDocUntil')}
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
            label="Malzeme Tipi"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.materialTypeName}
            onChange={handleFilterChange('materialTypeName')}
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
    </Box>
  );
};

export default MaterialHeadTable; 