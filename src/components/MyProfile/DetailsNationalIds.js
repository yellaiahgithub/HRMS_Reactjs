import React from 'react'
import { Grid, Card, List, ListItem } from '@material-ui/core'
import { BASEURL } from 'config/conf'
import { useState, useEffect } from 'react'
import apicaller from 'helper/Apicaller'
import { connect } from 'react-redux'

const NatioanlIdDetails = props => {
  const [blocking, setBlocking] = useState(false)
  const [nationalIdArray, setNationalIdArray] = useState([])
  const { employeeUUID } = props

  useEffect(() => {
    if (employeeUUID) {
      setBlocking(true)
      apicaller('get', `${BASEURL}/nationalId/by?employeeUUID=${employeeUUID}`)
        .then(res => {
          setBlocking(false)
          if (res.status === 200) {
            console.log(res.data)
            setNationalIdArray(res.data)
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('err', err)
          setNationalIdArray([])
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
  return (
    <>
      {nationalIdArray.length !== 0 ? (
        <div>
          {nationalIdArray?.map((item, idx) => (
            <Card
              className='myProfileCard'>
              <div>
                <span className='text-grey font-weight-bold float-right ' style={{ fontSize: '12px' }}>
                  Is Primary{' '} : {item.isPrimary ? 'Yes' : 'No'}
                </span>
              </div>
              <Grid container >
                <Grid item md={12} style={{ display: 'contents' }}>
                  <Grid item md={3} className='p-4'>
                    <div>ID Card Type</div>
                    <span className='text-grey font-weight-bold'>
                      {item.identificationType}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>ID Card Number</div>
                    <span className='text-grey font-weight-bold'>
                      {item.Identification}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>Expiry Date</div>
                    <span className='text-grey font-weight-bold'>
                      {getParsedDate(item.expiry)}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>Name As Per Document</div>
                    <span className='text-grey font-weight-bold'>{item.name}</span>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          ))}
        </div>
      ) :
        <Grid>
          <div className='text-grey text-center pt-4'> No National ID Details Added</div>
        </Grid>
      }
    </>
  )
}

export default NatioanlIdDetails;
