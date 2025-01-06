import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import SupportTablesPage from './components/pages/SupportTablesPage';
import CompanyTable from './components/pages/support-tables/CompanyTable';
import CompanyDetail from './components/pages/support-tables/CompanyDetail';
import MaterialTable from './components/pages/support-tables/MaterialTable';
import CostCenterTable from './components/pages/support-tables/CostCenterTable';
import BomTable from './components/pages/support-tables/BomTable';
import RouteTable from './components/pages/support-tables/RouteTable';
import WorkCenterTable from './components/pages/support-tables/WorkCenterTable';
import OperationTable from './components/pages/support-tables/OperationTable';
import UnitTable from './components/pages/support-tables/UnitTable';
import HomePage from './components/pages/HomePage';
import MaterialHeadTable from './components/pages/material/MaterialHeadTable';
import MaterialHeadDetail from './components/pages/material/MaterialHeadDetail';
import CostCenterHeadTable from './components/pages/costcenter/CostCenterHeadTable';
import CostCenterHeadDetail from './components/pages/costcenter/CostCenterHeadDetail';
import WorkCenterDetail from './components/pages/support-tables/WorkCenterDetail';
import BomHeadTable from './components/pages/bom/BomHeadTable';
import BomHeadDetail from './components/pages/bom/BomHeadDetail';

// Örnek sayfa bileşenleri
const ContactPage = () => <div>İletişim Sayfası İçeriği</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#dbeafe',
      dark: '#1e40af',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: '1.15rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tables" element={<SupportTablesPage />} />
            <Route path="/tables/company" element={<CompanyTable />} />
            <Route path="/tables/company/:id" element={<CompanyDetail />} />
            <Route path="/material" element={<MaterialTable />} />
            <Route path="/cost-center" element={<CostCenterTable />} />
            <Route path="/bom" element={<BomTable />} />
            <Route path="/route-type" element={<RouteTable />} />
            <Route path="/work-center" element={<WorkCenterTable />} />
            <Route path="/tables/operation" element={<OperationTable />} />
            <Route path="/tables/unit" element={<UnitTable />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/material/head" element={<MaterialHeadTable />} />
            <Route path="/material/head/:id" element={<MaterialHeadDetail />} />
            <Route path="/costCenter/head" element={<CostCenterHeadTable />} />
            <Route path="/costCenter/head/:id" element={<CostCenterHeadDetail />} />
            <Route path="/work-center/head/:id" element={<WorkCenterDetail />} />
            <Route path="/bom/head" element={<BomHeadTable />} />
            <Route path="/bom/head/:id" element={<BomHeadDetail />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
