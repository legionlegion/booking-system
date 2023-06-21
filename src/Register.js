import React, { useState } from "react";
import Input from "./FormInput";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }


    fetch("/register", requestOptions)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          alert('Invalid username or password');
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
        <Input
          title="Username"
          type="text"
          name="username"
          id="username"
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <Input
          title="Password"
          type="password"
          name="password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
