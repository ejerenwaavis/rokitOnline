import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieBanner from './components/ui/CookieBanner';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Gallery from './pages/Gallery';
import Tutorials from './pages/Tutorials';
import TutorialPost from './pages/TutorialPost';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Health from './pages/Health';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Portal
import Dashboard from './pages/portal/Dashboard';
import NewOrder from './pages/portal/NewOrder';
import OrderDetail from './pages/portal/OrderDetail';
import NewQuote from './pages/portal/NewQuote';
import NewDesign from './pages/portal/NewDesign';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import OrdersManager from './pages/admin/OrdersManager';
import PortfolioManager from './pages/admin/PortfolioManager';
import TutorialsManager from './pages/admin/TutorialsManager';
import ServicesManager from './pages/admin/ServicesManager';
import CustomersManager from './pages/admin/CustomersManager';
import AdminLayout from './components/layout/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? children : <Navigate to="/auth/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoggedIn } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/auth/login" replace />;
  if (!isAdmin()) return <Navigate to="/portal" replace />;
  return children;
};

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <CookieBanner />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="portfolio-manager" element={<Navigate to="/admin/portfolio" replace />} />
          <Route path="tutorials" element={<TutorialsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="customers" element={<CustomersManager />} />
        </Route>

        {/* Public + portal routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/tutorials/:slug" element={<TutorialPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/health" element={<Health />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/portal" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/portal/orders/new" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
          <Route path="/portal/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/portal/quotes/new" element={<NewQuote />} />
          <Route path="/portal/designs/new" element={<ProtectedRoute><NewDesign /></ProtectedRoute>} />
          <Route path="/portal/order" element={<Navigate to="/portal/orders/new" replace />} />
          <Route path="/portal/quote" element={<Navigate to="/portal/quotes/new" replace />} />
          <Route path="/portal/design" element={<Navigate to="/portal/designs/new" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
