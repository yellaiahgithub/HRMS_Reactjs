import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Table,
  DataGrid,
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
  Switch,
  Box,
  Snackbar,
  TableContainer
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'
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
import { ClimbingBoxLoader } from 'react-spinners';
import apicaller from 'helper/Apicaller';

const EmployeeCreateUserID = () => {
  const history = useHistory()
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

  const handleSort = (sortOrder) => {
    let sortedEmployees = JSON.parse(JSON.stringify(allEmployees));
    if (sortOrder == 'ASC') {
      sortedEmployees = sortedEmployees.sort((empA, empB) =>
        empA.employeeName > empB.employeeName
          ? 1
          : empB.employeeName > empA.employeeName
          ? -1
          : 0
      );
      setEmployees(sortedEmployees);
      setPaginationEmployee(sortedEmployees);
    } else {
      sortedEmployees = sortedEmployees.sort((empB, empA) =>
        empA.employeeName > empB.employeeName
          ? 1
          : empB.employeeName > empA.employeeName
          ? -1
          : 0
      );
      setEmployees(sortedEmployees);
      setPaginationEmployee(sortedEmployees);
    }
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const [formURL, setFormURL] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const [status, setStatus] = useState('0');
  const handleStatus = (event) => {
    setStatus(event.target.value);
  };
  // const [checked, setChecked] = useState();
  const [allEmployees, setAllEmployees] = useState([]);
  const [paginationEmployee, setPaginationEmployee] = useState([]);
  const [employeeDetailsData, setEmployeeDetailsData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeID, setEmployeeID] = useState();
  const [blocking, setBlocking] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [checkAllEmployee, setCheckAllEmployee] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Customer' : 'Cancel';
  let [validDate, setValidDate] = useState(true);
  
  useEffect(() => {
    getEmployeesWithoutUserID();
  }, []);

  const handleSelectEmployee = index => e =>{
    if (e.target.name == 'empSelected') {
        const result = allEmployees.map((item, i) => {
          if (index == i) {
            return { ...item, [e.target.name]: e.target.checked }
          } else {
            return item
          }
        })
        const newArray = result.map((item,i) => {
          return item
        })
        setAllEmployees(newArray)
        setPaginationEmployee(newArray)
    }
  }

  const handleSelectAllEmployees = (e) =>{
    const newArray = allEmployees.map((item) => {
      item.empSelected=e.target.checked
      return { ...item};
    });
    setAllEmployees(newArray);
    setCheckAllEmployee(e.target.checked)   
    setPaginationEmployee(newArray)
  }

  const getEmployeesWithoutUserID = () => {
    // Get getEmployeesWithoutUserID API call
    apicaller('get', `${BASEURL}/employee/fetchEmployeesWithOutUserId`)
    .then(res => {
      if(res.status === 200) {
        for(let i=0; i< res.data.length; i++) {
          res.data[i].empSelected = false;
        }
        setEmployeeDetailsData(res.data);
        setAllEmployees(res.data)
        setPaginationEmployee(res.data)
      }
    })
    .catch(err => {
      console.log('fetchEmployeesWithOutUserId Err', err)
    })
  };
  const save = (e) => {
    e.preventDefault();
    //to do service call
    let employeeUUIDs = [];
    allEmployees.map((item) => {
      if(item.empSelected) {
        employeeUUIDs.push(item.uuid)
      }
    })
    console.log('employeeUUIDs', employeeUUIDs)
    if(employeeUUIDs.length > 0){
      let input = {
        employeeIds: employeeUUIDs
      }
      apicaller('post', `${BASEURL}/employee/generateUserIds`, input)
      .then(res => {
        if(res.status === 200) {
          setState({
            open: true,
            message: 'User IDs created successfully!',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          getEmployeesWithoutUserID()
        }
      })
      .catch(err => {
        console.log('Create UserID err', err)
      })
    } else {
      setState({
        open: true,
        message: 'Select atleast one Employee',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }

    const handleSearch = (event) => {
        const results = allEmployees.filter((obj) =>
            JSON.stringify(obj)
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );
        if (results.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }
        setEmployees(results)
        setPaginationEmployee(results)
    };

  const loading = false;
  return (
    <>
      <BlockUi
        // className="p-5"
        tag="div"
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card className="card-box shadow-none">
          <Grid container spacing={0}>
            <Grid item xs={10} md={10} lg={10} xl={10} className="mx-auto">
              <div className="d-flex flex-column flex-md-row justify-content-between p-5">
                <div
                  className={clsx(
                    'search-wrapper search-wrapper--alternate search-wrapper--grow',
                    { 'is-active': searchOpen }
                  )}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    id="input-with-icon-textfield22-2"
                    placeholder="Search Employee..."
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
                        <div className="font-weight-bold px-4 pt-3">
                          Results
                        </div>
                        <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                          <ListItem
                            button
                            href="#/"
                            value={recordsPerPage}
                            onClick={(e) => {
                              setRecordsPerPage(10);
                              setPage(1)
                              handleClose2()
                              setPaginationEmployee(allEmployees);
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
                            value={recordsPerPage}
                            onClick={(e) => {
                              setRecordsPerPage(20);
                              setPage(1)
                              handleClose2()
                              setPaginationEmployee(allEmployees);
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
                            value={recordsPerPage}
                            onClick={(e) => {
                              setRecordsPerPage(30);
                              setPage(1)
                              handleClose2()
                              setPaginationEmployee(allEmployees);
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
                              handleSort('ASC');handleClose2()
                            }}>
                            <div className="mr-2">
                              <ArrowUpwardTwoToneIcon />
                            </div>
                            <span className="font-size-md">Ascending</span>
                          </ListItem>
                          <ListItem
                            button
                            href="#/"
                            onClick={(e) => {handleSort('DES');handleClose2()}}>
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

              <Grid container spacing={6}>
                <Grid item md={12}>
                  <div className="table-responsive-md">
                    <TableContainer>
                    <Table className="table table-alternate-spaced mb-0">
                      <thead>
                        <tr>
                          <th className="text-center">
                            <Checkbox
                              color="primary"
                              className="align-self-start"
                              name='checkBoxAll'
                              // checked={checkAllEmployee}
                              value={checkAllEmployee}
                              onChange={(event) =>{
                                handleSelectAllEmployees(event)
                              }
                            }
                            />
                          </th>
                          <th
                            style={{ width: '300px' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize  text-center"
                            scope="col">
                            Employee ID
                          </th>
                          <th
                            style={{ width: '300px' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize  text-center"
                            scope="col">
                            Employee Name
                          </th>
                          <th
                            style={{ width: '300px' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize  text-center"
                            scope="col">
                            Department
                          </th>
                          <th
                            style={{ width: '300px' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize  text-center"
                            scope="col">
                            Location
                          </th>
                          <th
                            style={{ width: '300px' }}
                            className="font-size-lg font-weight-bold pb-4 text-capitalize text-center"
                            scope="col">
                            Designation
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginationEmployee
                          .slice(
                            page * recordsPerPage > allEmployees.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= allEmployees.length
                              ? page * recordsPerPage
                              : allEmployees.length
                          )
                          .map((item, index) => (
                            <>
                              <tr>
                                <td className="text-center">
                                <Checkbox
                              color='primary'
                              className='align-self-start'
                              name={'empSelected'}
                              checked={item['empSelected']}
                              value={item.empSelected}
                              onChange={ handleSelectEmployee(index) }
                            />
                      
                                </td>
                                <td className="text-center">
                                  <div className="text-center">
                                    <span className="font-weight-normal">
                                      {item.employeeID
                                        ? item.employeeID
                                        : ''}
                                    </span>
                                  </div>
                                </td>

                                <td className="text-center">
                                  <span className="font-weight-normal">
                                  {item.employeeName
                                        ? item.employeeName
                                        : ''}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="font-weight-normal">
                                    {item.department
                                     ? item.department
                                     : ''}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="font-weight-normal">
                                    {item.location
                                    ? item.location
                                    : ''}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="font-weight-normal">
                                    {item.designation
                                    ? item.designation
                                    : ''}
                                  </span>
                                </td>
                              </tr>
                              <tr className="divider"></tr>
                            </>
                          ))}
                      </tbody>
                    </Table>
                    </TableContainer>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br></br>
          <div className="divider" />
          <div className="divider" />
          <br></br>
          <div className='float-right' style={{ marginRight: '2.5%' }}>                   
            <Button
              onClick={(e) => save(e)}
              className="btn-primary font-weight-normal mb-2 mr-3">
              Create User ID
            </Button>
            </div>   
            <br/>  
            <br/>              
          <div className="d-flex  justify-content-center pt-3 mb-5">
            <Pagination
              className="pagination-primary"
              count={Math.ceil(allEmployees.length / recordsPerPage)}
              variant="outlined"
              shape="rounded"
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
        {/* </Card> */}
      </BlockUi>
    </>
  );
};

// export default EmployeeCreateUserID;
const mapStateToProps = (state) => {
  return {
    user: state.Auth.user
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeCreateUserID);
