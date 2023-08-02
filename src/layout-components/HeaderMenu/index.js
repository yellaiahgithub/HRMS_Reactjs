import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Box, Popover, Button, List, ListItem } from '@material-ui/core';

import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import CollectionsTwoToneIcon from '@material-ui/icons/CollectionsTwoTone';
import DnsTwoToneIcon from '@material-ui/icons/DnsTwoTone';
import HomeWorkTwoToneIcon from '@material-ui/icons/HomeWorkTwoTone';
import { NavLink, useHistory } from 'react-router-dom';

const HeaderMenu = (props) => {
  const { companyId } = props;
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadAnchor, setUploadAnchor] = useState(null);
  const [reportAnchor, setReportAnchor] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = (event) => {
    setUploadAnchor(event.currentTarget);
  };

  const handleReportClick = (event) => {
    setReportAnchor(event.currentTarget);
  };

  const handleUploadClose = () => {
    setUploadAnchor(null);
  };

  const handleReportClose = (event) => {
    setReportAnchor(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'mega-menu-popover' : undefined;

  const uploadOpen = Boolean(uploadAnchor);
  const uploadId = uploadOpen ? 'upload-menu-popover' : undefined;

  const reportOpen = Boolean(reportAnchor);
  const reportId = reportOpen ? 'report-menu-popover' : undefined;

  const leaveOpen = Boolean(anchorElMenu)
  const leaveId = leaveOpen ? 'leave-menu-popover' : undefined;

  const handleClickMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  return (
    <>
      <div className="app-header-menu">
        <Button size="small" onClick={handleClick} className="btn-pill  ">
          Workforce Management
        </Button>
        <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <div className="popover-custom-xxl p-0">
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">
                  <ListItem button component="a" href='/hireProcess'>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Hire Process</span>
                  </ListItem>
                  <ListItem component="a" button href="/nationalIDs">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>National ID</span>
                  </ListItem>
                  <ListItem component="a" button href="/addAddress">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Address</span>
                  </ListItem>
                  <ListItem component="a" button href="/addEmergencyContact">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Emergency Contact</span>
                  </ListItem>
                  <ListItem component="a" button href="/createDependants">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Dependants</span>
                  </ListItem>
                  <ListItem component="a" button href="/addWorkExperience">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Work Experience</span>
                  </ListItem>
                  <ListItem component="a" button href="/addPhoneAndEmailAddress">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Phone & Email</span>
                  </ListItem>
                  <ListItem component="a" button href="/addCertificateLicense">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Certificate / License</span>
                  </ListItem>
                  <ListItem component="a" button href="/employees">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee</span>
                  </ListItem>
                  <ListItem component="a" button href="/orgStructure">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Org Structure</span>
                  </ListItem>
                  <ListItem component="a" button href="/educationalDetails">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Education Details</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-success p-3">
                  <ListItem button component="a" href='/department'>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Department</span>
                  </ListItem>
                  <ListItem component="a" button href='/locations'>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Location</span>
                  </ListItem>
                  <ListItem component="a" button href="/designation">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Designation</span>
                  </ListItem>
                  <ListItem component="a" button href="/sourceBank">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Source Bank</span>
                  </ListItem>
                  <ListItem component="a" button href="/bankBranches">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Bank Branches</span>
                  </ListItem>
                  <ListItem component="a" button href="/bank">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Bank</span>
                  </ListItem>
                  <ListItem component="a" button href="/jobBand">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Job Band</span>
                  </ListItem>
                  <ListItem component="a" button href="/jobGrade">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Job Grade</span>
                  </ListItem>
                  <ListItem component="a" button href="/publishAnnouncement">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Publish Company News</span>
                  </ListItem>
                  <ListItem component="a" button href="/letters">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Letters</span>
                  </ListItem>
                  <ListItem component="a" button href="/exitControl">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Exit Controls</span>
                  </ListItem>
                  <ListItem component="a" button href="/probationControl">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Probation Control</span>
                  </ListItem>
                  <ListItem component="a" button href="/probationPeriodSetup">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Probation Period Setup</span>
                  </ListItem>
                  <ListItem component="a" button href="/holidayCalendarMaster">
                    <div className='mr-2'>
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Holiday Calendar Master</span>
                  </ListItem>
                  <ListItem component="a" button href="/holidayCalendar">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Holiday Calendar</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <List component="div" className="nav-neutral-danger p-3">
                  <ListItem component="a" button href={'/createUserIdSetup'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>UserID Setup</span>
                  </ListItem>
                  <ListItem component="a" button href={'/autoNumberingSetup'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Auto Numbering Setup</span>
                  </ListItem>
                  <ListItem component="a" button href="/updateEmployeeID">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Update/Delete ID</span>
                  </ListItem>
                  <ListItem component="a" button href="/createEmployeeUserId">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Create UserID</span>
                  </ListItem>
                  <ListItem component="a" button href="/transactionSummary?type=admin">
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Transaction Summary</span>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </div>
        </Popover>
        <Button onClick={handleClickMenu} size="small" className="btn-pill  ">
          Leave Management
        </Button>
        <Popover id={leaveId} open={leaveOpen} anchorEl={anchorElMenu} onClose={handleCloseMenu} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <div className="popover-custom-xxl p-0">
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">                 
                  <ListItem button component="a" href='/leaveTypes'>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Leave Types</span>
                  </ListItem>
                  <ListItem button component="a" href='/leaveAccumulation'>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Leave Accumulation</span>
                  </ListItem>
                  <ListItem button onClick={handleCloseMenu} component={NavLink} to={'/accrualPolicy'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Accrual Policy</span>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </div>
        </Popover>
        <Button onClick={handleUploadClick} className="btn-pill">
          Upload
        </Button>
        <Popover id={uploadId} open={uploadOpen} anchorEl={uploadAnchor} onClose={handleUploadClose} anchorOrigin={{
          vertical: 'bottom', horizontal: 'left'
        }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <div className="popover-custom-xxl p-0">
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadResults'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Results</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadDepartment'}>
                    <div className='mr-2'>
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className='font-size-xs opacity-3' />
                    </div>
                    <span>Upload Department</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadEmployees'}>
                    <div className='mr-2'>
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className='font-size-xs opacity-3' />
                    </div>
                    <span>Upload Employees</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadDesignation'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Designation</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadCertificate'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Certificate</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadLicense'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload License</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadDocument'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Document</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <List component="div" className="nav-neutral-first p-3">
                  <div className="divider-v divider-v-lg" />
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadNationalID'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload National ID</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadAddress'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Address</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadLocation'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Location</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadPhone'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Phone</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadJobGrade'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Job Grade</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadJobBands'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Job Band</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadCompanyPolicy'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Company Policy</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-success p-3">
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadEmailID'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Email ID</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadEmergencyContact'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Emergency Contact</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadDependants'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Dependants</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadBeneficiary'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Beneficiary</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/uploadWorkExperience'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Upload Work Experience</span>
                  </ListItem>
                  <ListItem button onClick={handleUploadClose} component={NavLink} to={'/managerChangeUpload'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Manager Change Upload</span>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </div>
        </Popover>

        <Button onClick={handleReportClick} className="btn-pill">
          Reports
        </Button>
        <Popover
          id={reportId}
          open={reportOpen}
          anchorEl={reportAnchor}
          onClose={handleReportClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          <div className='popover-custom-xxl p-0'>
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/downloadResults'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Download Results</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/nationalIDReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>National ID Report</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeeDetailsReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Details Report</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/emergencyContactReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Emergency Contact Report</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeeMissingInfoReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Missing Info Report</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">
                  <ListItem button onClick={() => {
                    handleReportClose();
                    window.location.assign('/employeeDependantOrBeneficiaryDetails?type=Dependant')
                  }}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Dependant Details</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/departmentReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Department Wise Report</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeeHireSeparation'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Hire Separation</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/probationConfirmation'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Probation Confirmation</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeeBloodGroup'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Blood Group</span>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={4}>
                <div className="divider-v divider-v-lg" />
                <List component="div" className="nav-neutral-first p-3">
                  <ListItem button onClick={() => {
                    handleReportClose();
                    window.location.assign('/employeeDependantOrBeneficiaryDetails?type=Beneficiary')
                  }}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Beneficiary Details</span>
                  </ListItem>
                  <ListItem button onClick={() => {
                    handleReportClose();
                    window.location.assign('/employeeCertificateOrLicenseReports?type=Certificate')
                  }}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Certificate Details</span>
                  </ListItem>

                  <ListItem button onClick={() => {
                    handleReportClose();
                    window.location.assign('/employeeCertificateOrLicenseReports?type=License')
                  }}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee License Details</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeeRolesReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Roles Report</span>
                  </ListItem>
                  <ListItem button onClick={handleReportClose} component={NavLink} to={'/employeePriorWorkExperienceReport'}>
                    <div className="mr-2">
                      <FontAwesomeIcon icon={['fas', 'chevron-right']} className="font-size-xs opacity-3" />
                    </div>
                    <span>Employee Prior Work Experience Report</span>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </div>
        </Popover>

      </div>
    </>
  );
};

export default HeaderMenu;