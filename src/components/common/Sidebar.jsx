// components/Sidebar.jsx
'use client';

import { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Calendar,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import Image from 'next/image';

const Sidebar = ({
  // Props pour personnaliser le comportement
  user = {},
  onNavigate = () => {},
  onLogout = () => {},
  activeItem = 'dashboard',
  isCollapsed = false,
  onToggleCollapse = () => {},
  logoUrl = '',
  className = '',
  menuItems = []
}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Items de menu par défaut si non fournis
  const defaultMenuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'requests',
      label: 'Requêtes',
      icon: FileText,
      path: '/requests',
      submenu: [
        { id: 'all-requests', label: 'Toutes les requêtes', path: '/requests' },
        { id: 'new-request', label: 'Nouvelle requête', path: '/requests/new' },
        { id: 'my-requests', label: 'Mes requêtes', path: '/requests/mine' }
      ]
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Calendar,
      path: '/resources'
    },
    {
      id: 'academic',
      label: 'Académique',
      icon: BookOpen,
      path: '/academic',
      submenu: [
        { id: 'schedules', label: 'Emplois du temps', path: '/academic/schedules' },
        { id: 'certificates', label: 'Certificats', path: '/academic/certificates' },
        { id: 'equivalences', label: 'Équivalences', path: '/academic/equivalences' }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
      path: '/finance',
      submenu: [
        { id: 'purchases', label: 'Achats', path: '/finance/purchases' },
        { id: 'expenses', label: 'Notes de frais', path: '/finance/expenses' },
        { id: 'budget', label: 'Budget', path: '/finance/budget' }
      ]
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: BarChart3,
      path: '/reports'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      path: '/users',
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      path: '/settings'
    }
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  // Filtrer les items selon les permissions de l'utilisateur
  const filterMenuItems = (items) => {
    return items.filter(item => {
      if (item.adminOnly && user.role !== 'admin') return false;
      return true;
    });
  };

  const handleSubMenuToggle = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const handleNavigation = (item) => {
    onNavigate(item);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo et nom */}
      <div className={`flex items-center px-6 py-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : ''}`}>
        {logoUrl && (
          <Image 
            src={logoUrl} 
            alt="Logo" 
            width={isCollapsed ? 32 : 40} 
            height={isCollapsed ? 32 : 40}
            className="object-contain"
          />
        )}
        {!isCollapsed && (
          <div className="ml-3">
            <h1 className="text-xl font-bold" style={{ color: '#3B82F6' }}>
              AdminFlow
            </h1>
            <p className="text-sm text-gray-500">Gestion administrative</p>
          </div>
        )}
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filterMenuItems(items).map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openSubmenu === item.id;

          return (
            <div key={item.id} className="mb-1">
              {/* Item principal */}
              <div
                onClick={() => hasSubmenu ? handleSubMenuToggle(item.id) : handleNavigation(item)}
                className={`
                  flex items-center px-6 py-3 cursor-pointer transition-colors
                  ${isActive ? 'bg-primary/10 border-r-2' : 'hover:bg-gray-50'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                style={{ 
                  borderColor: isActive ? '#3B82F6' : 'transparent',
                  backgroundColor: isActive ? '#3B82F610' : undefined
                }}
              >
                <Icon 
                  className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-500'}`}
                  style={{ color: isActive ? '#3B82F6' : undefined }}
                />
                {!isCollapsed && (
                  <>
                    <span className={`ml-3 ${isActive ? 'text-primary font-medium' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    {hasSubmenu && (
                      <ChevronDown 
                        className={`ml-auto w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Sous-menu */}
              {hasSubmenu && !isCollapsed && isOpen && (
                <div className="ml-8 py-1">
                  {item.submenu.map((subitem) => (
                    <div
                      key={subitem.id}
                      onClick={() => handleNavigation(subitem)}
                      className={`
                        flex items-center px-6 py-2 text-sm cursor-pointer transition-colors
                        ${activeItem === subitem.id ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}
                      `}
                      style={{ color: activeItem === subitem.id ? '#3B82F6' : undefined }}
                    >
                      {subitem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profil utilisateur et déconnexion */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && user.name && (
          <div className="flex items-center px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
              <span className="text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`
            flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
        style={{ backgroundColor: '#3B82F6' }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

/*

Comment utiliser ce composant

########## Récupération des données et navigation : ##########

const Layout = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Récupération des données utilisateur
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const userData = await getCurrentUser(); // votre fonction
      setUser(userData);
    };
    fetchUserData();
  }, []);

  // Gestion de la navigation
  const handleNavigation = (item) => {
    setActiveItem(item.id);
    router.push(item.path);
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await logout(); // votre fonction de logout
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        user={user}
        activeItem={activeItem}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        
        </main>
        </div>
      );
    };

########## Personnalisation avec vos propres menus : ##########

const customMenuItems = [
      {
        id: 'home',
        label: 'Accueil',
        icon: Home,
        path: '/'
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: FileText,
        path: '/documents',
        submenu: [
          { id: 'templates', label: 'Modèles', path: '/documents/templates' },
          { id: 'shared', label: 'Partagés', path: '/documents/shared' }
        ]
      },
      // ... autres items
    ];
    
    <Sidebar
      menuItems={customMenuItems}
      user={currentUser}
      activeItem={activeRoute}
      onNavigate={handleNavigation}
    />

########## Gestion de l'état collapsed : ##########

const [isCollapsed, setIsCollapsed] = useState(false);
    
    <Sidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      // ... autres props
    />
*/