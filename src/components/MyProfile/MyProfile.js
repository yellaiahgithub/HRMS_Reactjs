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
import JobDetails from './JobDetails';
import DependantBenificiaries from './DependantBenificiaries';
import EmergencyContactDetails from './EmergencyContactDetails';
import EducationalDetails from './EducationalDetails';
import PriorWorkExperience from './PriorWorkExperience';
import NatioanlIdDetails from './DetailsNationalIds';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import { makeStyles } from '@material-ui/core/styles';
import EmployeeDetailsCard from './EmployeeDetailsCard';
import PersonalDetails from './PersonalDetails';

const MyProfile = (props) => {
  const { employeeUUID, user } = props;
  const [blocking, setBlocking] = useState(false);
  const [activeTab, setActiveTab] = useState('0');
  const [employee, setEmployee] = useState(null);
  const [fromTeamsPage, setFromTeamsPage] = useState(false);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  useEffect(() => {
    if (employeeUUID) {
      getEmployee(employeeUUID);
      setFromTeamsPage(true);
    } else {
      setEmployee(user);
    }
  }, []);
  const getEmployee = (uuid) => {
    apicaller(
      'get',
      `${BASEURL}/employee/fetchEmployeeByUserId?uuid=${uuid}`
    )
      .then((res) => {
        if (res.status === 200) {
          setEmployee(res.data[0]);
        }
      })
      .catch((err) => {
        setBlocking(false);
        if (err.response?.data) {
        }
        console.log('get employee err', err);
      });
  };
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
                <EmployeeDetailsCard employeeDetails={employee} fromTeamsPage={fromTeamsPage} />
                <Card style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                  <Grid container spacing={6}>
                    <Grid item lg={12} >
                      <Card className="shadow-xxl p-3">
                        <List className="d-flex nav-tabs nav-tabs-info tabs-animated tabs-animated-shadow flex-column flex-md-row">
                          <ListItem
                            button
                            selected={activeTab === '0'}
                            onClick={() => {
                              toggle('0');
                            }}>
                            <span>Job Details</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '1'}
                            onClick={() => {
                              toggle('1');
                            }}>
                            <span>Personal Details</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '2'}
                            onClick={() => {
                              toggle('2');
                            }}>
                            <span>Dependants/ Beneficiaries</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '3'}
                            onClick={() => {
                              toggle('3');
                            }}>
                            <span>Emergency Contact Details</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '4'}
                            onClick={() => {
                              toggle('4');
                            }}>
                            <span>Education Details</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '5'}
                            onClick={() => {
                              toggle('5');
                            }}>
                            <span>Prior Work Experience</span>
                          </ListItem>
                          <ListItem
                            button
                            selected={activeTab === '6'}
                            onClick={() => {
                              toggle('6');
                            }}>
                            <span>National ID Details</span>
                          </ListItem>
                        </List>
                        <Divider />
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '0'
                          })}
                          index={0}>
                          <div className="scroll-area-lg shadow-overflow">
                            <JobDetails employeeDetails={employee} />
                          </div>
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '1'
                          })}
                          index={1}>
                          <div className="scroll-area-lg shadow-overflow">
                            <PersonalDetails employeeDetails={employee} />
                          </div>
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '2'
                          })}
                          index={2}>
                          <DependantBenificiaries employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '3'
                          })}
                          index={3}>
                          <EmergencyContactDetails employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '4'
                          })}
                          index={4}>
                          <EducationalDetails employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '5'
                          })}
                          index={5}>
                          <PriorWorkExperience employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
                        </div>
                        <div
                          className={clsx('tab-item-wrapper', {
                            active: activeTab === '6'
                          })}
                          index={6}>
                          <NatioanlIdDetails employeeUUID={employeeUUID ? employeeUUID : user.uuid} />
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
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
// export default MyProfile;
