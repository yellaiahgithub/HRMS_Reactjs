import React, { useState, Component, useEffect } from 'react'
import {
  Grid,
  Card,
  MenuItem,
  TextField,
  Button,
  Table,
  CardContent,
  Switch,
  Snackbar
} from '@material-ui/core'
import 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import apicaller from 'helper/Apicaller'
import { useHistory } from 'react-router-dom'
import { BASEURL } from 'config/conf'

const CreateUserIdSetup = () => {
  const history = useHistory()
  const [state, setState] = useState({
    emailId: false,
    employeeId: true,
    customUserId: false
  })

  const [toast, setToast] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = toast

  const [action, setAction] = useState('CREATE');
  const [id, setUUID] = useState();

  const [combinationData, setCombinationData] = useState([
    {
      combination: '',
      length: 0
    }
  ])

  const handleClose = () => {
    setToast({ ...toast, open: false })
  }

  const handleCombinationData = index => e => {
    if (e.target.name == 'combination') {
      const result = combinationRows.filter(
        item => item.combination == e.target.value
      )
      if (result.length > 0) {
        showErrorMsg(true)
      } else {
        showErrorMsg(false)
      }
    }
    const newArray = combinationRows.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value }
      } else {
        return item
      }
    })
    setRows(newArray)
  }

  const [combinationRows, setRows] = useState(combinationData)
  const combinationList = [{ value: 'First Name' }, { value: 'Last Name' }]
  const [isSubmitted, setIsSubmitted] = useState()
  const [errorMsg, showErrorMsg] = useState(false)

  const handleAdd = () => {
    if (combinationRows.length !== combinationList.length) {
      setRows([
        ...combinationRows,
        {
          combination: '',
          length: 0,
        }
      ])
    }
  }

  const handleRemove = i => {
    if (combinationRows.length !== 1) {
      const list = [...combinationRows]
      list.splice(i, 1)
      setRows(list)
    }
  }

  const handleChange = name => e => {
    const checked = e.currentTarget.checked
    for (let key in state) {
      if (key === name) {
        setState(prevState => ({
          ...prevState,
          [key]: checked
        }))
        if(name !== 'customUserId') {
          setRows([
            {
              combination: '',
              length: 0,
            }
          ])
        }
      } else {
        setState(prevState => ({
          ...prevState,
          [key]: false
        }))
      }
    }
  }

  useEffect(() => {
    getUserIDSetup();
  }, []);

  const getUserIDSetup = () => {
    // Get getUserIDSetup API call
    apicaller('get', `${BASEURL}/userIdSetup`)
    .then(res => {
      if(res.status === 200) {
        console.log('res.data', res.data)
        if(res.data.length > 0) {
          let userIdSetup = res.data[0];
          setState(prevState => ({
            ...prevState,
            ['emailId']: userIdSetup.emailId,
            ['employeeId']: userIdSetup.employeeId,
            ['customUserId']: userIdSetup.customUserId
          }))

          if(userIdSetup.combination.length > 0) {
            let combinationDataArr = [];
            for(let i=0; i<userIdSetup.combination.length; i++) {
              combinationDataArr.push({ combination: userIdSetup.combination[i].name, length: userIdSetup.combination[i].length })
            }
            setRows(combinationDataArr)
          }
          setUUID(userIdSetup.uuid)
          setAction('UPDATE');
        } else {
          setAction('CREATE');
        }
      }
    })
    .catch(err => {
      console.log('getUserIDSetup Err', err)
    })
  };

  const save = e => {
    e.preventDefault()
    if (!errorMsg) {
      setIsSubmitted(true)
      let keys = Object.keys(state).filter(k => state[k])
      let combination = [];
      if(keys[0] === "customUserId") {
        for(let i=0; i<combinationRows.length; i++) {
          let combinationObj = {};
          combinationObj.name = combinationRows[i].combination;
          combinationObj.length = Number(combinationRows[i].length);
          combinationObj.sequenceNumber = i+1;
          combination.push(combinationObj)
        }
      }

      let input = {
        emailId: keys[0] === "emailId" ? true : false,
        employeeId:  keys[0] === "employeeId" ? true : false,
        customUserId: keys[0] === "customUserId" ? true : false,
        combination: combination,
        action: action,
        uuid: id
      }
      console.log('input', input)

      apicaller('post', `${BASEURL}/userIdSetup`, input)
      .then(res => {
        if(res.status === 200) {
          setToast({
            open: true,
            message: action === 'CREATE' ? 'UserID Setup Created Successfully' : 'UserID Setup Updated Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          history.push('/createUserIdSetup')
        }
      })
      .catch(err => {
        console.log('userIDSetup API err', err)
      })
    }
  }

  return (
    <>
      <Card
        style={{
          padding: '25px',
          border: '1px solid #c4c4c4',
          margin: '10px'
        }}>
        <div className='card-header'>
          <div className='card-header--title'>
            <p>
              <b>UserID Creation Options</b>
            </p>
          </div>
        </div>
        <Grid container spacing={0}>
          <Grid item md={10} lg={7} xl={10} className='mx-auto'>
            <div>
              <Switch
                onChange={handleChange('emailId')}
                checked= {state.emailId}
                name='emailId'
                color='primary'
                className='switch-small'
              />
              &nbsp; &nbsp;
              <label style={{ marginTop: '15px' }} className='mb-2'>
                Employees's Email ID is the User ID
              </label>
            </div>

            <div>
              <Switch
                onChange={handleChange('employeeId')}
                checked={state.employeeId}
                name='employeeId'
                color='primary'
                className='switch-small'
              />
              &nbsp; &nbsp;
              <label style={{ marginTop: '15px' }} className='mb-2'>
                Employees ID is the User ID
              </label>
            </div>

            <div>
              <Switch
                onChange={handleChange('customUserId')}
                checked={state.customUserId}
                name='customUserId'
                color='primary'
                className='switch-small'
              />
              &nbsp; &nbsp;
              <label style={{ marginTop: '15px' }} className='mb-2'>
                Custom User ID
              </label>
            </div>
          </Grid>

          <Grid item md={10} lg={7} xl={10} className='mx-auto'>
            {state.customUserId ? (
              <Card
                style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4',
                  margin: '25px 0'
                }}>
                <CardContent className='p-0'>
                  <div className='table-responsive-md'>
                    <Table className='table table-hover table-striped text-nowrap mb-0'>
                      <thead className='thead-light'>
                        <tr>
                          <th style={{ width: '20%' }} className='text-center'>
                            Sequence
                          </th>
                          <th style={{ width: '30%' }} className='text-center'>
                            Combination
                          </th>
                          <th style={{ width: '20%' }} className='text-center'>
                            Length
                          </th>
                          <th style={{ width: '20%' }} className='text-center'>
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {combinationRows.map((item, idx) => {
                          return (
                            <tr>
                              <td className='text-center'>
                                <div>{idx + 1}</div>
                              </td>
                              <td className='text-center'>
                                <div>
                                  {' '}
                                  <TextField
                                    variant='outlined'
                                    fullWidth
                                    id='outlined-combination'
                                    select
                                    label='Select'
                                    size='small'
                                    placeholder=''
                                    value={item?.combination}
                                    name='combination'
                                    onChange={handleCombinationData(idx)}
                                    helperText={
                                      isSubmitted
                                        ? isSubmitted && item?.combination == ''
                                          ? 'Combination is required'
                                          : ''
                                        : errorMsg
                                        ? 'Combination already exist'
                                        : ''
                                    }
                                    error={
                                      isSubmitted
                                        ? isSubmitted && item.combination == ''
                                          ? true
                                          : false
                                        : errorMsg
                                        ? true
                                        : false
                                    }>
                                    {combinationList.map(option => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.value}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </div>
                              </td>
                              <td className='text-center'>
                                <div>
                                  <TextField
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    name='length'
                                    placeholder='Length'
                                    value={item?.length}
                                    inputProps={{ type: 'number' }}
                                    onChange={handleCombinationData(idx)}
                                    helperText={
                                      isSubmitted && item?.length == ''
                                        ? 'Length is required'
                                        : ''
                                    }
                                    error={
                                      isSubmitted && item?.length == ''
                                        ? true
                                        : false
                                    }
                                  />
                                </div>
                              </td>
                              <td className='text-center'>
                                <div>
                                  <Button
                                    onClick={handleAdd}
                                    className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'plus']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                  <Button
                                    onClick={() => handleRemove(idx)}
                                    className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'times']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div className='divider' />
                  <div className='divider' />
                </CardContent>
              </Card>
            ) : (
              ''
            )}{' '}
            <br></br>
            <div className='float-left' style={{ marginRight: '2.5%' }}>
              <Button
                className='btn-primary mb-2 m-2'
                type='submit'
                onClick={e => save(e)}>
                Save
              </Button>
            </div>{' '}
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />
      </Card>
    </>
  )
}

export default CreateUserIdSetup