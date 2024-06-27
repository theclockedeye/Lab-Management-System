import React, { useState } from "react";
import styles from "./SignUpForm.module.css"; // Update the import statement
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [username1, setUsername1] = useState(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSwipe = (e) => {
    if (e.deltaX > 0) {
      setIsSignIn(false);
    } else {
      setIsSignIn(true);
    }
  };

  const handleSignIn = async (e, user_type) => {
    e.preventDefault();

    if (user_type == "student") {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/myapi/login/",
          {
            username: username,
            password: password,
            user_type: user_type,
          }
        );

        console.log("***********************************");
        // Handle successful login response
        const storedUsername = response.data.username; // Capture the username from the response
        const baseurl = "http://localhost:3000";
        let redirecturl = response.data.redirect_url;

        // Add the username as a query parameter to the redirection URL
        const urlWithUsername = `${redirecturl}?username=${encodeURIComponent(
          storedUsername
        )}`;

        // Redirect the user to the updated URL that includes the username as a query parameter
        window.location.href = urlWithUsername;

        setEmail("");
        setPassword("");
      } catch (error) {
        console.error("Error:", error); // Handle error
        console.log("invalid credentials");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      }
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/fac/fac_login/",
          {
            username: username,
            password: password,
            user_type: user_type,
          }
        );

        console.log("***********************************");
        console.log("Username:", response.data.username); // Log the username
        const storedUsername = response.data.username;
        setUsername1(storedUsername);

        const baseurl = "http://localhost:3000";
        let redirecturl = response.data.redirect_url;

        const urlWithUsername = `${redirecturl}?username=${encodeURIComponent(
          storedUsername
        )}`;

        window.location.href = urlWithUsername;

        setEmail("");
        setPassword("");
      } catch (error) {
        console.error("Error:", error);
        console.log("invalid credentials");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <div className={styles.spell}>
      <div className={styles["viewport-container"]}>
        {errorMessage && (
          <div
            className={styles["error-message"]}
            style={{ paddingLeft: "42%", color: "red" }}
          >
            <p>{errorMessage}</p>
          </div>
        )}
        <div
          className={`${styles.container} ${
            isSignIn ? "" : styles["right-panel-active"]
          }`}
          id="container"
        >
          <div
            className={`${styles["form-container"]} ${styles["sign-up-container"]}`}
          >
            <form action="#" method="post">
              <h1>Faculty Login</h1>
              
                
              
              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" onClick={(e) => handleSignIn(e, "faculty")}>
                Sign In
              </button>
            </form>
          </div>
          <div
            className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
          >
            <form action="#" method="post">
              <h1>Student Login</h1>
              

              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#">Forgot your password?</a>
              <button type="submit" onClick={(e) => handleSignIn(e, "student")}>
                Sign In
              </button>
            </form>
          </div>
          <div className={styles["overlay-container"]}>
            <div className={styles.overlay}>
              <div
                className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
              >
                <h1 className={styles.h1} style={{ color: "white" }}>
                  Are you a Student?
                </h1>
                <p style={{ color: "white" }}>
                  Then please try this student login
                </p>
                <button
                  className={styles.ghost}
                  onClick={toggleForm}
                  id="signIn"
                  type="button"
                >
                  Sign In
                </button>
              </div>
              <div
                className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}
              >
                <h1 className={styles.h1} style={{ color: "white" }}>
                  Are You a Faculty?
                </h1>
                <p className={styles.p} style={{ color: "white" }}>
                  Then Use this Faculty Login page
                </p>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={toggleForm}
                  id="signIn"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
