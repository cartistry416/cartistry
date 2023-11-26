// eslint-disable-next-line
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { useHistory } from 'react-router-dom'

import api from './auth-request-api'
import SuccessfulLoginLogoutModal from "../components/modals/SuccessfulLoginLogoutModal";
export const AuthContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
  LOGIN_GUEST: "LOGIN_GUEST",
  REQUEST_TOKEN: "REQUEST_TOKEN",
};

function AuthContextProvider(props) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        guest: false,
        showLoginLogoutModal: false,
        modalMessage: '',
    });
    useEffect(() => {
        if (auth.showLoginLogoutModal) {
            const timer = setTimeout(() => {
                setAuth({ ...auth, showLoginLogoutModal: false });
            }, 2000);
            return () => clearTimeout(timer); // Clean up the timer
        }
    }, [auth.showLoginLogoutModal]);
    
    // const history = useHistory();

    // useEffect(() => {
    //     auth.getLoggedIn();
    // }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guest: false,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    guest: false,
                    showLoginLogoutModal: true,
                    modalMessage: 'You are now logged in. You will soon be redirected',
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    guest: false,
                    showLoginLogoutModal: true,
                    modalMessage: 'You are now logged out. You will soon be redirected',
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: false,
                    guest: false,
                })
            }
            case AuthActionType.LOGIN_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    guest: true,
                })
            }
            case AuthActionType.REQUEST_TOKEN: {
              return setAuth({
                ...auth,
                user: {
                  ...auth.user,
                  resetPasswordToken: payload.token
                }
              })
            }
            default:
                return auth;
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn().catch((err) => {
      if (err.response && err.response.data) {
        // Extracting the errorMessage from the server response
        const errorMessage = err.response.data.errorMessage;
        console.error("Error in getLoggedIn:", errorMessage);
        return { success: false, errorMessage: errorMessage };
      } else {
        // Handle cases where the error is not from the server response
        console.error("Error in getLoggedIn: An unexpected error occurred: " + err);
        return { success: false, errorMessage: "An unexpected error occurred" };
      }
    });

    // Check if the response is successful
    if (response && response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
      return { success: true, errorMessage: "" };
    } else {
      return response; // This contains the error message and success flag
    }
  };

  auth.registerUser = async function (
    email,
    password,
    passwordVerify,
    username
  ) {
    let errorMessage;
    const response = await api
      .registerUser(email, password, passwordVerify, username)
      .catch((err) => {
        if (err.response && err.response.data) {
          // Extracting the errorMessage from the server response
          errorMessage = err.response.data.errorMessage;
          return { success: false, errorMessage: errorMessage };
        } else {
          // Handle cases where the error is not from the server response
          console.error("Error in getLoggedIn: An unexpected error occurred: " + err);
          return {
            success: false,
            errorMessage: "An unexpected error occurred",
          };
        }
      });
    console.log(response);
    // Check if the response is successful
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.REGISTER_USER,
        payload: {
          user: response.data.user,
        },
      });
      // Uncomment the next line to navigate to the login page or home page after successful registration
      // history.push("/login"); // or history.push("/");
      return { success: true, errorMessage: "" };
    } else {
      return { success: false, errorMessage: errorMessage };
    }
  };

  auth.loginUser = async function (email, password) {
    let response;
    try {
      response = await api.loginUser(email, password);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
          },
        });

        const cookies = response.headers["set-cookie"];
        console.log("Cookies:", cookies);
        return { success: true, errorMessage: "" };
      }
    } catch (error) {
      return { success: false, errorMessage: error.response.data.errorMessage };
    }
  };

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: {
          user: null,
          loggedIn: false,
          guest: false,
        },
      });
      // history.push("/");
    }
  };

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    //console.log("user initials: " + initials);
    return initials;
  };

  auth.loginGuest = () => {
    authReducer({
      type: AuthActionType.LOGIN_GUEST,
      payload: null,
    });
    //history.push("/playlister/all")
  };

  auth.resetPassword = async (newPassword, confirmPassword) => {
    try {
      const response = await api.resetPassword(newPassword, confirmPassword);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (e) {
      console.error(e);
    }
  };

  auth.requestPasswordToken = async (email) => {
    try {
      const response = await api.requestPasswordToken(email);
      authReducer({
        type: AuthActionType.REQUEST_TOKEN,
        payload: {
          token: response.data.token
        }
      })
      return { success: true, errorMessage: "" };
    } catch (error) {
      return { success: false, errorMessage: error.response.data.errorMessage };
    }
  }


    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {auth.showLoginLogoutModal && <SuccessfulLoginLogoutModal message={auth.modalMessage} />}
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
