import React, { useState } from "react";
import { Box, Button, Checkbox, Container, FormControlLabel, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission

    if (username === "" || password === "") {
      alert('Please enter both username and password');
      return;
    }

    // build request payload
    let payload = {
      username: username,
      password: password,
      admin: admin
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }


    fetch(`${process.env.REACT_APP_BACKEND}/register`, requestOptions)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          alert(data.error);
          console.log(data.error)
        } else {
          alert("Success");
          navigate("/");
        }
      })
      .catch(error => {
        alert(error);
      })
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <h2>Register</h2>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box mt={2}>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            fullWidth
            inputProps={{ maxLength: 10 }}
          />
        </Box>
        <Box mt={2}>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
            inputProps={{ maxLength: 10 }}
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                id="admin"
                onChange={(event) => setAdmin(event.target.checked)}
              />
            }
            label="I am an admin (for demo purposes)"
          />
        </Box>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default RegisterPage;
