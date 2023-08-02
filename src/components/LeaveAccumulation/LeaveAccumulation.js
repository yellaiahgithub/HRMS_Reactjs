import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import apicaller from 'helper/Apicaller'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Table, 
    InputAdornment,
    Card,
    Menu,
    Button,
    List,
    ListItem,
    TextField,
    Snackbar,  
    TableContainer
} from '@material-ui/core'
import 'date-fns'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'
import Pagination from '@material-ui/lab/Pagination'
import BlockUi from 'react-block-ui'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'


const LeaveAccumulation = () => {
    const [blocking, setBlocking] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [getAllLeaveAccumulation, setGetAllLeaveAccumulation] = useState([])
    const [paginationAccumulation, setPaginationAccumulation] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [formURL, setFormURL] = useState('/createLeaveAccumulation');
    const [page, setPage] = useState(1)
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state

    const openSearch = () => setSearchOpen(true)
    const closeSearch = () => setSearchOpen(false)
    const handleClose3 = () => {
        setState({ ...state, open: false })
    }
    const [anchorEl, setAnchorEl] = useState(null) 

    useEffect(() => {
        getAllData()
    }, [])
    
    const getAllData = () => {
        apicaller('get', `${BASEURL}/leaveAccumulationPolicy/fetchAll`)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)             
                    setGetAllLeaveAccumulation(res.data)
                    setPaginationAccumulation(res.data)
                }
            })
            .catch(err => {
                console.log(' getLeaveAccumualtion err', err)

            })
    }
 
    const [anchorEl2, setAnchorEl2] = useState(null)
    const handleClick2 = event => {
        setAnchorEl2(event.currentTarget)
    }
    const handleClose2 = () => {
        setAnchorEl2(null)
    }
    const handleSort = sortOrder => {
        let sortedLeaveAccumulation = JSON.parse(JSON.stringify(getAllLeaveAccumulation))
        if (sortOrder == 'ASC') {
            sortedLeaveAccumulation = sortedLeaveAccumulation.sort((loct1, loct2) =>
                loct1.id > loct2.id
                    ? 1
                    : loct2.id > loct1.id
                        ? -1
                        : 0
            )
            setGetAllLeaveAccumulation(sortedLeaveAccumulation)
            setPaginationAccumulation(sortedLeaveAccumulation)
        } else {
            sortedLeaveAccumulation = sortedLeaveAccumulation.sort((loct2, loct1) =>
                loct1.id > loct2.id
                    ? 1
                    : loct2.id > loct1.id
                        ? -1
                        : 0
            )
            setGetAllLeaveAccumulation(sortedLeaveAccumulation)
            setPaginationAccumulation(sortedLeaveAccumulation)
        }
    }

    const handleSearch = (event) => {
        const results = getAllLeaveAccumulation.filter((obj) =>
          obj.id.toLowerCase().includes(event.target.value.toLowerCase()) ||
          obj.leaveTypeName.toLowerCase().includes(event.target.value.toLowerCase()) ||
          obj.description.toLowerCase().includes(event.target.value.toLowerCase())
        );
        if (results.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            });
        }            
        setPaginationAccumulation(results)
    };
    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }

    return (
        <>
            <BlockUi
                tag='div'
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>
                <Card className='card-box shadow-none'>
                    <div className='d-flex flex-column flex-md-row justify-content-between px-4 py-3'               >
                        <div
                            className={clsx(
                                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                                { 'is-active': searchOpen }
                            )}>
                            <TextField
                                variant='outlined'
                                size='small'
                                id='input-with-icon-textfield22-2'
                                placeholder='Search...'
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
                        <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-end px-4 p-2'>
                                <Button
                                    className='btn-primary mr-2'
                                    component={NavLink}
                                    to='/createLeaveAccumulation'>
                                    Configure Leave Carry Forward Policy
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={handleClick2}
                                    className='btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill'>
                                    <SettingsTwoToneIcon className='w-50' />
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
                                    <div className='dropdown-menu-lg overflow-hidden p-0'>
                                        <div className='font-weight-bold px-4 pt-3'>Results</div>
                                        <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                            <ListItem
                                                button
                                                href='#/'
                                                value={recordsPerPage}
                                                onClick={e => {
                                                    setRecordsPerPage(10)
                                                    setPage(1)
                                                    handleClose2()
                                                    setPaginationAccumulation(getAllLeaveAccumulation)
                                                }}>
                                                <div className='nav-link-icon mr-2'>
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>
                                                    <b>10</b> results per page
                                                </span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href='#/'
                                                value={recordsPerPage}
                                                onClick={e => {
                                                    setRecordsPerPage(20)
                                                    setPage(1)
                                                    handleClose2()
                                                    setPaginationAccumulation(getAllLeaveAccumulation)
                                                }}>
                                                <div className='nav-link-icon mr-2'>
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>
                                                    <b>20</b> results per page
                                                </span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href='#/'
                                                value={recordsPerPage}
                                                onClick={e => {
                                                    setRecordsPerPage(30)
                                                    setPage(1)
                                                    handleClose2()
                                                    setPaginationAccumulation(getAllLeaveAccumulation)
                                                }}>
                                                <div className='nav-link-icon mr-2'>
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>
                                                    <b>30</b> results per page
                                                </span>
                                            </ListItem>
                                        </List>
                                        <div className='divider' />
                                        <div className='font-weight-bold px-4 pt-4'>Order</div>
                                        <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                            <ListItem
                                                button
                                                href='#/'
                                                onClick={e => {
                                                    handleSort('ASC'); handleClose2()
                                                }}>
                                                <div className='mr-2'>
                                                    <ArrowUpwardTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>Ascending</span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href='#/'
                                                onClick={e => { handleSort('DES'); handleClose2() }}>
                                                <div className='mr-2'>
                                                    <ArrowDownwardTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>Descending</span>
                                            </ListItem>
                                        </List>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className='divider' />
                    {paginationAccumulation.length > 0 && (
                        <>
                            <div>
                                <div className='table-responsive-md m-4 px-5'>
                                    <TableContainer>
                                        <Table className='table table-alternate-spaced p-2'>
                                            <thead className="thead-light">
                                                <tr className='m-4 '>
                                                    <th
                                                        style={{ width: 'auto' }}
                                                        className='font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark'
                                                        scope='col'>
                                                        Accumulation ID
                                                    </th>
                                                    <th
                                                        style={{ width: 'auto' }}
                                                        className='font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark'
                                                        scope='col'>
                                                        Leave Types
                                                    </th>
                                                    <th
                                                        style={{ width: 'auto' }}
                                                        className='font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark'
                                                        scope='col'>
                                                        Accumulation Description
                                                    </th>

                                                </tr>
                                            </thead>
                                            {paginationAccumulation.length > 0 ? (<>
                                                <tbody>

                                                    {paginationAccumulation
                                                        .slice(
                                                            page * recordsPerPage > getAllLeaveAccumulation.length
                                                                ? page === 0
                                                                    ? 0
                                                                    : page * recordsPerPage - recordsPerPage
                                                                : page * recordsPerPage - recordsPerPage,
                                                            page * recordsPerPage <= getAllLeaveAccumulation.length
                                                                ? page * recordsPerPage
                                                                : getAllLeaveAccumulation.length
                                                        )
                                                        .map((item, idx) => (
                                                            <>
                                                                <tr className='mx-5 text-dark'>
                                                                    <td className="text-left">
                                                                        <div className='text-lef'>
                                                                            <span className='font-weight-normal'>
                                                                                {item?.id}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className='text-left'>
                                                                        <span className='font-weight-normal'>
                                                                            {item?.leaveTypeName}
                                                                        </span>
                                                                    </td>
                                                                    <td className='text-left'>
                                                                        <span className='font-weight-normal'>
                                                                            {item?.description}
                                                                        </span>
                                                                    </td>
                                                                    <td className='text-right'>
                                                                        <Button
                                                                            component={NavLink}
                                                                            to={formURL + '?uuid=' + item.uuid}
                                                                            className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                                                            <FontAwesomeIcon
                                                                                icon={['far', 'edit']}
                                                                                className='font-size-sm'
                                                                            />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                                <tr className='divider'></tr>
                                                            </>
                                                        ))}
                                                </tbody>
                                            </>) : (
                                                <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                                                    <label className="p-4 d-flex align-items-center">
                                                        No Matching Results Found
                                                    </label>
                                                </div>
                                            )}
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                        <Pagination
                            className='pagination-primary'
                            count={Math.ceil(getAllLeaveAccumulation.length / recordsPerPage)}
                            variant='outlined'
                            shape='rounded'
                            selected={true}
                            page={page}
                            onChange={handleChange}
                            showFirstButton
                            showLastButton
                        />
                    </div>
                        </>
                    )}
                   
                    {paginationAccumulation.length == 0 && (
                        <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                            <label className="p-4 d-flex align-items-center">
                                No Matching Results Found
                            </label>
                        </div>
                    )}
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
export default LeaveAccumulation;