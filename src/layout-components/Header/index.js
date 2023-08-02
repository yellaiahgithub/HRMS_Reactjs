import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import HeaderDots from '../../layout-components/HeaderDots';
import HeaderDrawer from '../../layout-components/HeaderDrawer';
import HeaderUserbox from '../../layout-components/HeaderUserbox';
import HeaderSearch from '../../layout-components/HeaderSearch';
import HeaderMenu from '../../layout-components/HeaderMenu';
import UserHeaderMenu from '../../layout-components/UserHeaderMenu';
import MyTeamHeaderMenu from 'layout-components/MyTeamHeaderMenu';

const Header = (props) => {
  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    setSidebarToggleMobile,
    companyId,
    showHeader,
    showUserHeader,
    headerType,
    view,
    isAdminViewEnabled,
    isUserMapped
  } = props;
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  return (
    <>
      <div
        className={clsx('app-header', {
          'app-header--shadow': headerShadow,
          'app-header--opacity-bg': headerBgTransparent
        })}>
        <div className="app-header--pane">
          <button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
              { 'is-active': sidebarToggleMobile }
            )}
            onClick={toggleSidebarMobile}>
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
          <HeaderSearch />
          {showHeader && view === 'Admin' ? <HeaderMenu companyId={companyId} /> : ''}
          {view === 'Employee' ? (<>
            {isAdminViewEnabled ? <HeaderMenu companyId={companyId} /> : 
            <>{headerType.toLowerCase()==='MyProfile'.toLowerCase() && <UserHeaderMenu />}
            {headerType.toLowerCase()==='MyTeam'.toLowerCase() && <MyTeamHeaderMenu/>} </> } </>
            ):''}
        </div>
        <div className="app-header--pane">
          <HeaderUserbox />
          <HeaderDrawer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerBgTransparent: state.ThemeOptions.headerBgTransparent,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  view: state.Auth.view,
  isAdminViewEnabled : state.Auth.isAdminViewEnabled,
  isUserMapped:state.Auth.isUserMapped
});
const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
