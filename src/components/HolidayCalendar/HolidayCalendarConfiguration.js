import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import 'date-fns'
import { NavLink } from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns'
import {
    Table,
    Grid,
    InputAdornment,
    Card,
    Menu,
    Button,
    List,
    ListItem,
    TextField,
    FormControl,
    TableContainer,
    MenuItem,
    Checkbox,
    Snackbar
} from '@material-ui/core'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'
import apicaller from 'helper/Apicaller'
import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import { BASEURL } from 'config/conf'
import ScrollBar from 'react-perfect-scrollbar'
import { useLocation } from 'react-router-dom';
const HolidayCalendarConfiguration = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const editUUID = queryParams.get('uuid') || null;
    const readOnly =
        queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
    const edit = editUUID ? true : false;
    const saveButtonLabel = edit ? 'Update Customer' : 'Create Customer';
    const [uuid,setUUID]=useState(null);
    const [holidays, setHolidays] = useState()
    const [isSubmitted, setIsSubmitted] = useState();
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => 1900 + i);
    const [selectYear, setSelectYear] = useState('');
    const [allLocations, setAllLocations] = useState([])
    const [filteredLocations, setfilteredLocations] = useState([])
    const [paginationHolidays, setpaginationHolidays] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [searchOpen, setSearchOpen] = useState(false)
    const openSearch = () => setSearchOpen(true)
    const closeSearch = () => setSearchOpen(false)
    const [holidayType, setHolidayType] = useState()
    const [holiday, setHoliday] = useState()
    const [allHolidays, setAllHolidays] = useState([])
    const [anchorEl2, setAnchorEl2] = useState(null)
    const [maxNoOfHolidays, setMaxNoOfHolidays] = useState()
    const [holidayselectedCount, setHolidayselectedCount] = useState(0)
    const [minDate, setMinDate]=useState()
    const [maxDate, setMaxDate]=useState()
    let locationList = []
    const handleClick2 = event => {
        setAnchorEl2(event.currentTarget)
    }
    const handleClose2 = () => {
        setAnchorEl2(null)
    }
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    const holidayTypes = [
        {
            value: 'Closed',
            label: 'Closed'
        },
        {
            value: 'Restricted',
            label: 'Restricted'
        },
    ]

    useEffect(() => {
        setUUID(editUUID);
        setSelectYear(currentYear);
        const minDate=new Date("01/01/"+currentYear)
        const maxDate=new Date("12/31/"+currentYear)
        setMinDate(minDate)
        setMaxDate(maxDate)
        getLocations()
        getHolidayRestrict()

    }, [])

    const getHolidayRestrict = () => {
        apicaller('get', `${BASEURL}/holidayCalendarRestrictions`)
            .then(res => {
                if (res.status === 200 && res.data) {
                    console.log('res.data', res.data)
                    if (res.data.isRestricted) {
                        setMaxNoOfHolidays(res.data.maxNoOfHolidays)
                    }
                }
            })
            .catch(err => {
                console.log('Maxium Number of Holidays', err)
            })
    }

    const getHolidays = () => {
        apicaller('get', `${BASEURL}/holiday/fetchAll`)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.map((item, i) => {
                        delete item._id
                        delete item.createdAt
                        delete item.updatedAt
                        delete item.uuid
                        delete item.isActive
                        delete item.__v
                        return { ...item, ['nameOfHoliday']: item.name, ['isSelected']: false, type: '', ['selectedHolidayType']: {} ,['startDate']:null,['endDate']:null }
                    })
                    setHolidays(data)
                    setpaginationHolidays(data)
                    setAllHolidays(data)
                }
            })
            .catch(err => {
                console.log('getHolidays err', err)
            })
    }
    const getLocations = () => {
        apicaller('get', `${BASEURL}/location`)
            .then(res => {
                if (res.status === 200) {
                    locationList = res.data
                    if (editUUID) {
                        setAllLocations(res.data, getHolidayByUUID())
                    }
                    else {
                        setAllLocations(res.data, getHolidays())
                    }
                }
            })
            .catch(err => {
                console.log('getDesignation err', err)
            })
    }
    const getHolidayByUUID = () => {
        apicaller('get', `${BASEURL}/holidayCalendarConfiguration/byId?uuid=` + editUUID)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    setHoliday(data.name);
                    setSelectYear(data.year);
                    const locations = []
                    data.locationId.forEach(location => {
                        const reqLocation = locationList.find(loc => loc.locationId === location)
                        if (reqLocation)
                            locations.push(reqLocation)
                    });
                    const holidayData = data.holidays.map((item, i) => {
                        return { ...item, ['startDate']:item.startDate?item.startDate:null,['endDate']:item.endDate?item.endDate:null }
                    })
                    setfilteredLocations(locations)
                    setAllHolidays(holidayData)
                    setHolidays(holidayData)
                    setpaginationHolidays(holidayData)
                    const holidays = holidayData.filter(holiday => holiday.isSelected == true)
                    setHolidayselectedCount(holidays.length)
                }
            })
            .catch((err) => {
                console.log('get customer err', err);
            });
    };
    const validate = ()=>{
        let isValid=true;
        let errors=[]
        if(filteredLocations==null||filteredLocations?.length==0){
            isValid=false;
            errors.push("Location is required.")
        }
        if(selectYear==null ||selectYear.length==0){
            isValid=false;
            errors.push("Year is Mandatory.")
        }
        if(holiday==null || holiday.length==0){
            isValid=false;
            errors.push("Name of Holiday is Mandatory.")
        }
        let atleastOneSelected=false;
        holidays.forEach(holiday=>{
            if(holiday.isSelected){
                atleastOneSelected=true;
                if(holiday.startDate==null||holiday.startDate.length==0){
                    isValid=false;
                    errors.push("Start Date is Mandatory for "+holiday.nameOfHoliday)
                }
                else{
                    const startDate= new Date(holiday.startDate)
                    const endDate=new Date(holiday.endDate)
                    if(!( startDate instanceof Date && !isNaN(startDate))){
                        isValid=false;
                        errors.push("Invalid Start Date for "+holiday.nameOfHoliday)
                    }
                    if(startDate<minDate){
                        isValid=false;
                        errors.push("Start Date Can not be Less than "+minDate.toDateString()+" "+holiday.nameOfHoliday)
                    }
                    if(startDate>maxDate){
                        isValid=false;
                        errors.push("Start Date Can not be Greater than "+maxDate.toDateString()+" "+holiday.nameOfHoliday)
                    } 
                    if((holiday.endDate&&endDate instanceof Date&& endDate>minDate && startDate>endDate)) {
                        isValid=false;
                        errors.push("Start Date Can not be Greater than End Date - "+holiday.nameOfHoliday)
                    }                                  
                }
                if(holiday.endDate==null||holiday.endDate.length==0){
                    isValid=false;
                    errors.push("End Date is Mandatory for "+holiday.nameOfHoliday)
                }
                else{
                    const startDate= new Date(holiday.startDate)
                    const endDate=new Date(holiday.endDate)
                    if(!(endDate instanceof Date && !isNaN(endDate))){
                        isValid=false;
                        errors.push("Invalid End Date for "+holiday.nameOfHoliday)
                    }
                    if(endDate<minDate){
                        isValid=false;
                        errors.push("End Date Can not be Less than "+minDate.toDateString()+" "+holiday.nameOfHoliday)
                    }
                    if(endDate>maxDate){
                        isValid=false;
                        errors.push("End Date Can not be Greater than "+maxDate.toDateString()+" "+holiday.nameOfHoliday)
                    }
                    if((holiday.startDate&&startDate instanceof Date&& startDate<maxDate && startDate>endDate)) {
                        isValid=false;
                        errors.push("End Date Can not be Less than Start Date - "+holiday.nameOfHoliday)
                    }
                }
                if(holiday.type==null||holiday.type.length==0){
                    isValid=false;
                    errors.push("Type is Mandatory for "+holiday.nameOfHoliday)
                }
            }
        })
        if(!atleastOneSelected){
            isValid=false;
            errors.push("Please Select atleast one holiday.")
        }
        if(!isValid)
        setState({
            open: true,
            message: errors.toString(),
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
        })
        return isValid
    }
    const save = () => {
        setIsSubmitted(true);
        const isValid=validate()
        if(isValid){
            let location
            if (filteredLocations?.length > 0) {
                location = filteredLocations.map(a => a.locationId)
            }
            const holidaysData = holidays.map((item, i) => {
                delete item.selectedHolidayType
                delete item.name
                return item
            })
            let input = {
                "name": holiday,
                "year": selectYear,
                "locationId": location,
                "holidays": holidaysData
            }
            if (!uuid) {
                apicaller('post', `${BASEURL}/holidayCalendarConfiguration`, input)
                    .then(res => {
                        if (res.status === 200) {
                            setUUID(res.data[0].uuid)
                            setState({
                                open: true,
                                message: `${holiday} is successfully added to holiday Configuration`,
                                toastrStyle: 'toastr-success',
                                vertical: 'top',
                                horizontal: 'right'
                            });
                            // resetPage();
                        }
                    })
                    .catch(err => {
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
            else {
                input.uuid = uuid;
                apicaller('patch', `${BASEURL}/holidayCalendarConfiguration/update`, input)
                    .then(res => {
                        if (res.status === 200) {
                            setState({
                                open: true,
                                message: `${holiday} is successfully Updated`,
                                toastrStyle: 'toastr-success',
                                vertical: 'top',
                                horizontal: 'right'
                            });
                        }
                    })
                    .catch(err => {
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
        }
    }
    const resetPage = () => {
        // Reset form fields
        setHoliday('')
        setSelectYear('')
        setfilteredLocations([])
        getHolidays()
    }
    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }
    const paddingTop = {
        paddingTop: '25px'
    }
    const handleSelectHoliday = index => e => {
        if (e.target.name === 'isSelected') {
            const result = paginationHolidays.map((item, i) => {
                if (index === i) {
                    if (e.target.checked) {
                        if (holidayselectedCount < maxNoOfHolidays) {
                            setHolidayselectedCount(holidayselectedCount + 1);
                        } else {
                            setState({
                                open: true,
                                message: 'Maximum number of holidays reached!',
                                toastrStyle: 'toastr-warning',
                                vertical: 'top',
                                horizontal: 'right'
                            });
                            return item; // Prevent selecting more holidays than the maximum limit
                        }
                    } else {
                        setHolidayselectedCount(holidayselectedCount - 1);

                    }
                    return { ...item, [e.target.name]: e.target.checked };
                }
                return item;
            });
            setHolidays(result);
            setpaginationHolidays(result);
        }
    }
    const holidaySelectStartDate = (index, name) => e => {
        const reqDate=new Date(e);
        reqDate.setHours(0);
        reqDate.setMinutes(0);
        reqDate.setSeconds(0);
        reqDate.setMilliseconds(0);
        if (name == 'startDate') {
            const result = holidays.map((item, i) => {
                if (index == i) {
                    return { ...item, [name] : reqDate, ["endDate"]: item.endDate ? item.endDate : reqDate }
                } else {
                    return item
                }
            })
            const newArray = result.map((item, i) => {
                return item
            })
            setHolidays(newArray)
            setpaginationHolidays(newArray)
        }
        else {
            const result = holidays.map((item, i) => {
                if (index == i) {
                    return { ...item, [name]: reqDate }
                } else {
                    return item
                }
            })
            const newArray = result.map((item, i) => {
                return item
            })
            setHolidays(newArray)
            setpaginationHolidays(newArray)
        }
    }
    const handleSelectHolidayType = (index, holidayType) => {
        const result = holidays.map((item, i) => {
            if (index == i) {
                return { ...item, ['selectedHolidayType']: holidayType, ['type']: holidayType.value }
            } else {
                return item
            }
        })
        const newArray = result.map((item, i) => {
            return item
        })
        setHolidays(newArray)
        setpaginationHolidays(newArray)
    }
    const handleSearch = event => {
        const results = holidays.filter(obj =>
            obj.nameOfHoliday.toLowerCase().includes(event.target.value.toLowerCase())
        )
        setAllHolidays(results)
        setpaginationHolidays(results)
    }
    const handleSort = sortOrder => {
        let sortedHolidays = JSON.parse(JSON.stringify(holidays))
        if (sortOrder == 'ASC') {
            sortedHolidays = sortedHolidays.sort((loct1, loct2) =>
                loct1.nameOfHoliday > loct2.nameOfHoliday
                    ? 1
                    : loct2.nameOfHoliday > loct1.holidnameOfHolidayayName
                        ? -1
                        : 0
            )
            setAllHolidays(sortedHolidays)
            setpaginationHolidays(sortedHolidays)
        } else {
            sortedHolidays = sortedHolidays.sort((loct2, loct1) =>
                loct1.nameOfHoliday > loct2.nameOfHoliday
                    ? 1
                    : loct2.nameOfHoliday > loct1.nameOfHoliday
                        ? -1
                        : 0
            )
            setAllHolidays(sortedHolidays)
            setpaginationHolidays(sortedHolidays)
        }
    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };


    return (
        <>
            <Card>
                <ScrollBar>
                    <Grid item md={4}
                        className='py-4 px-5'>
                        <span className='font-weight-normal  text-dark d-block py-2  '>
                            Holiday Calendar of the year *
                        </span>
                        <Autocomplete
                            id='combo-box-demo'
                            options={yearsArray}
                            disabled={readOnly}
                            value={selectYear}
                            getOptionLabel={option => option.toString()}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    // style={{ width: "calc(50% - 2px)", marginLeft: "2px", display: 'inline-block' }}
                                    placeholder=' Select Year'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    error={isSubmitted && (selectYear ? false : true)}
                                    helperText={
                                        isSubmitted && (!selectYear || selectYear === '')
                                        ? 'Field is Mandatory'
                                        : ''
                                    }
                                />
                            )}
                            onChange={(event, value) => {
                                setSelectYear(value)
                            }}
                        />
                    </Grid>
                    <Grid className='pl-4'>
                        <div className="bg-white px-4 rounded">
                            <Grid item md={6}>
                                <span className='font-weight-normal pb-2 text-dark d-block'>
                                    Name of the Holiday *
                                </span>
                                <FormControl
                                    variant='outlined'
                                    fullWidth
                                    size='small'>
                                    <TextField
                                        id="outlined-holiday"
                                        type="text"
                                        variant="outlined"
                                        placeholder='Name of the Holiday'                                    
                                        fullWidth
                                        required
                                        size="small"
                                        name='holiday'
                                        value={holiday}
                                        onChange={(event, value) => {
                                            setHoliday(event.target.value)
                                        }}
                                        error={isSubmitted && (holiday ? false : true)}
                                        helperText={
                                            isSubmitted && (!holiday || holiday === '')
                                            ? 'Field is Mandatory'
                                            : ''
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4}
                                className='pb-4'>
                                <span className='font-weight-normal  text-dark d-block pt-4 pb-2 '>
                                    Select Location(S) *
                                </span>
                                <FormControl
                                    variant='outlined'
                                    fullWidth
                                    size='small'>
                                    <Autocomplete
                                        id='combo-box-demo'
                                        multiple
                                        options={allLocations}
                                        disabled={readOnly}
                                        value={filteredLocations}
                                        getOptionLabel={option => option.locationName}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                placeholder=' Select Location(S)'
                                                variant='outlined'
                                                fullWidth
                                                size='small'
                                                error={(isSubmitted && (filteredLocations!=null && filteredLocations.length==0 ))? true : false}
                                                helperText={
                                                    isSubmitted && (filteredLocations!=null && filteredLocations.length==0 )
                                                    ? 'Field is Mandatory'
                                                    : ''
                                                }
                                            />
                                        )}
                                        onChange={(event, value) => {
                                            setfilteredLocations(value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Card className='card-box shadow-none mb-4 '
                                style={{ maxWidth: '90%' }}>
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
                                                                setpaginationHolidays(allHolidays)
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
                                                                setpaginationHolidays(allHolidays)
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
                                                                setpaginationHolidays(allHolidays)
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
                                                                handleSort('ASC')
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
                                                                handleSort('DES')
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
                                                            title=' '
                                                            className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark px-5 '
                                                            scope='col'>

                                                        </th>
                                                        <th
                                                            title='holiday '
                                                            style={Object.assign(
                                                                { minWidth: '200px', maxWidth: '200px' },
                                                                paddingTop
                                                            )}
                                                            className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark  '
                                                            scope='col'>
                                                            Name of the Holiday
                                                        </th>
                                                        <th
                                                            title='startDate'
                                                            style={Object.assign(
                                                                { minWidth: '135px', maxWidth: '185px' },
                                                                paddingTop
                                                            )}
                                                            className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark px-5 '
                                                            scope='col'>
                                                            Start Date
                                                        </th>
                                                        <th
                                                            title='endDate'
                                                            style={Object.assign(
                                                                { minWidth: '135px', maxWidth: '185px' },
                                                                paddingTop
                                                            )}
                                                            className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark px-5 '
                                                            scope='col'>
                                                            End Date
                                                        </th>
                                                        <th
                                                            title='holidayType'
                                                            style={Object.assign(
                                                                { minWidth: '200px', maxWidth: '200px' },
                                                                paddingTop
                                                            )}
                                                            className='font-size-sm font-weight-bold pb-4 text-capitalize text-dark px-5 '
                                                            scope='col'>
                                                            Holiday Type
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {paginationHolidays.length > 0 ? (
                                                    <>
                                                        <tbody>
                                                            {paginationHolidays
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
                                                                .map((item, index) => (
                                                                    <>
                                                                        <tr>
                                                                            <td className="text-center">
                                                                                <Checkbox
                                                                                    color='primary'
                                                                                    className='align-self-start'
                                                                                    name={'isSelected'}
                                                                                    checked={item['isSelected']}
                                                                                    disabled={readOnly}
                                                                                    value={item.isSelected}
                                                                                    onChange={handleSelectHoliday((page-1)*recordsPerPage+index)}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <div className='font-size-sm font-weight-normal  text-capitalize '>
                                                                                    <div
                                                                                        title={item?.nameOfHoliday} >
                                                                                        {item?.nameOfHoliday}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <Grid item md={10}>
                                                                                    <MuiPickersUtilsProvider
                                                                                        utils={DateFnsUtils}
                                                                                        style={{ margin: '0%' }}>
                                                                                        <KeyboardDatePicker
                                                                                            style={{ margin: '0%' }}
                                                                                            inputVariant='outlined'
                                                                                            format='dd/MM/yyyy'
                                                                                            margin='normal'
                                                                                            id='outlined-startDate'
                                                                                            fullWidth
                                                                                            size='small'
                                                                                            minDate={minDate}
                                                                                            maxDate={item.endDate&&new Date(item.endDate) instanceof Date && new Date(item.endDate)>new Date(minDate)?new Date(item.endDate):maxDate}
                                                                                            name='startDate'
                                                                                            selected={item['startDate']}
                                                                                            disabled={readOnly}
                                                                                            value={item.startDate}
                                                                                            onChange={holidaySelectStartDate((page-1)*recordsPerPage+index, 'startDate')}
                                                                                            KeyboardButtonProps={{
                                                                                                'aria-label': 'change date'
                                                                                            }}
                                                                                            error={(isSubmitted && item.isSelected && (!item.startDate || new Date(item.startDate)>maxDate || new Date(item.startDate)<minDate || !(new Date(item.startDate) instanceof Date ) || isNaN(new Date(item.startDate)) ||(item.endDate&&new Date(item.endDate) instanceof Date&& new Date(item.endDate)>new Date(minDate) && new Date(item.startDate)>new Date(item.endDate)) ))? true : false}
                                                                                            helperText={
                                                                                                isSubmitted ? ((item.isSelected ?((!item.startDate || item.startDate === '')
                                                                                                    ? 'Field is Mandatory'
                                                                                                    :new Date(item.startDate) instanceof Date && !isNaN(new Date(item.startDate))?(item.endDate&&new Date(item.endDate) instanceof Date && new Date(item.endDate)>new Date(minDate)&&new Date(item.startDate)>new Date(item.endDate)?"StartDate Can not be Greater Than End Date":new Date(item.startDate)>maxDate?"Start Date Can not be Greater than "+maxDate.toLocaleDateString():(new Date(item.startDate)<minDate?"Start Date Can not be Less than "+minDate.toLocaleDateString():'')):"Invalid Date"):''))
                                                                                                :''
                                                                                            }
                                                                                        />
                                                                                    </MuiPickersUtilsProvider>
                                                                                </Grid>
                                                                            </td>
                                                                            <td>
                                                                                <Grid item md={10}>
                                                                                    <MuiPickersUtilsProvider
                                                                                        utils={DateFnsUtils}
                                                                                        style={{ margin: '0%' }}>
                                                                                        <KeyboardDatePicker
                                                                                            style={{ margin: '0%' }}
                                                                                            inputVariant='outlined'
                                                                                            format='dd/MM/yyyy'
                                                                                            margin='normal'
                                                                                            id='outlined-endDate'
                                                                                            fullWidth
                                                                                            size='small'
                                                                                            name='endDate'
                                                                                            minDate={(item.startDate && new Date(item.startDate) instanceof Date && new Date(item.startDate)<new Date(maxDate))?new Date(item.startDate):minDate}
                                                                                            maxDate={maxDate}
                                                                                            selected={item['endDate']}
                                                                                            disabled={readOnly}
                                                                                            value={item.endDate}
                                                                                            onChange={holidaySelectStartDate((page-1)*recordsPerPage+index, 'endDate')}
                                                                                            KeyboardButtonProps={{
                                                                                                'aria-label': 'change date'
                                                                                            }}
                                                                                            error={(isSubmitted && item.isSelected && (!item.endDate || new Date(item.endDate)>maxDate || new Date(item.endDate)<minDate || !(new Date(item.endDate) instanceof Date ) || isNaN(new Date(item.endDate)) ||(item.startDate&&new Date(item.startDate) instanceof Date&& new Date(item.startDate)<new Date(maxDate) && new Date(item.startDate)>new Date(item.endDate)) ))? true : false}
                                                                                            helperText={
                                                                                                isSubmitted ? (item.isSelected ?((!item.endDate || item.endDate === '')
                                                                                                    ? 'Field is Mandatory'
                                                                                                    :new Date(item.endDate) instanceof Date && !isNaN(new Date(item.endDate))?((item.startDate&&new Date(item.startDate) instanceof Date&& new Date(item.startDate)<new Date(maxDate) && new Date(item.startDate)>new Date(item.endDate))?"End Date Can not be Less Than Start Date": new Date(item.endDate)>maxDate?"End Date Can not be Greater than "+maxDate.toLocaleDateString():(new Date(item.endDate)<minDate?"End Date Can not be Less than "+minDate.toLocaleDateString():"")):"Invalid Date"):'')
                                                                                                :''
                                                                                            }
                                                                                        />
                                                                                    </MuiPickersUtilsProvider>
                                                                                </Grid>
                                                                            </td>
                                                                            <td>
                                                                                <Grid item md={12}>
                                                                                    <FormControl
                                                                                        variant='outlined'
                                                                                        fullWidth
                                                                                        size='small'>
                                                                                        <Autocomplete
                                                                                            id='combo-box-demo'
                                                                                            options={holidayTypes}
                                                                                            value={{ value: item.type }}
                                                                                            disabled={readOnly}
                                                                                            name="holidayType"
                                                                                            getOptionLabel={option => option.value}
                                                                                            renderInput={params => (
                                                                                                <TextField
                                                                                                    {...params}
                                                                                                    variant='outlined'
                                                                                                    fullWidth
                                                                                                    size='small'
                                                                                                    error={isSubmitted &&item.isSelected && (item.type ? false : true)}
                                                                                                    helperText={
                                                                                                        isSubmitted &&item.isSelected && (!item.type || item.type === '')
                                                                                                        ? 'Field is Mandatory'
                                                                                                        : ''
                                                                                                    }
                                                                                                />
                                                                                            )}
                                                                                            onChange={(event, value) => {
                                                                                                handleSelectHolidayType((page-1)*recordsPerPage+index, value)
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </Grid>
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
                    </Grid>
                </ScrollBar>
            </Card>
            <div className="pt-4">
                <Button
                    onClick={save}
                    className="btn-primary mx-3 mb-2">
                    <span className="btn-wrapper--label px-5 ">{!uuid ? "Create" : "Update"}</span>
                </Button>
                <Button
                    className='btn-primary mx-3 mb-2'
                    component={NavLink}
                    to='/holidayCalendar'>
                    <span className="btn-wrapper--label px-5 ">Cancel</span>
                </Button>
            </div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={2000}
            />
        </>
    )
}
export default HolidayCalendarConfiguration;