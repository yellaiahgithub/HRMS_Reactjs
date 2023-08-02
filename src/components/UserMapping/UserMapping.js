import React, { useState, Component, useEffect } from 'react';
import 'date-fns';
import SelectEmployee from 'components/SelectEmployee';
import { Button, Card, Grid, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { setIsUserMapped, setMappedByUser, setUser } from 'actions';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { Autocomplete } from '@material-ui/lab';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import { useHistory } from 'react-router-dom';

const CreateUserMappingSetup = (props) => {
  const {
    user,
    mappedByUser,
    setMappedUser,
    setLoggedInUser,
    setUserMapped,
    isUserMapped
  } = props;
  const [employeeData, setEmployeeData] = useState();
  const [allEmployees, setEmployees] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState();
  const [employeeIndex, setEmployeeIndex] = useState();
  const history = useHistory();

  useEffect(() => {
    getEmployees();
  }, []);
  const getParsedDate = (date) => {
    if (date !== null && date !== '') {
      return new Date(date).toLocaleDateString('af-ZA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } else {
      return 'N/A';
    }
  };

  const getEmployees = () => {
    setBlocking(true);
    apicaller('get', `${BASEURL}/employee/fetchEmployeeByUserId`)
      .then((res) => {
        if (res.status === 200) {
          setBlocking(false);
          console.log('res.data', res.data);
          const data = res.data;
          for (let index = 0; index < data.length; index++) {
            const iterator = data[index];
            iterator['nameWithId'] = iterator.legalName + '-' + iterator.id;
          }
          //filter logged in user and mapped user from list
          const filteredEmployees = res.data.filter(
            (employee) =>
              !(
                employee.uuid == user.uuid ||
                employee.uuid == mappedByUser?.uuid
              )
          );
          setEmployees(filteredEmployees);
        } else {
          setBlocking(false);
        }
      })
      .catch((err) => {
        setBlocking(false);
        console.log('getEmployees err', err);
      });
  };
  const mapToEmployee = () => {
    setLoggedInUser(employeeData);
    if (!isUserMapped) {
      setMappedUser(user);
      setUserMapped(true);
    }
    history.push('/dashboard');
  };
  return (
    <>
      <Card>
        <div className="bg-white p-4 rounded">
          <BlockUi
            tag="div"
            blocking={blocking}
            loader={
              <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <div>
                  <label className=" mb-2">Select Employee *</label>
                  <Autocomplete
                    id="combo-box-demo"
                    options={allEmployees}
                    getOptionLabel={(option) => option.nameWithId}
                    value={
                      employeeIndex != null
                        ? allEmployees[employeeIndex] || ''
                        : null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          employeeIndex != null
                            ? allEmployees[employeeIndex] || ''
                            : null
                        }
                        name="selectedEmployee"
                      />
                    )}
                    onChange={(event, value) => {
                      const index = allEmployees.findIndex(
                        (employee) => employee.uuid === value?.uuid
                      );
                      setEmployeeIndex(index);
                      setEmployeeDetail(value);
                      setEmployeeData(value);
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            {employeeDetail && (
              <Card style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                <div className="p-4">
                  <Grid container spacing={0}>
                    <Grid item md={2}>
                      <div className="rounded avatar-image overflow-hidden d-140  text-center text-success d-flex justify-content-center align-items-center">
                        {employeeDetail?.profilePic ? (
                          <img
                            className="img-fluid img-fit-container rounded-sm"
                            src={employeeDetail?.profilePic}
                            style={{ width: '150px', height: '150px' }}
                            alt="..."
                          />
                        ) : (
                          <img
                            className="img-fluid img-fit-container rounded-sm"
                            src={empty_profile_picture}
                            style={{ width: '150px', height: '150px' }}
                            alt="..."
                          />
                        )}
                      </div>
                    </Grid>
                    <Grid item md={10}>
                      <Grid item md={12} className="d-flex" spacing={2}>
                        <Grid item md={3}>
                          <div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              Employee Name
                            </div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              DOB
                            </div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              Department
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <p className="opacity-8 font-size-sm mb-3">
                            {employeeDetail.legalName}
                          </p>
                          <p className="opacity-8 font-size-sm mb-3">
                            {getParsedDate(employeeDetail?.dob)}
                          </p>
                          <p className="opacity-8 font-size-sm mb-3">
                            {employeeDetail?.departmentName}
                          </p>
                        </Grid>
                        <Grid item md={3}>
                          <div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              Employee ID
                            </div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              Designation
                            </div>
                            <div className="font-size-sm font-weight-bold mb-3">
                              Location
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={3}>
                          <p className="opacity-8 font-size-sm mb-3">
                            {employeeDetail?.id}
                          </p>
                          <p className="opacity-8 font-size-sm mb-3">
                            {employeeDetail?.designation}
                          </p>
                          <p className="opacity-8 font-size-sm mb-3">
                            {employeeDetail?.locationName}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Card>
            )}
            {employeeData && (
              <div
                className="bg-white pb-4"
                style={{ float: 'right' }}>
                <Button onClick={mapToEmployee} className="btn-primary mx-1">
                  <span className="btn-wrapper--label">
                    Map To This Employee
                  </span>
                </Button>
                <br />
              </div>
            )}
          </BlockUi>
        </div>
      </Card>
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.Auth.user,
  mappedByUser: state.Auth.mappedByUser,
  isUserMapped: state.Auth.isUserMapped
});

const mapDispatchToProps = (dispatch) => ({
  setLoggedInUser: (data) => dispatch(setUser(data)),
  setMappedUser: (data) => dispatch(setMappedByUser(data)),
  setUserMapped: (data) => dispatch(setIsUserMapped(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserMappingSetup);
