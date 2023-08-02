import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Snackbar,
  Container,
  MenuItem,
  MenuList,
  TextField,
  Switch,
  Table
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
// List
import apicaller from 'helper/Apicaller';
import { useDropzone } from 'react-dropzone';
import { Alert, Pagination } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import { parse } from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';
import { moment } from 'moment';

const CreateItemCatalogue = (props) => {
  const { selectedCompany } = props;
  const history = useHistory();
  const [isSubmitted, setIsSubmitted] = useState();

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false;
  const saveButtonLabel = edit
    ? 'Update Item Catalogue'
    : 'Create Item Catalogue';

  const [type, setType] = useState('');
  const [code, setCode] = useState();
  const [description, setDescription] = useState();
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [status, setStatus] = useState(true);
  const [_id, setId] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [newFileUploaded, setNewFileUploaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [imgSrc, SetImageSrc] = useState('');
  const [uploadItemCatalogue, setUploadItemCatalogue] = useState(false);
  const [paginationItemCatalogueData, setPaginationItemCatalogueData] =
    useState([]);
  const [uploadItemCatalogueData, setUploadItemCatalogueData] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false);

  const [showUploadedData, setShowUploadedData] = useState(false);
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults');
  const [isUploadedDataValid, setIsUploadedDataValid] = useState(false);
  const [currentStatus, setCurrentStatus] = useState([{ label: 'Active', value: true }])
  const csvHeader = [
    { label: 'Item_Type', key: 'Item_Type' },
    { label: 'Item_Code', key: 'Item_Code' },
    { label: 'Description', key: 'Description' },
    { label: 'Effective_Date(DD/MM/YYYY)', key: 'Effective_Date' }
  ];
  const csvLink = {
    filename: 'Load_Item_Catalogue_Template.csv',
    headers: csvHeader,
    data: []
  };
  const itemCatalogueStatus = [
    {
      value: 'Active',
      code: true
    },
    {
      value: 'Inactive',
      code: false
    }
  ];

  const itemCatalogueType = [
    {
      value: 'Certificate'
    },
    {
      value: 'License'
    }
  ];
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (id) {
      getItemCatalogue();
      setCurrentStatus([{ label: 'Active', value: true }, { label: 'InActive', value: false }])
    }
  }, []);

  const getItemCatalogue = () => {
    apicaller('get', `${BASEURL}/itemCatalogue/fetchById/` + id)
      .then((res) => {
        if (res.status === 200) {
          setType(res.data[0].type);
          setCode(res.data[0].code);
          setDescription(res.data[0].description);
          setEffectiveDate(new Date(res.data[0].effectiveDate)?.toString());
          setStatus(res.data[0].status);
          setId(res.data[0]._id);
          setCreatedAt(res.data[0].createdAt);
        }
      })
      .catch((err) => {
        console.log('create deignation err', err);
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
    // noClick: true,
    // noKeyboard: true,
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
        setUploadItemCatalogueData(result.data);
        setPaginationItemCatalogueData(result.data);
      });
      setNewFileUploaded(true);
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
              setPaginationItemCatalogueData([]);
              setUploadItemCatalogueData([]);
            }}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ));
  const save = (e) => {
    e.preventDefault();
    //to do service call
    setIsSubmitted(true);

    let inputObj = {
      type: type,
      code: code,
      description: description,
      effectiveDate: effectiveDate,
      status: status,
      _id: _id,
      createdAt: createdAt
    };
    let isValid = false;
    isValid =
      type != null &&
      type.length > 0 &&
      code != null &&
      code.length > 0 &&
      description != null &&
      description.length > 0 &&
      status != null &&
      new Date(effectiveDate) > new Date(selectedCompany.registrationDate);
    if (isValid) {
      if (inputObj._id == null) {
        apicaller('post', `${BASEURL}/itemCatalogue/save`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'ItemCatalogue Created Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            setState({
              open: true,
              message: err.response.data,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
            console.log('create ItemCatalogue err', err);
          });
      } else {
        apicaller('put', `${BASEURL}/itemCatalogue/update`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'ItemCatalogue Updated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            setState({
              open: true,
              message: err.response.data,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
            console.log('update ItemCatalogue err', err);
          });
      }
    } else {
      setState({
        open: true,
        message: 'Errors exist in this form kindly resolve them before saving',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  const validateUploadingData = () => {
    setIsUploadedDataValid(false);
    let dataWithoutErrors = [];
    let dataWithErrors = [];

    uploadItemCatalogueData.forEach((item) => {
      let isValid = true;
      item.errors = [];
      if (item.Item_Type == null || item.Item_Type.length == 0) {
        isValid = false;
        item.errors.push('Type can not be empty.\n');
      }
      if (item.Item_Code == null || item.Item_Code.length == 0) {
        isValid = false;
        item.errors.push('Code can not be empty.\n');
      }
      if (item.Description == null || item.Description.length == 0) {
        isValid = false;
        item.errors.push('Description can not be empty.\n');
      }
      if (
        item['Effective_Date(DD/MM/YYYY)'] == null ||
        item['Effective_Date(DD/MM/YYYY)'].length == 0
      ) {
        isValid = false;
        item.errors.push('Effective Date can not be empty.\n');
      }
      if (
        new Date(item['Effective_Date(DD/MM/YYYY)']) <
        new Date(selectedCompany.registrationDate)
      ) {
        isValid = false;
        item.errors.push(
          "Effective Date can not be before Company's Registration Date.\n"
        );
      }
      if (isValid) {
        dataWithoutErrors.push(item);
      } else {
        dataWithErrors.push(item);
      }
    });
    if (dataWithErrors.length == 0) {
      setIsUploadedDataValid(true);
    }
    const data = [...dataWithErrors];
    data.push(...dataWithoutErrors);
    setUploadItemCatalogueData(data);
    setPaginationItemCatalogueData(data);
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
    let dataWithErrors = [];
    uploadItemCatalogueData.forEach((item) => {
      let isValid =
        item.Item_Type != null &&
        item.Item_Type.length > 0 &&
        item.Item_Code != null &&
        item.Item_Code.length > 0 &&
        item.Description != null &&
        item.Description.length > 0 &&
        new Date(item['Effective_Date(DD/MM/YYYY)']) >
        new Date(selectedCompany.registrationDate);
      const data = {
        type: item.Item_Type,
        code: item.Item_Code,
        description: item.Description,
        effectiveDate: item['Effective_Date(DD/MM/YYYY)']
      };
      if (!isValid) {
        dataWithErrors.push(data);
      }
      modifiedData.push(data);
    });
    const fileData = { fileName: files[0].name, data: modifiedData };
    setNavigateToUploadResultsPage(true);
    setState({
      open: true,
      message:
        "Upload is in Queue Kindly verify the results in 'UPLOAD RESULTS' page",
      toastrStyle: 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    });
    apicaller('post', `${BASEURL}/itemCatalogue/saveAll`, fileData)
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
        console.log('create ItemCatalogue err', err);
      });
  };
  return (
    <Card>
      <br />
      {!showUploadedData ? (
        <Grid container spacing={0}>
          <Grid item md={10} lg={7} xl={11} className="mx-auto">
            <h4 className="m-2 text-center">{saveButtonLabel}</h4>
            <br />
            <Grid container>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6} className="mx-auto">
                  <label className="mb-2">Type *</label>
                  <TextField
                    id="outlined-status"
                    label={type ? '' : 'Select Type'}
                    variant="outlined"
                    fullWidth
                    select
                    size="small"
                    value={type}
                    disabled={readOnly || uploadItemCatalogue}
                    onChange={(event) => {
                      setType(event.target.value);
                    }}
                    error={isSubmitted && (type == null || type.length == 0)}
                    helperText={
                      isSubmitted && (type == null || type.length == 0)
                        ? 'Type Should not be empty'
                        : null
                    }>
                    {itemCatalogueType.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} className="mx-auto">
                  <label className="mb-2">Code *</label>
                  <TextField
                    id="outlined-description"
                    placeholder="Code"
                    type="text"
                    variant="outlined"
                    fullWidth
                    disabled={readOnly || uploadItemCatalogue}
                    size="small"
                    value={code}
                    onChange={(event) => {
                      const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                      setCode(result.toUpperCase());
                    }}
                    error={isSubmitted && (code == null || code.length == 0)}
                    helperText={
                      isSubmitted && (code == null || code.length == 0)
                        ? 'Code Should not be empty'
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Description *
                  </label>
                  <TextField
                    id="outlined-description"
                    placeholder="Description"
                    type="text"
                    variant="outlined"
                    fullWidth
                    disabled={readOnly || uploadItemCatalogue}
                    size="small"
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                    error={
                      isSubmitted &&
                      (description == null || description.length == 0)
                    }
                    helperText={
                      isSubmitted &&
                        (description == null || description.length == 0)
                        ? 'Description Should not be empty'
                        : null
                    }
                  />
                </Grid>
                <Grid item md={6} lg={6} xl={6} className="mx-auto">
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Effective Date *
                  </label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ margin: '0%' }}>
                    <KeyboardDatePicker
                      style={{ margin: '0%' }}
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      fullWidth
                      size="small"
                      disabled={readOnly || uploadItemCatalogue}
                      value={effectiveDate}
                      onChange={(event) => {
                        setEffectiveDate(event);
                      }}
                      error={
                        !effectiveDate ||
                        (effectiveDate instanceof Date &&
                          new Date(effectiveDate) <
                          new Date(selectedCompany.registrationDate))
                      }
                      helperText={
                        !effectiveDate
                          ? 'Date is Required'
                          : effectiveDate instanceof Date &&
                            new Date(effectiveDate) <
                            new Date(selectedCompany.registrationDate)
                            ? "Effective Date Cannot be Less than Company's Registered Date"
                            : null
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6}>
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Status *
                  </label>     
                  <TextField
                    id="outlined-status"
                    // required
                    label={status ? '' : 'Select Status'}
                    variant="outlined"
                    error={isSubmitted && ((status === '') ? true : false)}
                    helperText={
                      isSubmitted && ((status === '') ? 'Field is Mandatory' : '')
                    }
                    fullWidth
                    select
                    size="small"
                    value={(status === '') ? '' : (status ? true : false)}
                    onChange={(event) => {
                      setStatus(event.target.value);
                    }}>
                    {currentStatus.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              {!edit ? (
                <>
                  <Grid container spacing={0}>
                    <Grid item md={7}>
                      <label style={{ marginTop: '15px' }} className="mb-2 mx-2">
                        Upload Item Catalogue
                      </label>
                      <Switch
                        onChange={(event) => {
                          setUploadItemCatalogue(event.target?.checked);
                        }}
                        checked={uploadItemCatalogue}
                        name="upload"
                        color="primary"
                        className="switch-small"
                      />
                    </Grid>
                  </Grid>

                  {uploadItemCatalogue ? (
                    <>
                      <Grid item container spacing={2} direction="row">
                        <Grid
                          item
                          md={12}
                          className="font-weight-bold mb-3 text-uppercase text-dark font-size-sm text-center">
                          <CSVLink
                            {...csvLink}
                            style={{
                              color: 'blue',
                              cursor: 'pointer',
                              '& :hover': {
                                textDecoration: 'underline'
                              }
                            }}>
                            CLICK TO DOWNLOAD TEMPLATE IF YOU DON'T HAVE ONE
                          </CSVLink>
                        </Grid>
                      </Grid>
                      <Grid item container spacing={2} direction="row">
                        <Grid item md={12}>
                          <Card
                            style={{
                              padding: '25px',
                              border: '1px solid #c4c4c4',
                              margin: '25px'
                            }}
                            className="mt-4 p-3 p-lg-5 shadow-xxl">
                            <div className="card-header">
                              <div className="card-header--title">
                                <p>
                                  <b>Upload Item Catalogues</b>
                                </p>
                              </div>
                            </div>
                            {edit && newFileUploaded ? (
                              <Grid item md={3} className="p-2">
                                <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
                                  <img
                                    className="img-fluid img-fit-container rounded-sm"
                                    src={imgSrc}
                                    alt="..."
                                  />
                                </div>
                              </Grid>
                            ) : (
                              ''
                            )}
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
                                        Some files will be rejected! Accepted
                                        only csv files
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
                                    <Alert
                                      severity="success"
                                      className="text-center mb-3">
                                      You have uploaded <b>{thumbs.length}</b>{' '}
                                      files!
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
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
              <br />
            </Grid>
            <Box textAlign="right">
              <Button
                className="btn-primary mb-2 mr-3"
                component={NavLink}
                to="./itemCatalogue">
                Cancel
              </Button>
              {uploadItemCatalogue ? (
                <Button
                  className="btn-primary mb-2 mr-3"
                  type="submit"
                  disabled={files?.length == 0}
                  onClick={(e) => setShowUploadedData(true)}>
                  Next
                </Button>
              ) : (
                <Button
                  className="btn-primary mb-2 mr-3"
                  type="submit"
                  onClick={(e) => save(e)}>
                  {saveButtonLabel}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          {paginationItemCatalogueData.length > 0 && (
            <>
              <Box textAlign="right">
                <Button
                  className="btn-primary mb-2 mr-3"
                  onClick={(e) => validateUploadingData()}>
                  Validate
                </Button>
              </Box>
              <div className="p-4">
                <div className="table-responsive-md">
                  <Table className="table table-alternate-spaced mb-0">
                    <thead>
                      <tr>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Type
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Code
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Description
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Effective Date
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
                      {paginationItemCatalogueData
                        .slice(
                          page * recordsPerPage > uploadItemCatalogueData.length
                            ? page === 0
                              ? 0
                              : page * recordsPerPage - recordsPerPage
                            : page * recordsPerPage - recordsPerPage,
                          page * recordsPerPage <=
                            uploadItemCatalogueData.length
                            ? page * recordsPerPage
                            : uploadItemCatalogueData.length
                        )
                        .map((item, index) => (
                          <>
                            <tr
                              style={
                                item.errors?.length > 0
                                  ? { backgroundColor: 'red' }
                                  : {}
                              }>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label
                                      style={
                                        item.errors?.length > 0
                                          ? { color: 'red' }
                                          : {}
                                      }
                                      className="font-weight-normal "
                                      title={item.Item_Type}>
                                      {item.Item_Type}
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
                                      className="font-weight-normal "
                                      title={item.Item_Code}>
                                      {item.Item_Code}
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
                                      className="font-weight-normal "
                                      title={item.Description}>
                                      {item.Description}
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
                                      className="font-weight-normal "
                                      title={
                                        item['Effective_Date(DD/MM/YYYY)']
                                      }>
                                      {item['Effective_Date(DD/MM/YYYY)']}
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
                                      className="font-weight-normal "
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
                    uploadItemCatalogueData.length / recordsPerPage
                  )}
                  variant="outlined"
                  shape="rounded"
                  selected={true}
                  page={page}
                  onChange={handleChange}
                  showFirstButton
                  showLastButton
                />
              </div>{' '}
            </>
          )}
          {navigateToUploadResultsPage ? (
            <div className="d-flex align-items-center justify-content-center">
              <a
                href={uploadResultsUrl}
                className="font-weight-bold text-black"
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
              onClick={(e) => setShowUploadedData(false)}>
              Back
            </Button>
            <Button
              disabled={!isUploadedDataValid}
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => saveAll(e)}>
              Save all
            </Button>
          </Box>
        </>
      )}
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
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateItemCatalogue);
