import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux';
import apicaller from 'helper/Apicaller';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Table,
  TableContainer,
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
} from '@material-ui/core'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { BrowserRouter as useLocation } from 'react-router-dom';

const CreateModuleAccess = (props) => {
  const { selectedCompany } = props;
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = state
  const [blocking, setBlocking] = useState(false)
  const [companyModules, setCompanyModules] = useState([])
  const [allCompanyModules, setAllCompanyModules] = useState([])
  const [mode, setMode] = useState('')

  useEffect(() => {
    getModuleAccess();
  }, [])

  const getModuleAccess = () => {
    console.log('companyId', selectedCompany.companyId)
    apicaller('get', `${BASEURL}/moduleAccess/names`)
    .then(res => {
      if(res.status === 200) {
        let modules = res.data;
        apicaller('get', `${BASEURL}/moduleAccess/by?companyId=${selectedCompany.companyId}`)
        .then(res1 => {
          if(res1.status === 200 && res1.data.length > 0) {
            setCompanyModules(res1.data)
            setAllCompanyModules(res1.data)
            setMode('update')
          } else {
            let companyModules = modules.map((item, idx) => {
              return { name: item, hasClientSubscribed: false, companyId: selectedCompany.companyId}
            })
            setCompanyModules(companyModules)
            setAllCompanyModules(companyModules)
            setMode('create')
          }
        })
      }
    })
    .catch(err => {
      console.log('Get Module Names Err', err)
    })
  }

  const handleClose3 = () => {
    setState({ ...state, open: false })
  }

  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const handleSearch = event => {
    const filteredCompanyModules = allCompanyModules.filter(
      module =>
        module.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) 
    )

    if (filteredCompanyModules.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }

    setCompanyModules(filteredCompanyModules)
  }

  const handleChangeHasClientSubscribed = (checked, idx) => {
    const newArray = companyModules.map((item, i) => {
      if (idx === i) {
        return { ...item, ['hasClientSubscribed']: checked }
      } else {
        return item
      }
    })
    setCompanyModules(newArray)
  }

  const save = (e) => {
    e.preventDefault();
    //to do service call
    console.log('companyModules', companyModules);
    let method = mode === 'create'? 'post' : 'patch'
      apicaller(method, `${BASEURL}/moduleAccess`, companyModules)
      .then(res => {
        if(res.status === 200) {
          setState({
            open: true,
            message: `Module Access ${mode === 'create' ? 'Created': 'Updated'} Successfully`,
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setState({
          open: true,
          message: `Error in ${mode === 'create' ? 'creating': 'updating'} module access`,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }

  return (
    <>
      <BlockUi
        className='p-5'
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card className='card-box shadow-none'>
          <div className='d-flex justify-content-between px-4 py-3'>
            <div
              className={clsx(
                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                { 'is-active': searchOpen }
              )}>
              <TextField
                variant='outlined'
                size='small'
                id='input-with-icon-textfield22-2'
                placeholder='Search Module...'
                onFocus={openSearch}
                onBlur={closeSearch}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
          <div className='divider' />
          <div className='p-4'>
            <div className='table-responsive-md'>
              <TableContainer>
                <Table className='table table-alternate-spaced mb-0'>
                  <thead>
                    <tr>
                      <th
                        style={{ width: '300px' }}
                        className='font-size-lg font-weight-bold pb-4 text-capitalize'
                        scope='col'>
                        Module Name
                      </th>
                      <th
                        style={{ width: '300px' }}
                        className='font-size-lg font-weight-bold pb-4 text-capitalize'
                        scope='col'>
                        Has the client subscribed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyModules.map((item, idx) => (
                        <>
                          <tr>
                            <td><div>{item.name}</div></td>
                            <td>
                              <span className=''>
                                <Checkbox
                                  id="outlined-hasClientSubscibed"
                                  variant="outlined"
                                  size="small"
                                  style={{ padding: '0px' }}
                                  checked={item.hasClientSubscribed}
                                  color="primary"
                                  onChange={(event) => {
                                    handleChangeHasClientSubscribed(event.target.checked, idx)
                                  }
                                  }
                                />
                              </span>
                            </td>
                          </tr>
                          <tr className='divider'></tr>
                        </>
                      ))}
                  </tbody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div
            className="float-right"
            style={{ marginRight: '2.5%' }}>    
            <Button
              className="btn-primary mb-2 m-2"
              type="submit"
              onClick={(e) => save(e)}
            >
              Save
            </Button>
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
  )
}

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.Auth.selectedCompany
  }
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateModuleAccess);