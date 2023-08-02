import React, { useState, useEffect } from 'react'
import { Grid, Card, List, ListItem } from '@material-ui/core'
import { PageTitle } from '../../layout-components'
import Birthday from 'components/Dashboard/Birthday'
import CompanyPolicy from 'components/Dashboard/CompanyPolicy'
import QuickAction from 'components/Dashboard/QuickAction'
import Announcement from 'components/Dashboard/Announcement'
import HolidayDashboard from 'components/Dashboard/HolidayDashboard'
import { connect } from 'react-redux'
import PendingApprovals from 'components/MyProfile/PendingApprovals'
import Permissions from 'components/Dashboard/Permissions'
import PendingProbationConfirmation from 'components/PendingProbationConfirmation/pendingProbationConfirmation'

const Dashboard = props => {
  const { user, isAdminViewEnabled,view,isUserMapped } = props

  const [userIs, setUserIs] = useState('')

  useEffect(() => {
    console.log(isAdminViewEnabled)
    checkUserRole()
  })

  const checkUserRole = () => {
    if (user.roles)
      if (user.roles?.some(object => object.name === 'Core HR Admin')) {
        setUserIs('coreAdmin')
      }
  }

  return (
    <>
      {view !== 'Employee' ? (
        <PageTitle titleHeading='Dashboard' titleDescription='Coming soon' />
      ) : (
        <>
          {isAdminViewEnabled ? (
            <Grid container spacing={4}>
              <PendingApprovals isDirectEmployee={false} isAdmin={true}/>
              <PendingProbationConfirmation/>
              <Permissions />
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Birthday />
              <Announcement />
              <CompanyPolicy />
              <QuickAction />
              <HolidayDashboard />
            </Grid>
          )}
        </>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  user: state.Auth.user,
  view:state.Auth.view,
  isAdminViewEnabled : state.Auth.isAdminViewEnabled,
  isUserMapped:state.Auth.isUserMapped
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
