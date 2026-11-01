import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import V4Layout from './components/layout/V4Layout';
import CookieBanner from './components/ui/CookieBanner';
import CursorEffects from './components/ui/CursorEffects';

// Exact Lovable V7 Routes (1:1 zero-deviation copies)
import { Route as HomeRoute } from './routes/index';
import { Route as AboutRoute } from './routes/about';
import { Route as WhatWeDoRoute } from './routes/what-we-do';
import { Route as BrandIdentityRoute } from './routes/services.brand-identity';
import { Route as WebsitesDigitalRoute } from './routes/services.websites-digital';
import { Route as MarketingGrowthRoute } from './routes/services.marketing-growth';
import { Route as CommunicationContentRoute } from './routes/services.communication-content';
import { Route as PhysicalProductionRoute } from './routes/services.physical-production';
import { Route as WorkIndexRoute } from './routes/work.index';
import { Route as WorkSlugRoute } from './routes/work.$slug';
import { Route as IdeasIndexRoute } from './routes/ideas.index';
import { Route as IdeasSlugRoute } from './routes/ideas.$slug';
import { Route as ToolsRoute } from './routes/tools';
import { Route as LabRoute } from './routes/lab';
import { Route as ShopRoute } from './routes/shop';
import { Route as StartProjectRoute } from './routes/start-a-project';
import { RokitNotFound } from './components/rokit-not-found';

// Legacy / Portal / Auth / Admin pages
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Health from './pages/Health';
import SolutionNGO from './pages/SolutionNGO';
import SolutionSME from './pages/SolutionSME';
import PhotoEnhancer from './pages/PhotoEnhancer';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

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
import ClientsManager from './pages/admin/ClientsManager';
import MediaBridge from './pages/admin/MediaBridge';
import AdminLayout from './components/layout/AdminLayout';

const HomePage = HomeRoute.component;
const AboutPage = AboutRoute.component;
const WhatWeDoPage = WhatWeDoRoute.component;
const BrandIdentityPage = BrandIdentityRoute.component;
const WebsitesDigitalPage = WebsitesDigitalRoute.component;
const MarketingGrowthPage = MarketingGrowthRoute.component;
const CommunicationContentPage = CommunicationContentRoute.component;
const PhysicalProductionPage = PhysicalProductionRoute.component;
const WorkIndexPage = WorkIndexRoute.component;
const WorkSlugPage = WorkSlugRoute.component;
const IdeasIndexPage = IdeasIndexRoute.component;
const IdeasSlugPage = IdeasSlugRoute.component;
const ToolsPage = ToolsRoute.component;
const LabPage = LabRoute.component;
const ShopPage = ShopRoute.component;
const StartProjectPage = StartProjectRoute.component;

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pathname !== this.props.pathname && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return <RokitNotFound />;
    }
    return this.props.children;
  }
}

function LovableShell() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <RouteErrorBoundary pathname={location.pathname}>
      <Outlet />
    </RouteErrorBoundary>
  );
}

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
    <CursorEffects />
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
        {/* Exact Lovable V7 Public Routes */}
        <Route element={<LovableShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/what-we-do" element={<WhatWeDoPage />} />
          <Route path="/services" element={<Navigate to="/what-we-do" replace />} />
          <Route path="/services/brand-identity" element={<BrandIdentityPage />} />
          <Route path="/services/websites-digital" element={<WebsitesDigitalPage />} />
          <Route path="/services/marketing-growth" element={<MarketingGrowthPage />} />
          <Route path="/services/communication-content" element={<CommunicationContentPage />} />
          <Route path="/services/physical-production" element={<PhysicalProductionPage />} />
          <Route path="/work" element={<WorkIndexPage />} />
          <Route path="/work/:slug" element={<WorkSlugPage />} />
          <Route path="/gallery" element={<Navigate to="/work" replace />} />
          <Route path="/gallery/:slug" element={<WorkSlugPage />} />
          <Route path="/ideas" element={<IdeasIndexPage />} />
          <Route path="/ideas/:slug" element={<IdeasSlugPage />} />
          <Route path="/tutorials" element={<Navigate to="/ideas" replace />} />
          <Route path="/tutorials/:slug" element={<IdeasSlugPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/start-a-project" element={<StartProjectPage />} />
          <Route path="/contact" element={<Navigate to="/start-a-project" replace />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="portfolio-manager" element={<Navigate to="/admin/portfolio" replace />} />
          <Route path="tutorials" element={<TutorialsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="customers" element={<CustomersManager />} />
          <Route path="clients" element={<ClientsManager />} />
          <Route path="media-bridge" element={<MediaBridge />} />
        </Route>

        {/* Utility / Auth / Portal Routes */}
        <Route element={<V4Layout />}>
          <Route path="/photo-enhancer" element={<PhotoEnhancer />} />
          <Route path="/portal/quotes/new" element={<NewQuote />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/health" element={<Health />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/portal" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Route>

        {/* Portal Action Routes */}
        <Route element={<MainLayout />}>
          <Route path="/solutions/ngo" element={<SolutionNGO />} />
          <Route path="/solutions/sme" element={<SolutionSME />} />
          <Route path="/portal/orders/new" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
          <Route path="/portal/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/portal/designs/new" element={<ProtectedRoute><NewDesign /></ProtectedRoute>} />
          <Route path="/portal/order" element={<Navigate to="/portal/orders/new" replace />} />
          <Route path="/portal/quote" element={<Navigate to="/portal/quotes/new" replace />} />
          <Route path="/portal/design" element={<Navigate to="/portal/designs/new" replace />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<RokitNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
