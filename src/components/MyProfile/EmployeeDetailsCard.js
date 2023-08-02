import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Divider,
    Grid,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import { setUser } from 'actions';
import avatar5 from '../../assets/images/avatars/avatar8.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone'
import CheckIcon from '@material-ui/icons/Check'
import { useDropzone } from 'react-dropzone'
import { BASEURL } from 'config/conf'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
const EmployeeDetailsCard = ({ employeeDetails, fromTeamsPage, user, setUserData }) => {
    const history = useHistory();
    const [filePath, setFilePath] = useState();
    const [showUploadImage, setShowUploadImage] = useState(false)
    const [files, setFiles] = useState([])
    const [profileImg, setProfileImg] = useState(null)
    const [blocking, setBlocking] = useState(false)
    const [newDocumentUploaded, setNewDocumentUploaded] = useState(false)
    const [documentObj, setDocumentObj] = useState()
    const [fileName, setFileName] = useState();

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });

    const {
        isDragActive,
        isDragAccept,
        isDragReject,
        open,
        getRootProps,
        getInputProps
    } = useDropzone({
        noClick: true,
        noKeyboard: true,
        multiple: false,
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            )
            setNewDocumentUploaded(false)
            setFilePath()
            setDocumentObj()
        }
    })
    const thumbs = files.map(file => (
        <div
            key={file.name}
            className='rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center font-weight-bold text-success d-flex justify-content-center align-items-center'>
            <img
                className='img-fluid img-fit-container rounded-sm'
                src={file.preview}
                alt='...'
            />
        </div>
    ))
    const checkIfProfileImg = file => {
        if (file) {
            let path =
                file?.filePath +
                '/' +
                file?.fileName
            apicaller('get', `${BASEURL}/storage?path=` + path)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data) {
                            let baseStr64 = res.data
                            let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
                            // Set the source of the Image to the base64 string
                            setProfileImg(imgSrc64)
                            if(!fromTeamsPage) {
                                const userData = user;
                                userData['profilePic'] = imgSrc64;
                                setUserData(userData);
                                history.push('/myProfile');
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('updateSession err', err)
                })
        }
    }
    const uploadDocument = () => {
        setBlocking(true)
        let path = 'document/logo'
        let formData = new FormData()
        formData.append('file', files[0])
        formData.append('documentType', files[0].name)
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
                    console.log('res.data', res.data)
                    setDocumentObj(res.data)
                    let path = res.data.filePath + '/' + res.data.fileName
                    setFilePath(path)
                    setFileName(res.data.fileName)
                    setNewDocumentUploaded(true)
                    setShowUploadImage(false)

                    saveObj({
                        uuid: employeeDetails.uuid,
                        file: res.data
                    })
                    if (employeeDetails.file) {
                        deleteFile(employeeDetails.file.filePath + '/' + employeeDetails.file.fileName)
                    }

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
    const saveObj = (inputObj) => {
        setBlocking(true);
        apicaller('put', `${BASEURL}/employee/update`, inputObj)
            .then((res) => {
                setBlocking(false);
                if (res.status === 200) {
                    console.log('res.data', res.data);
                    checkIfProfileImg(inputObj.file)
                    setState({
                        open: true,
                        message: 'Employee Details Updated Successfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                }
            })
            .catch((err) => {
                setBlocking(false);
                setState({
                    open: true,
                    message: 'Error Occured while creating Employee Details',
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                });
                console.log('update employee err', err);
            });
    };

    const deleteFile = (filePath) => {
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
        <Card
            style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
            <div className="p-4">
                <Grid container spacing={0} className="d-flex">
                    <Grid item md={12} xl={2}>
                        <Grid item container alignItems="flex-start" spacing={2}>
                            <Grid item>
                                {!showUploadImage && (
                                    <div className='rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center text-success d-flex justify-content-center align-items-center'>
                                        {profileImg || employeeDetails?.profilePic ? (
                                            <img className='img-fluid img-fit-container rounded-sm' src={profileImg || employeeDetails?.profilePic} style={{ width: '100px', height: '100px' }} alt='...' />
                                        ) : (
                                            <img className='img-fluid img-fit-container rounded-sm' src={avatar5} style={{ width: '100px', height: '100px' }}
                                                alt='...' />)}
                                    </div>
                                )}
                                {showUploadImage && (
                                    <div className='dropzone rounded shadow-xxl'>
                                        <div
                                            {...getRootProps({
                                                className: 'dropzone-upload-wrapper'
                                            })}>
                                            <input {...getInputProps()} />
                                            <div className='dropzone-inner-wrapper d-140 rounded dropzone-avatar'>
                                                <div className='avatar-icon-wrapper d-140 rounded'>
                                                    <Button
                                                        onClick={open}
                                                        className='avatar-button badge shadow-sm btn-icon badge-position badge-position--top-right border-0 text-indent-0 d-40 badge-circle btn-second text-white'>
                                                        <PublishTwoToneIcon className='d-20' />
                                                    </Button>
                                                    <div>
                                                        {isDragAccept && (
                                                            <div className='rounded overflow-hidden d-140 bg-success text-center font-weight-bold text-white d-flex justify-content-center align-items-center'>
                                                                <CheckIcon className='d-40' />
                                                            </div>
                                                        )}
                                                        {isDragReject && (
                                                            <div className='rounded overflow-hidden d-140 bg-danger text-center font-weight-bold text-white d-flex justify-content-center align-items-center'>
                                                                <CloseTwoToneIcon className='d-60' />
                                                            </div>
                                                        )}
                                                        {!isDragActive && (
                                                            <div className='rounded overflow-hidden d-140 bg-neutral-dark text-center font-weight-bold text-black-50 d-flex justify-content-center align-items-center'>
                                                                <AccountCircleTwoToneIcon className='d-50' />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {thumbs.length > 0 && <div>{thumbs}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        {files[0] && !filePath && (
                                            <Button
                                                className='btn-primary'
                                                style={{ width: "-webkit-fill-available" }}
                                                type='submit'
                                                onClick={e => uploadDocument()}>
                                                Save
                                            </Button>
                                        )}

                                        {filePath && (
                                            <Button
                                                size='small'
                                                style={{ bottom: '30px', width: "-webkit-fill-available" }}
                                                onClick={() => setFiles([])}
                                                className='btn-primary'>
                                                Remove
                                            </Button>
                                        )}

                                    </div>
                                )}
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => setShowUploadImage(true)}
                                    className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0'>
                                    <FontAwesomeIcon icon={['far', 'edit']} className='font-size-xs' />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={10}>
                        <Grid item md={12} spacing={6}>
                            <h5 className='text-dark'>{employeeDetails?.legalName}</h5>
                            <Grid container>
                                <Grid item md={12} style={{ display: 'contents' }}>
                                    <Grid item md={2} className='p-4'>
                                        <div>Employee ID</div>
                                        <span className='text-grey font-weight-bold'>
                                            {employeeDetails?.id}
                                        </span>
                                    </Grid>
                                    <Grid item md={2} className='p-4'>
                                        <div>Job Title </div>
                                        <span className='text-grey font-weight-bold'>
                                            {employeeDetails?.designationName}
                                        </span>
                                    </Grid>
                                    <Grid item md={2} className='p-4'>
                                        <div>Department</div>
                                        <span className='text-grey font-weight-bold'>
                                            {employeeDetails?.departmentName}
                                        </span>
                                    </Grid>
                                    <Grid item md={2} className='p-4'>
                                        <div>Location </div>
                                        <span className='text-grey font-weight-bold'>
                                            {employeeDetails?.locationName}
                                        </span>
                                    </Grid>
                                    <Grid item md={3} className='p-4'>
                                        <div>Report To</div>
                                        <span className='text-grey font-weight-bold'>
                                            {employeeDetails?.managerName}
                                        </span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    user: state.Auth.user
});
  
const mapDispatchToProps = (dispatch) => ({
    setUserData: (data) => dispatch(setUser(data))
});
  
export default connect(mapStateToProps,mapDispatchToProps)(EmployeeDetailsCard);