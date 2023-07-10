import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from './App';
import jwtDecode from "jwt-decode";
import { AppBar, Toolbar, IconButton, Typography, Button, TextField, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  const [usernameLogin, setUsernameLogin] = useState("");
  const [password, setPassword] = useState("");
  const [tickInterval, setTickInterval] = useState();

  const { user, setUser, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleRefresh = useCallback((status) => {
    console.log("Current user: ", user);
    console.log(Date.now());
    // clear the previous interval if one is running
    if (tickInterval !== null) {
      console.log("Duplicate tick interval", tickInterval);
      clearInterval(tickInterval);
      setTickInterval(null);
    }

    if (status) {
      let i = setInterval(() => {
        console.log("Runs every 10 mins");
        const requestOptions = {
          method: "GET",
          credentials: "include",
        }

        fetch('/refresh', requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              const decodedData = jwtDecode(data.access_token);
              console.log("Decoded data: ", decodedData);
              setUser({
                jwtToken: data.access_token,
                username: decodedData.username,
                isAdmin: decodedData.isAdmin,
              })
            }
          })
          .catch(error => {
            console.log("User is not logged in ", error);
          })
      }, 600000); // every 10 mins
      setTickInterval(i);
    } else {
      console.log("Turning off tick interval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])

  useEffect(() => {
    if (user.jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }

      fetch('/refresh', requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.access_token) {
            const decodedData = jwtDecode(data.access_token);
            console.log("Decoded data: ", decodedData);
            setUser({
              jwtToken: data.access_token,
              username: decodedData.username,
              isAdmin: decodedData.isAdmin,
            })
          }
        })
        .catch(error => {
          console.log("User is not logged in ", error);
          setLoading(false);
        })
    }
  }, [user])

  // Use an effect to navigate when the user info is updated
  // due to async nature of set state we only use 1 set state to avoid racing
  useEffect(() => {
    toggleRefresh(true);
    setLoading(false);
    console.log("Navigating to booking management, user details: ", user);
    navigate('/booking-management');
    return () => {
      toggleRefresh(false);
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission

    if (usernameLogin === "" || password === "") {
      alert('Please enter both username and password');
    }

    // build request payload
    let payload = {
      username: usernameLogin,
      password: password,
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }

    fetch("/authenticate", requestOptions)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          alert('Invalid username or password');
        } else {
          const decodedData = jwtDecode(data.access_token);
          console.log("Decoded data: ", decodedData);
          setUser({
            jwtToken: data.access_token,
            username: decodedData.username,
            isAdmin: decodedData.isAdmin,
          })
        }
      })
      .catch(error => {
        alert(error);
        setLoading(false);
      })
  };

  const handleLogout = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch('/logout', requestOptions)
      .catch(error => {
        console.log("Error logging out", error);
      })
      .finally(() => {
        setUser({
          username: "",
          jwtToken: "",
          isAdmin: false,
        })
        toggleRefresh(false); // stop refresh token countdown
      })
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" sx={{ marginRight: '15px' }}>
          <img
            src={`${process.env.PUBLIC_URL}/orca.png`}
            alt="Orca logo"
            width='50px'
            height='50px'
          />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Book4U
        </Typography>
        {user.jwtToken !== "" && (
          <Button color="inherit" onClick={() => navigate('/booking-management')}>
            Manage Bookings
          </Button>
        )}
        {user.jwtToken === "" ? (
          <form onSubmit={handleSubmit}>
            <TextField
              variant="standard"
              placeholder="Username"
              value={usernameLogin}
              onChange={(event) => setUsernameLogin(event.target.value)}
              sx={{ marginRight: '10px' }}
            />
            <TextField
              variant="standard"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              sx={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="secondary" type="submit" sx={{ marginRight: '10px' }}>
              Login
            </Button>
            <Button variant="contained" color="secondary" type="button" onClick={handleRegister}>
              Register
            </Button>
          </form>
        ) : (
          <Box display="flex" alignItems="center" sx={{ marginRight: '15px' }}>
            <AccountCircleIcon />
            <Typography variant="subtitle1">
              User: {user.username}
            </Typography>
            <Button variant="contained" color="secondary" type="button" onClick={handleLogout} sx={{ marginLeft: '15px' }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}


export default Navbar;