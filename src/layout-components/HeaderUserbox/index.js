import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Typography,
  Badge,
  Menu,
  Button,
  List,
  ListItem,
  Tooltip,
  Divider
} from '@material-ui/core';

import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';

import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import { logoutUser, setAdminViewEnable, setIsUserMapped, setMappedByUser, setUser } from 'actions';
import { NavLink,useHistory } from 'react-router-dom'
import ShuffleTwoTone from '@material-ui/icons/ShuffleTwoTone';

const StyledBadge = withStyles({
  badge: {
    backgroundColor: 'var(--success)',
    color: 'var(--success)',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
})(Badge);

const HeaderUserbox = (props) => {
  console.log('props ::' + props)
  const { user,view,accessToken,isUserMapped,setMappedUser,setLoggedInUser,setUserMapped,mappedByUser  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(empty_profile_picture);
  const [userIs, setUserIs] = useState('');
  const history = useHistory();
  const [hasUserMapping, setHasUserMapping]=useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    checkUserRole()
  });

  const { setAdminViewEnable, isAdminViewEnabled } = props;


  const changeView = () => {
    handleClose()
    setAdminViewEnable(!isAdminViewEnabled)
  }


  const checkUserRole = () => {
    if (user.roles) if (user.roles?.some((object) => object.name === 'Core HR Admin')) {
      setUserIs('coreAdmin')
    }
    //user mapping roles CLIENT SIDE ADMIN
    if (user.roles) if (user.roles?.some((object) => object.name.toUpperCase() === 'CLIENT SIDE ADMIN'.toUpperCase())) {
      setHasUserMapping(true)
    }
  }

  const { logoutUser, isAuthenticated } = props;

  const logout = () => {
    logoutUser(accessToken);
    window.location.href = 'login';
  };

  return (
    <>
      <Button
        variant="text"
        onClick={handleClick}
        className="ml-2 btn-transition-none text-left ml-2 p-0 bg-transparent d-flex align-items-center"
        disableRipple>
        <div className="d-block p-0 avatar-icon-wrapper">
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            badgeContent=" "
            classes={{ badge: 'bg-success badge-circle border-0' }}
            variant="dot">
            <div className="avatar-icon rounded">
              {user && user.profilePic ? (
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
          </StyledBadge>
        </div>

        <div className="d-none d-xl-block pl-2">
          <div className="font-weight-bold pt-2 line-height-1 text-capitalize">
            {user.legalName}
          </div>
          <span className="text-black-50 text-capitalize">
            {view === 'Admin' ? view : user.designationName}
          </span>
        </div>
        <span className="pl-1 pl-xl-3">
          <FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'top',
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
          <div className="d-flex px-3 pt-3 align-items-center justify-content-between">
            <Typography className="text-capitalize pl-1 font-weight-bold text-primary">
              <span>Profile Options</span>
            </Typography>
            <div className="font-size-xs pr-1">
              <Tooltip title="Change settings" arrow>
                <a href="#/" onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                </a>
              </Tooltip>
            </div>
          </div>
          {view === 'Admin' ? <div>
            <List
              component="div"
              className="nav-neutral-primary text-left d-flex align-items-center flex-column px-3 pb-3">
              <ListItem button className="d-block text-left">
                My Account
              </ListItem>
              <ListItem button className="d-block text-left">
                Profile settings
              </ListItem>
              <ListItem button className="d-block text-left">
                Active tasks
              </ListItem>
            </List>
            <Divider className="w-100" />
            <div className="d-flex py-3 justify-content-center">
              <div className="d-flex align-items-center">
                <div>
                  <FontAwesomeIcon
                    icon={['far', 'chart-bar']}
                    className="font-size-xxl text-info"
                  />
                </div>
                <div className="pl-3 line-height-sm">
                  <b className="font-size-lg">$9,693</b>
                  <span className="text-black-50 d-block">revenue</span>
                </div>
              </div>
            </div>
            <Divider className="w-100" />
            <div className="d-block rounded-bottom py-3 text-center">
              <Tooltip arrow title="Facebook">
                <Button
                  size="large"
                  className="btn-facebook p-0 d-40 font-size-lg text-white">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fab', 'facebook']} />
                  </span>
                </Button>
              </Tooltip>
              <Tooltip arrow title="Dribbble">
                <Button
                  size="large"
                  className="btn-dribbble p-0 d-40 font-size-lg text-white mx-2">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fab', 'dribbble']} />
                  </span>
                </Button>
              </Tooltip>
              <Tooltip arrow title="Twitter">
                <Button
                  size="large"
                  className="btn-twitter p-0 d-40 font-size-lg text-white">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fab', 'twitter']} />
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div> : <div className='dropdown-menu-lg overflow-hidden p-0'>


          { userIs.toLowerCase() == 'coreadmin' ?  
            <List
              component="div"
              className="nav-neutral-primary text-left d-flex align-items-center flex-column px-3 pb-3">
              <ListItem button 
                 className="font-size-sm"
                  component={NavLink}
                  to='./dashboard'
                  onClick={() => 
                    changeView()
                  }>
                <ShuffleTwoTone className="h1 d-block my-2" />
                 &nbsp;
                <span className="d-block text-left">
               {isAdminViewEnabled ? 'Switch To Employee' : 'Switch To Admin' } 
                </span>
              </ListItem>
            </List> : ''}
            { hasUserMapping && !isUserMapped?  
            <List
              component="div"
              className="nav-neutral-primary text-left d-flex align-items-center flex-column px-3 pb-3">
                <ListItem button 
                className="font-size-sm"
                 component={NavLink}
                 to='./userMapping'
                 onClick={(e)=>handleClose()
                 }
                 >
               <ShuffleTwoTone className="h1 d-block my-2" />
                &nbsp;
               <span className="d-block text-left">
               User Mapping
               </span>
             </ListItem>
            </List> : ''}
            <List
              component="div"
              className="nav-neutral-primary text-left d-flex align-items-center flex-column px-3 pb-3">
                {isUserMapped&&<ListItem button 
                 className="font-size-sm"
                  onClick={(e)=>{
                    setLoggedInUser(mappedByUser);
                    setMappedUser({});
                    setUserMapped(false);
                    setAdminViewEnable(false);
                    setUserIs('')
                    handleClose();
                    history.push('/userMapping');
                    // window.location.reload(true)
                  }}
                  >
                <ShuffleTwoTone className="h1 d-block my-2" />
                 &nbsp;
                <span className="d-block text-left">
                Exit User Mapping
                </span>
              </ListItem>}
              <ListItem
                onClick={() => logout()} button className="d-block text-left">
                Logout
              </ListItem>

            </List>

          </div>}
        </div>
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.Auth.user,
  isAdminViewEnabled : state.Auth.isAdminViewEnabled,
  view : state.Auth.view,
  accessToken:state.Auth.accessToken,
  isUserMapped:state.Auth.isUserMapped,
  mappedByUser: state.Auth.mappedByUser
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: (accessToken) => dispatch(logoutUser(accessToken)),
  setAdminViewEnable: isAdminViewEnabled => dispatch(setAdminViewEnable(isAdminViewEnabled)),
  setLoggedInUser: data => dispatch(setUser(data)),
  setMappedUser:data=>dispatch(setMappedByUser(data)),
  setUserMapped:data=>dispatch(setIsUserMapped(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUserbox);
