import React, { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { config } from "./App";
import "./Signup.css";

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };
    if (validateInput(formData)) {
      register(formData);
    }
  };

  const validateInput = (data) => {
    let { username, password, confirmPassword } = data;
    username = username.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    let message = "";
    if (username.length === 0) {
      message = "Username is a required field";
    } else if (username.length < 6) {
      message = "Username must be at least 6 characters";
    } else if (password.length === 0) {
      message = "Password is a required field";
    } else if (password.length < 8) {
      message = "Password must be at least 8 characters";
    } else if (password !== confirmPassword) {
      message = "Passwords do not match";
    }

    message && enqueueSnackbar(message, { variant: "warning" });
    return message.length === 0 ? true : false;
  };

  const register = async (formData) => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "post",
        url: `${config.endpoint}/auth/signup`,
        data: {
          username: formData.username,
          password: formData.password,
        },
      });
      setIsLoading(false);
      console.log(res.data);
      if (res.status === 201) {
        const { username, token } = res.data;
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        setIsRegistered(true);
        enqueueSnackbar("Registered Successfully", { variant: "success" });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err.response);
      if (err.response) {
        if (err.response.status === 400) {
          enqueueSnackbar(err.response.data.error, { variant: "error" });
        }
      } else if (err.request) {
        console.log(err.request);
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      } else {
        console.log("Error", err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="100vh"
      >
        <Box className="content">
          <Stack spacing={2} className="form">
            <h2 className="title">Register</h2>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              title="Username"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={handleUsername}
              fullWidth
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be atleast 8 characters length"
              fullWidth
              placeholder="Enter a password with minimum 8 characters"
              value={password}
              onChange={handlePassword}
            />
            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              fullWidth
            />
            {isLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Button className="button" variant="contained" type="submit">
                Sign Up
              </Button>
            )}
            <p className="secondary-action">
              Already have an account?{" "}
              <Link className="link" to="/signin">
                Sign In
              </Link>
            </p>
          </Stack>
        </Box>
        {isRegistered && <h1>Hello, {localStorage.getItem("username")}</h1>}
      </Box>
    </form>
  );
};

export default Signup;
