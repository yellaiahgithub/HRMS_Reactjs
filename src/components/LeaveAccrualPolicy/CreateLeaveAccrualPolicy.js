import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Snackbar,
  Table,
  Container,
  MenuItem,
  MenuList,
  TextField,
  Dialog,
  TableContainer
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavLink } from 'react-router-dom'
import { BASEURL } from 'config/conf'
import apicaller from 'helper/Apicaller'
import { useHistory, useLocation } from 'react-router-dom'
import BlockUi from 'react-block-ui'
import { ClimbingBoxLoader } from 'react-spinners'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const CreateLeaveAccrualPolicy = () => {

  const [accrualPolicyId, setAccrualPolicyId] = useState();
  const [isSubmitted, setIsSubmitted] = useState();
  const [leaveTypeUUID, setLeaveTypeUUID] = useState();
  const [leaveTypeIndex, setLeaveTypeIndex] = useState();
  const [accrualCriteria, setAccrualCriteria] = useState();
  const [accrualCriteriaIndex, setAccrualCriteriaIndex] = useState()
  const [description, setDescription] = useState();
  const [leaveTypeArray, setLeaveTypeArray] = useState([])
  const [uuid, setUUID] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editUUID = queryParams.get('uuid') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = editUUID ? true : false;
  let tempLeaveTypes = []
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [blocking, setBlocking] = useState(false)
  const history = useHistory()

  const leavAccrualPolicyData = [
    {
      fromService: '',
      toService: '',
      accrualFrequency: '',
      accrualAfterValue: '',
      accrualAfterUnit: '',
      eligibleLeaveCount: '',
      eligibleLeaveUnit: '',
    },
  ]
  const [leavAccrualPolicyArray, setLeaveAccrualPolicyArray] = useState(
    leavAccrualPolicyData
  )

  const accrualCriterias = [
    'Working Days', 'Service Period'
  ];
  const accrualFrequencies = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Half-yearly', value: 'Half-yearly' },
    { label: 'Annually', value: 'Annually' }
  ]
  const accrualAfterEveryFrequencies = [
    { label: 'Days', value: 'Days' },
    { label: 'Months', value: 'Months' },
  ]
  const elegibleLeaveFrequencies = [
    { label: 'Days', value: 'Days' },
    { label: 'Weeks', value: 'Weeks' },
    { label: 'Months', value: 'Months' },
  ]

  const handleClose = () => {
    setState({ ...state, open: false })
  }
  useEffect(() => {
    setUUID(editUUID);
    getAllLeaveTypes()
  }, [])

  const handleAddAccrualPolicies = () => {
    setLeaveAccrualPolicyArray([
      ...leavAccrualPolicyArray,
      {
        fromService: '',
        toService: '',
        accrualFrequency: '',
        accrualAfterValue: '',
        accrualAfterUnit: '',
        eligibleLeaveCount: '',
        eligibleLeaveUnit: '',
      }
    ])
  }

  const handleRemoveAccrualPolicies = i => {
    if (leavAccrualPolicyArray.length !== 1) {
      const list = [...leavAccrualPolicyArray]
      list.splice(i, 1)
      setLeaveAccrualPolicyArray(list)
    }
  }

  const handleAccrualPolicyData = index => e => {
    const input = e.target.value;
    let isValid = true;
    if (e.target.name === 'fromService' || e.target.name === 'toService') {
      // Check if the input is a valid positive number
      if ((/^\d*$/.test(input)) && input === '' || (parseInt(input) > 0 && parseInt(input) <= 70)) {
        isValid = true;
      }
      else {
        isValid = false;
      }
    }
    if (e.target.name === 'accrualAfterValue' || e.target.name === 'eligibleLeaveCount') {
      // Check if the input is a valid positive number
      if (/^\d*$/.test(input)) {
        isValid = true;
      }
      else {
        isValid = false;
      }
    }
    if (isValid) {
      const newArray = leavAccrualPolicyArray.map((item, i) => {
        if (index === i) {
          return { ...item, [e.target.name]: e.target.value }
        } else {
          return item
        }
      })
      setLeaveAccrualPolicyArray(newArray)
    }
  }

  const save = (e) => {
    e.preventDefault();
    //to do service call
    setIsSubmitted(true);
    let ifValid = true
    if ((accrualPolicyId === null || accrualPolicyId === undefined) &&
      (description === null || description === undefined) &&
      (leaveTypeUUID === null || leaveTypeUUID === undefined) &&
      (accrualCriteria === null || accrualCriteria === undefined)) {
      ifValid = false
    }
    // Chheck if any value is empty
    leavAccrualPolicyArray.some(objt => {
      Object.values(objt).some(value => {
        if (value === '') {
          ifValid = false
        }
      })
    })

    if (!ifValid) {
      let msg = 'Mandatory fields are required'
      setState({
        open: true,
        message: msg,
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }
    const rules = []
    leavAccrualPolicyArray.forEach((item) => {
      let itemObj = {};
      itemObj.fromService = Number(item.fromService);
      itemObj.toService = Number(item.toService);
      itemObj.accrualFrequency = item.accrualFrequency;
      itemObj.accrualAfter = {};
      itemObj.accrualAfter.value = Number(item.accrualAfterValue);
      itemObj.accrualAfter.unit = item.accrualAfterUnit;
      itemObj.eligibleLeave = {};
      itemObj.eligibleLeave.count = Number(item.eligibleLeaveCount);
      itemObj.eligibleLeave.unit = item.eligibleLeaveUnit;
      rules.push(itemObj)
    })

    let inputObj = {
      id: accrualPolicyId,
      description: description,
      leaveTypeUUID: leaveTypeUUID,
      accrualCriteria: accrualCriteria,
      rules: rules,
    };
    console.log(inputObj);
    if (!editUUID) {
      apicaller('post', `${BASEURL}/leaveAccrualPolicy/save`, inputObj)
        .then((res) => {
          if (res.status === 200 && res.data) {
            console.log('res.data', res.data);
            setState({
              open: true,
              message: 'Leave Accrual Policy Created Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: 'Error Occured While Creating Leave Accrual Policy Details',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('create accrual err', err);
        });
    } else {
      let inputObj = {
        id: accrualPolicyId,
        description: description,
        leaveTypeUUID: leaveTypeUUID,
        accrualCriteria: accrualCriteria,
        rules: rules,
        uuid: uuid
      };
      apicaller('put', `${BASEURL}/leaveAccrualPolicy/update`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            console.log('res.data', res.data);
            setState({
              open: true,
              message: 'Leave Accrual Policy Updated Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: 'Error Occured while updating Leave Accrual Policy Details',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('update leave accrual policy err', err);
        });
    }
  };

  const getAllLeaveTypes = () => {
    apicaller('get', `${BASEURL}/leaveType`)
      .then(res => {
        if (res.status === 200 && res.data) {
          tempLeaveTypes = res.data
          setLeaveTypeArray(res.data)
          if (editUUID) {
            getAccraulRecord(editUUID)

          }
        }
      }).catch(
        err => {
          console.log(err)
        }
      )
  }
  const getAccraulRecord = (editUUID) => {
    apicaller('get', `${BASEURL}/leaveAccrualPolicy/fetch?uuid=${editUUID}`)
      .then(res => {
        if (res.status === 200 && res.data) {
          console.log(res.data)
          const resp = res.data;
          setAccrualPolicyId(resp.id);
          setLeaveTypeUUID(resp.leaveTypeUUID);
          setDescription(resp.description);
          setAccrualCriteria(resp.accrualCriteria);
          const tempRules = []
          resp.rules.forEach(rule => {
            tempRules.push({
              fromService: rule.fromService,
              toService: rule.toService,
              accrualFrequency: rule.accrualFrequency,
              accrualAfterValue: rule.accrualAfter.value,
              accrualAfterUnit: rule.accrualAfter.unit,
              eligibleLeaveCount: rule.eligibleLeave.count,
              eligibleLeaveUnit: rule.eligibleLeave.unit,
            })
          })
          setLeaveAccrualPolicyArray(tempRules);
          const index = tempLeaveTypes.findIndex(leaveType => leaveType.uuid === resp.leaveTypeUUID);
          if (index != -1) {
            setLeaveTypeIndex(index);
          }
          const accrualCriteriaIdx = accrualCriterias.findIndex(criteria => criteria === resp.accrualCriteria)
          if (accrualCriteriaIdx != -1) {
            setAccrualCriteriaIndex(accrualCriteriaIdx)
          }
        }
      }).catch(
        err => {
          console.log(err)
        }
      )


  }

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card style={{
          padding: '25px',
          border: '1px solid #c4c4c4',
          margin: '15px'
        }}>
          <Grid container spacing={0}>
            <Grid item xs={10} md={10} lg={7} xl={11} className="mx-auto">
              <Grid container>
                <Grid item md={4} className="mt-4">
                  <label className="mb-2">Accrual Policy ID *</label>
                  <TextField
                    id="outlined-accrualPolicyId"
                    placeholder="Accrual Policy ID"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    value={accrualPolicyId}
                    error={isSubmitted && !accrualPolicyId}
                    helperText={
                      isSubmitted && !accrualPolicyId
                        ? 'Accrual Policy Id is Required'
                        : null
                    }
                    onChange={(event) => {
                      const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                      setAccrualPolicyId(result.toUpperCase());
                    }}
                  />{' '}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  <label
                    style={{ marginTop: '15px' }}
                    className=" mb-2">
                    Select Leave Type *
                  </label>
                  <Autocomplete
                    id="combo-box-demo"
                    select
                    // multiple
                    options={leaveTypeArray}
                    value={leaveTypeIndex ? leaveTypeArray[leaveTypeIndex] : null}
                    getOptionLabel={(option) => option?.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Leave Type"
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={
                          isSubmitted &&
                          (leaveTypeUUID ? false : true)
                        }
                        helperText={
                          isSubmitted &&
                          (leaveTypeUUID
                            ? ''
                            : 'Leave Type is Mandatory')
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      const index = leaveTypeArray.findIndex(leaveType => leaveType.uuid === value.uuid);
                      if (index != -1) {
                        setLeaveTypeIndex(index);
                        setLeaveTypeUUID(value.uuid);
                      }
                      else {
                        setLeaveTypeIndex(null);
                        setLeaveTypeUUID(null);
                      }

                    }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4} >
                  <label
                    style={{ marginTop: '15px' }}
                    className=" mb-2">
                    Accural Criteria *
                  </label>
                  <Autocomplete
                    id="combo-box-demo"
                    select
                    options={accrualCriterias}
                    value={accrualCriteriaIndex != null ? accrualCriterias[accrualCriteriaIndex] : null}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="outlined"
                        fullWidth
                        size="small"
                        id="outlined-accrualCriteria"
                        helperText={isSubmitted && (accrualCriteria ? '' : 'Accrual Criteria is Required')}
                        error={isSubmitted && (accrualCriteria ? false : true)}
                      />
                    )}
                    onChange={(event, value) => {
                      const accrualCriteriaIdx = accrualCriterias.findIndex(criteria => criteria === value)
                      if (accrualCriteriaIdx != -1) {
                        setAccrualCriteriaIndex(accrualCriteriaIdx)
                        setAccrualCriteria(value);
                      }
                      else {
                        setAccrualCriteriaIndex(null)
                        setAccrualCriteria(null);
                      }
                    }
                    }
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={8} >
                  <label
                    style={{ marginTop: '15px' }}
                    className="mb-2">Policy Description *</label>
                  <TextField
                    id="outlined-policyDescription"
                    placeholder="Policy Description"
                    type="text"
                    variant="outlined"
                    fullWidth
                    multiline
                    // disabled={readOnly}
                    size="small"
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                    helperText={
                      isSubmitted &&
                      (description
                        ? ''
                        : 'Policy Description is Required')
                    }
                    error={
                      isSubmitted &&
                      (description
                        ? false
                        : true)
                    }
                  />
                </Grid>{' '}
              </Grid>
              <div className="mt-5">
                <label>Accrual Based On Working Days</label>

                <Card style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4',
                  marginTop: '15px'
                }}>
                  <>
                    <div className='table-responsive-md mt-4' >
                      <TableContainer>
                        <Table className='table table-hover table-striped text-nowrap' >
                          <thead className='thead-light'>
                            <tr>
                              <th >Service From(Yrs)</th>
                              <th >Service To(Yrs)</th>
                              <th >Accrual Frequency</th>
                              <th >Accrual After Every Frequency</th>
                              <th >Eligible Leave Frequency</th>
                              <th></th>
                              <th>Add</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leavAccrualPolicyArray.map((item, idx) => (
                              <tr>
                                <td>
                                  <div>
                                    <TextField
                                      variant='outlined'
                                      fullWidth
                                      id='outlined-fromService'
                                      size='small'
                                      type="number"
                                      name='fromService'
                                      value={item.fromService}
                                      onChange={handleAccrualPolicyData(idx)}
                                      error={
                                        isSubmitted && !item.fromService
                                          ? true
                                          : false
                                      }
                                    ></TextField>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <TextField
                                      variant='outlined'
                                      fullWidth
                                      id='outlined-toService'
                                      size='small'
                                      type="number"
                                      name='toService'
                                      value={item.toService}
                                      onChange={handleAccrualPolicyData(idx)}
                                      error={
                                        isSubmitted && !item.toService
                                          ? true
                                          : false
                                      }
                                    ></TextField>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <TextField
                                      id="outlined-accrualFrequency"
                                      label="Select"
                                      variant="outlined"
                                      fullWidth
                                      select
                                      size="small"
                                      name="accrualFrequency"
                                      value={item.accrualFrequency}
                                      onChange={handleAccrualPolicyData(idx)}
                                      error={
                                        isSubmitted && !item.accrualFrequency
                                          ? true
                                          : false
                                      }>
                                      {accrualFrequencies.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <div style={{ width: '90px', paddingRight: '10px' }}>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-accrualAfterValue'
                                        size='small'
                                        type="number"
                                        name='accrualAfterValue'
                                        value={item.accrualAfterValue}
                                        onChange={handleAccrualPolicyData(idx)}
                                        error={
                                          isSubmitted && !item.accrualAfterValue
                                            ? true
                                            : false
                                        }
                                      ></TextField>
                                    </div>
                                    <div style={{ width: '140px' }}>
                                      <TextField
                                        id="outlined-accrualAfterUnit"
                                        label="Select"
                                        variant="outlined"
                                        fullWidth
                                        select
                                        size="small"
                                        name="accrualAfterUnit"
                                        value={item.accrualAfterUnit}
                                        onChange={handleAccrualPolicyData(idx)}
                                        error={
                                          isSubmitted && !item.accrualAfterUnit
                                            ? true
                                            : false
                                        }
                                      >
                                        {accrualAfterEveryFrequencies.map(option => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <div style={{ width: '90px', paddingRight: '10px' }}>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-eligibleLeaveCount'
                                        size='small'
                                        type="number"
                                        name='eligibleLeaveCount'
                                        value={item.eligibleLeaveCount}
                                        onChange={handleAccrualPolicyData(idx)}
                                        error={
                                          isSubmitted && !item.eligibleLeaveCount
                                            ? true
                                            : false
                                        }
                                      ></TextField>
                                    </div>
                                    <div style={{ width: '100px' }}>
                                      <TextField
                                        id="outlined-eligibleLeaveUnit"
                                        label="Select"
                                        variant="outlined"
                                        fullWidth
                                        select
                                        size="small"
                                        name="eligibleLeaveUnit"
                                        value={item.eligibleLeaveUnit}
                                        onChange={handleAccrualPolicyData(idx)}
                                        error={
                                          isSubmitted && !item.eligibleLeaveUnit
                                            ? true
                                            : false
                                        }
                                      >
                                        {elegibleLeaveFrequencies.map(option => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </div>
                                </td>
                                <td></td>
                                <td>
                                  <Button
                                    onClick={handleAddAccrualPolicies}
                                    className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'plus']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    onClick={() =>
                                      handleRemoveAccrualPolicies(idx)
                                    }
                                    className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'times']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TableContainer>
                    </div>
                  </>
                </Card>
              </div>
            </Grid>
          </Grid>
          <br></br>
          <div className='float-right' style={{ marginRight: '2.5%' }}>
            <Button
              className='btn-primary mb-2 m-2'
              component={NavLink}
              to='./accrualPolicy'>
              Cancel
            </Button>
            <Button
              className='btn-primary mb-2 m-2'
              onClick={e => save(e)}

            >
              <span>{!uuid ? "Save" : "Update"}</span>

            </Button>
          </div>
        </Card >
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />

      </BlockUi >
    </>
  )
}
export default CreateLeaveAccrualPolicy;