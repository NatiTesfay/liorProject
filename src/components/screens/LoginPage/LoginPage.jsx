import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./LoginPage.css"; // Ensure the correct path for your CSS file

const defaultTheme = createTheme();

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const navigate = useNavigate();
  
  // Ref to keep track of the menu
  const menuRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token); // Store the JWT in localStorage
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to the dashboard
        }, 2000); // Wait 2 seconds before redirecting
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  const handleClick = (event, menuType) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menuType);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  // Function to format text with line breaks every 8 words
  const formatText = (text, wordsPerLine = 8) => {
    const words = text.split(" ");
    let formattedText = "";
    for (let i = 0; i < words.length; i++) {
      formattedText += words[i] + " ";
      if ((i + 1) % wordsPerLine === 0) {
        formattedText += "\n";
      }
    }
    return formattedText;
  };

  const projectDescription =
    "Welcome to the GPS Dashboard! This project allows users to input their address, fetch geographical coordinates (latitude and longitude) using OpenStreetMap's Nominatim service, and view their location on an interactive map. Additionally, users can get their current geolocation with a single click. Enjoy a seamless experience with an intuitive interface and real-time location tracking.";

  const teamDescription = [
    { name: "Lior1", role: "Frontend Technologies" },
    { name: "Lior2", role: "Backend Technologies" },
    { name: "Lior3", role: "UI/UX Design" }
  ];

  // Handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="login-container">
          <Box className="dropdown-container">
            <Box className="dropdown-button" ref={menuRef}>
              <IconButton
                aria-controls="project-description-menu"
                aria-haspopup="true"
                onClick={(event) => handleClick(event, "project")}
                endIcon={<ExpandMoreIcon />}
              >
                About Project
              </IconButton>
              <Menu
                id="project-description-menu"
                anchorEl={anchorEl}
                open={currentMenu === "project"}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxWidth: '300px', // Adjust width as needed
                  },
                }}
              >
                <MenuItem
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "light",
                    whiteSpace: "pre-line",
                    textAlign: "center",
                  }}
                  onClick={handleClose}
                >
                  {formatText(projectDescription)}
                </MenuItem>
              </Menu>
            </Box>

            <Box className="dropdown-button" ref={menuRef}>
              <IconButton
                aria-controls="team-menu"
                aria-haspopup="true"
                onClick={(event) => handleClick(event, "team")}
                endIcon={<ExpandMoreIcon />}
              >
                About the Team
              </IconButton>
              <Menu
                id="team-menu"
                anchorEl={anchorEl}
                open={currentMenu === "team"}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxWidth: '300px', // Adjust width as needed
                  },
                }}
              >
                {teamDescription.map((member, index) => (
                  <MenuItem
                    key={index}
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "light",
                      textAlign: "center",
                    }}
                    onClick={handleClose}
                  >
                    {`${member.name}: ${member.role}`}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          <Box className="login-form">
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
              className="login-card"
            >
              <div className="form-group">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  placeholder="Enter your username"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                />
              </div>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 8, mb: 4 }} textAlign="center"></Box>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
