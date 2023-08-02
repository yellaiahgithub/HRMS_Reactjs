import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  InputAdornment,
  Card,
  Menu,
  Button,
  List,
  ListItem,
  TextField,
  Dialog,
  Snackbar
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';

const DashboardSourceBank = (props) => {
  const history = useHistory();

  const { selectedCompany } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [formURL, setFormURL] = useState('/createSourceBank');

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

  const [sourceBanks, setSourceBanks] = useState([]);
  const [allSourceBank, setAllSourceBanks] = useState([]);
  const [paginationSourceBank, setPaginationSourceBank] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getSourceBank();
  }, []);

  const getSourceBank = () => {
    // Get all SourceBanks API call
    apicaller('get', `${BASEURL}/sourceBank/fetchAllSourceTargetBanks`)
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          setSourceBanks(res.data);
          setAllSourceBanks(res.data);
          setPaginationSourceBank(res.data);
        }
      })
      .catch((err) => {
        console.log('getSourceBanks err', err);
      });
  };

  const handleSort = (sortOrder) => {
    let sortedSourceBanks = JSON.parse(JSON.stringify(sourceBanks));
    if (sortOrder == 'ASC') {
      sortedSourceBanks = sortedSourceBanks.sort((desA, desB) =>
        desA.sourceBankName > desB.sourceBankName
          ? 1
          : desB.sourceBankName > desA.sourceBankName
          ? -1
          : 0
      );
      setSourceBanks(sortedSourceBanks);
      setPaginationSourceBank(sortedSourceBanks);
    } else {
      sortedSourceBanks = sortedSourceBanks.sort((desB, desA) =>
        desA.sourceBankName > desB.sourceBankName
          ? 1
          : desB.sourceBankName > desA.sourceBankName
          ? -1
          : 0
      );
      setSourceBanks(sortedSourceBanks);
      setPaginationSourceBank(sortedSourceBanks);
    }
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  const handleSearch = (event) => {
    const filteredSourceBanks = allSourceBank.filter(
      (sourceBank) =>
        sourceBank.sourceBankId
          ?.toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        sourceBank.sourceBankName
          ?.toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        sourceBank.targetBranchId
          ?.toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        sourceBank.targetBranchName
          ?.toUpperCase()
          .includes(event.target.value?.toUpperCase())
    );

    if (filteredSourceBanks.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setSourceBanks(filteredSourceBanks);
    setPaginationSourceBank(filteredSourceBanks);
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
              placeholder="Search Bank"
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
                className="btn-primary  mr-2"
                component={NavLink}
                to="./CreateSourceBank">
                Create SourceBank
              </Button>
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
                  <div className=" px-4 pt-3">Results</div>
                  <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {
                        setRecordsPerPage(10);
                        setPage(1)
                        handleClose2()
                        setPaginationSourceBank(sourceBanks);
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
                        setPaginationSourceBank(sourceBanks);
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
                        setPaginationSourceBank(sourceBanks);
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
                  <div className=" px-4 pt-4">Order</div>
                  <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {handleSort('ASC'); handleClose2()}}>
                      <div className="mr-2">
                        <ArrowUpwardTwoToneIcon />
                      </div>
                      <span className="font-size-md">Ascending</span>
                    </ListItem>
                    <ListItem
                      button
                      href="#/"
                      onClick={(e) => {handleSort('DES'); handleClose2()}}>
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
        {paginationSourceBank.length > 0 && (
          <>
            <div className="p-4">
              <div className="table-responsive-md">
                <Table className="table table-alternate-spaced mb-0">
                  <thead>
                    <tr>
                      <th
                      style={{ width: '400px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Source Bank Id
                      </th>
                      <th
                        style={{ width: '400px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Source Bank Name
                      </th>
                      <th
                        style={{ width: '400px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize   "
                        scope="col">
                        Target Branch Code
                      </th>
                      <th
                        style={{ width: '400px' }}
                        className="font-size-lg font-weight-bold pb-4 text-capitalize  "
                        scope="col">
                        Target Branch Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationSourceBank
                      .slice(
                        page * recordsPerPage > sourceBanks.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= sourceBanks.length
                          ? page * recordsPerPage
                          : sourceBanks.length
                      )
                      .map((item, index) => (
                        <>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className=" text-black"
                                    title={item.sourceBankId}>
                                    {item.sourceBankId}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className=" text-black"
                                    title={item.sourceBankName}>
                                    {item.sourceBankName}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className=" text-black"
                                    title={item.targetBranchId}>
                                    {item.targetBranchId}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#/"
                                    onClick={(e) => e.preventDefault()}
                                    className=" text-black"
                                    title={item.targetBranchName}>
                                    {item.targetBranchName}
                                  </a>
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
                count={Math.ceil(sourceBanks.length / recordsPerPage)}
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
        {paginationSourceBank.length == 0 && (
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
)(DashboardSourceBank);
