import { Box, Button, Card, Dialog, Grid, Snackbar, Table } from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import 'date-fns';
import apicaller from 'helper/Apicaller';
import { useDropzone } from 'react-dropzone';
import { Alert, Pagination } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import { parse } from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';

const CreateUploadPhone = (props) => {
  const { selectedCompany, hideCodes, setHideCodes } = props;

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const toggle4 = () => setModal4(!modal4)
  const [modal4, setModal4] = useState(false)
  const [isAutoGeneratedEmployeeId, setIsAutoGeneratedEmployeeId] =
    useState(false);
  const [files, setFiles] = useState([]);
  const [paginationUploadPhoneData, setPaginationUploadPhoneData] =
    useState([]);
  const [uploadPhoneData, setUploadPhoneData] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [CSVHeader, setCSVHeader] = useState([]);
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false);

  const [isValidated, setIsValidated] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState()
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults');

  const validatePhoneNumber = (phoneNumber) => {
    const str = '0123456789';
    return (/^\d{10}$/.test(phoneNumber));
  }
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    getPhoneCSVHeader();
  }, []);
  const getPhoneCSVHeader = () => {
    apicaller('get', `${BASEURL}/employeePhone/CSVHeader`)
      .then((res) => {
        if (res.status === 200) {
          setCSVHeader(res.data.CSVHeader);
        }
      })
      .catch((err) => {
        console.log('get employee Phone err', err);
      });
  };

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    multiple: false,
    accept: 'text/csv',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        const text = await file.text();
        const result = parse(text, { header: true });
        setUploadPhoneData(result.data);
        setPaginationUploadPhoneData(result.data);
      });
    }
  });
  const thumbs = files.map((file, index) => (
    <Grid item md={12} className="p-2" key={file.name}>
      <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
        {file.name} - {file.size}KB
        <Box textAlign="right">
          <Button
            onClick={(e) => {
              files.splice(index, 1);
              thumbs.splice(index, 1);
              setPaginationUploadPhoneData([]);
              setUploadPhoneData([]);
            }}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ));

  const validateUploadingData = () => {
    let dataWithoutErrors = [];
    let dataWithErrors = [];

    uploadPhoneData.forEach((item) => {
      let isValid = true;
      item.errors = [];
      if (!isAutoGeneratedEmployeeId) {
        if (item.Employee_Id == null || item.Employee_Id.length == 0) {
          isValid = false;
          item.errors.push('Employee Id can not be empty.\n');
        } else {
          const duplicateEmployeeWithId = uploadPhoneData.find(
            (emp) => emp.id === item.Employee_Id
          );
          if (duplicateEmployeeWithId) {
            isValid = false;
            item.errors.push(
              "Duplicate Employee Id '" +
              item.Employee_Id +
              "' .Another record with Employee name '" +
              duplicateEmployeeWithId?.Phone_Type +
              "' also has same EmployeeId in the uploaded file " +
              '\n'
            );
          }
        }
      }
      if (item.Phone_Type == null || item.Phone_Type.length == 0) {
        isValid = false;
        item.errors.push('Phone Type can not be empty.\n');
      }
      let txtErr = '';
      if (item.Phone_Type.toLowerCase() != 'official' && item.Phone_Type.toLowerCase() != 'personal'
        && item.Phone_Type.toLowerCase() != 'confidential') {
        isValid = false;
        txtErr = txtErr + 'Phone Typeis not valid.\n'
      }

        if (!validatePhoneNumber (item.Phone_Number)) {
          console.log('Phone Number is not valid.')
          isValid = false;
          txtErr = txtErr + 'Phone Number is not valid.\n'
        } else {
          console.log('Phone Number is valid.')
        }
      item.errors.push(txtErr)

      if (item.Phone_Number == null || item.Phone_Number.length == 0) {
        isValid = false;
        item.errors.push('Phone Number can not be empty.\n');
      }
      if (!(item.Is_Primary?.toLowerCase() === 'true' || item.Is_Primary?.toLowerCase() === 'false')) {
        isValid = false;
        item.errors.push('Is Primary can not be empty.\n');
      }
      if (isValid) {
        dataWithoutErrors.push(item);
      } else {
        dataWithErrors.push(item);
      }
    });
    if (!dataWithErrors || dataWithErrors.length == 0) {
      setIsValidated(true)
    }
    const data = [...dataWithErrors];
    data.push(...dataWithoutErrors);
    setUploadPhoneData(data);
    setPaginationUploadPhoneData(data);
    setState({
      open: true,
      message:
        dataWithErrors?.length > 0
          ? dataWithErrors.length +
          ' Records have errors kindly resolve them in order to save them'
          : 'No Errors found in the data you can save them',
      toastrStyle:
        dataWithErrors?.length > 0 ? 'toastr-warning' : 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    });
  };
  const saveAll = (e) => {
    e.preventDefault();
    //to do service call
    let modifiedData = [];
    uploadPhoneData.forEach((item) => {
      const data = {
        employeeId: item.Employee_Id,
        phoneNumber: item.Phone_Number,
        type: item.Phone_Type,
        isPreferred: item.Is_Primary,
      };
      if (!isAutoGeneratedEmployeeId) {
        data.id = item.Employee_Id;
      }
      modifiedData.push(data);
    });
    const fileData = {
      fileName: files[0].name,
      data: modifiedData,
      isAutoGeneratedEmployeeId: isAutoGeneratedEmployeeId
    };
    setNavigateToUploadResultsPage(true);
    setState({
      open: true,
      message:
        "Upload is in Queue Kindly verify the results in 'UPLOAD RESULTS' page",
      toastrStyle: 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    });
    apicaller('post', `${BASEURL}/employeePhone/saveAll`, fileData)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        setState({
          open: true,
          message: err?.response?.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
        console.log('Upload employee phone err', err);
      });
  };
  return (
    <>
      {!hideCodes ? (
        <>
          <Grid container spacing={0}>
            <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
              <Grid item container spacing={2} direction="row" >
                <Grid item md={12} className="font-size-sm d-flex align-items-center ">
                  <FontAwesomeIcon
                    icon={['far', 'file-excel']}
                    style={{ color: 'green' }}
                    className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'
                  />
                  <CSVLink
                    {...{
                      filename: 'Load_Phones_Template.csv',
                      headers: CSVHeader,
                      data: []
                    }}
                    style={{
                      color: 'green',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textTransform: 'capitalize',
                      '& :hover': {
                        textDecoration: 'underline'
                      }
                    }}>
                    click to Download The Template If You Don't Have One
                  </CSVLink>
                </Grid>
                <Grid item container spacing={2} direction="row">
                  <Grid item md={12}>
                    <Card
                      className="mt-4 p-3 p-lg-5 shadow-xxl codesCard">
                      <div className="card-header">
                        <div className="card-header--title">
                          <p>
                            <b>Upload .CSV file</b>
                          </p>
                        </div>
                      </div>
                      <div className="dropzone">
                        <div
                          {...getRootProps({
                            className: 'dropzone-upload-wrapper'
                          })}>
                          <input {...getInputProps()} />
                          <div className="dropzone-inner-wrapper bg-white">
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
                                  Some files will be rejected! Accepted only csv
                                  files
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
                          <div className="mb-3 text-uppercase text-dark font-size-sm text-center">
                            Uploaded Files
                          </div>
                          {thumbs.length <= 0 && (
                            <div className='text-first text-center font-size-sm'>
                              Uploaded demo File previews will appear here!
                            </div>
                          )}
                          {thumbs.length > 0 && (
                            <div>
                              <Alert
                                severity="success"
                                className="text-center mb-3">
                                You have uploaded <b>{thumbs.length}</b> files!
                              </Alert>
                              <Grid container spacing={0}>
                                {thumbs}
                              </Grid>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Grid>
                </Grid>
                <br />
              </Grid>
              <Grid item container spacing={2} direction="row" className='mt-4'>
                <Button
                  className="btn-primary m-2 "
                  type="submit"
                  disabled={files?.length == 0}
                  onClick={toggle4}>
                  Next
                </Button>
                <Button
                  className="btn-primary m-2 "
                  component={NavLink}
                  to="./dashboard">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Dialog
            open={modal4}
            onClose={toggle4}
            classes={{ paper: 'shadow-sm-dark rounded-sm' }}>
            <div className='text-center p-5'>
              <div className='avatar-icon-wrapper rounded-circle m-0'>
                <div className='d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-first text-first m-0 d-130'>
                  <FontAwesomeIcon
                    icon={['far', 'keyboard']}
                    className='d-flex align-self-center display-3'
                  />
                </div>
              </div>
              <h4 className='font-weight-bold mt-4'>Are you sure?</h4>
              <p className='mb-0 text-black-50'>
                Assuming the first row of the csv file is header
              </p>
              <div className='pt-4'>
                <Button
                  onClick={toggle4}
                  className='btn-neutral-secondary btn-pill mx-1'>
                  <span className='btn-wrapper--label'>No</span>
                </Button>
                <Button
                  onClick={e => setHideCodes(true)}
                  className='btn-first btn-pill mx-1'>
                  <span className='btn-wrapper--label'>Yes</span>
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      ) : (
        <>
          {paginationUploadPhoneData.length > 0 && (
            <>
              <Box textAlign="right">
                <Button
                  className="btn-primary mb-2 mr-3"
                  onClick={(e) => validateUploadingData()}>
                  Validate
                </Button>
              </Box>
              <div className="p-4">
                <div className="table-responsive-md"
                  style={{ width: '100%', overflowX: 'auto' }}>
                  <Table className="table table-alternate-spaced mb-0">
                    <thead>
                      <tr>
                        {!isAutoGeneratedEmployeeId && (
                          <th
                            style={{ width: 'auto' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize "
                            scope="col">
                            Employee Id
                          </th>
                        )}
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Phone Type
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Phone Number
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Is Preferred
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Errors
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginationUploadPhoneData
                        .slice(
                          page * recordsPerPage > uploadPhoneData.length
                            ? page === 0
                              ? 0
                              : page * recordsPerPage - recordsPerPage
                            : page * recordsPerPage - recordsPerPage,
                          page * recordsPerPage <= uploadPhoneData.length
                            ? page * recordsPerPage
                            : uploadPhoneData.length
                        )
                        .map((item, index) => (
                          <>
                            <tr>
                              {!isAutoGeneratedEmployeeId && (
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <label title={item.Employee_Id}>
                                        {item.Employee_Id}
                                      </label>
                                    </div>
                                  </div>
                                </td>
                              )}
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label title={item.Phone_Type}>
                                      {item.Phone_Type}
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label title={item.Phone_Number}>
                                      {item.Phone_Number}
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label title={item.Is_Primary}>
                                      {item.Is_Primary}
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label
                                      style={
                                        item.errors?.length > 0
                                          ? { color: 'red' }
                                          : {}
                                      }
                                      title={item.errors}>
                                      {item.errors}
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr className="divider"></tr>
                          </>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                <Pagination
                  className="pagination-primary"
                  count={Math.ceil(
                    uploadPhoneData.length / recordsPerPage
                  )}
                  variant="outlined"
                  shape="rounded"
                  selected={true}
                  page={page}
                  onChange={handleChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
          )}
          {navigateToUploadResultsPage ? (
            <div className="d-flex align-items-center justify-content-center">
              <a
                href={uploadResultsUrl}
                className="text-black"
                title="Navigate To Upload Results Page"
                style={{ color: 'blue' }}>
                Navigate To Upload Results Page
              </a>
            </div>
          ) : (
            ''
          )}
          <Box textAlign="right">
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => {
                setHideCodes(false)
                toggle4()
                setIsValidated(true)
              }}>
              Back
            </Button>
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              disabled={!isValidated ? true : false}
              onClick={(e) => saveAll(e)}>
              Save all
            </Button>
          </Box>
        </>
      )
      }
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
      <br />
      <br />
    </ >
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUploadPhone);