import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import apicaller from 'helper/Apicaller';
import {
  Grid,
  Card,
  Snackbar,
  Dialog,
  Popover,
  Button
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { ClimbingBoxLoader } from 'react-spinners';
import BlockUi from 'react-block-ui';
import styles from '../ViewEmployeeDetails/employee.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
// import EmployeeDetailsCard from './EmployeeDetailsCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MyProfile from 'components/MyProfile/MyProfile';

const MyTeam = (props) => {
  const { selectedCompany, user } = props;
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [orgData, setOrgData] = useState();
  const [blocking, setBlocking] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [showReporteeDetails, setShowReporteeDetails] = useState(null);
  const handleClose3 = () => {
    setOpen3(false);
  };

  useEffect(() => {
    fetchEmployeesHirarchy(user.uuid,user.managerUUID);
  }, []);

  const fetchEmployeesHirarchy = (employeeUUID,managerUUID) => {
    setBlocking(true);
    apicaller(
      'get',
      `${BASEURL}/employee/fetchEmployeesTeam?employeeUUID=${employeeUUID}&managerUUID=${managerUUID}`
    )
      .then(async (res) => {
        if (res.status === 200) {
          setBlocking(false);
          if (res.data) {
            let teamHirarchy = res.data.find(
              (empDetails) => empDetails.uuid == employeeUUID
            );
            let reporteeData = res.data.filter(
              (empDetails) => empDetails.managerUUID == employeeUUID
            );
            let managerData = res.data.filter(
              (empDetails) => empDetails.uuid == teamHirarchy.managerUUID
            );
            teamHirarchy.reportees = reporteeData;
            teamHirarchy.managerData = managerData;
            setOrgData(teamHirarchy);
          }
        }
      })
      .catch((err) => {
        setBlocking(false);
        if (err.response?.data) {
        }
        console.log('get employee err', err);
      });
  };

  const getImage = (file) => {
    return new Promise((resolve) => {
      if (file) {
        let path = file?.filePath + '/' + file?.fileName;
        apicaller('get', `${BASEURL}/storage?path=` + path)
          .then((res) => {
            if (res.status === 200) {
              if (res.data) {
                let baseStr64 = res.data;
                let imgSrc64 = 'data:image/jpg;base64,' + baseStr64;
                // Set the source of the Image to the base64 string
                resolve(imgSrc64);
              }
            }
          })
          .catch((err) => {
            console.log('updateSession err', err);
          });
      }
    });
  };

  const getInitials = (name) => {
    if (name) {
      let first_name = name.charAt(0);
      let last_name = name.split(' ').pop().charAt(0);
      return first_name + last_name;
    }
  };

  return (
    <>
      <BlockUi
        // className='p-5'
        tag="div"
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <h5>Your Direct/In-direct Reportees</h5>
        {/* <EmployeeDetailsCard user={user} /> */}
        <Grid container spacing={0}>
          <Grid item md={12} className="mx-auto">
            <div className="p-4 rounded">
              <br></br>
              <div className="scroll-area-xxl">
                <PerfectScrollbar options={{ wheelPropagation: true }}>
                  <div>
                    {orgData && (
                      <div className={styles.orgTree}>
                        <ul style={{ paddingLeft: '0px' }}>
                          <li style={{ float: 'inherit' }}>
                            {orgData.uuid != user.uuid &&
                            orgData?.managerData.length > 0 ? (
                              <>
                                {orgData?.managerData.map(
                                  (managerData, idx) => (
                                    <>
                                      <div
                                        className={styles.card1}
                                        onClick={(e) =>
                                          fetchEmployeesHirarchy(
                                            managerData.uuid,
                                            managerData.managerUUID
                                          )
                                        }>
                                        <div className={styles.card1Body}>
                                          <Grid
                                            item
                                            md={12}
                                            container
                                            className="mx-auto mb-2"
                                            direction="row">
                                            <Grid item md={3}>
                                              {managerData?.file ? (
                                                <div className="avatar-icon-wrapper avatar-icon-lg">
                                                  <div className="avatar-icon">
                                                    <img
                                                      src={
                                                        managerData?.profilePic
                                                      }
                                                      alt={getInitials(
                                                        managerData?.firstName +
                                                          ' ' +
                                                          managerData.lastName
                                                      )}
                                                    />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="avatar-icon-wrapper avatar-initials avatar-icon-lg">
                                                  <div className="avatar-icon text-white bg-success">
                                                    {getInitials(
                                                      managerData?.firstName +
                                                        ' ' +
                                                        managerData.lastName
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </Grid>{' '}
                                            <Grid
                                              item
                                              md={9}
                                              style={{
                                                paddingLeft: '10px'
                                              }}>
                                              <span
                                                style={{
                                                  textAlign: 'left'
                                                }}>
                                                <h6>
                                                  {' '}
                                                  {managerData?.firstName +
                                                    ' ' +
                                                    managerData.lastName}
                                                </h6>
                                                <p>
                                                  {managerData?.designation}
                                                </p>
                                                <p>{managerData?.department}</p>
                                                <p> {managerData?.location}</p>

                                                {managerData?.employeePhone ==
                                                'NA' ? (
                                                  ''
                                                ) : (
                                                  <p>
                                                    {managerData?.employeePhone}
                                                  </p>
                                                )}
                                                {}

                                                {managerData?.employeeEmail ==
                                                'NA' ? (
                                                  ''
                                                ) : (
                                                  <p>
                                                    {' '}
                                                    {managerData?.employeeEmail}
                                                  </p>
                                                )}
                                              </span>
                                            </Grid>
                                          </Grid>
                                        </div>
                                      </div>
                                    </>
                                  )
                                )}
                              </>
                            ) : (
                              ''
                            )}

                            {orgData.uuid != user.uuid &&
                            orgData?.managerData.length > 0 ? (
                              <ul></ul>
                            ) : (
                              ''
                            )}
                            <div className={styles.card1}>
                              <div className={styles.card1Body}>
                                <Grid
                                  item
                                  md={12}
                                  container
                                  className="mx-auto mb-2"
                                  direction="row">
                                  <Grid item md={3}>
                                    {/* <div className={styles.image}> */}
                                    {orgData?.file ? (
                                      <div className="avatar-icon-wrapper avatar-icon-lg">
                                        <div className="avatar-icon">
                                          <img
                                            src={orgData.profilePic}
                                            alt={getInitials(
                                              orgData?.firstName +
                                                ' ' +
                                                orgData.lastName
                                            )}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="avatar-icon-wrapper avatar-initials avatar-icon-lg">
                                        <div className="avatar-icon text-white bg-success">
                                          {getInitials(
                                            orgData?.firstName +
                                              ' ' +
                                              orgData.lastName
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {/* </div> */}
                                  </Grid>{' '}
                                  <Grid
                                    item
                                    md={9}
                                    style={{ paddingLeft: '10px' }}>
                                    <span style={{ textAlign: 'left' }}>
                                      <h6>
                                        {' '}
                                        {orgData?.firstName +
                                          ' ' +
                                          orgData.lastName}
                                      </h6>
                                      <p>{orgData?.designation}</p>
                                      <p> {orgData?.department}</p>
                                      <p> {orgData?.location}</p>
                                      {orgData?.employeePhone == 'NA' ? (
                                        ''
                                      ) : (
                                        <p> {orgData?.employeePhone} </p>
                                      )}
                                      {orgData?.employeeEmail == 'NA' ? (
                                        ''
                                      ) : (
                                        <p> {orgData?.employeeEmail} </p>
                                      )}
                                    </span>
                                  </Grid>{' '}
                                </Grid>
                              </div>
                            </div>
                            {orgData?.reportees.length > 0 ? <ul></ul> : ''}
                          </li>
                        </ul>
                        <div className={styles.orgTree}>
                          <ul style={{ padding: '0px' }}>
                            <div
                              style={{
                                display: 'flex',
                                overflowX: 'scroll',
                                marginLeft: '16px',
                                marginTop: '-17px'
                              }}>
                              {orgData?.reportees.length > 0 ? (
                                <>
                                  {orgData?.reportees.map((item, idx) => (
                                    <>
                                      <li className="mb-4">
                                        <div className={styles.card1}>
                                          <div className={styles.card1Body}>
                                            <Grid
                                              item
                                              md={12}
                                              container
                                              className="mx-auto mb-2"
                                              direction="row">
                                              <Grid
                                                item
                                                md={3}
                                                onClick={(e) =>
                                                  fetchEmployeesHirarchy(
                                                    item.uuid,
                                                    item.managerUUID
                                                  )
                                                }>
                                                {/* <div className={styles.image}> */}
                                                {item?.file &&
                                                item.profilePic ? (
                                                  <div className="avatar-icon-wrapper avatar-icon-lg">
                                                    <div className="avatar-icon">
                                                      <img
                                                        src={item.profilePic}
                                                        alt={getInitials(
                                                          item?.firstName +
                                                            ' ' +
                                                            item.lastName
                                                        )}
                                                      />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="avatar-icon-wrapper avatar-initials avatar-icon-lg">
                                                    <div className="avatar-icon text-white bg-success">
                                                      {getInitials(
                                                        item?.firstName +
                                                          ' ' +
                                                          item.lastName
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                                {/* </div> */}
                                              </Grid>
                                              <Grid
                                                item
                                                md={7}
                                                style={{
                                                  paddingLeft: '10px'
                                                }}
                                                onClick={(e) =>
                                                  fetchEmployeesHirarchy(
                                                    item.uuid,
                                                    item.managerUUID
                                                  )
                                                }>
                                                <span
                                                  style={{
                                                    textAlign: 'left'
                                                  }}>
                                                  <h6>
                                                    {' '}
                                                    {item?.firstName +
                                                      ' ' +
                                                      item.lastName}
                                                  </h6>
                                                  <p>{item?.designation}</p>
                                                  <p> {item?.department}</p>
                                                  <p> {item?.location}</p>
                                                  {item?.employeePhone ==
                                                  'NA' ? (
                                                    ''
                                                  ) : (
                                                    <p>
                                                      {' '}
                                                      {item?.employeePhone}{' '}
                                                    </p>
                                                  )}
                                                  {item?.employeeEmail ==
                                                  'NA' ? (
                                                    ''
                                                  ) : (
                                                    <p>
                                                      {' '}
                                                      {item?.employeeEmail}{' '}
                                                    </p>
                                                  )}
                                                </span>
                                              </Grid>
                                              <Grid item md={2}>
                                                <Button
                                                  onClick={(e) =>
                                                    setShowReporteeDetails(
                                                      item.uuid
                                                    )
                                                  }
                                                  className="d-30  p-0 ">
                                                  <FontAwesomeIcon
                                                    icon={[
                                                      'fas',
                                                      'share-square'
                                                    ]}
                                                    className="font-size-lg"
                                                  />
                                                </Button>
                                              </Grid>
                                            </Grid>
                                            <Grid
                                              item
                                              md={12}
                                              container
                                              className="mx-auto mb-2"
                                              direction="row"
                                              onClick={(e) =>
                                                fetchEmployeesHirarchy(
                                                  item.uuid,
                                                  item.managerUUID
                                                )
                                              }>
                                              <Grid item md={10}></Grid>
                                              <Grid item md={2}>
                                                <div
                                                  style={{
                                                    width: '50%',
                                                    backgroundColor: 'deepskyblue',
                                                    borderRadius: '60px',
                                                    margin: '0px 20%',
                                                    color: 'white'
                                                  }}>
                                                  {item.children}
                                                </div>
                                              </Grid>
                                            </Grid>
                                          </div>
                                        </div>
                                      </li>
                                    </>
                                  ))}
                                </>
                              ) : (
                                ''
                              )}
                            </div>
                          </ul>
                        </div>
                        <div></div>
                      </div>
                    )}
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </Grid>
        </Grid>
        <Popover
          open={showReporteeDetails != null}
          onClose={e => {setShowReporteeDetails(null); fetchEmployeesHirarchy(user.uuid,user.managerUUID)}}
          style={{
            top: '0',
            left: '320px',
            right: '10px',
            maxHeight: '800px',
            maxWidth: '1300px',
            margin: '0 auto'
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center'
          }}>
          <Button
            style={{ marginLeft: '95%', marginTop: '1%' }}
            onClick={e => {setShowReporteeDetails(null); fetchEmployeesHirarchy(user.uuid,user.managerUUID)}}
            className="btn-neutral-danger d-30  p-0 ">
            <FontAwesomeIcon
              icon={['fas', 'times']}
              className="font-size-lg crossIcon"
            />
          </Button>
          <MyProfile employeeUUID={showReporteeDetails} />
        </Popover>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose3}
          message={message}
          autoHideDuration={2000}
        />
      </BlockUi>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.Auth.user,
    selectedCompany: state.Auth.selectedCompany
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MyTeam);
