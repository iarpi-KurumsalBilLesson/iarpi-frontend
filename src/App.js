import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import SupportTablesPage from './components/pages/SupportTablesPage';
import CompanyTable from './components/pages/support-tables/CompanyTable';
import CompanyDetail from './components/pages/support-tables/CompanyDetail';

// Örnek sayfa bileşenleri
const HomePage = () => <div>Ana Sayfa İçeriği</div>;
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
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
