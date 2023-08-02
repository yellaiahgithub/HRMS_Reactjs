import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import axios from 'axios';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import { CSVLink } from 'react-csv';
import noResults from '../../assets/images/composed-bg/no_result.jpg'


const UploadResults = (props) => {
  const history = useHistory();

  const { selectedCompany } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const handleClose3 = () => {
    setState({ ...state, open: false });
  };

  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const [uploadResults, setUploadResults] = useState([]);
  const [alluploadResults, setAllUploadResults] = useState([]);
  const [paginationUploadResult, setPaginationUploadResult] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [csvHeader, setCsvHeader] = useState([
    { label: 'Item_Type', key: 'type' },
    { label: 'Item_Code', key: 'code' },
    { label: 'Description', key: 'description' },
    { label: 'Effective_Date', key: 'effectiveDate' },
    { label: 'Status', key: 'status' }
  ]);
  useEffect(() => {
    getUploadResult();
  }, []);

  const getUploadResult = () => {
    // Get all UploadResults API call
    apicaller('get', `${BASEURL}/uploadResults/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          setUploadResults(res.data);
          setAllUploadResults(res.data);
          setPaginationUploadResult(res.data);
        }
      })
      .catch((err) => {
        console.log('getUploadResults err', err);
      });
  };
  const tableData = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100px'
  }

  const uploadResultStatusFilter = [
    { value: 'All Statuses' },
    { value: 'Sucess' },
    { value: 'InProgress' },
    { value: 'Rejected' }
  ];
  const [status, setStatus] = useState('All Statuses');

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };
  const handleFilter = () => {
    if (status.toLocaleLowerCase() != 'All Statuses'.toLowerCase()) {
      const filteredUploadResults = alluploadResults.filter(
        (customer) => customer.status.toLowerCase() == status.toLowerCase()
      );
      setUploadResults(filteredUploadResults);
      setPaginationUploadResult(filteredUploadResults);
    } else {
      setUploadResults(alluploadResults);
      setPaginationUploadResult(alluploadResults);
    }
    handleClose()
  };
  const handleSort = (sortOrder) => {
    let sortedUploadResults = JSON.parse(JSON.stringify(uploadResults));
    if (sortOrder == 'ASC') {
      sortedUploadResults = sortedUploadResults.sort((desA, desB) =>
        desA.createdAt > desB.createdAt
          ? 1
          : desB.createdAt > desA.createdAt
            ? -1
            : 0
      );
      setUploadResults(sortedUploadResults);
      setPaginationUploadResult(sortedUploadResults);
    } else {
      sortedUploadResults = sortedUploadResults.sort((desB, desA) =>
        desA.createdAt > desB.createdAt
          ? 1
          : desB.createdAt > desA.createdAt
            ? -1
            : 0
      );
      setUploadResults(sortedUploadResults);
      setPaginationUploadResult(sortedUploadResults);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    const filteredUploadResults = alluploadResults.filter(
      (uploadResult) =>
        uploadResult.uploadedBy
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        uploadResult.status
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        uploadResult.type
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        uploadResult.fileName
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        new Date(uploadResult.createdAt)
          .toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        new Date(uploadResult.createdAt)
          .toLocaleTimeString()
          .toUpperCase()
          .includes(event.target.value?.toUpperCase())
    );

    if (filteredUploadResults.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setUploadResults(filteredUploadResults);
    setPaginationUploadResult(filteredUploadResults);
  };

  return (
    <>
      <Card className="card-box shadow-none">
        <div className="d-flex flex-column flex-md-row justify-content-between px-4 py-3">
          <div
            className={clsx(
              'search-wrapper search-wrapper--alternate search-wrapper--grow',
              { 'is-active': searchOpen }
            )}>
            <TextField
              variant="outlined"
              size="small"
              id="input-with-icon-textfield22-2"
              placeholder="Search Upload Results..."
              onFocus={openSearch}
              onBlur={closeSearch}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <Button
                onClick={handleClick}
                className="btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill">
                <FilterListTwoToneIcon className="w-50" />
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                classes={{ list: 'p-0' }}
                onClose={handleClose}>
                <div className="dropdown-menu-xxl overflow-hidden p-0">
                  <div className="p-3">
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                          Status
                        </small>
                        <FormControl variant="outlined" fullWidth size="small">
                          <Select
                            fullWidth
                            value={status}
                            onChange={handleStatus}
                            labelWidth={0}>
                            {uploadResultStatusFilter.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="divider" />
                  <div className="p-3 text-center bg-secondary">
                    <Button
                      className="btn-primary"
                      size="small"
                      onClick={handleFilter}>
                      Filter results
                    </Button>
                  </div>
                  <div className="divider" />
                  <div className="p-3">
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <List className="nav-neutral-danger flex-column p-0">
                          <ListItem
                            button
                            className="d-flex rounded-sm justify-content-center"
                            href="#/"
                            onClick={e => {
                              getUploadResult();
                              setStatus()
                              handleClose()
                            }}>
                            <div className="mr-2">
                              <DeleteTwoToneIcon />
                            </div>
                            <span>Cancel</span>
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Menu>
            </div>
            <div>
              <Button
                onClick={handleClick2}
                className="btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill">
                <SettingsTwoToneIcon className="w-50" />
              </Button>
              <Menu
                anchorEl={anchorEl2}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl2)}
                classes={{ list: 'p-0' }}
                onClose={handleClose2}>
                <div className="dropdown-menu-lg overflow-hidden p-0">
                  <div className="font-weight-bold px-4 pt-3">Results</div>
                  <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {
                        setRecordsPerPage(10);
                        setPage(1)
                        setPaginationUploadResult(uploadResults);
                        handleClose2();
                      }}>
                      <div className="nav-link-icon mr-2">
                        <RadioButtonUncheckedTwoToneIcon />
                      </div>
                      <span className="font-size-md">
                        <b>10</b> results per page
                      </span>
                    </ListItem>
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {
                        setRecordsPerPage(20);
                        setPage(1)
                        setPaginationUploadResult(uploadResults);
                        handleClose2();
                      }}>
                      <div className="nav-link-icon mr-2">
                        <RadioButtonUncheckedTwoToneIcon />
                      </div>
                      <span className="font-size-md">
                        <b>20</b> results per page
                      </span>
                    </ListItem>
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {
                        setRecordsPerPage(30);
                        setPage(1)
                        setPaginationUploadResult(uploadResults);
                        handleClose2();
                      }}>
                      <div className="nav-link-icon mr-2">
                        <RadioButtonUncheckedTwoToneIcon />
                      </div>
                      <span className="font-size-md">
                        <b>30</b> results per page
                      </span>
                    </ListItem>
                  </List>
                  <div className="divider" />
                  <div className="font-weight-bold px-4 pt-4">Order</div>
                  <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {
                        handleSort('ASC');
                        handleClose2();
                      }}>
                      <div className="mr-2">
                        <ArrowUpwardTwoToneIcon />
                      </div>
                      <span className="font-size-md">Ascending</span>
                    </ListItem>
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => { handleSort('DES'); handleClose2(); }}>
                      <div className="mr-2">
                        <ArrowDownwardTwoToneIcon />
                      </div>
                      <span className="font-size-md">Descending</span>
                    </ListItem>
                  </List>
                </div>
              </Menu>
            </div>
          </div>
        </div>
        <div className="divider" />
        {paginationUploadResult.length > 0 && (
          <>
            <div className="p-4">
              <div style={{ overflow: 'auto' }} className="table-responsive-md">
                <Table className="table table-alternate-spaced mb-0">
                  <thead style={{ background: '#eeeeee' }}>
                    <tr className="align-items-center justify-content-center">
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-left font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Type
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Uploaded Date
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        Uploaded Time
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Uploaded By
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        File Name
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Upload Status
                      </th>
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        Uploaded File
                      </th>{' '}
                      <th
                        style={{ width: 'auto' }}
                        className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        Error File
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationUploadResult
                      .slice(
                        page * recordsPerPage > uploadResults.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= uploadResults.length
                          ? page * recordsPerPage
                          : uploadResults.length
                      )
                      .map((item, index) => (
                        <>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title={item.type} >
                                    {item.type}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title={item.createdAt} >
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title={item.createdAt} >
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleTimeString()}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title={item.uploadedBy} >
                                    {item.uploadedBy}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title={item.fileName} >
                                    {item.fileName}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div
                                className="d-flex align-items-center justify-content-center "
                                style={
                                  item.status.toLowerCase() ==
                                    'Sucess'.toLowerCase()
                                    ? {
                                      background: '#cde1cd',
                                      color: 'green',
                                      cursor: 'pointer',
                                      borderRadius: '25px',
                                      '& :hover': {
                                        textDecoration: 'underline'
                                      }
                                    }
                                    : item.status.toLowerCase() ==
                                      'InProgress'.toLowerCase()
                                      ? {
                                        background: 'rgb(232 235 57 / 29%)',
                                        color: 'rgb(255 139 0)',
                                        cursor: 'pointer',
                                        borderRadius: '25px',
                                        '& :hover': {
                                          textDecoration: 'underline'
                                        }
                                      }
                                      : {
                                        background: 'rgb(230 183 183)',
                                        color: 'red',
                                        cursor: 'pointer',
                                        borderRadius: '25px',
                                        '& :hover': {
                                          textDecoration: 'underline'
                                        }
                                      }
                                }>
                                <div>{item.status}</div>
                              </div>
                            </td>
                            <td>
                              {item.fileName.split('.')[1].toLowerCase() ==
                                'csv' && (
                                  <div className="d-flex align-items-center ">
                                    <div>
                                      <CSVLink
                                        {...{
                                          headers: item.csvHeader,
                                          data: item.uploadedData,
                                          filename:
                                            item.type +
                                            '_Sucess_' +
                                            item.createdAt +
                                            '_' +
                                            item.fileName
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                          '& :hover': {
                                            textDecoration: 'underline'
                                          }
                                        }}>
                                        <FileCopyIcon className="d-40" />
                                      </CSVLink>
                                    </div>
                                  </div>
                                )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center ">
                                <div style={tableData}>
                                  {item.errorData.length > 0 ? (
                                    <CSVLink
                                      {...{
                                        headers: [
                                          ...item.csvHeader,
                                          { label: 'Errors', key: 'errors' }
                                        ],
                                        data: item.errorData,
                                        filename:
                                          item.type +
                                          '_Error_' +
                                          item.updatedAt +
                                          '_' +
                                          item.errorFileName
                                      }}
                                      style={{
                                        cursor: 'pointer',
                                        '& :hover': {
                                          textDecoration: 'underline'
                                        }
                                      }}>
                                      <FileCopyIcon className="d-40" />
                                    </CSVLink>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-right"></td>
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
                count={Math.ceil(uploadResults.length / recordsPerPage)}
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
        {paginationUploadResult.length == 0 && (
          <div className='text-center' >
            <img
              alt='...'
              src={noResults}
              style={{ maxWidth: '600px' }}
            />
          </div>
        )}
      </Card>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose3}
        message={message}
        autoHideDuration={2000}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.Auth.selectedCompany
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UploadResults);
