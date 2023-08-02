import {
  Button,
  Card,
  Dialog,
  Grid,
  Snackbar,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import avatar4 from '../../assets/images/avatars/avatar4.jpg';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { useDropzone } from 'react-dropzone';

import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { Alert } from '@material-ui/lab';
import { setSelectedEmployee } from '../../actions/index'
const HireProcessII = (props) => {
  const { selectedCompany, setEmployee } = props;

  const urlLocation = useLocation();
  const queryParams = new URLSearchParams(urlLocation.search);
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Customer' : 'Create Customer';
  let [validDate, setValidDate] = useState(true);
  const [employeeId, setEmployeeId] = useState();
  const [employeeUUID, setEmployeeUUID] = useState();
  const [employeeJobType, setEmployeeJobType] = useState();
  const [employeeJobStatus, setEmployeeJobStatus] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [fatherOrHusband, setfatherOrHusband] = useState();
  const [fatherOrHusbandName, setfatherOrHusbandName] = useState();
  const [dob, setDob] = useState();
  const [celebratesOn, setCelebratesOn] = useState();
  const [birthCountry, setBirthCountry] = useState();
  const [birthState, setBirthState] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [nationality, setNationality] = useState();
  const [gender, setGender] = useState();
  const [maritalStatus, setMaritalStatus] = useState();
  const [hireDate, setHireDate] = useState();
  const [reasonForHire, setReasonForHire] = useState();
  const [reasonForHireName, setReasonForHireName] = useState();
  const [department, setDepartment] = useState();
  const [departmentName, setDepartmentName] = useState();
  const [location, setLocation] = useState();
  const [locationName, setLocationName] = useState();
  const [designation, setDesignation] = useState();
  const [designationName, setDesignationName] = useState();
  const [managerId, setManagerId] = useState();
  const [managerName, setManagerName] = useState();

  const [_id, setId] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  const [isActive, setIsActive] = useState();
  const [employeeObject, setEmployeeObject] = useState();
  const [profilePicPath, setProfilePicPath] = useState([]);
  const [profilePicName, setProfilePicName] = useState([]);
  const [files, setFiles] = useState([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const deleteModaltoggle = () => setDeleteModal(!deleteModal);
  const editModalToggle = () => setEditModal(!editModal);

  const [state, setState] = useState({
    openToast: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, openToast, toastrStyle, message } = state;
  const [profileImg, setProfileImg] = useState(empty_profile_picture);

  useEffect(() => {
    if (id) {
      getEmployee();
    } else {
      setState({
        openToast: true,
        message: "'Id' is required to search for employee",
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
    getRootProps,
    getInputProps
  } = useDropzone({
    noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center font-weight-bold text-success d-flex justify-content-center align-items-center">
      <img
        className="img-fluid img-fit-container rounded-sm"
        src={file.preview}
        alt="..."
      />
    </div>
  ));

  const getEmployee = () => {
    apicaller('get', `${BASEURL}/employee/fetchEmployeeByUserId?id=` + id)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
           const employee = res.data[0];
           employee['employeeName'] = employee.firstName + ' ' + employee.lastName
            setEmployee(employee)
            setEmployeeObject(employee);
            setEmployeeUUID(employee.uuid)
            setEmployeeId(employee.id);
            setEmployeeJobType(employee.jobType);
            setEmployeeJobStatus(employee.jobStatus);
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setMiddleName(employee.middleName);
            setfatherOrHusbandName(employee.fatherOrHusbandName);
            setfatherOrHusband(employee.fatherOrHusband);
            setDob(
              new Date(employee.dob).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            );
            setCelebratesOn(
              new Date(employee.celebratesOn).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            );
            setBirthCountry(employee.birthCountry);
            setBirthState(employee.birthState);
            setBirthPlace(employee.birthPlace);
            setNationality(employee.nationality);
            setGender(employee.gender);
            setMaritalStatus(employee.maritalStatus);
            setHireDate(
              new Date(employee.hireDate).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            );
            setReasonForHire(employee.reasonForHire);
            setReasonForHireName(employee.reasonForHireName);
            setDepartment(employee.department);
            setDepartmentName(employee.departmentName);
            setLocation(employee.location);
            setLocationName(employee.locationName);
            setDesignation(employee.designation);
            setDesignationName(employee.designationName);
            setManagerId(employee.managerId);
            setManagerName(employee.managerName);
            setId(employee._id);
            setCreatedAt(employee.createdAt);
            setUpdatedAt(employee.updatedAt);
            setIsActive(employee.isActive);
            setProfilePicName(employee?.file?.fileName);
            setProfilePicPath(employee?.file?.filePath);
            checkIfProfileImg(employee);
          } else {
            setState({
              openToast: true,
              message: 'Employee not found',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        }
      })
      .catch((err) => {
        console.log('get employee err', err);
      });
  };

  const checkIfProfileImg = (employeetionData) => {
    if (employeetionData?.file) {
      let path =
        employeetionData?.file?.filePath +
        '/' +
        employeetionData?.file?.fileName;
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then((res) => {
          if (res.status === 200) {
            if (res.data) {
              let baseStr64 = res.data;
              let imgSrc64 = 'data:image/jpg;base64,' + baseStr64;
              // Set the source of the Image to the base64 string
              setProfileImg(imgSrc64);
            }
          }
        })
        .catch((err) => {
          console.log('updateSession err', err);
        });
    }
  };

  const handleClose = () => {
    setState({ ...state, openToast: false });
  };
  const saveProfilePic = () => {
    updateEmployee();
  };
  const handleDeleteID = () => {
    setDeleteModal(false);
    updateEmployee();
    apicaller(
      'delete',
      `${BASEURL}/storage?path=` + profilePicPath + '/' + profilePicName
    )
      .then((res) => {
        if (res.status === 200) {
          setState({
            openToast: true,
            message: 'Deleted Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          });
        }
      })
      .catch((err) => {
        console.log('err', err);
        if (err?.response?.data) {
          setState({
            openToast: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
        }
      });
  };
  const updateEmployee = () => {
    let inputObj = { ...employeeObject };
    if (files[0]) {
      let path = selectedCompany.companyName + '/profile';
      let formData = new FormData();
      formData.append('file', files[0]);
      formData.append('documentType', 'profile');

      apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
        .then((res) => {
          if (res.status === 200) {
            inputObj['file'] = res.data;
            let path = res.data.filePath + '/' + res.data.fileName;
            apicaller('put', `${BASEURL}/employee/update`, inputObj)
              .then((res) => {
                if (res.status === 200) {
                  checkIfProfileImg(inputObj);
                  setState({
                    openToast: true,
                    message: 'Employee Updated Successfully',
                    toastrStyle: 'toastr-success',
                    vertical: 'top',
                    horizontal: 'right'
                  });
                }
              })
              .catch((err) => {
                setState({
                  openToast: true,
                  message: 'Error Occured while creating Employee Details',
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                });
                console.log('update employee err', err);
              });
          }
        })
        .catch((err) => {
          console.log('Iamge Upload err', err);
          setState({
            openToast: true,
            message: 'err',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
        });
      setEditModal(false);
      setFiles([]);
    } else {
      inputObj['file'] = null;
      setProfileImg(empty_profile_picture);
      apicaller('put', `${BASEURL}/employee/update`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            setState({
              openToast: true,
              message: 'Employee Updated Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            openToast: true,
            message: 'Error Occured while creating Employee Details',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('update employee err', err);
        });
    }
  };
  return (
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item md={10} lg={7} xl={11} className="mx-auto">
          <h6 className="">
            Employee has been Sucessfully hired. Please have a look at the
            summary and Next Steps
          </h6>
          <br />
          <b>Summary</b>
          <br />
          <Grid container spacing={0}>
            <Grid item container direction="row">
              <Grid item md={6} container className="mx-auto" direction="row">
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    Employee ID
                  </label>
                </Grid>
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    {employeeId != null && employeeId.length > 0
                      ? employeeId
                      : '-'}
                  </label>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Employee Job Type
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {employeeJobType != null && employeeJobType.length > 0
                        ? employeeJobType
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Employee Job Status
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {employeeJobStatus != null && employeeJobStatus.length > 0
                        ? employeeJobStatus
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Legal Name
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {firstName + ' ' + lastName}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Father/Husband Name
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {fatherOrHusbandName != null &&
                        fatherOrHusbandName.length > 0
                        ? fatherOrHusbandName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} container className="mx-auto" direction="row">
                <Grid item md={6} className="mx-auto"></Grid>
                <Grid item md={6} container className="mx-auto" direction="row">
                  <Grid item md={12} className="mx-auto">
                    <div className="rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center font-weight-bold text-success d-flex justify-content-center align-items-center">
                      <img
                        className="img-fluid img-fit-container rounded-sm"
                        src={profileImg}
                        alt="..."
                      />
                    </div>
                  </Grid>
                  <Grid item md={12} className="mx-auto">
                    <div
                      {...getRootProps({
                        className: 'dropzone-upload-wrapper'
                      })}
                      className="align-items-center justify-content-center">
                      <input {...getInputProps()} />
                      <Button
                        onClick={(e) => {
                          setDeleteModal(true);
                        }}
                        className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
                        <FontAwesomeIcon
                          icon={['fas', 'trash']}
                          className="font-size-sm"
                        />
                      </Button>
                      <Button
                        onClick={(e) => setEditModal(true)}
                        className="btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                        <FontAwesomeIcon
                          icon={['far', 'edit']}
                          className="font-size-sm"
                        />
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container direction="row">
              <Grid item md={6} container className="mx-auto" direction="row">
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    Date Of Birth
                  </label>
                </Grid>
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    {dob != null && dob.length > 0 ? dob : '-'}
                  </label>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Celebrates On
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {celebratesOn != null && celebratesOn.length > 0
                        ? celebratesOn
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Birth Country
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {birthCountry != null && birthCountry.length > 0
                        ? birthCountry
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Gender
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {gender != null && gender.length > 0 ? gender : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Hire Date
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {hireDate != null && hireDate.length > 0 ? hireDate : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Reason for Hire
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {reasonForHireName != null && reasonForHireName.length > 0
                        ? reasonForHireName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Employee Location
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {locationName != null && locationName.length > 0
                        ? locationName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} container className="mx-auto" direction="row">
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    Birth State
                  </label>
                </Grid>
                <Grid item md={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className=" mb-2">
                    {birthState != null && birthState.length > 0
                      ? birthState
                      : '-'}
                  </label>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Place Of Birth
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {birthPlace != null && birthPlace.length > 0
                        ? birthPlace
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Nationality
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {nationality != null && nationality.length > 0
                        ? nationality
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Maritial Status
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {maritalStatus != null && maritalStatus.length > 0
                        ? maritalStatus
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Employee Department
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {departmentName != null && departmentName.length > 0
                        ? departmentName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Employee Designation
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {designationName != null && designationName.length > 0
                        ? designationName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
                <Grid item container className="mx-auto" direction="row">
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Manager
                    </label>
                  </Grid>
                  <Grid item md={6} className="mx-auto">
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      {managerName != null && managerName.length > 0
                        ? managerName
                        : '-'}
                    </label>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <b>The following data is pending</b>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item container direction="row">
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./addAddress?uuid=" + employeeUUID}>
                    Employee Address
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./createDependants?uuid=" + employeeUUID}>
                    Employee Dependant Details
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"addWorkExperience?uuid=" + employeeUUID}>
                    Prior Work Experience
                  </a>
                </u>
              </Grid>
            </Grid>
            <Grid item container direction="row">
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./addEmergencyContact?uuid=" + employeeUUID}>
                    Emergency Contact Details
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./educationalDetails?uuid=" + employeeUUID}>
                    Education Qualifications
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./addCertificateLicense?uuid=" + employeeUUID}>
                    Employee Certificate & License
                  </a>
                </u>
              </Grid>
            </Grid>
            <Grid item container direction="row">
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./nationalIDs?uuid=" + employeeUUID}>
                    National ID
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
                <u>
                  <a style={{ color: 'blue' }} href={"./addPhoneAndEmailAddress?uuid=" + employeeUUID}>
                    Employee Phone & Email
                  </a>
                </u>
              </Grid>
              <Grid item md={4} className="mx-auto">
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <div>
            <Button className="btn-primary mb-2 m-2"
              component={NavLink}
              to={"./createUserCredentials?id=" + employeeId}>
              Create User ID
            </Button>
            <Button className="btn-primary mb-2 m-2" component={NavLink}
              to={"./hireprocess?id=" + employeeId}>
              Edit Hire Information
            </Button>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              key={`${vertical},${horizontal}`}
              open={openToast}
              classes={{ root: toastrStyle }}
              onClose={handleClose}
              message={message}
              autoHideDuration={2000}
            />
          </div>
        </Grid>
      </Grid>
      <Dialog
        open={deleteModal}
        onClose={deleteModaltoggle}
        classes={{ paper: 'shadow-lg rounded' }}>
        <div className="text-center p-5">
          <div className="avatar-icon-wrapper rounded-circle m-0">
            <div className="d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130">
              <FontAwesomeIcon
                icon={['fas', 'times']}
                className="d-flex align-self-center display-3"
              />
            </div>
          </div>
          <h4 className="font-weight-bold mt-4">
            Are you sure you want to delete this Photo?
          </h4>
          <p className="mb-0 font-size-lg text-muted">
            You cannot undo this operation.
          </p>
          <div className="pt-4">
            <Button
              onClick={deleteModaltoggle}
              className="btn-neutral-secondary btn-pill mx-1">
              <span className="btn-wrapper--label">Cancel</span>
            </Button>
            <Button
              onClick={handleDeleteID}
              className="btn-danger btn-pill mx-1">
              <span className="btn-wrapper--label">Delete</span>
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={editModal}
        onClose={editModalToggle}
        classes={{ paper: 'shadow-lg rounded' }}>
        <div className="dropzone">
          <div
            {...getRootProps({
              className: 'dropzone-upload-wrapper'
            })}>
            <input {...getInputProps()} />
            <div className="dropzone-inner-wrapper bg-white" onClick={open}>
              {isDragAccept && (
                <div>
                  <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto">
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(300,300)">
                        <path
                          d="M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <CheckIcon className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm text-success">
                    All files will be uploaded!
                  </div>
                </div>
              )}
              {isDragReject && (
                <div>
                  <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto">
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(300,300)">
                        <path
                          d="M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <CloseTwoToneIcon className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm text-danger">
                    Some files will be rejected! Accepted only Images
                  </div>
                </div>
              )}
              {!isDragActive && (
                <div>
                  <div className="d-140 hover-scale-lg icon-blob btn-icon text-first mx-auto">
                    <svg
                      className="d-140 opacity-2"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(300,300)">
                        <path
                          d="M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    <div className="blob-icon-wrapper">
                      <PublishTwoToneIcon className="d-50" />
                    </div>
                  </div>
                  <div className="font-size-sm">
                    Drop files here or click to upload
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer p-3 bg-secondary">
          <div>
            <div className="font-weight-bold mb-3 text-uppercase text-dark font-size-sm text-center">
              Uploaded Files
            </div>
            {thumbs.length > 0 && (
              <div>
                <Alert severity="success" className="text-center mb-3">
                  You have uploaded <b>{thumbs.length}</b> files!
                </Alert>
                <Grid container spacing={0}>
                  {thumbs}
                </Grid>
                <div className="pt-4">
                  <Button
                    onClick={(e) => {
                      setFiles([]);
                      editModalToggle();
                    }}
                    className="btn-neutral-secondary btn-pill mx-1">
                    <span className="btn-wrapper--label">Cancel</span>
                  </Button>
                  <Button
                    onClick={saveProfilePic}
                    className="btn-danger btn-pill mx-1">
                    <span className="btn-wrapper--label">Save</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
      <br />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = dispatch => ({
  setEmployee: data => dispatch(setSelectedEmployee(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(HireProcessII);
