import React, { useState } from 'react';
import { Grid, Box, Popover, Button, List, ListItem } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from 'actions';
import {
    Card,
} from '@material-ui/core';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MyTeamHeaderMenu = (props) => {
    const user = props.user

    const [activeTab, setActiveTab] = useState('0');

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    return (
        <>
            <div className=" app-header-menu pt-3  justify-content-center">
                <List className="nav-line d-flex  nav-tabs-second">
                    <ListItem
                        size="small" component={NavLink}
                        to={'/my-team'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '0'}
                        onClick={() => {
                            toggle('0');
                        }}>
                        <span className="font-size-sm font-weight-normal">My Team</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/leave'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '1'}
                        onClick={() => {
                            toggle('1');
                        }}>
                        <span className="font-size-sm font-weight-normal">Leave</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/time'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '2'}
                        onClick={() => {
                            toggle('2');
                        }}>
                        <span className="font-size-sm font-weight-normal ">Time</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/pendingApprovals'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '3'}
                        onClick={() => {
                            toggle('3');
                        }}>
                        <span className="font-size-sm font-weight-normal">Pending Approvals</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/initiateActions'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '4'}
                        onClick={() => {
                            toggle('4');
                        }}>
                        <span className="font-size-sm font-weight-normal">Initiate Actions</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/transactionSummary?type=manager'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '5'}
                        onClick={() => {
                            toggle('5');
                        }}>
                        <span className="font-size-sm font-weight-normal"> Transaction Summary</span>
                    </ListItem>
                </List>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user
});
const mapDispatchToProps = (dispatch) => ({
    logoutUser: (accessToken) => dispatch(logoutUser(accessToken))
});
export default connect(mapStateToProps, mapDispatchToProps)(MyTeamHeaderMenu);