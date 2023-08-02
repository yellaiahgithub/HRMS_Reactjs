import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import {
  setSidebarToggle,
  setSidebarToggleMobile
} from '../../reducers/ThemeOptions';
import logo from '../../assets/images/avatars/logo.jpg';

const SidebarHeader = (props) => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const {
    sidebarToggleMobile,
    setSidebarToggleMobile,
    sidebarToggle,
    setSidebarToggle,
    user,
    view,
    isAdminViewEnabled,
    selectedCompany
  } = props;
  const [companyLogo, setCompanyLogo] = useState(logo);
  useEffect(() => {
    getCompanyLogo(selectedCompany);
    console.log('user', user);
  }, []);
  const getCompanyLogo = (selectedCompany) => {
    if (selectedCompany?.file?.filePath) {
      let path =
        selectedCompany?.file?.filePath + '/' + selectedCompany?.file?.fileName;
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then((res) => {
          if (res.status === 200) {
            if (res.data) {
              let baseStr64 = res.data;
              let imgSrc64 = 'data:image/jpg;base64,' + baseStr64;
              // Set the source of the Image to the base64 string
              setCompanyLogo(imgSrc64);
            }
          }
        })
        .catch((err) => {
          console.log('updateSession err', err);
        });
    }
  };
  return (
    <>
      <div className="app-sidebar--header">
        <div className="app-sidebar-logo">
          <NavLink to="/" title="HRMS" className="app-sidebar-logo">
            <div className="avatar-icon rounded">
              <img alt="HRMS" src={companyLogo} />
            </div>
            <div className="app-sidebar-logo--text">
              <span>{view.toString().toUpperCase()=="ADMIN"?view:(isAdminViewEnabled?"Admin":"Employee")}</span>
              <b className="app-sidebar-logo--text text-capitalize">{selectedCompany.companyName}</b>
            </div>
          </NavLink>
        </div>
        <Tooltip title="Collapse sidebar" placement="right" arrow>
          <Button
            onClick={toggleSidebar}
            className="btn btn-sm collapse-sidebar-btn">
            <FontAwesomeIcon icon={['far', 'dot-circle']} size="lg" />
          </Button>
        </Tooltip>
        <Button
          className={clsx(
            'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
            { 'is-active': sidebarToggleMobile }
          )}
          onClick={toggleSidebarMobile}>
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </Button>
        <Tooltip title="Expand sidebar" placement="right" arrow>
          <Button
            onClick={toggleSidebar}
            className="expand-sidebar-btn btn btn-sm">
            <FontAwesomeIcon icon={['fas', 'arrows-alt-h']} />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  user: state.Auth.user,
  view: state.Auth.view,
  selectedCompany:state.Auth.selectedCompany,
  isAdminViewEnabled:state.Auth.isAdminViewEnabled
});
const mapDispatchToProps = (dispatch) => ({
  setSidebarToggle: (enable) => dispatch(setSidebarToggle(enable)),
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});
export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
