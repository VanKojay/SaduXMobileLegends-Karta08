import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

// Custom hook untuk menggunakan AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token saat aplikasi dimuat
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, account } = response.data;

      // Simpan token dan user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(account));

      setUser(account);
      setIsAuthenticated(true);

      return { success: true, data: account };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login gagal'
      };
    }
  };

  // Register function
  const register = async (teamData) => {
    try {
      const response = await authService.register(teamData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registrasi gagal' 
      };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Role checking functions
  const isSuperAdmin = () => {
    return user?.type === 'super_admin';
  };

  const isAdmin = () => {
    return user?.type === 'admin';
  };

  const isAdminOrSuperAdmin = () => {
    return user?.type === 'admin' || user?.type === 'super_admin';
  };

  const isTeam = () => {
    return user?.type === 'team';
  };

  const isMember = () => {
    return user?.type === 'member';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    isSuperAdmin,
    isAdmin,
    isAdminOrSuperAdmin,
    isTeam,
    isMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };
export default AuthContext;
