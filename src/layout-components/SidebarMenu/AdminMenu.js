import React from "react";
import { NavLink } from 'react-router-dom';
import BallotTwoToneIcon from '@material-ui/icons/BallotTwoTone';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

const AdminMenu = () => {
    const toggleSidebarMobile = () => setSidebarToggleMobile(false);
    return (
        <>
            <div className="sidebar-header">
                <span>Setup Pages</span>
            </div>
            <ul>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/customer">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Customer
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/company">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Company
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/roles">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Roles
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/assignedPermissions">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Assign/Unassign Permissions
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/actions">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Actions
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/actionsAndReasons">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Actions & Reasons
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/itemCatalogue">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Item Catalogue
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/moduleAccess">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Module Access
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/passwordRules">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Password Rules
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/orgChartSetup">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Org Chart Setup
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/notificationTemplate">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Notification Template
                    </NavLink>
                </li>
            </ul>
        </>
    )
}
export default AdminMenu;