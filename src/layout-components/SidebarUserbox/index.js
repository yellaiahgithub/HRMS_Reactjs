import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Badge, Menu, Button, Tooltip, Divider } from '@material-ui/core';
import avatar2 from '../../assets/images/avatars/avatar2.jpg';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from 'actions';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';

const SidebarUserbox = (props) => {
  const {accessToken}=props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { logoutUser, isAuthenticated, user, view } = props;
  const [officialEmail, setOfficialEmail] = useState();
  const [designation, setDesignation] = useState();
  useEffect(() => {
    const reqEmail = user.emails?.find(emailData => emailData.type.toLowerCase() === "Official".toLowerCase())
    setOfficialEmail(reqEmail?.email);
    setDesignation(designation?.designation)

  });
  const logout = () => {
    logoutUser(accessToken);
    window.location.href = 'login';
  };
  return (
    <>
      <div className="app-sidebar--userbox">
        <Box className="card-tr-actions">
          <Button
            variant="text"
            onClick={handleClick}
            className="ml-2 p-0 d-30 border-0 btn-transition-none text-white-50"
            disableRipple>
            <FontAwesomeIcon
              icon={['fas', 'ellipsis-h']}
              className="font-size-lg"
            />
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            open={Boolean(anchorEl)}
            classes={{ list: 'p-0' }}
            onClose={handleClose}>
            <div className="dropdown-menu-lg overflow-hidden p-0">
              <div className="align-box-row align-items-center p-3">
                <div className="avatar-icon-wrapper avatar-icon-md">
                  <div className="avatar-icon rounded-circle">
                    {user.profilePic ? (
                      <img
                        className="img-fluid img-fit-container rounded-sm"
                        src={user.profilePic}
                        alt="..."
                      />
                    ) : (
                      <img
                        className="img-fluid img-fit-container rounded-sm"
                        src={empty_profile_picture}
                        alt="..."
                      />
                    )}
                  </div>
                </div>
                <div className="pl-2">
                  <span className="font-weight-bold d-block text-capitalize">
                    {user.legalName}
                  </span>
                  <div className="badge badge-success border-0">Active</div>
                </div>
              </div>
              <Divider className="w-100" />
              <div className="d-flex py-3 justify-content-center">
                <div className="d-flex align-items-center">
                  <div>
                    <FontAwesomeIcon
                      icon={['far', 'user']}
                      className="font-size-xxl text-success"
                    />
                  </div>
                  <div className="pl-3 line-height-sm">
                    <b className="font-size-lg">14,596</b>
                    <span className="text-black-50 d-block">reports</span>
                  </div>
                </div>
              </div>
              <Divider className="w-100" />
              <div className="d-block rounded-bottom py-3 text-center">
                <Tooltip arrow title="Facebook">
                  <Button
                    size="large"
                    className="btn-facebook mx-1 p-0 d-40 font-size-lg text-white">
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fab', 'facebook']} />
                    </span>
                  </Button>
                </Tooltip>
                <Tooltip arrow title="Twitter">
                  <Button
                    size="large"
                    className="btn-twitter mx-1 p-0 d-40 font-size-lg text-white">
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fab', 'twitter']} />
                    </span>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Menu>
        </Box>
        <div className="avatar-icon-wrapper avatar-icon-md">
          <Badge
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            badgeContent=" "
            overlap="circle"
            classes={{ badge: 'bg-success badge-circle' }}>
            <div className="avatar-icon rounded-circle">
              {user.profilePic ? (
                <img
                  className="img-fluid img-fit-container rounded-sm"
                  src={user.profilePic}
                  alt="..."
                />
              ) : (
                <img
                  className="img-fluid img-fit-container rounded-sm"
                  src={empty_profile_picture}
                  alt="..."
                />
              )}
            </div>
          </Badge>
        </div>
        {view === 'Employee' ?
          <div className="my-2 userbox-details">
            <span className="text-capitalize">{user.designationName}</span>
          </div> : ''}
        {view === 'Admin' ? <div className="my-3 userbox-details">
          <span className="text-capitalize">{user.legalName}</span>
          <small className="d-block text-white-50">
            ({officialEmail ? officialEmail : "Official Mail Id Not Added"})
          </small>
        </div> : <div className=' userbox-details'><div className=" userbox-details">
          <span className="text-capitalize">{user.legalName}</span>
        </div>
          <div className="my-2 userbox-details">
            <span >
              {officialEmail ? officialEmail : "Official Mail Id Not Added"}
            </span>
          </div>
        </div>}
        {view === 'Admin' ? <Button onClick={() => logout()} size="small" className="btn-userbox">
          Logout
        </Button> : ''}


      </div >
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  view : state.Auth.view,
  accessToken:state.Auth.accessToken
});
const mapDispatchToProps = (dispatch) => ({
  logoutUser: (accessToken) => dispatch(logoutUser(accessToken))
});
export default connect(mapStateToProps, mapDispatchToProps)(SidebarUserbox);
