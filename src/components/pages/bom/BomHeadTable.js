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
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BomHeadTable = () => {
  const navigate = useNavigate();
  const [boms, setBoms] = useState([]);
  const [filteredBoms, setFilteredBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [materialHeads, setMaterialHeads] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [bomTypes, setBomTypes] = useState([]);
  const [newBom, setNewBom] = useState({
    companyId: '',
    bomDocNumber: '',
    bomDocFrom: '',
    bomDocUntil: '',
    quantity: '',
    drawNum: '',
    materialHeadId: '',
    materialTypeId: '',
    bomTypeId: ''
  });
  const [filters, setFilters] = useState({
    bomDocNumber: '',
    bomDocFrom: '',
    bomDocUntil: '',
    materialTypeName: '',
    bomTypeName: '',
    companyName: ''
  });

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/bom/head');
        
        if (response.data.status === 'OK') {
          setBoms(response.data.data);
          setFilteredBoms(response.data.data);
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

    fetchBoms();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [companiesRes, materialHeadsRes, materialTypesRes, bomTypesRes] = await Promise.all([
          axios.get('http://localhost:8080/companies'),
          axios.get('http://localhost:8080/material/head'),
          axios.get('http://localhost:8080/materials'),
          axios.get('http://localhost:8080/boms')
        ]);

        if (companiesRes.data.status === 'OK') {
          setCompanies(companiesRes.data.data);
        }
        if (materialHeadsRes.data.status === 'OK') {
          setMaterialHeads(materialHeadsRes.data.data);
        }
        if (materialTypesRes.data.status === 'OK') {
          setMaterialTypes(materialTypesRes.data.data);
        }
        if (bomTypesRes.data.status === 'OK') {
          setBomTypes(bomTypesRes.data.data);
        }
      } catch (err) {
        console.error('Dropdown data fetch error:', err);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const filtered = boms.filter(bom => {
      return (
        bom.bomDocNumber?.toLowerCase().includes(filters.bomDocNumber.toLowerCase()) &&
        bom.bomDocFrom?.toLowerCase().includes(filters.bomDocFrom.toLowerCase()) &&
        bom.bomDocUntil?.toLowerCase().includes(filters.bomDocUntil.toLowerCase()) &&
        bom.materialTypeName?.toLowerCase().includes(filters.materialTypeName.toLowerCase()) &&
        bom.bomTypeName?.toLowerCase().includes(filters.bomTypeName.toLowerCase()) &&
        bom.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    });
    setFilteredBoms(filtered);
  }, [filters, boms]);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNewBomChange = (field) => (event) => {
    setNewBom(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/bom/head', newBom);
      
      if (response.data.status === 'OK') {
        setIsModalOpen(false);
        // Tabloyu güncelle
        const bomsResponse = await axios.get('http://localhost:8080/bom/head');
        if (bomsResponse.data.status === 'OK') {
          setBoms(bomsResponse.data.data);
          setFilteredBoms(bomsResponse.data.data);
        }
        // Formu temizle
        setNewBom({
          companyId: '',
          bomDocNumber: '',
          bomDocFrom: '',
          bomDocUntil: '',
          quantity: '',
          drawNum: '',
          materialHeadId: '',
          materialTypeId: '',
          bomTypeId: ''
        });
      } else {
        setError('Kayıt eklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || 'Kayıt eklenirken bir hata oluştu');
    }
  };

  const clearFilters = () => {
    setFilters({
      bomDocNumber: '',
      bomDocFrom: '',
      bomDocUntil: '',
      materialTypeName: '',
      bomTypeName: '',
      companyName: ''
    });
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
            Ürün Ağacı Listesi
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
            Ürün Ağacı Listesi
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
            Ürün Ağacı Listesi
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
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
              <TableCell sx={{ fontWeight: 'bold' }}>Malzeme Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ürün Ağacı Tipi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBoms.map((bom) => (
              <TableRow key={bom.id}>
                <TableCell>{bom.bomDocNumber}</TableCell>
                <TableCell>{bom.bomDocFrom}</TableCell>
                <TableCell>{bom.bomDocUntil}</TableCell>
                <TableCell>{bom.materialTypeName}</TableCell>
                <TableCell>{bom.bomTypeName}</TableCell>
                <TableCell>{bom.companyName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/bom/head/${bom.id}`)}
                    sx={{ color: 'primary.main' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
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
            label="Belge Numarası"
            value={filters.bomDocNumber}
            onChange={handleFilterChange('bomDocNumber')}
            size="small"
            fullWidth
          />
          <TextField
            label="Başlangıç Tarihi"
            value={filters.bomDocFrom}
            onChange={handleFilterChange('bomDocFrom')}
            size="small"
            fullWidth
          />
          <TextField
            label="Bitiş Tarihi"
            value={filters.bomDocUntil}
            onChange={handleFilterChange('bomDocUntil')}
            size="small"
            fullWidth
          />
          <TextField
            label="Malzeme Tipi"
            value={filters.materialTypeName}
            onChange={handleFilterChange('materialTypeName')}
            size="small"
            fullWidth
          />
          <TextField
            label="Ürün Ağacı Tipi"
            value={filters.bomTypeName}
            onChange={handleFilterChange('bomTypeName')}
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
            Yeni Ürün Ağacı Ekle
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Şirket</InputLabel>
              <Select
                value={newBom.companyId}
                onChange={handleNewBomChange('companyId')}
                label="Şirket"
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.comCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Belge Numarası"
              value={newBom.bomDocNumber}
              onChange={handleNewBomChange('bomDocNumber')}
              size="small"
              fullWidth
            />

            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={newBom.bomDocFrom}
              onChange={handleNewBomChange('bomDocFrom')}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={newBom.bomDocUntil}
              onChange={handleNewBomChange('bomDocUntil')}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Miktar"
              type="number"
              value={newBom.quantity}
              onChange={handleNewBomChange('quantity')}
              size="small"
              fullWidth
            />

            <TextField
              label="Çizim Numarası"
              value={newBom.drawNum}
              onChange={handleNewBomChange('drawNum')}
              size="small"
              fullWidth
            />

            <FormControl fullWidth size="small">
              <InputLabel>Malzeme</InputLabel>
              <Select
                value={newBom.materialHeadId}
                onChange={handleNewBomChange('materialHeadId')}
                label="Malzeme"
              >
                {materialHeads.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.docNum}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Malzeme Tipi</InputLabel>
              <Select
                value={newBom.materialTypeId}
                onChange={handleNewBomChange('materialTypeId')}
                label="Malzeme Tipi"
              >
                {materialTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.docType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Ürün Ağacı Tipi</InputLabel>
              <Select
                value={newBom.bomTypeId}
                onChange={handleNewBomChange('bomTypeId')}
                label="Ürün Ağacı Tipi"
              >
                {bomTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.docType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setIsModalOpen(false)}
                fullWidth
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
              >
                Kaydet
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default BomHeadTable; 