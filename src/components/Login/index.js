import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loginAdmin } from '../../actions/index';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Tooltip,
  TextField,
  Snackbar

} from '@material-ui/core';

import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

import hero8 from '../../assets/images/hero-bg/hero-8.jpg';

const Login = (props) => {
  const { isAuthenticated, loginAdmin, error } = props;

  const [checked1, setChecked1] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'left',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle,  message } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleChange1 = (event) => {
    setChecked1(event.target.checked);
  };

  const listener = event => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      loginUser(event);      
    }
  };
  const loginUser = (e) => {     
    if (!username || username == null) {
      setState({
        open: true,
        message: "Username Required",
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'left'
      })
    }
    else if (!password || password == null) {
      setState({
        open: true,
        message: "password Required",
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'left'
      })
    }
    else {
      loginAdmin({
        username: username,
        password: password,
      })
    };
  }

  useEffect(() => {
    window.addEventListener("keydown", listener);
    if (isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated)
      window.location.href = 'dashboard';
    }
    else if (!isAuthenticated && error) {
      setState({
        open: true,
        message: error,
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'left'
      })
    }
    return () => {
      window.removeEventListener("keydown", listener);
    };
  },[listener]);


  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white"     
      onKeyDown={listener}>
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Grid container spacing={0} className="min-vh-100">
                    <Grid
                      item
                      lg={7}
                      xl={6}
                      className="d-flex align-items-center">
                      <Grid item md={10} lg={8} xl={7} className="mx-auto">
                        <div className="py-4">
                          <div className="text-center mb-3">
                            <h1 className="display-4 mb-1 font-weight-bold">
                              Login
                            </h1>
                          </div>
                          <div>
                            <div className="mb-4">
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="textfield-username"
                                label="Username"
                                value={username}
                                onChange={(event) => {
                                  setUsername(event.target.value);
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleOutlined />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                            <div className="mb-3">
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="textfield-password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(event) => {
                                  setPassword(event.target.value);
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LockTwoToneIcon />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-between align-items-center font-size-md">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checked1}
                                    onChange={handleChange1}
                                    value="checked1"
                                    color="primary"
                                  />
                                }
                                label="Remember me"
                              />
                              <div>
                                <a
                                  href="/forgotPassword"
                                  // onClick={(e) => e.preventDefault()}
                                  className="text-first">
                                  Forgot Password
                                </a>
                              </div>
                            </div>
                            <div className="text-center py-4">
                              <Button
                                className="btn-second font-weight-bold w-50 my-2"
                                onClick={(e) => loginUser(e)}
                                type="submit">
                                Sign in
                              </Button>
                            </div>
                            <div className="text-center text-black-50 mt-3">
                              Don't have an account?{' '}
                              <a
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="text-first">
                                Sign up
                              </a>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item lg={5} xl={6} className="d-flex">
                      <div className="hero-wrapper w-100 bg-composed-wrapper bg-premium-dark min-vh-lg-100">
                        <div className="flex-grow-1 w-100 d-flex align-items-center">
                          <div
                            className="bg-composed-wrapper--image opacity-5"
                            style={{ backgroundImage: 'url(' + hero8 + ')' }}
                          />
                          <div className="bg-composed-wrapper--bg bg-second opacity-6" />
                          <div className="bg-composed-wrapper--bg bg-deep-blue opacity-2" />
                          <div className="bg-composed-wrapper--content text-center p-5">
                            <div className="text-white px-0 px-lg-2 px-xl-4">
                              <h1 className="display-3 mb-4 font-weight-bold">
                                HRMS
                              </h1>
                              <p className="font-size-lg mb-0 opacity-8">
                                Premium admin template powered by the most
                                popular UI components framework available for
                                React: Material-UI. Features hundreds of
                                examples making web development fast and easy.
                                Start from one of the individual apps included
                                or from the general dashboard and build
                                beautiful scalable applications and presentation
                                websites.
                              </p>
                              <div className="divider mx-auto border-1 my-5 border-light opacity-2 rounded w-25" />
                              <div>
                                <Button className="btn-success px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-none py-3 hover-scale-sm hover-scale-lg">
                                  <span className="btn-wrapper--label">
                                    See Features List
                                  </span>
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={['fas', 'arrow-right']}
                                    />
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero-footer pb-4">
                          <List
                            component="div"
                            className="nav-pills nav-neutral-secondary d-flex">
                            <Tooltip title="Facebook" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Twitter" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'twitter']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Google" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'google']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Instagram" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                              </ListItem>
                            </Tooltip>
                          </List>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
      <Snackbar
       style={{ top: 100, left: 200 }}
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  error: state.Auth.error
});

const mapDispatchToProps = (dispatch) => ({
  loginAdmin: (data) => dispatch(loginAdmin(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
