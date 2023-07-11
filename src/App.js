import React, { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Homepage';
import Navbar from './Navbar';
import BookingManagement from './BookingManagement';
import RegisterPage from './Register';

// Created context
export const UserContext = createContext();

// That component separates user context from app, so we don't pollute it
function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    jwtToken: "",
    username: "",
    isAdmin: false
  });
  const [isLoading, setLoading] = useState(false);

  // We want to remember value reference, otherwise we will have unnecessary rerenders
  const value = useMemo(() => {
    return {
      user,
      setUser,
      isLoading,
      setLoading,
    };
  }, [user, setUser, isLoading, setLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function App() {
  const { user, isLoading } = useContext(UserContext);
  useEffect(() => {
  }, [isLoading])

  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/booking-management"
            element={isLoading
              ? <div>Loading...</div> // Show a loading screen while fetching the token
              : user.jwtToken !== ""
                ? <BookingManagement />
                : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
        </Routes>
      </div>
    </div>
  );
}

// wrap App inside UserContextProvider
function AppWrapper() {
  return (
    <UserContextProvider>
      <App />
    </UserContextProvider>
  );
}

export default AppWrapper;