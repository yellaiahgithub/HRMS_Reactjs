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

export default function SearchRoles() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)

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
  })
  const handleSort = sortOrder => {
    let sortedRoles = JSON.parse(JSON.stringify(roles))
    if (sortOrder == 'ASC') {
      sortedRoles = sortedRoles.sort((rolesA, rolesB) =>
        rolesA.name > rolesB.name
          ? 1
          : rolesB.name > rolesA.name
            ? -1
            : 0
      )
      setRoles(sortedRoles)
      setPaginationRoles(sortedRoles)
    } else {
      sortedRoles = sortedRoles.sort((rolesB, rolesA) =>
        rolesA.name > rolesB.name
          ? 1
          : rolesB.name > rolesA.name
            ? -1
            : 0
      )
      setRoles(sortedRoles)
      setPaginationRoles(sortedRoles)
    }
  }
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [paginationRoles, setPaginationRoles] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  useEffect(() => {
    getRoles();
  }, [])

  const getRoles = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/role`)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          setRoles(res.data)
          setPaginationRoles(res.data)
          setAllRoles(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }
  const handleClose3 = () => {
    setState({ ...state, open: false })
  }
  const handleSearch = event => {
    const filteredRoles = allRoles.filter(
      roles =>
        roles.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        roles.description
          .toUpperCase()
          .includes(event.target.value?.toUpperCase())
    )
    if (filteredRoles.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }
    setRoles(filteredRoles)
    setPaginationRoles(filteredRoles)
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
                fullWidth
                placeholder="Search Roles"
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
                <Button className="btn-primary mr-2" component={NavLink} to="./CreateRoles">
                  Create Role
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
                          setPaginationRoles(roles)
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
                          setPaginationRoles(roles)
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
                          setPaginationRoles(roles)
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
                          handleSort('ASC')
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
                        onClick={e => {
                          handleSort('DES')
                          handleClose2();
                        }}>
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
          <div className="p-4">
            <div className="table-responsive-md">
              <Table className="table table-alternate-spaced mb-0">
                <thead>
                  <tr>
                    <th
                      className="font-size-lg font-weight-bold pb-4 text-capitalize"
                      scope="col">
                      Role Name
                    </th>
                    <th
                      className="font-size-lg font-weight-bold pb-4 text-capitalize"
                      scope="col">
                      Role Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginationRoles
                    .slice(
                      page * recordsPerPage > roles.length
                        ? page === 0
                          ? 0
                          : page * recordsPerPage - recordsPerPage
                        : page * recordsPerPage - recordsPerPage,
                      page * recordsPerPage <= roles.length
                        ? page * recordsPerPage
                        : roles.length
                    )
                    .map((item) => (
                      <>
                        <tr>
                          <td>
                            <span>{item.name}</span>
                          </td>
                          <td>
                            <span>{item.description}</span>
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
              className='pagination-primary'
              count={Math.ceil(roles.length / recordsPerPage)}
              variant='outlined'
              shape='rounded'
              selected={true}
              page={page}
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </div>
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
      </BlockUi>
    </>
  );
}
