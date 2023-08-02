import React from 'react'
import { Grid, Card, List, ListItem } from '@material-ui/core'
import { BASEURL } from 'config/conf'
import { useState, useEffect } from 'react'
import apicaller from 'helper/Apicaller'
import { connect } from 'react-redux'

const DependantBenificiaries = props => {
  const [blocking, setBlocking] = useState(false)
  const [dependantsArray, setDependantsArray] = useState([])
  const { employeeUUID } = props

  useEffect(() => {
    if (employeeUUID) {
      setBlocking(true)
      apicaller(
        'get',
        `${BASEURL}/employeeDependantOrBeneficiary/fetchByEmployeeUUID/${employeeUUID}`
      )
        .then(res => {
          setBlocking(false)
          if (res.status === 200) {
            console.log(res.data)
            setDependantsArray(res.data)
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('err', err)
          setDependantsArray([])
        })
    }
  }, [])

  const getParsedDate = date => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }
  const overflowWrap = {
    'overflowWrap': 'break-word',
  }

  return (
    <>
      {dependantsArray.length !== 0 ? (
        <>
          {dependantsArray?.map((item, idx) => (
            <Card
              className='myProfileCard'>
              <div className='d-flex justify-content-between align-items-center'>
                <Grid item md={3}>
                  {' '}
                  <div>
                    <div className='text-grey font-weight-bold px-4'>
                      {' '}
                      {item.type.toLowerCase() == 'dependant'
                        ? <h5>Dependant</h5>
                        : <h5>Beneficiary</h5>}
                    </div>
                  </div>
                </Grid>
              </div>

              {item && item.type.toLowerCase() == 'dependant' ? (
                <Grid container>
                  <Grid item md={12} style={{ display: 'contents' }}>
                    <Grid item md={3} className='p-4'>
                      <div>Dependant Name</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.name}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Relationship With Employee</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.relationWithEmployee}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Marital Status</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.maritalStatus}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Dependant Address</div>
                      <span className='text-grey font-weight-bold' style={overflowWrap}>
                        {item?.addressLineOne},{' '}
                        {item?.addressLineTwo},{' '}
                        {item?.city},{' '}
                        {item?.state},{' '}{item?.country},{' '}{item?.pinCode}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Age</div>
                      <span className='text-grey font-weight-bold'>{item.age}</span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Gender</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.gender}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Is Student</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.isStudent ? 'True' : 'False'}
                      </span>
                    </Grid>

                    <Grid item md={3} className='p-4'>
                      <div>Is Disabled</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.isDisabled ? 'True' : 'False'}
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item md={12} style={{ display: 'contents' }}>
                    <Grid item md={3} className='p-4'>
                      <div>Beneficiary Name</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.name}
                      </span>
                    </Grid>
                    <Grid item md={3} className='p-4'>
                      <div>Beneficiary Type</div>
                      <span className='text-grey font-weight-bold'>
                        {item?.beneficiaryType}
                      </span>
                    </Grid>
                    <Grid item md={6} className='p-4'>
                      <div>Beneficiary Address</div>
                      <span className='text-grey font-weight-bold' style={overflowWrap}>
                        {item?.addressLineOne},{' '}{item?.addressLineTwo},{' '}{item?.city},{' '}
                        {item?.state},{' '}{item?.country}{' '}-{item?.pinCode},
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Card>
          ))}
        </>
      ) :
        <Grid>
          <div className='text-grey text-center pt-4'> No Dependants/Beneficiary Added</div>
        </Grid>
      }
    </>
  )

}

export default DependantBenificiaries
