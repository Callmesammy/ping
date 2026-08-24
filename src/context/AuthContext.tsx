import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userName: string;
  userAvatar: string;
  isAuthModalOpen: boolean;
  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('ping_user_name') || '@alex_vibe';
  });

  const [userAvatar, setUserAvatarState] = useState<string>(() => {
    return localStorage.getItem('ping_user_avatar') || '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const setUserName = (name: string) => {
    const formatted = name.startsWith('@') ? name : `@${name}`;
    setUserNameState(formatted);
    localStorage.setItem('ping_user_name', formatted);
  };

  const setUserAvatar = (avatar: string) => {
    setUserAvatarState(avatar);
    localStorage.setItem('ping_user_avatar', avatar);
  };

  return (
    <AuthContext.Provider
      value={{
        userName,
        userAvatar,
        isAuthModalOpen,
        setUserName,
        setUserAvatar,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
