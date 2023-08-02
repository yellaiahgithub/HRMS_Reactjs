import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Grid,
  Card,
  List,
  ListItem,
  Table,
  TableContainer,
  CardContent
} from '@material-ui/core'
import announcementicon from '../../../src/assets/images/announcementicon.png'
import announcementimg from '../../../src/assets/images/announcementimg.png'
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import Pagination from '@material-ui/lab/Pagination'
import { connect } from 'react-redux'
import PerfectScrollbar from 'react-perfect-scrollbar'

const Announcement = props => {
  const { user } = props
  const [allAnnouncements, setAllAnnouncements] = useState([])
  const [paginationAnnouncements, setPaginationAnnouncements] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(1)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getAnnouncements()
  }, [])

  const getAnnouncements = () => {
    apicaller(
      'get',
      `${BASEURL}/notification?employeeUUID=${user.uuid}&notificationType=announcement`
    )
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data?.data)
          setAnnouncements(res.data?.data)
          setAllAnnouncements(res.data?.data)
          setPaginationAnnouncements(res.data?.data)
        }
      })
      .catch(err => {
        console.log('getAnnouncements err', err)
      })
  }

  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const getPrasedDate = createdDate => {
    const date = new Date(createdDate)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <>
      <Grid item lg={6}>
        <Card style={{ width: 'auto', height: "18rem", }}>
          <List
            component='div'
            className='nav-line d-flex nav-line-alt nav-tabs-info'>
            <ListItem>
              <div className='text-center my-1'>
                <img
                  src={announcementicon}
                  alt='action'
                  width='40'
                  height='40'
                />
              </div>
              <span className='text-center mx-4'> Company Announcements</span>
              <div className='divider' />
            </ListItem>
          </List>

          {announcements.length > 0 ? (
            <>
              <div style={{ height: '220px', overflow: 'auto' }}>
                {paginationAnnouncements.map((item, idx) => (
                  <>
                    <CardContent>
                      <div className='d-flex justify-content-between mb-4'>
                        <div className='d-flex align-items-center'>
                          <div>
                            <span
                              className='font-weight-bold'
                              style={{ color: 'rgba(232, 25, 58)' }}>
                              {item?.announcement?.title}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        className='mb-0'
                        style={{ color: 'rgba(14,64,85) !important' }}>
                        {item?.announcement?.news}
                      </p>

                      <div
                        className='d-flex justify-content-between align-items-center mt-4'
                        style={{ color: 'rgba(127, 127, 127)' }}>
                        <div>
                          <div>
                            Posted By :{' '}
                            {item?.postedBy ? item?.postedBy : 'Admin'}
                          </div>
                        </div>
                        <div>
                          Posted On :{' '}
                          {getPrasedDate(item?.announcement?.createdAt)}
                        </div>
                      </div>
                    </CardContent>

                    <div className='divider' />
                  </>
                ))}{' '}
              </div>
            </>
          ) : (
            <div className='text-center my-2'>
              <div className='text-center my-1'>
                <img
                  src={announcementimg}
                  alt='action'
                  width='150'
                  height='150'
                />
              </div>
              <h6>There Are No Announcements</h6>
            </div>
          )}
        </Card>
      </Grid>
    </>
  )
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Announcement)
