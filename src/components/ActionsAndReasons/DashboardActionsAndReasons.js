import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

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
import { Alert } from '@material-ui/lab';
import apicaller from 'helper/Apicaller';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import noResults from '../../assets/images/composed-bg/no_result.jpg'


export default function DashboardActionsAndReasons() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const [actionsReasons, setActionsReasons] = useState([]);
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const handleSort = sortOrder => {
    let sortedActionsReasons = JSON.parse(JSON.stringify(actionsReasons))
    if (sortOrder == 'ASC') {
      sortedActionsReasons = sortedActionsReasons.sort((actionsReasonsA, actionsReasonsB) =>
        actionsReasonsA.actionCode > actionsReasonsB.actionCode
          ? 1
          : actionsReasonsB.actionCode > actionsReasonsA.actionCode
            ? -1
            : 0
      )
      setActionsReasons(sortedActionsReasons)
      setPaginationActionsReasons(sortedActionsReasons)
    } else {
      sortedActionsReasons = sortedActionsReasons.sort((actionsReasonsB, actionsReasonsA) =>
        actionsReasonsA.actionCode > actionsReasonsB.actionCode
          ? 1
          : actionsReasonsB.actionCode > actionsReasonsA.actionCode
            ? -1
            : 0
      )
      setActionsReasons(sortedActionsReasons)
      setPaginationActionsReasons(sortedActionsReasons)
    }
  }
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [paginationRoles, setPaginationActionsReasons] = useState([])
  const [allActionsReasons, setAllActionsReasons] = useState([])

  useEffect(() => {
    getActionReasons();
  }, [])

  const getActionReasons = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/reason/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setBlocking(false)
          setActionsReasons(res.data);
          setPaginationActionsReasons(res.data)
          setAllActionsReasons(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('Fetchall Action Reasons Err', err)
      })
  }

  const handleClose3 = () => {
    setState({ ...state, open: false })
  }
  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }
  const handleSearch = event => {
    const filteredActionsReasons = allActionsReasons.filter(
      actionsReasons =>
        actionsReasons.actionCode
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        actionsReasons.actionName
          .toUpperCase()
          .includes(event.target.value?.toUpperCase())
    )
    if (filteredActionsReasons.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
    setActionsReasons(filteredActionsReasons)
    setPaginationActionsReasons(filteredActionsReasons)
  }

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
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
                fullWidth
                placeholder="Search Actions & Reasons"
                onFocus={openSearch}
                onChange={handleSearch}
                onBlur={closeSearch}
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
                <Button className="btn-primary mr-2" component={NavLink} to="./CreateActionReason">
                  Create Action Reason
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
                    <div className="font-weight-bold px-4 pt-3">Results</div>
                    <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                      <ListItem
                        button
                        href="#/"
                        onClick={e => {
                          setRecordsPerPage(10)
                          setPage(1)
                          setPaginationActionsReasons(actionsReasons);
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
                        onClick={e => {
                          setRecordsPerPage(20)
                          setPage(1)
                          setPaginationActionsReasons(actionsReasons);
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
                        onClick={e => {
                          setRecordsPerPage(30)
                          setPage(1)
                          setPaginationActionsReasons(actionsReasons);
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
                        onClick={e => { handleSort('DES'); handleClose2(); }}>
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
          {paginationRoles.length > 0 && (
          <>
          <div className="p-4">
            <div className="table-responsive-md">
              <Table className="table table-alternate-spaced mb-0">
                <thead>
                  <tr>
                    <th
                      style={{ width: 'auto' }}
                      className="font-size-lg font-weight-bold pb-4 text-capitalize text-left"
                      scope="col">
                      Action Code
                    </th>
                    <th
                      style={{ width: 'auto' }}
                      className="font-size-lg font-weight-bold pb-4 text-capitalize  text-left"
                      scope="col">
                      Action Name
                    </th>
                    <th
                      style={{ width: 'auto' }}
                      className="font-size-lg font-weight-bold pb-4 text-capitalize  text-left"
                      scope="col">
                      Reason Code
                    </th>
                    <th
                      style={{ width: '300px' }}
                      className="font-size-lg font-weight-bold pb-4 text-capitalize "
                      scope="col">
                      Reason Name
                    </th>
                  </tr>
                </thead>
                {paginationRoles.length > 0 ? (
                  <tbody>
                    {paginationRoles
                      .slice(
                        page * recordsPerPage > actionsReasons.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= actionsReasons.length
                          ? page * recordsPerPage
                          : actionsReasons.length
                      )
                      .map((item) => (
                        <>
                          <tr>
                            <td className="text-left">
                              <span>{item.actionCode}</span>
                            </td>
                            <td className="text-left">
                              <span>{item.actionName}</span>
                            </td>
                            <td className="text-left">
                              <span>{item.reasonCode}</span>
                            </td>
                            <td className="text-left">
                              <span>{item.reasonName}</span>
                            </td>
                          </tr>
                          <tr className="divider"></tr>
                        </>
                      ))}

                  </tbody>
                ) : (
                  <tbody className='text-center'>
                    <div >
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
              className='pagination-primary'
              count={Math.ceil(actionsReasons.length / recordsPerPage)}
              variant='outlined'
              shape='rounded'
              selected={true}
              page={page}
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </div>
          </>
          )}
        {paginationRoles.length == 0 && (
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
          onClose={handleClose3}
          message={message}
          autoHideDuration={2000}
        />
         </Card>
      </BlockUi>
    </>
  );
}