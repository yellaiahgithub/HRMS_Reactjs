import React, { useState, useEffect } from 'react';
import { Grid, Box, Popover, Button, List, ListItem } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from 'actions';

const UserHeaderMenu = (props) => {
    const user = props.user
    const history = useHistory();

    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        if(history.location.pathname === "/myProfile") {
            setActiveTab('0')
        } else if(history.location.pathname === "/employeeTimeline") {
            setActiveTab('1')
        } else if(history.location.pathname === "/orgStructure") {
            setActiveTab('2')
        } else if(history.location.pathname === "/myPeers") {
            setActiveTab('3')
        }else if(history.location.pathname === "/resignationDetails") {
            setActiveTab('4')
        }
    }, []);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    return (
        <>
            <div className=" app-header-menu pt-3  justify-content-center">
                <List className="nav-line d-flex  nav-tabs-second">
                    <ListItem
                        size="small" component={NavLink}
                        to={'/myProfile'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '0'}
                        onClick={() => {
                            toggle('0');
                        }}>
                        <span className="font-size-sm font-weight-normal">My Profile</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/employeeTimeline'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '1'}
                        onClick={() => {
                            toggle('1');
                        }}>
                        <span className="font-size-sm font-weight-normal"> My Timeline</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/orgStructure?userUUID='  + user.uuid} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '2'}
                        onClick={() => {
                            toggle('2');
                        }}>
                        <span className="font-size-sm font-weight-normal ">Org Structure</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/myPeers'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '3'}
                        onClick={() => {
                            toggle('3');
                        }}>
                        <span className="font-size-sm font-weight-normal">My Peers</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/resignationDetails'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '4'}
                        onClick={() => {
                            toggle('4');
                        }}>
                        <span className="font-size-sm font-weight-normal">Submit Resignation</span>
                    </ListItem>
                    <ListItem
                        size="small" component={NavLink}
                        to={'/transactionSummary?type=employee'} className="btn-pill"
                        button
                        disableRipple
                        selected={activeTab === '5'}
                        onClick={() => {
                            toggle('5');
                        }}>
                        <span className="font-size-sm font-weight-normal">Transaction Summary</span>                        
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
export default connect(mapStateToProps, mapDispatchToProps)(UserHeaderMenu);