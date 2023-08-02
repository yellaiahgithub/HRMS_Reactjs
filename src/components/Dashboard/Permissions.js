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
import { connect } from 'react-redux'
import key from '../../../src/assets/images/key.png'


const Permissions = props => {
  const { user } = props
  useEffect(() => {
  }, [])

  return (
    <>
       <Grid item lg={6}>
                <Card style={{ width: "auto", height: "18rem" }}>
                    <List component="div" className="nav-line d-flex nav-line-alt nav-tabs-info">
                        <ListItem>
                            <div className="text-center my-1">
                                <img src={key} alt="action" width="40" height="40" />
                            </div>
                            <span className="text-center mx-4" style={{color: '#11c5db'}}>
                                Assigned Permissions &nbsp; {user.permissions?.length}
                            </span>
                            <div className="divider" />
                        </ListItem>
                    </List>
                    <div>
                    </div>
                    <div className="table-responsive-md"
                        style={{ overflow: 'auto', height: '13.6rem' }}>
                        <TableContainer>
                            <Table className="table table-alternate-spaced mb-0" style={{ height: "auto" }}>
                                {user.permissions?.map((item, idx) => (
                                    <>
                                        <tr>
                                            <td className="px-2"> &nbsp;
                                                {item.name}
                                            </td>
                                        </tr>

                                    </>
                                ))
                                }
                            </Table>
                        </TableContainer>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Permissions)
