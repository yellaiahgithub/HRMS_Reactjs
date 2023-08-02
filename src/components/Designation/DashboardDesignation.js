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
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select,
  Snackbar
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import axios from 'axios';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';

const DashboardDesignation = (props) => {
  const history = useHistory();

  const { selectedCompany } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [formURL, setFormURL] = useState('/createDesignation');

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
  const handleSnackBarClose = () => {
    setState({ ...state, open: false });
  };

  const handleClose3 = () => {
    setState({ ...state, open: false });
  };

  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const [designations, setDesignations] = useState([]);
  const [alldesignations, setAllDesignations] = useState([]);
  const [paginationDesignation, setPaginationDesignation] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getDesignations();
  }, []);

  const getDesignations = () => {
    // Get all Designations API call
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          setDesignations(res.data);
          setAllDesignations(res.data);
          setPaginationDesignation(res.data);
        }
      })
      .catch((err) => {
        console.log('getDesignations err', err);
      });
  };

  const [status, setStatus] = useState('0');

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };
  const handleFilter = (status) => {
    if (status > 0) {
      let statusLabel = true;
      if (status == 2) {
        statusLabel = false;
      }
      const filteredDesignations = alldesignations.filter(
        (designation) => designation.status == statusLabel
      );
      setDesignations(filteredDesignations);
      setPaginationDesignation(filteredDesignations);
    } else {
      setDesignations(alldesignations);
      setPaginationDesignation(alldesignations);
    }
  };
  const handleSort = (sortOrder) => {
    let sortedDesignations = JSON.parse(JSON.stringify(designations));
    if (sortOrder == 'ASC') {
      sortedDesignations = sortedDesignations.sort((desA, desB) =>
        desA.name > desB.name ? 1 : desB.name > desA.name ? -1 : 0
      );
      setDesignations(sortedDesignations);
      setPaginationDesignation(sortedDesignations);
    } else {
      sortedDesignations = sortedDesignations.sort((desB, desA) =>
        desA.name > desB.name ? 1 : desB.name > desA.name ? -1 : 0
      );
      setDesignations(sortedDesignations);
      setPaginationDesignation(sortedDesignations);
    }
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  const handleSearch = (event) => {
    const filteredDesignations = alldesignations.filter(
      (designation) =>
        designation.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        designation.id.toUpperCase().includes(event.target.value?.toUpperCase())
    );

    if (filteredDesignations.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setDesignations(filteredDesignations);
    setPaginationDesignation(filteredDesignations);
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
              placeholder="Search designation..."
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
          <div className="d-flex align-items-center">
            <div>
              <Button
                className="btn-primary mr-2"
                component={NavLink}
                to="./CreateDesignation">
                Create Designation
              </Button>
            </div>
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
                            <MenuItem value={0}>All statuses</MenuItem>
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={2}>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="divider" />
                  <div className="p-3 text-center bg-secondary">
                    <Button className="btn-primary" size="small"
                      onClick={() => {
                        handleFilter(parseInt(status)); handleClose()
                      }}>
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
                            onClick={(e) => {
                              setStatus(0);
                              handleFilter(0);
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
                        handleClose2()
                        setPaginationDesignation(designations);
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
                        handleClose2()
                        setPaginationDesignation(designations);
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
                        handleClose2()
                        setPaginationDesignation(designations);
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
                      onClick={(e) => { handleSort('ASC'); handleClose2() }}>
                      <div className="mr-2">
                        <ArrowUpwardTwoToneIcon />
                      </div>
                      <span className="font-size-md">Ascending</span>
                    </ListItem>
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => { handleSort('DES'); handleClose2() }}>
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
        {paginationDesignation.length > 0 && (
          <>
            <div className="p-4">
              <div className="table-responsive-md">
                <Table className="table table-alternate-spaced mb-0">
                  <thead>
                    <tr>
                      <th
                        style={{ width: '300px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        Designation ID
                      </th>
                      <th
                        style={{ width: '300px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize "
                        scope="col">
                        Designation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationDesignation
                      .slice(
                        page * recordsPerPage > designations.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= designations.length
                          ? page * recordsPerPage
                          : designations.length
                      )
                      .map((item) => (
                        <>
                          <tr>
                            <td
                              onClick={() =>
                                history.push(
                                  formURL + '?id=' + item.id + '&readOnly=true'
                                )
                              }
                              className="text-left">
                              <span className="font-weight-normal">
                                {item.id}
                              </span>
                            </td>
                            <td
                              onClick={() =>
                                history.push(
                                  formURL + '?id=' + item.id + '&readOnly=true'
                                )
                              }>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className="font-weight-normal text-black"
                                    title="...">
                                    {item.name}
                                  </a>
                                  {/* <span className="text-black-50 d-block">
                          Customer since 2019
                        </span> */}
                                </div>
                              </div>
                            </td>
                            <td className="text-right">
                              {/* <Button className="btn-first mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                      <FontAwesomeIcon
                        icon={['fas', 'search']}
                        className="font-size-sm"
                      />
                    </Button> */}
                              <Button
                                component={NavLink}
                                to={formURL + '?id=' + item.id}
                                className="btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                <FontAwesomeIcon
                                  icon={['far', 'edit']}
                                  className="font-size-sm"
                                />
                              </Button>
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
                count={Math.ceil(designations.length / recordsPerPage)}
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
        {paginationDesignation.length == 0 && (
          <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
            <label className="p-4 d-flex align-items-center">
              No Matching Results Found
            </label>
          </div>
        )}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleSnackBarClose}
          message={message}
          autoHideDuration={2000}
        />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.Auth.selectedCompany
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardDesignation);
