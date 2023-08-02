import React from 'react'
import { Grid, Card, List, ListItem } from '@material-ui/core'
import { BASEURL } from 'config/conf'
import { useState, useEffect } from 'react'
import apicaller from 'helper/Apicaller'
import { connect } from 'react-redux'
const EducationalDetails = props => {
  const [blocking, setBlocking] = useState(false)
  const [educationalDetails, setEducationalDetails] = useState([])
  const { employeeUUID } = props

  useEffect(() => {
    if (employeeUUID) {
      setBlocking(true)
      apicaller(
        'get',
        `${BASEURL}/education/byEmployeeUUID?employeeUUID=${employeeUUID}`
      )
        .then(res => {
          setBlocking(false)
          if (res.status === 200) {
            console.log(res.data)
            setEducationalDetails(res.data)
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('err', err)
          setEducationalDetails([])
        })
    }
  }, [])

  return (
    <>
      {educationalDetails.length !== 0 ? (
        <>
          {educationalDetails?.map((item, idx) => (
            <Card
              className='myProfileCard'>
              <div>
                <span className='text-grey font-weight-bold float-right ' style={{ fontSize: '12px' }}>
                  Is Highest Education : {item.isHighestEducation ? 'Yes' : 'No'}
                </span>
              </div>
              <Grid container>
                <Grid item md={12} style={{ display: 'contents' }}>
                  <Grid item md={3} className='p-4'>
                    <div>Level Of Education</div>
                    <span className='text-grey font-weight-bold'>
                      {item.levelOfEducation}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>Mode of Education</div>
                    <span className='text-grey font-weight-bold'>
                      {item.modeOfEducation}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>College is</div>
                    <span className='text-grey font-weight-bold'>
                      {item.istheCollege}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>Place of Education</div>
                    <span className='text-grey font-weight-bold' >
                      {item.city},{' '} {item.state},{' '}{item.country},
                    </span>
                  </Grid>
                  {item.levelOfEducation.toLowerCase() !== '10th' &&
                    item.levelOfEducation.toLowerCase() !== '10+2' &&
                    item.levelOfEducation.toLowerCase() !== 'intermediate' ? (
                    <Grid item md={3} className='p-4'>
                      <div>Name of the Degree</div>
                      <span className='text-grey font-weight-bold'>
                        {item.nameOfDegree}
                      </span>
                    </Grid>
                  ) : (
                    ''
                  )}
                  <Grid item md={3} className='p-4'>
                    <div>
                      {' '}
                      {item.levelOfEducation.toLowerCase() == '10th' ||
                        item.levelOfEducation.toLowerCase() == '10+2'
                        ? 'Name of the School'
                        : 'Name of the College'}
                    </div>
                    <span className='text-grey font-weight-bold'>
                      {item.nameofTheCollegeOrSchoolOrOrganization}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>
                      {' '}
                      {item.levelOfEducation.toLowerCase() == '10th' ||
                        item.levelOfEducation.toLowerCase() == '10+2'
                        ? 'Name of the Board'
                        : 'Name of the University'}
                    </div>
                    <span className='text-grey font-weight-bold'>
                      {item.nameOfBoard}
                    </span>
                  </Grid>
                  <Grid item md={3} className='p-4'>
                    <div>Year of Passing</div>
                    <span className='text-grey font-weight-bold'>
                      {item.yearOfPassing}
                    </span>
                  </Grid>
                </Grid>
                <Grid item md={3} className='p-4'>
                  <div>Marks Scored</div>
                  <span className='text-grey font-weight-bold'>
                    {item.aggregate}
                  </span>
                </Grid>
              </Grid>
            </Card>
          ))}
        </>
      ) :
        <Grid>
          <div className='text-grey text-center pt-4'> No Educational Details Added</div>
        </Grid>
      }
    </>
  )
}


export default EducationalDetails
