import React, { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { config } from "./App";

const Signin = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username: username,
      password: password,
    };
    if (validateInput(formData)) {
      login(formData);
    }
  };

  const login = async (formData) => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "post",
        url: `${config.endpoint}/auth/signin`,
        data: {
          username: formData.username,
          password: formData.password,
        },
      });
      setIsLoading(false);
      console.log(res.data);
      if (res.status === 200) {
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        const { username, token } = res.data;
        persistLogin(username, token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          // console.log("HI");
          setIsLoading(false);
          enqueueSnackbar(err.response.data.error, { variant: "error" });
          setUsername("");
          setPassword("");
        }
        // console.log(err.response.data);
        // console.log(err.response.status);
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

  const validateInput = (data) => {
    let { username, password } = data;
    username = username.trim();
    password = password.trim();
    let message = "";
    if (username.length === 0) {
      message = "Username is a required field";
    } else if (password.length === 0) {
      message = "Password is a required field";
    }
    message && enqueueSnackbar(message, { variant: "warning" });
    return message.length === 0 ? true : false;
  };

  const persistLogin = (username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
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
            <h2 className="title">Login</h2>
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
              fullWidth
              placeholder="Enter password"
              value={password}
              onChange={handlePassword}
            />
            {isLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Button className="button" variant="contained" type="submit">
                Sign In
              </Button>
            )}
            <p className="secondary-action">
              Don't have an account?{" "}
              <Link className="link" to="/signup">
                Sign Up
              </Link>
            </p>
          </Stack>
        </Box>
        {isLoggedIn && <h1>Hello, {localStorage.getItem("username")}</h1>}
      </Box>
    </form>
  );
};

export default Signin;
