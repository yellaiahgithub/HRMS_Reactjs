import { Card, Grid, Divider } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SubmitResignation from './SubmitResignation';
import ViewHistory from './ViewHistory';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import { makeStyles } from '@material-ui/core/styles';
import EmployeeDetailsCard from 'components/MyProfile/EmployeeDetailsCard';

const CreateResignationDetails = (props) => {
  const { employeeUUID, user } = props;
  const [blocking, setBlocking] = useState(false);
  const [activeTab, setActiveTab] = useState('0');
  const [employee, setEmployee] = useState(null);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  useEffect(() => {
      setEmployee(user)
  }, []);
  return (
    <div>
      <BlockUi
        tag="div"
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card>
          <Grid container spacing={0}>
            <Grid item md={12} lg={12} xl={12} className="mx-auto">
              <div className="bg-white p-4 rounded">
                <EmployeeDetailsCard employeeDetails={employee} />
                <Card style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                  <Grid container spacing={6}>
                    <Grid item lg={12}>
                      <Card className="shadow-xxl p-3">
                        <List className="d-flex nav-tabs nav-tabs-info tabs-animated tabs-animated-shadow">
                          <ListItem
                            button
                            selected={activeTab === '0'}
                            onClick={() => {
                              toggle('0');
                            }}>
                            <span>Submit Resignation</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '1'}
                            onClick={() => {
                              toggle('1');
                            }}>
                            <span>View History</span>
                          </ListItem>
                        </List>
                        <Divider />
                        <div
                          style={{ overflow: 'hidden' }}
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '0'
                          })}
                          index={0}>
                            {employee && 
                            <SubmitResignation employeeDetails={employee} />
                            }
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '1'
                          })}
                          index={1}>
                          <ViewHistory employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            </Grid>
          </Grid>
        </Card>
      </BlockUi>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.Auth.user
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateResignationDetails);
// export default CreateResignationDetails;
