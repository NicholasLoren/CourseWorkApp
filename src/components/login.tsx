import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { palette } from "../utils/utils";
import logo from "../assets/logo.png";
import auth, { db } from "../firebase.config.js";
import { doc, getDoc } from "firebase/firestore";

import { signInWithEmailAndPassword } from "firebase/auth";
import Joi from "joi";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="mailto:lorennicosir@gmail.com">
        Course Work App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme(palette);

//Form error interface
interface FormErrors {
  uniqueCode?: string;
  password?: string;
  email?: string;
  [key: string]: any;
  // Add more error keys as needed
}

type schemaType = {
  email: object;
  password: object;
  uniqueCode: object;
  [key: string]: any;
};

export default function Login() {
  const outerSchema: schemaType = {
    email: Joi.string()
      .required()
      .min(3)
      .email({ tlds: { allow: ["com", "net"] } }),
    password: Joi.string().required().min(6),
    uniqueCode: Joi.number().min(100000).max(999999).required(),
  };

  const [data, setData] = useState<{
    email: string;
    password: string;
    uniqueCode: number;
  }>({ email: "", password: "", uniqueCode: 0 });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //Check if all form fields are entered
  useEffect(() => {
    if (Object.keys(errors).length === 0) setSubmitDisabled(false);
    else setSubmitDisabled(true);
  }, [errors]);

  // Handle form state changge
  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { currentTarget } = event;
    const { name, value } = currentTarget;
    const errorsCopy: FormErrors = {};

    const errorMessage = validate(name, value);
    if (errorMessage) {
      let newString = removeQuotes(errorMessage);
      return setErrors({ [name]: newString });
    } else delete errorsCopy[name];

    setData({ ...data, [name]: value });
    setErrors({ ...errorsCopy });
  };

  //Validate form inputs
  const validate = (name: string, value: string) => {
    const innerSchema = Joi.object({ [name]: outerSchema[name] });
    const { error } = innerSchema.validate({ [name]: value });

    return error ? error.details[0].message : null;
  };

  //pretify names for errors
  const removeQuotes = (value: string) => {
    return value.replace(/"/g, "");
  };

  /* Submit for to login */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password, uniqueCode } = data;
    //Validate every item
    const validateEmail: string | null = validate("email", email);
    if (validateEmail) {
      return setErrors({ email: removeQuotes(validateEmail) });
    }

    const validatePassword: string | null = validate("password", password);
    if (validatePassword) {
      return setErrors({ password: removeQuotes(validatePassword) });
    }

    const validateUniqueCode: string | null = validate(
      "uniqueCode",
      uniqueCode.toString()
    );
    if (validateUniqueCode) {
      return setErrors({ password: removeQuotes(validateUniqueCode) });
    }

    const signIn = async () => {
      // const auth = getAuth()
      setIsLoading(true);
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        //Before signIn check for user uniqueCode
        // console.log(user)
        const docSnap = await getDoc(doc(db, "students", user.uid));
        if (docSnap.exists()) {
          const { uniqueCode: code } = docSnap.data();
          if (code === uniqueCode) {
            return navigate("/");
          } else {
            setErrors({
              uniqueCode: "Please provide a valid unique code",
            });
            setIsLoading(false);
          }
        } else {
          setErrors({
            uniqueCode:
              "You have not been verified,Please contact the administrator",
          });
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }; //sigin

    signIn();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, width: 80, height: 80 }} src={logo}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) => handleChange(event)}
              autoFocus
            />
            {errors["email"] && (
              <Alert severity="error">{errors["email"]}</Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(event) => handleChange(event)}
              autoComplete="current-password"
            />
            {errors["password"] && (
              <Alert severity="error">{errors["password"]}</Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="uniqueCode"
              label="Unique Code"
              type="number"
              onChange={(event) => handleChange(event)}
              id="uniqueCode"
            />
            {errors["uniqueCode"] && (
              <Alert severity="error">{errors["uniqueCode"]}</Alert>
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              disabled={submitDisabled}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
