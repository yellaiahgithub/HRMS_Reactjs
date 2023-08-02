import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import apicaller from 'helper/Apicaller';
import {
    Grid,
    Card,
    Button,
    TextField,
    Snackbar
} from '@material-ui/core'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { BASEURL } from 'config/conf';
const CreateBank = (props) => {
    const saveButtonLabel = 'Create Bank';
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const [isSubmitted, setIsSubmitted] = useState()
    const [bankName, setBankName] = useState()
    const [blocking, setBlocking] = useState(false);
    const { vertical, horizontal, open, toastrStyle, message } = state
    const handleClose3 = () => {
        setState({ ...state, open: false })
    }

    const save = (e) => {
        e.preventDefault();
        //to do service call
        const data = {
            name: bankName
        }
        apicaller('post', `${BASEURL}/bank`, data)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    if (res.data && res.data[0]) {
                        setBankName('')
                        setIsSubmitted(false)
                        setState({
                            open: true,
                            message: 'Bank Added Successfully',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        })
                    }
                }
            })
            .catch(err => {
                setBlocking(false)
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
}

    const loading = false
    return (
        <>
            <BlockUi
                tag='div'
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>
                <Card>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12} xl={12} className='mx-auto'>
                            <div className='bg-white p-4 rounded'>
                                    <label style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
                                        Bank Name *
                                    </label>
                                    <TextField
                                        id='outlined-bankName'
                                        placeholder='Bank Name'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        name='bankName'
                                        value={bankName}
                                        onChange={(event) => {
                                            setBankName(event.target.value)
                                        }}
                                        error={isSubmitted && (bankName ? false : true)}
                                        helperText={
                                            isSubmitted &&
                                            (bankName ? '' : 'Bank Name is Required')
                                        }
                                    />
                                </div>
                        </Grid>
                    </Grid>
                    <div
                        className="float-right"
                        style={{ marginRight: '2.5%' }}>
                        <Button
                            className="btn-primary mb-2 m-2"
                            type="submit"
                            onClick={save}>
                            {saveButtonLabel}
                        </Button>
                        <Button
                            component={NavLink}
                            to="./bank"
                            className="btn-primary mb-2 m-2">
                            Cancel
                        </Button>

                    </div>
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

const mapStateToProps = (state) => {
    return {
        user: state.Auth.user
    }
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBank);