import { Box, Button, Card, Checkbox, Dialog, DialogContent, Grid, Snackbar, Table, TextField, MenuItem } from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import 'date-fns';
import apicaller from 'helper/Apicaller';
import { useDropzone } from 'react-dropzone';
import { Alert, Autocomplete, Pagination } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import { parse } from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';

import { ClimbingBoxLoader } from 'react-spinners';
import BlockUi from 'react-block-ui';
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const CreateUploadCompanyPolicy = (props) => {
    const { selectedCompany } = props;
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const [isSubmitted, setIsSubmitted] = useState();
    const [uploadCompanyPolicyData, setUploadCompanyPolicyData] = useState([]);
    const [version, setVersion] = useState();
    const [policyType, setPolicyType] = useState();
    const [policy, setPolicy] = useState();
    const [policyTypeList, setPolicyTypeList] = useState();
    const [status, setStatus] = useState(true);
    const [currentStatus, setCurrentStatus] = useState([{ label: 'Active', value: true }, { label: 'InActive', value: false }])
    const [effectiveDate, setEffectiveDate] = useState(null);
    const [blocking, setBlocking] = useState(false);
    const [filePath, setFilePath] = useState();
    const [fileName, setFileName] = useState();
    const [files, setFiles] = useState([]);
    const [documentSrc, setDocumentSrc] = useState('')
    const [newDocumentUploaded, setNewDocumentUploaded] = useState(false)
    const [documentObj, setDocumentObj] = useState()
    const [allFilesData, allFilesDataForSave] = useState()
    const [open2, setOpen2] = useState(false)
    const handleClose2 = () => {
        setOpen2(false)
    }
    const handleClickOpen2 = () => {
        setOpen2(true)
    }
    useEffect(() => {
        getPolicyType();
    }, []);

    const handleClose = () => {
        setState({ ...state, open: false })
    }

    const getPolicyType = () => {
        apicaller('get', `${BASEURL}/policy`)
            .then((res) => {
                if (res.status === 200) {
                    const policyTypeList = res.data.map(x => x.type)
                    setPolicyTypeList(policyTypeList);
                }
            })
            .catch((err) => {
                console.log('get Policy err', err);
            });
    };

    const save = (e) => {
        e.preventDefault();
        //to do service call
        const data = {
            type: policyType
        }
        apicaller('post', `${BASEURL}/policy`, data)
            .then((res) => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    if (res.data && res.data[0]) {
                        setPolicyType('')
                        handleClose2()
                        getPolicyType()
                        setState({
                            open: true,
                            message: 'Policy Added Successfully',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        })
                    }
                }
            })
            .catch(err => {
                console.log('err', err)
                if (err?.response?.data) {
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                }
            })
    };

    const saveCompanyPolicy = (e) => {
        setIsSubmitted(true)
        //to do service call
        let obj = {
            type: policy,
            version: version,
            effectiveDate: effectiveDate,
            status: status,
            upload: {
                fileName: fileName,
                filePath: filePath
            }
        }
        apicaller('post', `${BASEURL}/companyPolicy`, obj)
            .then((res) => {
                if (res.status === 200) {
                    setPolicyType(null)
                    setVersion('')
                    setStatus(true)
                    setEffectiveDate('')
                    setFilePath()
                    setFileName()
                    setNewDocumentUploaded(false)
                    setFiles([])
                    console.log('res.data', res.data)
                    setState({
                        open: true,
                        message: 'Company Policy Added Successfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                    setIsSubmitted(false)
                }
            })
            .catch(err => {
                setIsSubmitted(false)
                console.log('err', err)
                if (err?.response?.data) {
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                }
            })
    };

    const uploadDocument = () => {
        setBlocking(true)
        let path = 'document/logo'
        let formData = new FormData()
        formData.append('file', files[0])
        // formData.append('path', path)
        formData.append('documentType', "CompanyPolicy")
        apicaller(
            'post',
            `${BASEURL}/storage/uploadFile`,
            formData
        )
            .then(res => {
                console.log('res.data', res.data)
                setBlocking(false)
                if (res.status === 200) {
                    setBlocking(false)
                    // saveUpdate(res.data.filePath)
                    console.log('res.data', res.data)
                    let path = res.data.filePath + '/' + res.data.fileName
                    setFilePath(path)
                    setFileName(res.data.fileName)
                    setNewDocumentUploaded(true)

                    setState({
                        open: true,
                        message: 'File Uploaded Successfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('upload err', err)
                setState({
                    open: true,
                    message: 'err',
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                })
            })
    }

    const {
        acceptedFiles,
        isDragActive,
        isDragAccept,
        isDragReject,
        getRootProps,
        getInputProps
    } = useDropzone({
        multiple: false,
        accept: 'application/pdf, image/jpeg, image/png',
        onDrop: (acceptedFiles) => {
            acceptedFiles.forEach(async (file) => {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                );
                const text = await file.text();
                const result = parse(text, { header: true }); // firstRow
                setUploadCompanyPolicyData(result.data);
            });
        }
    });
    const thumbs = files.map((file, index) => (
        <Grid item md={3} className='p-2' key={file.name}>
            <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
                {/* <iframe
              className='img-fluid img-fit-container rounded-sm'
              src={file.preview}
              height="200" width="300"></iframe> */}
                <a href={file.preview} download={file.name}>File: {file.name} </a>
                <FontAwesomeIcon
                    style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        background: 'black',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                    icon={['fas', 'times']}
                    className='font-size-lg crossIcon'
                    onClick={() => deleteUploadedPolicy()}
                />
            </div>
        </Grid>
    ))

    // Delete PDF cross icon
    const deleteUploadedPolicy = () => {
        // setFiles([])
        if (filePath) {
            setBlocking(true)
            apicaller('delete', `${BASEURL}/storage?path=` + filePath)
                .then(res => {
                    if (res.status === 200) {
                        setBlocking(false)
                        console.log('res.data', res.data)
                        if (res.data) {
                            setNewDocumentUploaded(false)
                            setFiles([])
                        }
                    }
                })
                .catch(err => {
                    setBlocking(false)
                    console.log('updateSession err', err)
                })
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
                <div className='bg-white rounded' style={{ padding: '4rem' }}>
                    <Grid container spacing={0}>
                        <Grid item md={12} className="d-flex" spacing={2}>
                            <Grid item md={6} >
                                <div>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className=" mb-2">
                                        Policy Type *
                                    </label>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={policyTypeList}
                                        value={policy}
                                        // getOptionLabel={(option) => (option.type ? option.type : '')}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Policy Type"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                name='policy'
                                                error={
                                                    isSubmitted &&
                                                    (policy ? false : true)
                                                }
                                                helperText={
                                                    isSubmitted &&
                                                    (policy
                                                        ? ''
                                                        : 'Field is Mandatory')
                                                }
                                            />
                                        )}
                                        onChange={(event, value) => {
                                            setPolicy(value);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <label
                                    style={{ marginTop: '15px' }}
                                    className=" mb-2">&nbsp;</label>
                                <div>
                                    <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleClickOpen2()
                                        }}
                                        className='text-black'
                                        title="..."
                                        style={{
                                            marginLeft: '36px',
                                            color: 'green',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            textTransform: 'capitalize',
                                            '& :hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Add New If You Couldn't Find Your policy Name
                                    </a>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item md={12} className="d-flex" spacing={2}>
                            <Grid item md={6}>
                                <div>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className=" mb-2">
                                        Version *
                                    </label>
                                    <TextField
                                        id="outlined-Version"
                                        placeholder="Version"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={version}
                                        onChange={(event) => {
                                            setVersion(event.target.value);
                                        }}
                                        error={isSubmitted && (version ? false : true)}
                                        helperText={
                                            isSubmitted &&
                                            (version ? '' : 'Field is Mandatory')
                                        }
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item md={12} className="d-flex" spacing={2}>
                            <Grid item md={6}>
                                <div>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className=' mb-2'>
                                        Effective Date *
                                    </label>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                        style={{ margin: '0%' }}>
                                        <KeyboardDatePicker
                                            style={{ margin: '0%' }}
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="outlined-effectiveDate"
                                            fullWidth
                                            size="small"
                                            value={effectiveDate}
                                            onChange={(event) => {
                                                setEffectiveDate(event);
                                            }}
                                            error={isSubmitted && (effectiveDate ? false : true)}
                                            helperText={
                                                isSubmitted &&
                                                (effectiveDate ? '' : 'Effective Date is Mandatory')
                                            }
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date'
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item md={12} className="d-flex" spacing={2}>
                            <Grid item md={6}>
                                <div>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className=" mb-2">
                                        Status *
                                    </label>
                                    <TextField
                                        id="outlined-status"
                                        // required
                                        label={status ? '' : 'Select Status'}
                                        variant="outlined"
                                        error={isSubmitted && ((status === '') ? true : false)}
                                        helperText={
                                            isSubmitted && ((status === '') ? 'Field is Mandatory' : '')
                                        }
                                        fullWidth
                                        select
                                        size="small"
                                        value={(status === '') ? '' : (status ? true : false)}
                                        onChange={(event) => {
                                            setStatus(event.target.value);
                                        }}>
                                        {currentStatus.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <br />
                <Grid container spacing={0}>
                    <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
                        <Grid item container spacing={2} direction="row">
                            <Grid item md={12}>
                                <Card
                                    className="mt-4 p-3 p-lg-5 shadow-xxl codesCard">
                                    <div className="card-header">
                                        <div className="card-header--title">
                                            <p>
                                                <b>Upload .CSV file</b>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="dropzone">
                                        <div
                                            {...getRootProps({
                                                className: 'dropzone-upload-wrapper'
                                            })}>
                                            <input {...getInputProps()} />
                                            <div className="dropzone-inner-wrapper bg-white">
                                                {isDragAccept && (
                                                    <div>
                                                        <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto">
                                                            <svg
                                                                className="d-140 opacity-2"
                                                                viewBox="0 0 600 600"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <g transform="translate(300,300)">
                                                                    <path
                                                                        d="M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </g>
                                                            </svg>
                                                            <div className="blob-icon-wrapper">
                                                                <CheckIcon className="d-50" />
                                                            </div>
                                                        </div>
                                                        <div className="font-size-sm text-success">
                                                            All files will be uploaded!
                                                        </div>
                                                    </div>
                                                )}
                                                {isDragReject && (
                                                    <div>
                                                        <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto">
                                                            <svg
                                                                className="d-140 opacity-2"
                                                                viewBox="0 0 600 600"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <g transform="translate(300,300)">
                                                                    <path
                                                                        d="M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </g>
                                                            </svg>
                                                            <div className="blob-icon-wrapper">
                                                                <CloseTwoToneIcon className="d-50" />
                                                            </div>
                                                        </div>
                                                        <div className="font-size-sm text-danger">
                                                            Some files will be rejected! Accepted only csv
                                                            files
                                                        </div>
                                                    </div>
                                                )}
                                                {!isDragActive && (
                                                    <div>
                                                        <div className="d-140 hover-scale-lg icon-blob btn-icon text-first mx-auto">
                                                            <svg
                                                                className="d-140 opacity-2"
                                                                viewBox="0 0 600 600"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <g transform="translate(300,300)">
                                                                    <path
                                                                        d="M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </g>
                                                            </svg>
                                                            <div className="blob-icon-wrapper">
                                                                <PublishTwoToneIcon className="d-50" />
                                                            </div>
                                                        </div>
                                                        <div className="font-size-sm">
                                                            Drop files here or click to upload
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer p-3 bg-secondary">
                                        <div>
                                            <div className="mb-3 text-uppercase text-dark font-size-sm text-center">
                                                Uploaded Files
                                            </div>
                                            {thumbs.length <= 0 && (
                                                <div className='text-first text-center font-size-sm'>
                                                    Uploaded demo File previews will appear here!
                                                </div>
                                            )}
                                            {thumbs.length > 0 && (
                                                <div>
                                                    <Alert
                                                        severity="success"
                                                        className="text-center mb-3">
                                                        You have uploaded <b>{thumbs.length}</b> file(s)
                                                    </Alert>
                                                    <Grid container spacing={0}>
                                                        {thumbs}
                                                    </Grid>
                                                    <Button
                                                        style={{ marginRight: '2.5%' }}
                                                        disabled={newDocumentUploaded}
                                                        onClick={e => {
                                                            if (documentSrc) {
                                                                alert('Delete Previous File Before Uploading New Document')
                                                            } else {
                                                                // documentSrc should be empty before uploading new
                                                                uploadDocument()
                                                            }
                                                        }}
                                                        className='btn-primary  mb-2 mr-3 float-right'>
                                                        Upload Document
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                                <Grid item container spacing={2} direction="row" className='mt-4'>
                                    <Button
                                        className="btn-primary m-2 "
                                        type="submit"
                                        disabled={files?.length == 0}
                                        onClick={e => saveCompanyPolicy(e)}>
                                        Save
                                    </Button>
                                    <Button
                                        className="btn-primary m-2 "
                                        onClick={() => {
                                            setPolicyType('')
                                            setVersion('')
                                            setStatus(true)
                                            setEffectiveDate(null)
                                            // setUploadCompanyPolicyData('')
                                        }}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Dialog
                            classes={{
                                paper: 'modal-content rounded border-0 bg-white p-3 p-xl-0'
                            }}
                            style={{ maxWidth: 'auto' }}
                            fullWidth
                            open={open2}
                            onClose={handleClose2}
                            aria-labelledby='form-dialog-title2'>
                            <DialogContent className='p-2'>
                                <div className='border-0'>
                                    <div className='card-body px-lg-3'>
                                        <>
                                            <Grid container spacing={12}>
                                                <Grid item md={12}>
                                                    <div>
                                                        <label className=' mb-2 '>
                                                            Policy Type
                                                        </label>
                                                        <TextField
                                                            variant='outlined'
                                                            size='small'
                                                            fullWidth
                                                            placeholder='policyType'
                                                            name='policyType'
                                                            value={policyType}
                                                            onChange={event => {
                                                                setPolicyType(event.target.value)
                                                            }}
                                                        />
                                                    </div>{' '}
                                                </Grid>
                                            </Grid>
                                        </>
                                    </div>
                                    <br></br>
                                    <div className='divider' />
                                    <div className='float-right' style={{ marginRight: '2.5%' }}>
                                        <Button
                                            className="btn-primary mb-2 mr-3"
                                            onClick={handleClose2}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="btn-primary mb-2 mr-3"
                                            // disabled={files?.length == 0}
                                            onClick={(e) => save(e)}
                                        >Save
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Grid>
                </Grid>
            </Card><br />
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={2000}
            />
        </BlockUi>
    );
};

const mapStateToProps = (state) => ({
    selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateUploadCompanyPolicy);



