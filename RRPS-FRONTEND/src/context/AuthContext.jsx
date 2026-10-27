import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rrps_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('rrps_token') || '';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rrps_user', JSON.stringify(currentUser));
      const currentToken = localStorage.getItem('rrps_token');
      if (!currentToken && currentUser.email) {
        authApi.login(currentUser.email, 'password')
          .then(res => {
            if (res && res.token) {
              setToken(res.token);
              localStorage.setItem('rrps_token', res.token);
            }
          })
          .catch(err => console.warn('Initial token fetch error:', err));
      }
    } else {
      localStorage.removeItem('rrps_user');
      localStorage.removeItem('rrps_token');
    }
  }, [currentUser]);

  const login = async (email, password, role) => {
    try {
      const res = await authApi.login(email, password);
      if (res && res.token) {
        const userObj = {
          id: res.userId,
          name: res.name,
          email: res.email,
          role: (res.role || role || 'CUSTOMER').toLowerCase(),
          avatar: (res.name ? res.name[0] : 'U').toUpperCase()
        };
        setCurrentUser(userObj);
        setToken(res.token);
        localStorage.setItem('rrps_token', res.token);
        return { success: true, user: userObj, token: res.token };
      }
    } catch (err) {
      console.warn('Backend login fallback to local user data:', err.message);
    }

    // Local fallback matching
    const matched = INITIAL_USERS.find(
      u => (email && u.email.toLowerCase() === email.toLowerCase()) || 
           (role && u.role.toLowerCase() === role.toLowerCase())
    );

    if (matched) {
      setCurrentUser(matched);
      return { success: true, user: matched };
    } else {
      const customUser = {
        id: Date.now(),
        name: email ? email.split('@')[0] : 'User',
        email: email || 'user@enterprise.com',
        role: (role || 'customer').toLowerCase(),
        avatar: (email ? email[0] : 'U').toUpperCase()
      };
      setCurrentUser(customUser);
      return { success: true, user: customUser };
    }
  };

  const switchRole = async (newRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role.toLowerCase() === newRole.toLowerCase());
    if (targetUser && targetUser.email) {
      await login(targetUser.email, 'password123', targetUser.role);
    } else {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('rrps_user');
    localStorage.removeItem('rrps_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
