import React from "react";
import { NavLink } from 'react-router-dom';
import BallotTwoToneIcon from '@material-ui/icons/BallotTwoTone';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';


const UserMenu = () => {
    const toggleSidebarMobile = () => setSidebarToggleMobile(false);
    return (
        <>
            <ul>
                <li>
                    <NavLink
                        // activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/myProfile">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        Me
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        // activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/myLeaves">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        My Leaves
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        // activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/roles&permissions">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        My Compensation
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        // activeClassName="active"
                        onClick={toggleSidebarMobile}
                        className="nav-link-simple"
                        to="/my-team">
                        <span className="sidebar-icon">
                            <BallotTwoToneIcon />
                        </span>
                        My Team
                    </NavLink>
                </li>
            </ul>
        </>
    )
}

export default UserMenu;