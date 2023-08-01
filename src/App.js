import React, { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Homepage from './Homepage';
import Navbar from './Navbar';
import BookingManagement from './BookingManagement';
import RegisterPage from './Register';
import { Container } from '@mui/material';

// Created context
export const UserContext = createContext();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvdAXi9pl0PeQtTIMSRbJTvM7kqXisrGg",
  authDomain: "syal-2ae9b.firebaseapp.com",
  projectId: "syal-2ae9b",
  storageBucket: "syal-2ae9b.appspot.com",
  messagingSenderId: "289513469289",
  appId: "1:289513469289:web:a97ef659fd2c2379d8b9f8",
  measurementId: "G-4W6RY89KJM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
      <Container>
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
      </Container>
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