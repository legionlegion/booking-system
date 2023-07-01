import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from './App';
import jwtDecode from "jwt-decode";

function Navbar() {
  const [usernameLogin, setUsernameLogin] = useState("");
  const [password, setPassword] = useState("");
  const [tickInterval, setTickInterval] = useState();

  const { user, setUser, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleRefresh = useCallback((status) => {
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
              setUser({
                ...user,
                jwtToken: data.access_token,
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
  }, [user, toggleRefresh])

  // Use an effect to navigate when the user info is updated
  // due to async nature of set state we only use 1 set state
  useEffect(() => {
    toggleRefresh(true);
    setLoading(false);
    console.log("Navigating to booking management, user details: ", user);
    navigate('/booking-management');
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
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'teal' }}>
      <div className="container-fluid">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${process.env.PUBLIC_URL}/orca.png`}
            alt="Orca logo"
            style={{ marginRight: '25px', width: '50px', height: '50px' }}
          />
          <div className="navbar-brand"
            onClick={() => navigate('/')}
            style={{ fontSize: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
            Book4U
          </div>
          {/* "Manage Bookings" link that only displays if jwtToken is not null or empty */}
          {user.jwtToken !== "" && (
            <div onClick={() => navigate('/booking-management')}
              style={{ cursor: 'pointer' }}>
              Manage Bookings
            </div>
          )}
        </div>
        {user.jwtToken === "" ? (
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="text"
              placeholder="Username"
              aria-label="Username"
              value={usernameLogin}
              onChange={(event) => setUsernameLogin(event.target.value)}
            />
            <input
              className="form-control me-2"
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className="btn btn-outline-info me-2" type="submit">
              Login
            </button>
            <button className="btn btn-outline-info" type="button" onClick={handleRegister}>
              Register
            </button>
          </form>
        ) : (
          <div>
            User: {user.username}
            <button className="btn btn-outline-info" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}


export default Navbar;