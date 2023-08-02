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
  Dialog,
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
import noResults from '../../assets/images/composed-bg/no_result.jpg'


const DashboardItemCatalogue = (props) => {
  const history = useHistory();

  const { selectedCompany } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [formURL, setFormURL] = useState('/createItemCatalogue');

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

  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const [itemCatalogues, setItemCatalogues] = useState([]);
  const [allitemCatalogues, setAllItemCatalogues] = useState([]);
  const [paginationItemCatalogue, setPaginationItemCatalogue] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedItemCatalogue, setSelectedItemCatalogue] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const toggle3 = () => setDeleteModal(!deleteModal);

  useEffect(() => {
    getItemCatalogue();
  }, []);

  const getItemCatalogue = () => {
    // Get all ItemCatalogues API call
    apicaller('get', `${BASEURL}/itemCatalogue/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          setItemCatalogues(res.data);
          setAllItemCatalogues(res.data);
          setPaginationItemCatalogue(res.data);
        }
      })
      .catch((err) => {
        console.log('getItemCatalogues err', err);
      });
  };
  const itemCatalogueStatusFilter = [
    {
      code: 0,
      value: 'All Statuses'
    },
    { code: 1, value: 'Active' },
    { code: 2, value: 'Inactive' }
  ];
  const [status, setStatus] = useState('0');

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };
  const handleFilter = () => {
    if (status > 0) {
      let statusLabel = true;
      if (status == 2) {
        statusLabel = false;
      }
      const filteredItemCatalogues = allitemCatalogues.filter(
        (customer) => customer.status == statusLabel
      );
      setItemCatalogues(filteredItemCatalogues);
      setPaginationItemCatalogue(filteredItemCatalogues);
    } else {
      setItemCatalogues(allitemCatalogues);
      setPaginationItemCatalogue(allitemCatalogues);
    }
  };
  const handleSort = (sortOrder) => {
    let sortedItemCatalogues = JSON.parse(JSON.stringify(itemCatalogues));
    if (sortOrder == 'ASC') {
      sortedItemCatalogues = sortedItemCatalogues.sort((desA, desB) =>
        desA.description > desB.description
          ? 1
          : desB.description > desA.description
            ? -1
            : 0
      );
      setItemCatalogues(sortedItemCatalogues);
      setPaginationItemCatalogue(sortedItemCatalogues);
    } else {
      sortedItemCatalogues = sortedItemCatalogues.sort((desB, desA) =>
        desA.description > desB.description
          ? 1
          : desB.description > desA.description
            ? -1
            : 0
      );
      setItemCatalogues(sortedItemCatalogues);
      setPaginationItemCatalogue(sortedItemCatalogues);
    }
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  const handleSearch = (event) => {
    const filteredItemCatalogues = allitemCatalogues.filter(
      (itemCatalogue) =>
        itemCatalogue.description
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        itemCatalogue.code
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        itemCatalogue.type
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        (itemCatalogue.status
          ? 'Active'.toUpperCase().startsWith(event.target.value?.toUpperCase())
          : 'InActive'
            .toUpperCase()
            .startsWith(event.target.value?.toUpperCase()))
    );

    if (filteredItemCatalogues.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setItemCatalogues(filteredItemCatalogues);
    setPaginationItemCatalogue(filteredItemCatalogues);
  };
  const showConfirmDelete = (i, selected) => {
    setDeleteModal(true);
    setSelectedItemCatalogue(selected);
  };
  const handleDeleteID = () => {
    setDeleteModal(false);
    apicaller(
      'delete',
      `${BASEURL}/itemCatalogue/delete?code=` + selectedItemCatalogue?.code
    )
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          setState({
            open: true,
            message: 'Deleted Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          });
          setPaginationItemCatalogue(
            paginationItemCatalogue.filter(
              (item) => item.code != selectedItemCatalogue?.code
            )
          );
          setItemCatalogues(
            itemCatalogues.filter(
              (item) => item.code != selectedItemCatalogue?.code
            )
          );
          setAllItemCatalogues(
            allitemCatalogues.filter(
              (item) => item.code != selectedItemCatalogue?.code
            )
          );
          // setItemCatalogues()
          // employeeCurrentPhoneDetailsArray.splice(index, 1);
        }
      })
      .catch((err) => {
        console.log('err', err);
        if (err?.response?.data) {
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
        }
      });
  };

  return (
    <>
      <Card className="card-box shadow-none">
        <div className="d-flex justify-content-between px-4 py-3">
          <div
            className={clsx(
              'search-wrapper search-wrapper--alternate search-wrapper--grow',
              { 'is-active': searchOpen }
            )}>
            <TextField
              variant="outlined"
              size="small"
              id="input-with-icon-textfield22-2"
              placeholder="Search Item Catalogue..."
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
                className="btn-primary font-weight-normal mr-2"
                component={NavLink}
                to="./CreateItemCatalogue">
                Create Item Catalogue
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
                    <Button
                      className="btn-primary"
                      size="small"
                      onClick={() => {
                        handleFilter(parseInt(status));
                        handleClose()
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
                            onClick={e => {
                              setStatus(0);
                              handleFilter(0);
                              handleClose(0)
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
                        setPaginationItemCatalogue(itemCatalogues);
                        handleClose2()
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
                        setPaginationItemCatalogue(itemCatalogues);
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
                        setPaginationItemCatalogue(itemCatalogues);
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
                      onClick={e => {
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
                      onClick={(e) => {handleSort('DES'); handleClose2();} }>
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
        {paginationItemCatalogue.length > 0 && (
          <>
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
                        Status
                      </th>
                    </tr>
                  </thead>
                  {paginationItemCatalogue.length > 0 ? (
                    <>
                      <tbody>
                        {paginationItemCatalogue
                          .slice(
                            page * recordsPerPage > itemCatalogues.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= itemCatalogues.length
                              ? page * recordsPerPage
                              : itemCatalogues.length
                          )
                          .map((item, index) => (
                            <>
                              <tr>
                                <td
                                  onClick={() =>
                                    history.push(
                                      formURL + '?id=' + item._id + '&readOnly=true'
                                    )
                                  }>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <a
                                        href="#/"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-weight-normal text-black"
                                        title={item.type}>
                                        {item.type}
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  onClick={() =>
                                    history.push(
                                      formURL + '?id=' + item._id + '&readOnly=true'
                                    )
                                  }>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <a
                                        href="#/"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-weight-normal text-black"
                                        title={item.code}>
                                        {item.code}
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  onClick={() =>
                                    history.push(
                                      formURL + '?id=' + item._id + '&readOnly=true'
                                    )
                                  }>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <a
                                        href="#/"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-weight-normal text-black"
                                        title={item.description}>
                                        {item.description}
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  onClick={() =>
                                    history.push(
                                      formURL + '?id=' + item._id + '&readOnly=true'
                                    )
                                  }>
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <a
                                        href="#/"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-weight-normal text-black"
                                        title={item.status ? 'Active' : 'Inactive'}>
                                        {item.status ? 'Active' : 'InActive'}
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right">
                                  <Button
                                    onClick={(e) => showConfirmDelete(index, item)}
                                    className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
                                    <FontAwesomeIcon
                                      icon={['fas', 'trash']}
                                      className="font-size-sm"
                                    />
                                  </Button>
                                  <Button
                                    component={NavLink}
                                    to={formURL + '?id=' + item._id}
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
                    </>
                  ) : (
                    <tbody className='text-center'>
                      <div>
                        <img
                          alt='...'
                          src={noResults}
                          style={{ maxWidth: '600px' }}
                        />
                      </div>
                    </tbody>
                  )}
                </Table>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
              <Pagination
                className="pagination-primary"
                count={Math.ceil(itemCatalogues.length / recordsPerPage)}
                variant="outlined"
                shape="rounded"
                selected={true}
                page={page}
                onChange={handleChange}
                showFirstButton
                showLastButton
              />
            </div>
            <Dialog
              open={deleteModal}
              onClose={toggle3}
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
                <h4 className="font-weight-normal mt-4">
                  Are you sure you want to delete this entry?
                </h4>
                <p className="mb-0 font-size-lg text-muted">
                  You cannot undo this operation.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={toggle3}
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
          </>
        )}
        {paginationItemCatalogue.length == 0 && (
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
      </Card >
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
)(DashboardItemCatalogue);
