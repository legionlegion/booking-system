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
  const [username, setUsername] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [isLoading, setLoading] = useState(true);

  // We want to remember value reference, otherwise we will have unnecessary rerenders
  const value = useMemo(() => {
    return {
      username,
      setUsername,
      jwtToken,
      setJwtToken,
      isLoading,
      setLoading,
    };
  }, [username, setUsername, jwtToken, setJwtToken, isLoading, setLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function App() {
  const { jwtToken, isLoading } = useContext(UserContext);
  useEffect(() => {
    console.log("App is loading: ", isLoading)
    console.log("JWT token: ", jwtToken)
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
              : jwtToken !== ""
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