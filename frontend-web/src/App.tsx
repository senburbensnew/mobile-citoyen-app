import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { UserForm } from './components/UserForm';
import { UsersList } from './components/UsersList';
import { AuditTrail } from './components/AuditTrail';
import { SystemSettings } from './components/SystemSettings';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ClipboardList, 
  LogOut, 
  Menu,
  X,
  Globe,
  Shield,
  Settings
} from 'lucide-react';
import { Badge } from './components/ui/badge';

type Page = 'dashboard' | 'users' | 'create-user' | 'audit-trail' | 'settings';

const AppContent = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return <Login />;
  }

  const menuItems = [
    { 
      id: 'dashboard' as Page, 
      label: t('dashboard'), 
      icon: LayoutDashboard,
      show: true,
    },
    { 
      id: 'users' as Page, 
      label: t('users'), 
      icon: Users,
      show: true,
    },
    { 
      id: 'create-user' as Page, 
      label: t('createUser'), 
      icon: UserPlus,
      show: currentUser.role === 'ADMIN' || currentUser.role === 'RH',
    },
    { 
      id: 'audit-trail' as Page, 
      label: t('auditTrail'), 
      icon: ClipboardList,
      show: currentUser.role === 'ADMIN',
    },
    { 
      id: 'settings' as Page, 
      label: t('settings'), 
      icon: Settings,
      show: currentUser.role === 'ADMIN',
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ht' : 'fr');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersList />;
      case 'create-user':
        return <UserForm onSuccess={() => setCurrentPage('users')} />;
      case 'audit-trail':
        return <AuditTrail />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-300',
      RH: 'bg-blue-100 text-blue-800 border-blue-300',
      GRAND_COMMIS: 'bg-purple-100 text-purple-800 border-purple-300',
      FONCTIONNAIRE: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Dashboard Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 border-l pl-3">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.fullName}</p>
                <Badge className={getRoleBadgeColor(currentUser.role)}>
                  {t(currentUser.role)}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </Button>
          </div>
        </div>

        {/* Mobile user info */}
        <div className="sm:hidden border-t px-4 py-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{currentUser.fullName}</p>
            <Badge className={getRoleBadgeColor(currentUser.role)}>
              {t(currentUser.role)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[73px] lg:top-[73px] left-0 z-30
            w-64 h-[calc(100vh-73px)] bg-white border-r
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}