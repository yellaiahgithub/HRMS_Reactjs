import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Container,
  MenuItem,
  Table,
  CardContent,
  MenuList,
  TextField,
  Snackbar
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCompanyData } from '../../actions/index'

import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory, useLocation } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import Alert from '@material-ui/lab/Alert'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setIn } from 'formik'
import { DonutSmallOutlined, SettingsBackupRestore } from '@material-ui/icons'
import { add } from 'date-fns'
import apicaller from 'helper/Apicaller'
import { useDropzone } from 'react-dropzone'

import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import CheckIcon from '@material-ui/icons/Check'

const CreateCompanyData = props => {
  const [files, setFiles] = useState([])
  const [imgSrc, SetImageSrc] = useState('')
  const [newImageUploaded, setNewImageUploaded] = useState(false)
  const [imgObj, setImageObj] = useState()
  const [filePath, setFilePath] = useState()

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    // noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
      setNewImageUploaded(false)
      setFilePath()
      setImageObj()
    }
  })

  const thumbs = files.map(file => (
    <Grid item md={3} className='p-2' key={file.name}>
      <div>
        <div>
          <Box textAlign="right">
            <Button
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                cursor: 'pointer'
              }}
              onClick={() => deleteCompanyLogo()}
              className="btn-neutral-danger mx-1 shadow-none d-30 border-0  d-inline-flex align-items-right justify-content-center ">
              <FontAwesomeIcon
                icon={['fas', 'times']} className="font-size-sm" />
            </Button>
          </Box>
        </div>
        <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm '>
          <img
            className='img-fluid img-fit-container rounded-sm'
            src={file.preview}
            alt='...'
          />
        </div>
      </div>
    </Grid>
  ))

  const deleteCompanyLogo = () => {
    setFiles([])
    if (filePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + filePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            if (res.data) {
              SetImageSrc('')
              setFilePath()
              setNewImageUploaded(false)
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }

  const { setCompanyData } = props

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false
  const saveButtonLabel = edit ? 'Update Company' : 'Create Company'

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const registeredUnder = [
    { value: 'Contract Labour Act' },
    { value: 'Factories Act' },
    { value: 'Mines Act' },
    { value: 'Motor Transport Act' },
    { value: 'Plantation Act' },
    { value: 'Shop & Establishment Act' }
  ]

  const industries = [
    { value: 'Chemicals' },
    { value: 'Consumer' },
    { value: 'Products' },
    { value: 'Energy' },
    { value: 'Engineering' },
    { value: 'Information Technology' },
    { value: 'Manufacturing' },
    { value: 'Materials' },
    { value: 'Other Services' }
  ]

  const phoneTypeArray = [
    { value: 'Business 1' },
    { value: 'Business 2' },
    { value: 'Customer Care' },
    { value: 'Sales' }
  ]

  const addressTypeArray = [
    { value: 'Billing' },
    { value: 'Business' },
    { value: 'Communication' },
    { value: 'Corporate Office' },
    { value: 'Head Office' },
    { value: 'Mailing' },
    { value: 'Others' }
  ]

  const emailTypeArray = [
    { value: 'Business' },
    { value: 'Customer Care' },
    { value: 'Official' },
    { value: 'Sales' }
  ]

  const sectors = [
    { value: 'Autonomous' },
    { value: 'Central Govt.' },
    { value: 'Cooperative' },
    { value: 'Limited Liability Partner' },
    { value: 'Mutual Benefit' },
    { value: 'NGO' },
    { value: 'Other' },
    { value: 'Partnership' },
    { value: 'Private & Public Sector' },
    { value: 'Private Limited' },
    { value: 'Public Limited' },
    { value: 'Section 25 Company' },
    { value: 'Sole Proprietorship' },
    { value: 'State Government' }
  ]

  const currencies = [
    {
      value: 'USD',
      label: '$'
    },
    {
      value: 'EUR',
      label: '€'
    },
    {
      value: 'BTC',
      label: '฿'
    },
    {
      value: 'JPY',
      label: '¥'
    }
  ]

  const languages = [
    {
      value: 'Arabic',
      label: 'Arabic'
    },
    {
      value: 'English',
      label: 'English'
    },
    {
      value: 'French',
      label: 'French'
    },
    {
      value: 'German',
      label: 'German'
    },
    {
      value: 'Greek',
      label: 'Greek'
    },
    {
      value: 'Hindi',
      label: 'Hindi'
    },
    {
      value: 'Russian',
      label: 'Russian'
    },
    {
      value: 'Spanish',
      label: 'Spanish'
    }
  ]

  const shifts = [
    {
      value: 'Permanent',
      label: 'Permanent'
    },
    {
      value: 'Rotating',
      label: 'Rotating'
    },
    {
      value: 'Continuous',
      label: 'Continuous'
    },
    {
      value: 'Discontinuous',
      label: 'Discontinuous'
    },
    {
      value: 'Swing',
      label: 'Swing'
    }
  ]

  const holidays = [
    { value: 'Holiday Calendar 1', label: 'Holiday Calendar 1' },
    { value: 'Holiday Calendar 2', label: 'Holiday Calendar 2' },
    { value: 'Holiday Calendar 3', label: 'Holiday Calendar 3' },
    { value: 'Holiday Calendar 4', label: 'Holiday Calendar 4' }
  ]
  const history = useHistory()

  const companyPhoneNumbersData = [
    {
      phoneType: '',
      phoneNumber: '',
      extension: '',
      asOfDate: new Date(),
      status: 'Active',
      preferred: true
    }
  ]

  const companyEmailData = [
    {
      emailType: '',
      email: '',
      preferred: true
    }
  ]

  const companyAddressData = [
    {
      addressType: '',
      address: '',
      asOfDate: new Date(),
      status: 'Active',
      preferred: true
    }
  ]

  const [blocking, setBlocking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()
  const [inputs, setInputs] = useState({})
  const [companyPhoneNumbers, setCompanyPhoneNumber] = useState(
    companyPhoneNumbersData
  )
  const [companyEmails, setCompanyEmails] = useState(companyEmailData)
  const [companyAddress, setCompanyAddress] = useState(companyAddressData)
  const [sector, setSector] = useState('')
  const [industry, setIndustry] = useState('')
  const [registerUnder, setRegisterUnder] = useState('')
  const [customers, setCustomers] = useState([])
  const [companyID, setId] = useState()
  const [officialLanguage, setLanguage] = useState(null)
  const [languageName, setLanguageName] = useState('')
  const [defaultCurrency, setCurrency] = useState(null)
  const [currencyName, setCurrencyName] = useState('')
  const [shiftPattern, setShift] = useState(null)
  const [shiftName, setShiftName] = useState('')
  const [customerUUID, setCustomerUUID] = useState(null)
  const [customerUUIDSubmit, setCustomerUUIDForSubmit] = useState('')
  const [holidayCalendar, setHoliday] = useState(null)
  const [holidayName, setHolidayName] = useState('')
  const [errorPhoneMsg, setErrorPhoneMsg] = useState('')
  const [errorAddMsg, setErrorAddMsg] = useState('')
  const [errorEmailMsg, setErrorEmailMsg] = useState('')
  const [validDate, setValidDate] = useState(true)
  const [registrationDate, setRegistrationDate] = useState(null)
  const [phoneDateValid, setPhoneDateValid] = useState(true)
  const [addressDateValid, setAddressDateValid] = useState(true)
  const [statusList, setStatusList] = useState([])

  useEffect(() => {
    if (id) {
      setBlocking(true)
      getCompanyData()
      setStatusList([{ value: 'Active' }, { value: 'Inactive' }])
    } else {
      getCustomers('')
      setStatusList([{ value: 'Active' }])
    }
  }, [])

  const getCompanyData = () => {
    apicaller('get', `${BASEURL}/company/by?uuid=` + id)
      .then(res => {
        setBlocking(false)
        const respData = res.data[0]
        if (res.status === 200) {
          // To set company data in redux store
          // let companyData = {
          //   companyId: respData.companyId,
          //   companyName: respData.companyName,
          //   registrationDate: respData.registrationDate,
          //   subdomainName: respData.subdomainName
          // }
          // setCompanyData(companyData)

          setCompanyDBSession(respData.companyName)

          const inputObj = {
            companyName: respData.companyName,
            subdomainName: respData.subdomainName,
            registrationDate: respData.registrationDate
              ? setRegistrationDate(
                new Date(respData.registrationDate).toLocaleDateString()
              )
              : '',
            corporateIdentityNumber: respData.corporateIdentityNumber,
            ROCRegisteredNumber: respData.ROCRegisteredNumber,
            ROCCode: respData.ROCCode,
            registeredDate: respData.registeredDate
              ? new Date(respData.registeredDate).toLocaleDateString()
              : '',
            companyPAN: respData.companyPAN,
            PANRegisteredDate: respData.PANRegisteredDate
              ? new Date(respData.PANRegisteredDate).toLocaleDateString()
              : '',
            PFAccountNumber: respData.PFAccountNumber,
            PFRegisteredDate: respData.PFRegisteredDate
              ? new Date(respData.PFRegisteredDate).toLocaleDateString()
              : '',
            ESIAccountNumber: respData.ESIAccountNumber,
            ESIRegisteredDate: respData.ESIRegisteredDate
              ? new Date(respData.ESIRegisteredDate).toLocaleDateString()
              : '',
            retirementAge: respData.retirementAge
          }
          setInputs(inputObj)
          if (respData.companyPhoneNumbers?.length > 0) {
            setCompanyPhoneNumber(respData.companyPhoneNumbers)
          } else {
            setCompanyPhoneNumber(companyPhoneNumbersData)
          }
          if (respData.companyPhysicalAddress?.length > 0) {
            setCompanyAddress(respData.companyPhysicalAddress)
          } else {
            setCompanyAddress(companyAddressData)
          }
          if (respData.companyEmailAddress?.length > 0) {
            setCompanyEmails(respData.companyEmailAddress)
          } else {
            setCompanyEmails(companyEmailData)
          }
          setSector(respData.sector)
          setIndustry(respData.industry)
          setRegisterUnder(respData.registeredUnder)
          setLanguage(
            languages.findIndex(x => x.value === respData.officialLanguage)
          )
          setLanguageName(respData.officialLanguage)
          setCurrency(
            currencies.findIndex(x => x.value === respData.defaultCurrency)
          )
          setCurrencyName(respData.currencyName)
          setShift(shifts.findIndex(x => x.value === respData.shiftPattern))
          setShiftName(respData.shiftPattern)
          setHoliday(
            holidays.findIndex(x => x.value === respData.holidayCalendar)
          )
          setHolidayName(respData.holidayCalendar)
          setCustomerUUIDForSubmit(respData.customer[0]?.uuid)
          setId(respData.companyId)
          getCustomers(respData.customerUUID)
          setCompanyCreatedDate(respData.createdAt)

          checkIfLogoUploadedOrNot(respData)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get customer err', err)
        getCustomers('')
      })
  }

  const checkIfLogoUploadedOrNot = companyData => {
    if (Object.keys(companyData.file).length > 0) {
      setBlocking(true)
      let path = companyData.file.filePath + '/' + companyData.file.fileName
      setFilePath(path)
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)

            if (res.data) {
              let baseStr64 = res.data
              let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
              // Set the source of the Image to the base64 string
              SetImageSrc(imgSrc64)
              setNewImageUploaded(true)
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }

  const setCompanyDBSession = companyName => {
    apicaller('post', `${BASEURL}/admin/updateSession`, {
      companyName: companyName
    })
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
        }
      })
      .catch(err => {
        console.log('updateSession err', err)
      })
  }

  const [isCompData, setCompData] = useState(false)
  const [createdDate, setCompanyCreatedDate] = useState(new Date())

  const getCustomers = customerUUID => {
    apicaller('get', `${BASEURL}/customer`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setCustomers(res.data)
          setCompData(true)
          if (customerUUID && customerUUID !== '') {
            setCustomerUUID(res.data.findIndex(x => x.uuid === customerUUID))
          }
        }
      })
      .catch(err => {
        console.log('getCustomers err', err)
      })
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleCompanyPhoneNumberData = (index, name) => e => {
    let value = '';
    if (e?.target && e?.target?.value) {
      // in case of dropdpwn
      value = e.target.value;
    } else if (e) {
      // in case of calendar
      value = e;
    }
    
    if (name == 'preferred') {
      const result = companyPhoneNumbers.map((item, i) => {
        if (index !== i) {
          return { ...item, [name]: false }
        } else {
          return { ...item, [name]: true }
        }
      })
      const newArray = result.map((item, i) => {
        return item
      })
      setCompanyPhoneNumber(newArray)
    } else {
      const newArray = companyPhoneNumbers.map((item, i) => {
        if (index === i) {
          return { ...item, [name]: value }
        } else {
          return item
        }
      })
      setCompanyPhoneNumber(newArray)

      setTimeout(() => {
        if (name == 'asOfDate') {
          validatePhoneDateWithRegisteredDate(value, index)
        }
      }, 1000)
    }
  }

  const handleCompanyEmailData = index => e => {
    if (e.target.name == 'preferred') {
      const result = companyEmails.map((item, i) => {
        if (index !== i) {
          return { ...item, [e.target.name]: false }
        } else {
          return { ...item, [e.target.name]: true }
        }
      })
      const newArray = result.map((item, i) => {
        return item
      })
      setCompanyEmails(newArray)
    } else {
      const newArray = companyEmails.map((item, i) => {
        if (index === i) {
          return { ...item, [e.target.name]: e.target.value }
        } else {
          return item
        }
      })
      setCompanyEmails(newArray)
    }
  }

  const handleCompanyAddressData = (index, name) => e => {
    let value = '';
    if (e.target && e.target.value.length>=0) {
      // in case of dropdpwn
      value = e.target.value;
    } else if (e) {
      // in case of calendar
      value = e;
    }
    if (name == 'preferred') {
      const result = companyAddress.map((item, i) => {
        if (index !== i) {
          return { ...item, [name]: false }
        } else {
          return { ...item, [name]: true }
        }
      })
      const newArray = result.map((item, i) => {
        return item
      })
      setCompanyAddress(newArray)
    } else {
      const newArray = companyAddress.map((item, i) => {
        if (index === i) {
          return { ...item, [name]: value }
        } else {
          return item
        }
      })
      setCompanyAddress(newArray)
      setTimeout(() => {
        if (name == 'asOfDate') {
          validateAddressDateWithRegisteredDate(value, index)
        }
      }, 1000)
    }
  }

  const uploadImage = () => {
    setBlocking(true)
    let path = 'logo'
    let formData = new FormData()
    formData.append('file', files[0])
    formData.append('documentType', 'company')

    apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setImageObj(res.data)

          let path = res.data.filePath + '/' + res.data.fileName
          setFilePath(path)

          setState({
            open: true,
            message: 'Image Uploaded Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('Iamge Upload err', err)
        setState({
          open: true,
          message: 'err',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }

  const handleSubmit = event => {
    event.preventDefault()
    setIsSubmitted(true)
    setErrorPhoneMsg('')
    setErrorAddMsg('')
    setErrorEmailMsg('')
    const phoneObj = companyPhoneNumbers.find(o => o.preferred === true)
    const addObj = companyAddress.find(o => o.preferred === true)
    const emailObj = companyEmails.find(o => o.preferred === true)
    let phonenoValid, emailValid, addValid

    let phoneData = [...companyPhoneNumbers]
    let addData = [...companyAddress]
    let emailData = [...companyEmails]

    // for (let i = 0; i <= companyPhoneNumbers.length; ++i) {
    //   if (phoneData[i]) {
    //     Object.values(phoneData[i]).every(value => {
    //       if (value === null || value === '') {
    //         phoneData.splice(i, 1)
    //       }
    //     })
    //   }
    // }

    // for (let i = 0; i <= companyAddress.length; ++i) {
    //   if (addData[i]) {
    //     Object.values(addData[i]).every(value => {
    //       if (value === null || value === '' || value === false) {
    //         addData.splice(i, 1)
    //       }
    //     })
    //   }
    // }

    // for (let i = 0; i <= companyEmails.length; ++i) {
    //   if (emailData[i]) {
    //     Object.values(emailData[i]).every(value => {
    //       if (value === null || value === '') {
    //         emailData.splice(i, 1)
    //       }
    //     })
    //   }
    // }

    if (!customerUUIDSubmit) {
      setState({
        open: true,
        message: 'Customer is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    } else if (!inputs.companyName) {
      setState({
        open: true,
        message: 'Company Name is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    } else if (!inputs.subdomainName) {
      setState({
        open: true,
        message: 'Sub Domain Name is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    } else if (!inputs.retirementAge) {
      setState({
        open: true,
        message: 'Retirement Age is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
    if (!phoneObj) {
      setErrorPhoneMsg('Any one Phone Number should be selected as Preferred')
    } else if (phoneObj) {
      for(let phone of companyPhoneNumbers){
        for (var key in phone) {
          if (key != 'extension') {
            if (phone[key] == null || phone[key] == '') {
              setErrorPhoneMsg('Phone fields are required')
              return
            } else {
              phonenoValid = true
              setErrorPhoneMsg('')
            }
          }
        }
      }
      if (!phoneDateValid) {
        setErrorPhoneMsg('Effective date of phone should not be less than the registration date')
      }
    }

    if (!addObj) {
      setErrorAddMsg('Any one Physical Address should be selected as Preferred')
    } else if (addObj) {
      for(let address of companyAddress){
        for (var key in address) {
          if (address[key] == null || address[key] == '') {
            setErrorAddMsg('Address fields are required')
            return
          } else {
            addValid = true
            setErrorAddMsg('')
          }
        }
      }
      if (!addressDateValid) {
        setErrorAddMsg('Effective date of address should not be less than the registration date')
      }
    }

    if (!emailObj) {
      setErrorEmailMsg('Any one Email Address should be selected as Preferred')
    } else if (emailObj) {
      for(let email of companyEmails){
        for (var key in email) {
          if (email[key] == null || email[key] == '') {
            setErrorEmailMsg('Email fields are required')
            return
          } else {
            emailValid = true
            setErrorEmailMsg('')
          }
        }
      }
    }

    if (
      customerUUIDSubmit &&
      inputs.companyName &&
      inputs.subdomainName &&
      inputs.retirementAge &&
      phonenoValid &&
      addValid &&
      emailValid &&
      validDate
    ) {
      inputs['registrationDate'] = registrationDate
      inputs['officialLanguage'] = languageName
      inputs['shiftPattern'] = shiftName
      inputs['holidayCalendar'] = holidayName
      inputs['defaultCurrency'] = currencyName
      inputs['companyPhoneNumbers'] = phoneData
      inputs['companyPhysicalAddress'] = addData
      inputs['companyEmailAddress'] = emailData
      inputs['sector'] = sector
      inputs['industry'] = industry
      inputs['registeredUnder'] = registerUnder
      inputs['customerUUID'] = customerUUIDSubmit
      inputs['file'] = imgObj ? imgObj : {}
      if (!edit) {
        setBlocking(true)
        apicaller('post', `${BASEURL}/company`, inputs)
          .then(res => {
            if (res.status === 200) {
              setBlocking(false)
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'err',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
              history.push('/company')
            }
          })
          .catch(err => {
            setBlocking(false)
            console.log('create company err', err)
          })
      } else {
        setBlocking(true)
        apicaller('patch', `${BASEURL}/company/${companyID}`, inputs)
          .then(res => {
            if (res.status === 200) {
              setBlocking(false)

              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'Company Updated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              history.push('/company')
            }
          })
          .catch(err => {
            setBlocking(false)
            console.log('create company err', err)
          })
      }
    }
  }

  const handleAddPhoneClick = () => {
    setCompanyPhoneNumber([
      ...companyPhoneNumbers,
      {
        phoneNumber: '',
        extension: '',
        asOfDate: new Date(),
        status: 'Active',
        preferred: '',
        phoneType: ''
      }
    ])
  }

  const handleRemovePhoneClick = i => {
    const list = [...companyPhoneNumbers]
    list.splice(i, 1)
    setCompanyPhoneNumber(list)
  }

  const handleAddEmailsClick = () => {
    setCompanyEmails([
      ...companyEmails,
      { emailType: '', email: '', preferred: false }
    ])
  }

  const handleRemoveEmailClick = i => {
    const list = [...companyEmails]
    list.splice(i, 1)
    setCompanyEmails(list)
  }

  const handleAddAddressClick = () => {
    setCompanyAddress([
      ...companyAddress,
      {
        addressType: '',
        address: '',
        asOfDate: new Date(),
        status: 'Active',
        preferred: false
      }
    ])
  }

  const handleRemoveAddressClick = i => {
    const list = [...companyAddress]
    list.splice(i, 1)
    setCompanyAddress(list)
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const validateUpdateDate = date => {
    if (date && !isNaN(Date.parse(date))) {
      if (new Date(date) > createdDate) {
        setValidDate(false)
      } else {
        setValidDate(true)
      }
    } else {
      if (date) setValidDate(false)
      else setValidDate(true)
    }
  }

  const validateDate = date => {
    if (date && !isNaN(Date.parse(date))) {
      if (new Date(date) > new Date()) {
        setValidDate(false)
      } else {
        setValidDate(true)
      }
    } else {
      if (date) setValidDate(false)
      else setValidDate(true)
    }
  }

  const validateAddressDateWithRegisteredDate = (date, index) => {
    if (registrationDate) {
      if (date && !isNaN(Date.parse(date))) {
        if (new Date(date) < new Date(registrationDate)) {
          setAddressDateValid(false)
          companyAddress[index]['addressDateNotValid'] = true
          companyAddress[index]['asOfDate'] = date

          const newArray = companyAddress.map((item, i) => {
            return item
          })
          setCompanyAddress(newArray)
        } else {
          delete companyAddress[index]['addressDateNotValid']
          companyAddress[index]['asOfDate'] = date

          const newArray = companyAddress.map((item, i) => {
            return item
          })
          setCompanyAddress(newArray)
          setAddressDateValid(true)
        }
      } else {
        if (date) setAddressDateValid(false)
        else setAddressDateValid(true)
      }
    }
  }

  const validatePhoneDateWithRegisteredDate = (date, index) => {
    if (registrationDate) {
      if (date && !isNaN(Date.parse(date))) {
        if (new Date(date) < new Date(registrationDate)) {
          setPhoneDateValid(false)
          companyPhoneNumbers[index]['phoneDateNotValid'] = true
          companyPhoneNumbers[index]['asOfDate'] = date

          const newArray = companyPhoneNumbers.map((item, i) => {
            return item
          })
          setCompanyPhoneNumber(newArray)
        } else {
          delete companyPhoneNumbers[index]['phoneDateNotValid']
          companyPhoneNumbers[index]['asOfDate'] = date

          const newArray = companyPhoneNumbers.map((item, i) => {
            return item
          })
          setCompanyPhoneNumber(newArray)
          setPhoneDateValid(true)
        }
      } else {
        if (date) setPhoneDateValid(false)
        else setPhoneDateValid(true)
      }
    }
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item md={10} lg={7} xl={10} className='mx-auto'>
              <div className='bg-white p-4 rounded'>
                <div className='text-center my-4'>
                  <h4 className='mb-1 '>{saveButtonLabel}</h4>
                </div>
                <br />
                {edit ? (
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <div>
                        <label className=' mb-2'>Company ID</label>
                        <TextField
                          style={{ background: 'lightgrey' }}
                          id='outlined-companyId'
                          placeholder='Company Id'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='companyId'
                          value={companyID}
                          disabled={true}></TextField>
                      </div>
                    </Grid>
                  </Grid>
                ) : null}

                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <div>
                      <label className=' mb-2'>Company Name *</label>
                      <TextField
                        id='outlined-companyName'
                        placeholder='Company Name'
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='companyName'
                        value={inputs.companyName}
                        onChange={handleChange}
                        error={isSubmitted && !inputs.companyName}
                        helperText={
                          isSubmitted &&
                          (inputs.companyName ? '' : 'Company Name is Required')
                        }
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Sub Domain Name *</label>
                      <TextField
                        id='outlined-subdomainName'
                        placeholder='Sub Domain Name'
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='subdomainName'
                        disabled={readOnly || edit}
                        value={inputs.subdomainName}
                        onChange={handleChange}
                        error={isSubmitted && !inputs.subdomainName}
                        helperText={
                          isSubmitted &&
                          (inputs.subdomainName
                            ? ''
                            : 'Sub Domian Name is Required')
                        }
                      />
                    </div>
                  </Grid>

                  <Grid item md={6}>
                    <div>
                      {isCompData ? (
                        <>
                          <label className=' mb-2'>Select Customer *</label>
                          <Autocomplete
                            id='combo-box-demo'
                            options={customers}
                            // defaultValue={customers[customerUUID] || ''}
                            value={customers[customerUUID] || ''}
                            getOptionLabel={option => option.customerName}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='customerUUID'
                                value={customers[customerUUID] || ''}
                                error={isSubmitted && customerUUID != ''}
                                helperText={
                                  isSubmitted &&
                                  (customerUUID == null
                                    ? 'Customer is Required'
                                    : '')
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              setCustomerUUID(
                                customers.findIndex(x => x.uuid === value?.uuid)
                              )
                              setCustomerUUIDForSubmit(value?.uuid)
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <label className=' mb-2'>Select Customer</label>
                          <TextField
                            id='outlined-company'
                            placeholder='Select'
                            variant='outlined'
                            fullWidth
                            size='small'
                          />
                        </>
                      )}
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Sector</label>
                      <TextField
                        id='outlined-sector'
                        label='Select'
                        variant='outlined'
                        fullWidth
                        select
                        size='small'
                        name='sector'
                        value={sector}
                        onChange={event => {
                          setSector(event.target.value)
                        }}>
                        {sectors.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Industry</label>
                      <TextField
                        variant='outlined'
                        fullWidth
                        id='outlined-industry'
                        select
                        label='Select'
                        size='small'
                        name='industry'
                        value={industry}
                        onChange={event => {
                          setIndustry(event.target.value)
                        }}>
                        {industries.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      {edit ? (
                        <>
                          <label className=' mb-2'>Registration Date</label>
                          <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            style={{ margin: '0%' }}>
                            <KeyboardDatePicker
                              style={{ margin: '0%' }}
                              inputVariant='outlined'
                              format='dd/MM/yyyy'
                              margin='normal'
                              id='date-picker-inline'
                              maxDate={new Date(createdDate)}
                              fullWidth
                              size='small'
                              value={registrationDate}
                              onChange={event => {
                                validateUpdateDate(event)
                                setRegistrationDate(event)
                              }}
                              helperText={
                                registrationDate &&
                                  registrationDate instanceof Date &&
                                  new Date(registrationDate) >
                                  new Date(createdDate)
                                  ? "Registration Date Cannot be greater than company's registered date"
                                  : null
                              }
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </>
                      ) : (
                        <>
                          <label className=' mb-2'>Registration Date *</label>
                          <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            style={{ margin: '0%' }}>
                            <KeyboardDatePicker
                              style={{ margin: '0%' }}
                              inputVariant='outlined'
                              format='dd/MM/yyyy'
                              margin='normal'
                              id='date-picker-inline'
                              // maxDate={new Date()}
                              fullWidth
                              size='small'
                              value={registrationDate}
                              onChange={event => {
                                validateDate(event)
                                setRegistrationDate(event)
                              }}
                              error={
                                isSubmitted
                                  ? registrationDate
                                    ? registrationDate !== null &&
                                      registrationDate instanceof Date &&
                                      new Date(registrationDate) > new Date()
                                      ? "Registration Date Cannot be greater than today's Date"
                                      : null
                                    : 'Registration Date Required'
                                  : registrationDate !== null &&
                                    registrationDate instanceof Date &&
                                    new Date(registrationDate) > new Date()
                                    ? "Registration Date Cannot be greater than today's Date"
                                    : null
                                      ? !isSubmitted
                                      : registrationDate !== null &&
                                        registrationDate instanceof Date &&
                                        new Date(registrationDate) > new Date()
                                        ? "Registration Date Cannot be greater than today's Date"
                                        : null
                              }
                              helperText={
                                isSubmitted
                                  ? registrationDate
                                    ? registrationDate !== null &&
                                      registrationDate instanceof Date &&
                                      new Date(registrationDate) > new Date()
                                      ? "Registration Date Cannot be greater than today's Date"
                                      : null
                                    : 'Registration Date Required'
                                  : registrationDate !== null &&
                                    registrationDate instanceof Date &&
                                    new Date(registrationDate) > new Date()
                                    ? "Registration Date Cannot be greater than today's Date"
                                    : null
                                      ? !isSubmitted
                                      : registrationDate !== null &&
                                        registrationDate instanceof Date &&
                                        new Date(registrationDate) > new Date()
                                        ? "Registration Date Cannot be greater than today's Date"
                                        : null
                              }
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </>
                      )}
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Company Pan</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        name='companyPAN'
                        placeholder='Company Pan'
                        value={inputs.companyPAN}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>CIN</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        placeholder='CIN'
                        name='corporateIdentityNumber'
                        value={inputs.corporateIdentityNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Pan Registered Date</label>
                      <TextField
                        id='outlined-panRegistrationDate'
                        placeholder='Registration Date'
                        type='text'
                        onFocus={e => (e.currentTarget.type = 'date')}
                        onBlur={e => (e.currentTarget.type = 'text')}
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='PANRegisteredDate'
                        value={inputs.PANRegisteredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>ROC Registered No.</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        placeholder='ROC Registered No.'
                        name='ROCRegisteredNumber'
                        value={inputs.ROCRegisteredNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>ROC Code</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        placeholder='ROC Code'
                        name='ROCCode'
                        value={inputs.ROCCode}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Registered Under</label>
                      <TextField
                        variant='outlined'
                        fullWidth
                        id='outlined-industry'
                        select
                        label='Select'
                        size='small'
                        name='registeredUnder'
                        value={registerUnder}
                        onChange={event => {
                          setRegisterUnder(event.target.value)
                        }}>
                        {registeredUnder.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Registered Date</label>
                      <TextField
                        id='outlined-registeredDate'
                        placeholder='Registered Date'
                        type='text'
                        onFocus={e => (e.currentTarget.type = 'date')}
                        onBlur={e => (e.currentTarget.type = 'text')}
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='registeredDate'
                        value={inputs.registeredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>PF Account No.</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        placeholder='PF Account No.'
                        name='PFAccountNumber'
                        value={inputs.PFAccountNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>PF Registered Date</label>
                      <TextField
                        id='outlined-pfRegistrationDate'
                        placeholder='PF Registered Date'
                        type='text'
                        onFocus={e => (e.currentTarget.type = 'date')}
                        onBlur={e => (e.currentTarget.type = 'text')}
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='PFRegisteredDate'
                        value={inputs.PFRegisteredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>ESI Account No.</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        placeholder='ESI Account No.'
                        name='ESIAccountNumber'
                        value={inputs.ESIAccountNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>ESI Registered Date</label>
                      <TextField
                        id='outlined-ESIRegistratedDate'
                        placeholder=' ESI Registered Date'
                        type='text'
                        onFocus={e => (e.currentTarget.type = 'date')}
                        onBlur={e => (e.currentTarget.type = 'text')}
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='ESIRegisteredDate'
                        value={inputs.ESIRegisteredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Default Currency</label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={currencies}
                        // defaultValue={currencies[defaultCurrency]}
                        getOptionLabel={option => option.value}
                        value={currencies[defaultCurrency] || ''}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='defaultCurrency'
                            value={currencies[defaultCurrency] || ''}
                          />
                        )}
                        onChange={(event, value) => {
                          setCurrency(
                            currencies.findIndex(x => x.value === value?.value)
                          )
                          setCurrencyName(value?.value)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Official Language</label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={languages}
                        getOptionLabel={option => option.value}
                        // defaultValue={languages[officialLanguage] || ''}
                        value={languages[officialLanguage] || ''}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='officialLanguage'
                            value={languages[officialLanguage] || ''}
                          />
                        )}
                        onChange={(event, value) => {
                          setLanguage(
                            languages.findIndex(x => x.value === value?.value)
                          )
                          setLanguageName(value?.value)
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Shift Pattern</label>
                    </div>
                    <Autocomplete
                      id='combo-box-demo'
                      options={shifts}
                      getOptionLabel={option => option.value}
                      // defaultValue={shifts[shiftPattern] || ''}
                      value={shifts[shiftPattern] || ''}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='shiftPattern'
                          value={shifts[shiftPattern] || ''}
                        />
                      )}
                      onChange={(event, value) => {
                        setShift(
                          shifts.findIndex(x => x.value === value?.value)
                        )
                        setShiftName(value?.value)
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Holiday Calendar</label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={holidays}
                        getOptionLabel={option => option.value}
                        // defaultValue={holidays[holidayCalendar]  || ''}
                        value={holidays[holidayCalendar] || ''}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='holidayCalendar'
                            value={holidays[holidayCalendar] || ''}
                          />
                        )}
                        onChange={(event, value) => {
                          setHoliday(
                            holidays.findIndex(x => x.value === value?.value)
                          )
                          setHolidayName(value?.value)
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Retirement Age *</label>
                      <TextField
                        variant='outlined'
                        size='small'
                        fullWidth
                        name='retirementAge'
                        type='number'
                        placeholder='Retirement Age'
                        value={inputs.retirementAge}
                        onChange={handleChange}
                        error={isSubmitted && !inputs.retirementAge}
                        helperText={
                          isSubmitted &&
                          (inputs.retirementAge
                            ? ''
                            : 'Retirement Age is Required')
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Card
            style={{
              padding: '25px',
              border: '1px solid #c4c4c4',
              margin: '25px'
            }}>
            <div className='card-header'>
              <div className='card-header--title'>
                <p>
                  Company Phone Number
                  <br></br>
                  <small style={{ color: 'red' }}>{errorPhoneMsg}</small>
                </p>
              </div>
            </div>

            <CardContent className='p-0'>
              <div className='table-responsive-md'>
                <Table className='table table-hover table-striped text-nowrap mb-0'>
                  <thead className='thead-light'>
                    <tr>
                      <th style={{ width: '20%' }} className='text-center'>
                        Phone Type
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Phone Number
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Extension
                      </th>
                      <th style={{ width: '30%' }} className='text-center'>
                        As Of Date
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Status
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Prefferred
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyPhoneNumbers.map((item, idx) => (
                      <tr>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              fullWidth
                              id={`outlined-phoneType${idx}`}
                              select
                              label='Select'
                              size='small'
                              name='phoneType'
                              value={item?.phoneType}
                              onChange={handleCompanyPhoneNumberData(idx,'phoneType' )}
                              helperText={
                                isSubmitted && item?.phoneType == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.phoneType == ''
                                  ? true
                                  : false
                              }>
                              {phoneTypeArray.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              size='small'
                              fullWidth
                              name='phoneNumber'
                              value={item?.phoneNumber}
                              inputProps={{ type: 'number' }}
                              onChange={handleCompanyPhoneNumberData(idx,'phoneNumber')}
                              helperText={
                                isSubmitted && item?.phoneNumber == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.phoneNumber == ''
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              size='small'
                              fullWidth
                              name='extension'
                              value={item?.extension}
                              onChange={handleCompanyPhoneNumberData(idx,'extension')}
                            // helperText={
                            //   item?.preferred && item?.extension == ''
                            //     ? true
                            //     : false
                            // }
                            // error={
                            //   item?.preferred && item?.extension == ''
                            //     ? true
                            //     : false
                            // }
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            {' '}
                            <MuiPickersUtilsProvider
                              utils={DateFnsUtils}
                              style={{ margin: '0%' }}>
                              <KeyboardDatePicker
                                style={{ margin: '0%' }}
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id={`outlined-phoneDate${idx}`}
                                fullWidth
                                size="small"
                                name='asOfDate'
                                value={item?.asOfDate}
                                onChange={handleCompanyPhoneNumberData(idx, 'asOfDate')}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}
                                helperText={
                                  item.phoneDateNotValid
                                    ? 'Effective date of phone should not be less than the registration date' : '' ||
                                      item?.preferred && item?.asOfDate == ''
                                      ? true
                                      : false
                                }
                                error={
                                  item.phoneDateNotValid ||
                                    (item?.preferred && item?.asOfDate == '')
                                    ? true
                                    : false
                                } />
                            </MuiPickersUtilsProvider>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              fullWidth
                              id={`outlined-phoneStatus${idx}`}
                              select
                              label='Select'
                              size='small'
                              name='status'
                              value={item?.status}
                              onChange={e => {
                                if (e.target.value == 'Inactive') {
                                  const result = companyPhoneNumbers.map(
                                    (item, i) => {
                                      if (idx == i) {
                                        return {
                                          ...item,
                                          ['preferred']: false,
                                          [e.target.name]: e.target.value
                                        }
                                      } else {
                                        return item
                                      }
                                    }
                                  )
                                  const newArray = result.map((item, i) => {
                                    return item
                                  })
                                  setCompanyPhoneNumber(newArray)
                                } else {
                                  const result = companyPhoneNumbers.map(
                                    (item, i) => {
                                      if (idx == i) {
                                        return {
                                          ...item,
                                          [e.target.name]: e.target.value
                                        }
                                      } else {
                                        return item
                                      }
                                    }
                                  )
                                  const newArray = result.map((item, i) => {
                                    return item
                                  })
                                  setCompanyPhoneNumber(newArray)
                                }
                              }}
                              helperText={
                                isSubmitted && item?.status == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.status == ''
                                  ? true
                                  : false
                              }>
                              {statusList.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Checkbox
                              checked={item?.preferred}
                              color='primary'
                              id={`phoneCheckbox${idx}`}
                              className='align-self-start'
                              name='preferred'
                              disabled={item?.status == 'Inactive'}
                              value={item?.preferred}
                              onChange={handleCompanyPhoneNumberData(idx, 'preferred')}
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Button
                              onClick={handleAddPhoneClick}
                              className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'plus']}
                                className='font-size-sm'
                              />
                            </Button>
                            <Button
                              disabled={item?.preferred}
                              onClick={() => handleRemovePhoneClick(idx)}
                              className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'times']}
                                className='font-size-sm'
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className='divider' />
              <div className='divider' />
            </CardContent>
          </Card>
          <Card
            style={{
              padding: '25px',
              border: '1px solid #c4c4c4',
              margin: '25px'
            }}>
            <div className='card-header'>
              <div className='card-header--title'>
                <p>
                  Company Physical Address
                  <br></br>
                  <small style={{ color: 'red' }}>{errorAddMsg}</small>
                </p>
              </div>
            </div>
            <CardContent className='p-0'>
              <div className='table-responsive-md'>
                <Table className='table table-hover table-striped text-nowrap mb-0'>
                  <thead className='thead-light'>
                    <tr>
                      <th style={{ width: '20%' }} className='text-center'>
                        Address Type
                      </th>
                      <th style={{ width: '40%' }} className='text-center'>
                        Address
                      </th>
                      <th style={{ width: '30%' }} className='text-center'>
                        As Of Date
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Status
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Prefferred
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyAddress.map((item, idx) => (
                      <tr>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              fullWidth
                              id='outlined-addressType1'
                              select
                              label='Select'
                              size='small'
                              name='addressType'
                              value={item?.addressType}
                              onChange={handleCompanyAddressData(idx, 'addressType')}
                              helperText={
                                isSubmitted && item?.addressType == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.addressType == ''
                                  ? true
                                  : false
                              }>
                              {addressTypeArray.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              size='small'
                              fullWidth
                              name='address'
                              value={item?.address}
                              onChange={handleCompanyAddressData(idx,'address')}
                              helperText={
                                isSubmitted && item?.address == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.address == ''
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <MuiPickersUtilsProvider
                              utils={DateFnsUtils}
                              style={{ margin: '0%' }}>
                              <KeyboardDatePicker
                                style={{ margin: '0%' }}
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                fullWidth
                                size="small"
                                value={item?.asOfDate}
                                onChange={
                                  // setAsOfDate(event)
                                  handleCompanyAddressData(idx,'asOfDate')
                                }
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}
                                helperText={
                                  item.addressDateNotValid
                                    ? 'Effective date of address should not be less than the registration date' : '' ||
                                      item?.preferred && item?.asOfDate == ''
                                      ? true
                                      : false
                                }
                                error={
                                  item.addressDateNotValid ||
                                    (item?.preferred && item?.asOfDate == '')
                                    ? true
                                    : false
                                } />
                            </MuiPickersUtilsProvider>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              fullWidth
                              id='outlined-addressStatus1'
                              select
                              label='Select'
                              size='small'
                              name='status'
                              value={item?.status}
                              onChange={e => {
                                if (e.target.value == 'Inactive') {
                                  const result = companyAddress.map(
                                    (item, i) => {
                                      if (idx == i) {
                                        return {
                                          ...item,
                                          ['preferred']: false,
                                          [e.target.name]: e.target.value
                                        }
                                      } else {
                                        return item
                                      }
                                    }
                                  )
                                  const newArray = result.map((item, i) => {
                                    return item
                                  })
                                  setCompanyAddress(newArray)
                                } else {
                                  const result = companyAddress.map(
                                    (item, i) => {
                                      if (idx == i) {
                                        return {
                                          ...item,
                                          [e.target.name]: e.target.value
                                        }
                                      } else {
                                        return item
                                      }
                                    }
                                  )
                                  const newArray = result.map((item, i) => {
                                    return item
                                  })
                                  setCompanyAddress(newArray)
                                }
                              }}
                              helperText={
                                isSubmitted && item?.status == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.status == ''
                                  ? true
                                  : false
                              }>
                              {statusList.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Checkbox
                              checked={item?.preferred}
                              color='primary'
                              id='CustomCheckbox3'
                              className='align-self-start'
                              name='preferred'
                              disabled={item?.status == 'Inactive'}
                              value={item?.preferred}
                              onChange={handleCompanyAddressData(idx, 'preferred')}
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Button
                              onClick={handleAddAddressClick}
                              className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'plus']}
                                className='font-size-sm'
                              />
                            </Button>
                            <Button
                              disabled={item?.preferred}
                              onClick={() => handleRemoveAddressClick(idx)}
                              className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'times']}
                                className='font-size-sm'
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className='divider' />
              <div className='divider' />
            </CardContent>
          </Card>

          <Card
            style={{
              padding: '25px',
              border: '1px solid #c4c4c4',
              margin: '25px'
            }}>
            <div className='card-header'>
              <div className='card-header--title'>
                <p>
                  Company Email Address
                  <br></br>
                  <small style={{ color: 'red' }}>{errorEmailMsg}</small>
                </p>
              </div>
            </div>
            <CardContent className='p-0'>
              <div className='table-responsive-md'>
                <Table className='table table-hover table-striped text-nowrap mb-0'>
                  <thead className='thead-light'>
                    <tr>
                      <th style={{ width: '20%' }} className='text-center'>
                        Email Type
                      </th>
                      <th style={{ width: '60%' }} className='text-center'>
                        Email Address
                      </th>
                      <th style={{ width: '10%' }} className='text-center'>
                        Prefferred
                      </th>
                      <th style={{ width: '20%' }} className='text-center'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyEmails.map((item, idx) => (
                      <tr>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              fullWidth
                              id='outlined-emailType1'
                              select
                              label='Select'
                              size='small'
                              name='emailType'
                              value={item?.emailType}
                              onChange={handleCompanyEmailData(idx)}
                              helperText={
                                isSubmitted && item?.emailType == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.emailType == ''
                                  ? true
                                  : false
                              }>
                              {emailTypeArray.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <TextField
                              variant='outlined'
                              name='email'
                              label='Email'
                              fullWidth
                              size='small'
                              value={item?.email}
                              onChange={handleCompanyEmailData(idx)}
                              type='email'
                              helperText={
                                isSubmitted && item?.email == ''
                                  ? "Field is Mandatory"
                                  : false
                              }
                              error={
                                isSubmitted && item?.email == ''
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Checkbox
                              checked={item?.preferred}
                              color='primary'
                              id='CustomCheckbox3'
                              className='align-self-start'
                              name='preferred'
                              value={item?.preferred}
                              onChange={handleCompanyEmailData(idx)}
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <div>
                            <Button
                              onClick={handleAddEmailsClick}
                              className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'plus']}
                                className='font-size-sm'
                              />
                            </Button>
                            <Button
                              disabled={item?.preferred}
                              onClick={() => handleRemoveEmailClick(idx)}
                              className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['fas', 'times']}
                                className='font-size-sm'
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className='divider' />
              <div className='divider' />
            </CardContent>
          </Card>

          <Card
            style={{
              padding: '25px',
              border: '1px solid #c4c4c4',
              margin: '25px'
            }}
            className='mt-4 p-3 p-lg-5 shadow-xxl'>
            <div className='card-header'>
              <div className='card-header--title'>
                <p>Upload Client Logo</p>
              </div>
            </div>

            {edit && newImageUploaded ? (
              <Grid item md={3} className='p-2'>
                <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
                  <img
                    className='img-fluid img-fit-container rounded-sm'
                    src={imgSrc}
                    alt='...'
                  />
                  <FontAwesomeIcon
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '0px',
                      background: 'black',
                      color: 'white'
                    }}
                    icon={['fas', 'times']}
                    className='font-size-lg crossIcon'
                    onClick={() => deleteCompanyLogo()}
                  />
                </div>
              </Grid>
            ) : (
              ''
            )}
            <div className='dropzone'>
              <div {...getRootProps({ className: 'dropzone-upload-wrapper' })}>
                <input {...getInputProps()} />
                <div className='dropzone-inner-wrapper bg-white'>
                  {isDragAccept && (
                    <div>
                      <div className='d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto'>
                        <svg
                          className='d-140 opacity-2'
                          viewBox='0 0 600 600'
                          xmlns='http://www.w3.org/2000/svg'>
                          <g transform='translate(300,300)'>
                            <path
                              d='M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z'
                              fill='currentColor'
                            />
                          </g>
                        </svg>
                        <div className='blob-icon-wrapper'>
                          <CheckIcon className='d-50' />
                        </div>
                      </div>
                      <div className='font-size-sm text-success'>
                        All files will be uploaded!
                      </div>
                    </div>
                  )}
                  {isDragReject && (
                    <div>
                      <div className='d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto'>
                        <svg
                          className='d-140 opacity-2'
                          viewBox='0 0 600 600'
                          xmlns='http://www.w3.org/2000/svg'>
                          <g transform='translate(300,300)'>
                            <path
                              d='M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z'
                              fill='currentColor'
                            />
                          </g>
                        </svg>
                        <div className='blob-icon-wrapper'>
                          <CloseTwoToneIcon className='d-50' />
                        </div>
                      </div>
                      <div className='font-size-sm text-danger'>
                        Some files will be rejected! Accepted only jpeg and png
                        files
                      </div>
                    </div>
                  )}
                  {!isDragActive && (
                    <div>
                      <div className='d-140 hover-scale-lg icon-blob btn-icon text-first mx-auto'>
                        <svg
                          className='d-140 opacity-2'
                          viewBox='0 0 600 600'
                          xmlns='http://www.w3.org/2000/svg'>
                          <g transform='translate(300,300)'>
                            <path
                              d='M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z'
                              fill='currentColor'
                            />
                          </g>
                        </svg>
                        <div className='blob-icon-wrapper'>
                          <PublishTwoToneIcon className='d-50' />
                        </div>
                      </div>
                      <div className='font-size-sm'>
                        Drop files here or click to upload
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='card-footer p-3 bg-secondary'>
              <div>
                <div className=' mb-3 text-uppercase text-dark font-size-sm text-center'>
                  Uploaded Files
                </div>
                {thumbs.length <= 0 && (
                  <div className='text-first text-center font-size-sm'>
                    Uploaded Company Logo previews will appear here!
                  </div>
                )}
                {thumbs.length > 0 && (
                  <div>
                    <Alert severity='success' className='text-center mb-3'>
                      You have uploaded <b>{thumbs.length}</b> files!
                    </Alert>
                    <Grid container spacing={0}>
                      {thumbs}
                    </Grid>
                    <Button
                      style={{ marginRight: '2.5%' }}
                      onClick={e => {
                        uploadImage()
                      }}
                      className='btn-primary font-weight-bold mb-2 mr-3 float-right'>
                      Upload Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className='float-right' style={{ marginRight: '2.5%' }}>
            <Button
              className='btn-primary mb-2 m-2'
              component={NavLink}
              to='./company'>
              Cancel
            </Button>
            <Button className='btn-primary mb-2 m-2' type='submit'>
              {saveButtonLabel}
            </Button>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />
      </Card>
    </BlockUi>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  setCompanyData: data => dispatch(setCompanyData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCompanyData)
