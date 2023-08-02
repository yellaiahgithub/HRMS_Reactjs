import React, { useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import SidebarUserbox from '../SidebarUserbox';
import BallotTwoToneIcon from '@material-ui/icons/BallotTwoTone';
import AdminMenu from './AdminMenu';
import UserMenu from './UserMenu';

const SidebarMenu = (props) => {
  const { setSidebarToggleMobile, sidebarUserbox, isAuthenticated, view, isAdminViewEnabled, isUserMapped } = props;
  const toggleSidebarMobile = () => setSidebarToggleMobile(false);
  return (
    <>
      <PerfectScrollbar>
        {sidebarUserbox && <SidebarUserbox />}
        <div className="sidebar-navigation">
          <div className="sidebar-header">
            <span>Navigation menu</span>
          </div>
          <ul>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/dashboard">
                <span className="sidebar-icon">
                  <BallotTwoToneIcon />
                </span>
                Dashboard
                {/* <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span> */}
              </NavLink>
            </li>
          </ul>
          {view === 'Admin' ? <AdminMenu /> : 
            <>{ isAdminViewEnabled  ? ''  : <UserMenu /> }</>
          }
        </div>
      </PerfectScrollbar>
    </>
  );
};
const mapStateToProps = (state) => ({
  sidebarUserbox: state.ThemeOptions.sidebarUserbox,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  isAuthenticated: state.Auth.isAuthenticated,
  view: state.Auth.view,
  isAdminViewEnabled : state.Auth.isAdminViewEnabled,
  isUserMapped:state.Auth.isUserMapped
});
const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});
export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
