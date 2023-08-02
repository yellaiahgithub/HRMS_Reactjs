import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import 'date-fns'
import {
    Table,
    Grid,
    InputAdornment,
    Card,
    Menu,
    MenuItem,
    Button,
    List,
    Switch,
    ListItem,
    TextField,
    FormControl,
    TableContainer,
    Snackbar
} from '@material-ui/core'
import apicaller from 'helper/Apicaller'
import Pagination from '@material-ui/lab/Pagination'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom';


import { NavLink } from 'react-router-dom'

const HolidayCalendarMaster = (props) => {
    const { user } = props;

    const [blocking, setBlocking] = useState(false)
    const [paganationHolidays, setPaginationHolidays] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [holiday, setHoliday] = useState('')
    const [allHolidays, setAllHolidays] = useState([])
    const [holidays, setHolidays] = useState([])
    const [isSubmitted, setIsSubmitted] = useState();
    const [allowMaxiumHolidays, setAllowMaxiumHolidays] = useState('');
    const [isRestricted, setIsRestricted] = useState(true)
    const [holidayRestrictionUUID, setHolidayRestrictionUUID] = useState()


    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    const [searchOpen, setSearchOpen] = useState(false)
    const openSearch = () => setSearchOpen(true)
    const closeSearch = () => setSearchOpen(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClose = () => {
        setState({ ...state, open: false })
        setAnchorEl(null)
    }
    const [anchorEl2, setAnchorEl2] = useState(null)
    const handleClick2 = event => {
        setAnchorEl2(event.currentTarget)
    }
    const handleClose2 = () => {
        setAnchorEl2(null)
    }
    const allowNumberOfMaxiumHolidays = Array.from({ length: 25 }, (_, i) => 1 + i);

    useEffect(() => {
        getAllHolidays()
        getHolidayRestrict()

    }, [])


    const getHolidayRestrict = () => {
        apicaller('get', `${BASEURL}/holidayCalendarRestrictions`)
            .then(res => {
                if (res.status === 200 && res.data) {
                    console.log('res.data', res.data)
                    setIsRestricted(res.data.isRestricted)
                    setAllowMaxiumHolidays(res.data.maxNoOfHolidays)
                    setHolidayRestrictionUUID(res.data.uuid)


                }
            })
            .catch(err => {
                console.log(' Number of Holidays', err)
            })
    }

    const getAllHolidays = () => {
        apicaller('get', `${BASEURL}/holiday/fetchAll`)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    setHolidays(res.data)
                    setAllHolidays(res.data)
                    setPaginationHolidays(res.data)

                }
            })
            .catch(err => {
                console.log(' getAllHolidays err', err)

            })
    }
    const save = () => {
        let inputObj = {
            "isRestricted": isRestricted,
            "maxNoOfHolidays": allowMaxiumHolidays,
        }
        if (!holidayRestrictionUUID) {
            apicaller('post', `${BASEURL}/holidayCalendarRestrictions`, inputObj)
                .then(res => {
                    if (res.status === 200 && res.data) {
                        setIsRestricted(inputObj.isRestricted)
                        setAllowMaxiumHolidays(inputObj.maxNoOfHolidays)
                        setState({
                            open: true,
                            message: `Number of Holidays Restricted Successfully`,
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });

                    }
                })
                .catch(err => {
                    console.log('allow maxium holidays err', err)
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });

                })
        } else {
            inputObj.uuid = holidayRestrictionUUID;
            apicaller('patch', `${BASEURL}/holidayCalendarRestrictions/update`, inputObj)
                .then(res => {
                    if (res.status === 200) {
                        setIsRestricted(inputObj.isRestricted)
                        setAllowMaxiumHolidays(inputObj.maxNoOfHolidays)
                        setState({
                            open: true,
                            message: `Number of Holidays Restricted Successfully`,
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    }
                })
                .catch(err => {
                    console.log('allow maxium holidays err', err)
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });

                })
        }

    }
    const addToList = () => {
        let obj = {
            "name": holiday
        }
        setBlocking(true)
        axios
            .post(`${BASEURL}/holiday`, obj)
            .then(res => {
                setBlocking(true)
                if (res.status === 200) {
                    getAllHolidays()
                    setHoliday('')
                    setState({
                        open: true,
                        message: `${holiday} is successfully added to holiday master`,
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('create holiday err', err)
                setState({
                    open: true,
                    message: err.response.data,
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                });
            })
    }
    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }
    const handleSearch = event => {
        const results = holidays.filter(obj =>
            JSON.stringify(obj).toLowerCase().includes(event.target.value.toLowerCase())
        )
        setAllHolidays(results)
        setPaginationHolidays(results)
    }
    const handleCancel = () => {
        // Reset form fields
        setHoliday('');
        setAllowMaxiumHolidays('');

    }
    const handleSort = sortOrder => {
        let sortedHolidays = JSON.parse(JSON.stringify(holidays))
        if (sortOrder == 'ASC') {
            sortedHolidays = sortedHolidays.sort((loct1, loct2) =>
                loct1.holidayName > loct2.holidayName
                    ? 1
                    : loct2.holidayName > loct1.holidayName
                        ? -1
                        : 0
            )
            setAllHolidays(sortedHolidays)
            setPaginationHolidays(sortedHolidays)
        } else {
            sortedHolidays = sortedHolidays.sort((loct2, loct1) =>
                loct1.holidayName > loct2.holidayName
                    ? 1
                    : loct2.holidayName > loct1.holidayName
                        ? -1
                        : 0
            )
            setAllHolidays(sortedHolidays)
            setPaginationHolidays(sortedHolidays)
        }
    }
    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '500px'
    }
    const paddingTop = {
        paddingTop: '25px'
    }
    return (
        <Card>
            <div className="mx-5 my-3">
                <Card className='card-box shadow-none mx-3 my-4'
                    style={{ maxWidth: '95%' }}>
                    <div className="bg-white p-4 rounded flex-column flex-md-row"
                    >
                        <Grid container spacing={0} className='pl-4'>
                            <Grid item md={1}>
                                <Switch
                                    onChange={(event) => {
                                        console.log(event);
                                        setIsRestricted(event.target.checked);
                                    }}
                                    checked={isRestricted}
                                    name="Allow"
                                    color="primary"
                                    className="switch-small"
                                />{' '}
                                &nbsp;
                            </Grid>
                            <Grid item md={10}>
                                <label className=" mb-2 text-dark">
                                    Restrict Number of Holidays per year for a location
                                </label>
                            </Grid>

                        </Grid>
                        <Grid item spacing={0} container >
                            {isRestricted ? (
                                <Grid item md={10} className='mx-auto'>
                                    <Grid item md={12} container direction='row' className='mt-4'>
                                        <Grid item md={2}>
                                            <label className='mb-2 text-dark' style={{ marginTop: '10px' }}> Allow Maximum</label>
                                        </Grid>
                                        <Grid item md={3} >
                                            <TextField
                                                id="outlined-allowMaxiumHolidays"
                                                label="Select"
                                                variant="outlined"
                                                fullWidth
                                                select
                                                size="small"
                                                name="allowMaxiumHolidays"
                                                value={allowMaxiumHolidays}
                                                onChange={(event) => {
                                                    setAllowMaxiumHolidays(event.target.value);
                                                }}
                                                helperText={
                                                    isSubmitted &&
                                                    (allowMaxiumHolidays && isRestricted
                                                        ? ''
                                                        : ' field is Required')
                                                }
                                                error={
                                                    isSubmitted &&
                                                    (allowMaxiumHolidays && isRestricted
                                                        ? false
                                                        : true)
                                                }>
                                                {allowNumberOfMaxiumHolidays.map((option) => (
                                                    <MenuItem
                                                        key={option}
                                                        value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item md={4} className='mb-2 text-dark'>
                                            <label className='mb-2' style={{ marginTop: '10px' }}>&nbsp; Holidays</label>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                        <Grid className='py-4 pl-4'>
                            <Button
                                className="btn-primary "
                                onClick={save} >
                                Save
                            </Button>
                            <Button
                                className="btn-primary mb-2 mr-3 m-2"
                                onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Grid>
                    </div>
                </Card>
                <Card className='card-box shadow-none mx-3 my-3'
                    style={{ maxWidth: '95%' }}>
                    <Grid className='pl-4'>
                        <div className="bg-white p-4 rounded flex-column flex-md-row">

                            <Grid item md={6}>
                                <span className='font-weight-normal pb-2 text-dark d-block'>
                                    Name of the Holiday
                                </span>
                                <FormControl
                                    variant='outlined'
                                    fullWidth
                                    size='small'>
                                    <TextField
                                        id="outlined-holiday"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size="small"
                                        value={holiday}
                                        name='holiday'
                                        onChange={(event, value) => {
                                            setHoliday(event.target.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid className='py-4'>
                                <Button
                                    className="btn-primary "
                                    onClick={addToList} >
                                    Add to List
                                </Button>
                                <Button
                                    className="btn-primary mb-2 mr-3 m-2 "
                                    onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Grid>
                        </div>
                    </Grid>
                </Card>
            </div>
            <div className="mx-5 my-3 mb-5">
                <span className='font-weight-normal  text-dark d-block  mx-3'>
                    Holiday Master
                </span>
                <Card className='card-box shadow-none mx-3 my-2 mb-4 '
                    style={{ maxWidth: '95%' }}>
                    <div className='d-flex flex-column flex-md-row justify-content-between px-4 py-3'>
                        <div
                            className={clsx(
                                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                                { 'is-active': searchOpen }
                            )}>
                            <TextField
                                variant='outlined'
                                size='small'
                                id='input-with-icon-textfield22-2'
                                placeholder='Search Holiday...'
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
                                                    setPaginationHolidays(allHolidays)
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
                                                    setPaginationHolidays(allHolidays)
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
                                                    setPaginationHolidays(allHolidays)
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
                                                    handleSort('ASC');handleClose2()
                                                }}>
                                                <div className='mr-2'>
                                                    <ArrowUpwardTwoToneIcon />
                                                </div>
                                                <span className='font-size-md'>Ascending</span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href='#/'
                                                onClick={e => {
                                                    handleSort('DES');handleClose2()
                                                }}>
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
                    <div className='p-4'>
                        <div className='table-responsive-md'>
                            <TableContainer>
                                <Table className='table table-alternate-spaced mb-0'>
                                    <thead style={{ background: '#eeeeee' }}>
                                        <tr>
                                            <th
                                                title=' Name of the Holiday'
                                                style={Object.assign(
                                                    { minWidth: '135px', maxWidth: '185px' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark px-5 '
                                                scope='col'>
                                                Name of the Holiday
                                            </th>
                                        </tr>
                                    </thead>
                                    {paganationHolidays.length > 0 ? (
                                        <>
                                            <tbody>
                                                {paganationHolidays
                                                    .slice(
                                                        page * recordsPerPage > allHolidays.length
                                                            ? page === 0
                                                                ? 0
                                                                : page * recordsPerPage - recordsPerPage
                                                            : page * recordsPerPage - recordsPerPage,
                                                        page * recordsPerPage <= allHolidays.length
                                                            ? page * recordsPerPage
                                                            : allHolidays.length
                                                    )
                                                    .map((item, idx) => (
                                                        <>
                                                            <tr>
                                                                <td
                                                                    style={Object.assign(
                                                                        { minWidth: '135px', maxWidth: '185px' },
                                                                        paddingTop
                                                                    )}
                                                                    className='font-size-normal pb-4 text-capitalize  px-5'>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.name}
                                                                            style={tableData}>
                                                                            {item?.name}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr className='divider'></tr>
                                                        </>
                                                    ))}
                                            </tbody>
                                        </>
                                    ) : (
                                        <tbody className='text-center'>
                                            <div>
                                                <img
                                                    alt='...'
                                                    src={noResults}
                                                    style={{ maxWidth: '600px' }}
                                                />
                                            </div>
                                        </tbody>
                                    )}
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                            <Pagination
                                className='pagination-primary'
                                count={Math.ceil(allHolidays.length / recordsPerPage)}
                                variant='outlined'
                                shape='rounded'
                                selected={true}
                                page={page}
                                onChange={handleChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={3000}
            />
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={3000}
            />
        </Card>
    )
}
const mapStateToProps = state => ({
    user: state.Auth.user
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(HolidayCalendarMaster)