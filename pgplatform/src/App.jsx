import { AppProvider, useApp } from './context/AppContext';
import IntroScreen from './pages/IntroScreen';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';

// Tenant
import TenantDashboard from './pages/tenant/TenantDashboard';
import SearchProperties from './pages/tenant/SearchProperties';
import TenantPayments from './pages/tenant/TenantPayments';
import ServiceRequests from './pages/tenant/ServiceRequests';
import CommunityFood from './pages/tenant/CommunityFood';
import TenantProfile from './pages/tenant/TenantProfile';

// Owner
import OwnerDashboard from './pages/owner/OwnerDashboard';
import RoomManagement from './pages/owner/RoomManagement';
import TenantManagement from './pages/owner/TenantManagement';
import OwnerPayments from './pages/owner/OwnerPayments';
import OwnerServiceRequests from './pages/owner/OwnerServiceRequests';
import CheckInOut from './pages/owner/CheckInOut';
import StaffManagement from './pages/owner/StaffManagement';
import InventoryManagement from './pages/owner/InventoryManagement';
import ReportsPage from './pages/owner/ReportsPage';
import OwnerSettings from './pages/owner/OwnerSettings';
import VisitorManagement from './pages/owner/VisitorManagement';
  
// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminKYC from './pages/admin/AdminKYC';

import {
  LayoutDashboard, Search, CreditCard, Wrench, Users, BedDouble,
  IndianRupee, Building2, ShieldCheck, User, Utensils,
  UserCheck, Users2, Package, BarChart2, Settings, Eye,
  Globe, Bot
} from 'lucide-react';

const tenantNav = [
  { key:'dashboard', label:'Dashboard',        icon:LayoutDashboard, component:TenantDashboard },
  { key:'search',    label:'Find a Room',      icon:Search,          component:SearchProperties },
  { key:'payments',  label:'Payments',         icon:CreditCard,      component:TenantPayments },
  { key:'requests',  label:'Service Requests', icon:Wrench,          component:ServiceRequests },
  { key:'community', label:'Food & Community', icon:Utensils,        component:CommunityFood },
  { key:'profile',   label:'My Profile & KYC', icon:User,            component:TenantProfile },
];

const ownerNav = [
  { key:'dashboard',  label:'Dashboard',         icon:LayoutDashboard,  component:OwnerDashboard },
  { key:'rooms',      label:'Rooms & Beds',      icon:BedDouble,        component:RoomManagement },
  { key:'tenants',    label:'Tenants',           icon:Users,            component:TenantManagement },
  { key:'checkinout', label:'Check-In / Out',    icon:UserCheck,        component:CheckInOut },
  { key:'payments',   label:'Payments',          icon:IndianRupee,      component:OwnerPayments },
  { key:'requests',   label:'Complaints',        icon:Wrench,           component:OwnerServiceRequests },
  { key:'staff',      label:'Staff',             icon:Users2,           component:StaffManagement },
  { key:'visitors',   label:'Visitors',          icon:Eye,              component:VisitorManagement },
  { key:'inventory',  label:'Inventory',         icon:Package,          component:InventoryManagement },
  { key:'food',       label:'Food',              icon:Utensils,         component:CommunityFood },
  { key:'reports',    label:'Reports',           icon:BarChart2,        component:ReportsPage },
  { key:'settings',   label:'Settings',          icon:Settings,         component:OwnerSettings },
];

const adminNav = [
  { key:'dashboard',  label:'Dashboard',         icon:LayoutDashboard,  component:AdminDashboard },
  { key:'users',      label:'User Management',   icon:Users,            component:AdminUsers },
  { key:'properties', label:'Property Approvals',icon:Building2,        component:AdminProperties },
  { key:'kyc',        label:'KYC Verification',  icon:ShieldCheck,      component:AdminKYC },
];

function AppRouter() {
  const { phase, user } = useApp();
  if (phase==='intro')   return <IntroScreen/>;
  if (phase==='landing') return <LandingPage/>;
  if (phase==='auth')    return <AuthPage/>;
  if (phase==='app' && user) {
    if (user.role==='tenant') return <Layout nav={tenantNav}  title="Tenant Portal"/>;
    if (user.role==='owner')  return <Layout nav={ownerNav}   title="Owner Dashboard"/>;
    if (user.role==='admin')  return <Layout nav={adminNav}   title="Admin Panel"/>;
  }
  return <LandingPage/>;
}

export default function App() {
  return <AppProvider><AppRouter/></AppProvider>;
}
