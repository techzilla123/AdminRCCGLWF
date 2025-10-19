import { useState, useEffect } from 'react';
import Logo from "./assets/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";
// Dashboard components
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Events } from './components/Events';
import { Donations } from './components/Donations';
import { Volunteers } from './components/Volunteers';
import { Communications } from './components/Communications';
import { Blog } from './components/Blog';
import { Settings } from './components/Settings';
// Auth components
import { Login } from './components/auth/Login';
import { ForgotPassword } from './components/auth/ForgotPassword';
import Verify from './components/auth/Verify';
import ResetPassword from './components/auth/ResetPassword';
import AuthExpired from './components/auth/AuthExpired';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  HandHeart, 
  MessageSquare, 
  FileText,
  Settings as SettingsIcon,
  Church
} from 'lucide-react';
import { authAPI } from './utils/api';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, component: Dashboard },
  { id: 'members', label: 'Members', icon: Users, component: Members },
  { id: 'events', label: 'Events', icon: Calendar, component: Events },
  { id: 'donations', label: 'Donations', icon: DollarSign, component: Donations },
  { id: 'volunteers', label: 'Volunteers', icon: HandHeart, component: Volunteers },
  { id: 'communications', label: 'Communications', icon: MessageSquare, component: Communications },
  { id: 'blog', label: 'Blog', icon: FileText, component: Blog },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, component: Settings },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'verify-forgot' | 'reset-password' | 'expired'>('login');
  const [hasAdmin, setHasAdmin] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing authentication and admin on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if admin exists
        const { hasAdmin: adminExists } = await authAPI.checkAdmin();
        setHasAdmin(adminExists);
        
        // Try to get stored access token and restore session
        const storedToken = localStorage.getItem('churchAdmin_accessToken');
        
        if (storedToken) {
          // Token exists, verify it's still valid
          try {
            const { session, user } = await authAPI.getSession();
            
            if (session && user) {
              setIsAuthenticated(true);
              setCurrentUserEmail(user.email || '');
              const savedSection = localStorage.getItem('churchAdmin_activeSection');
              if (savedSection) {
                setActiveSection(savedSection);
              }
            } else {
              // Token is invalid, clear it
              setIsAuthenticated(false);
              localStorage.removeItem('churchAdmin_accessToken');
            }
          } catch (error) {
            // Session check failed, clear token
            console.error('Session validation failed:', error);
            setIsAuthenticated(false);
            localStorage.removeItem('churchAdmin_accessToken');
          }
        } else {
          // No token stored
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || Dashboard;

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError(null);
      setUserEmail(email);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        setCurrentUserEmail(email);
        toast.success('Login successful!');
        localStorage.setItem('churchAdmin_activeSection', activeSection);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setAuthError(null);
      setUserEmail(email);
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        // Store the code for development (in production, this would be sent via email)
        if (response.code) {
          setResetCode(response.code);
          console.log('Reset code:', response.code);
        }
        setAuthView('verify-forgot');
        toast.success('Reset code sent! Check console for code (dev mode).');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setAuthError(error.message || 'Failed to send reset code.');
    }
  };

  const handleVerifyForgot = async (code: string) => {
    try {
      setAuthError(null);
      const response = await authAPI.verifyResetCode(userEmail, code);
      
      if (response.success) {
        setAuthView('reset-password');
        toast.success('Code verified! You can now reset your password.');
      }
    } catch (error: any) {
      console.error('Verify code error:', error);
      setAuthError(error.message || 'Invalid or expired verification code.');
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      setAuthError(null);
      const response = await authAPI.resetPassword(userEmail, newPassword);
      
      if (response.success) {
        toast.success('Password reset successful! Please login with your new password.');
        setAuthView('login');
        setUserEmail('');
        setResetCode('');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setAuthError(error.message || 'Failed to reset password.');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await authAPI.forgotPassword(userEmail);
      if (response.code) {
        setResetCode(response.code);
        console.log('Reset code:', response.code);
      }
      toast.success('Verification code resent! Check console for code (dev mode).');
    } catch (error: any) {
      console.error('Resend code error:', error);
      toast.error(error.message || 'Failed to resend code.');
    }
  };

  const handleSessionExpired = async () => {
    setAuthView('expired');
    await authAPI.logout();
    localStorage.removeItem('churchAdmin_activeSection');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setActiveSection('dashboard');
      setUserEmail('');
      setCurrentUserEmail('');
      setAuthView('login');
      localStorage.removeItem('churchAdmin_activeSection');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out on frontend even if backend fails
      setIsAuthenticated(false);
      setAuthView('login');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    switch (authView) {
      case 'forgot':
        return (
          <ForgotPassword
            onSubmit={handleForgotPassword}
            onBackToLogin={() => setAuthView('login')}
            error={authError}
            onClearError={() => setAuthError(null)}
          />
        );
      case 'verify-forgot':
        return (
          <Verify
            email={userEmail}
            type="forgot"
            onVerify={handleVerifyForgot}
            onBackToLogin={() => setAuthView('login')}
            onResendCode={handleResendCode}
            error={authError}
            onClearError={() => setAuthError(null)}
          />
        );
      case 'reset-password':
        return (
          <ResetPassword
            email={userEmail}
            onResetPassword={handleResetPassword}
            onBackToLogin={() => setAuthView('login')}
            error={authError}
            onClearError={() => setAuthError(null)}
          />
        );
      case 'expired':
        return (
          <AuthExpired
            onBackToLogin={() => setAuthView('login')}
            onClose={() => setAuthView('login')}
          />
        );
      default:
        return (
          <Login
            onSubmit={handleLogin}
            onForgotPassword={() => setAuthView('forgot')}
            error={authError}
            onClearError={() => setAuthError(null)}
          />
        );
    }
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen w-full">
        <aside className="w-64 border-r border-border bg-sidebar">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-lg font-semibold">RCCG LWF Admin</h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    // Save active section to localStorage
                    localStorage.setItem('churchAdmin_activeSection', item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-sidebar-border">
          <div className="text-sm text-muted-foreground mb-2">
            <p>RCCG Living Word Forney</p>
            <p>Admin Portal v1.0</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-destructive hover:underline text-left"
          >
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <ActiveComponent />
        </div>
      </main>
      </div>
    </>
  );
}