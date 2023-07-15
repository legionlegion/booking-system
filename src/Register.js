import React, { useState } from "react";
import FormInput from "./FormInput";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
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
    <div className='container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          title="Username"
          type="text"
          name="username"
          id="username"
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <FormInput
          title="Password"
          type="password"
          name="password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                id="admin"
                onChange={(event) => setAdmin(event.target.checked)}
              />
            }
            label="I am an admin"
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default RegisterPage;
