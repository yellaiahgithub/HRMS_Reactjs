import { Button, Card, Grid, Radio, Snackbar, Switch, TextField } from '@material-ui/core';
import axios from 'axios';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';


const CreateAutoNumberingSetupDepartment = ({autoNumberingData, setAutoNumberingData}) => {
  const [isSubmitted, setIsSubmitted] = useState();

  const [autoGenerated, setautoGenerated] = useState(autoNumberingData.autoGenerated);
  const [isAlphaNumeric, setIsAlphaNumeric] = useState(autoNumberingData.isAlphaNumeric);
  const [sequenceCode, setsequenceCode] = useState(autoNumberingData.sequenceCode);
  const [isSuffix, setisSuffix] = useState(autoNumberingData.alphaNumericPart);
  const [sequenceNumber, setsequenceNumber] = useState(autoNumberingData.sequenceNumber);

  useEffect(() => {
    getAutoNumberingData();
  }, [])

  const getAutoNumberingData = () => {
    apicaller('post', `${BASEURL}/autoNumbering/byType`, {
      type: "DEP"
    })
    .then(res => {
      if(res.status === 200) {
        let autoNumberingDataResp = res.data;
        autoNumberingDataResp.alphaNumericPart = autoNumberingDataResp.isSuffix ? "Suffix" : "Prefix"
        setAutoNumberingData(autoNumberingDataResp)
        setautoGenerated(autoNumberingDataResp.autoGenerated)
        setIsAlphaNumeric(autoNumberingDataResp.isAlphaNumeric)
        setsequenceCode(autoNumberingDataResp.sequenceCode)
        setisSuffix(autoNumberingDataResp.alphaNumericPart)
        setsequenceNumber(autoNumberingDataResp.sequenceNumber)
      }
    })
    .catch(err => {
      console.log('Fetch autonumbering bytype error', err);
    })
  }

  return (
    <Card style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <Grid container spacing={0}>
        <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
          <Grid container spacing={0}>
            <Grid item container direction="row">
              <Grid item md={10} lg={7} xl={12}>
                <label style={{ marginTop: '15px' }} className="mb-2">
                  <strong>Department</strong>
                </label>
              </Grid>
            </Grid>
            <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
              <Grid item md={6} className="mx-auto">
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Do you want the Department Code to be Auto Generated
                </label>              
              </Grid>
              <Grid item md={6} className="mx-auto">
                <Switch
                    value={autoGenerated}
                    checked={autoGenerated}
                    onChange={(event) => {
                      setautoGenerated(event.target.checked);
                      setAutoNumberingData({
                        ...autoNumberingData,
                        autoGenerated: event.target.checked 
                      })
                    }}
                    className="switch-small"
                  />
              </Grid>  
            </Grid>
            { autoGenerated && (
            <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
              <Grid item md={6}className="mx-auto">
                <label style={{ marginTop: '15px' }} className=" mb-2">
                Do you want the Department Code to be Alphanumeric
                </label>
              </Grid>
              <Grid item md={6} className="mx-auto">
              <Switch
                    value={isAlphaNumeric}
                    checked={isAlphaNumeric}
                    onChange={(event) => {
                      setIsAlphaNumeric(event.target.checked);
                      setAutoNumberingData({
                        ...autoNumberingData,
                        isAlphaNumeric: event.target.checked 
                      })
                    }}
                    className="switch-small"
                  />
              </Grid>
            </Grid>
            )}

            {autoGenerated&&isAlphaNumeric && (
            <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
              <Grid item md={6} className="mx-auto">
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  What is the Alphanumeric part
                </label>
              </Grid>
              <Grid item md={6} className="mx-auto">
                <TextField
                  id="outlined-sequenceCode"
                  placeholder="Alphanumeric Department"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={sequenceCode}
                  onChange={(event) => {
                    const result = event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                    setsequenceCode(result);
                    setAutoNumberingData({
                      ...autoNumberingData,
                      sequenceCode: result 
                    })
                  }} />
              </Grid>
            </Grid>
            )}
            {autoGenerated&&isAlphaNumeric && (
            <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
              <Grid item md={6} className="mx-auto">
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Where to place the alphanumeric part
                </label>
              </Grid>
              <Grid item md={6} className="mx-auto">
                <Radio
                  checked={isSuffix === 'Suffix'}
                  name="radio-isSuffix"
                  inputProps={{ 'aria-label': 'Suffix' }}
                  onChange={(event) => {
                    setisSuffix(event.target.value);
                    setAutoNumberingData({
                      ...autoNumberingData,
                      isSuffix: event.target.value === 'Suffix' ? true : false,
                      alphaNumericPart: event.target.value
                    })
                  }}
                  value="Suffix"
                  label="Suffix"
                />
                <label>Suffix</label>
                <Radio
                  checked={isSuffix === 'Prefix'}
                  onChange={(event) => {
                    setisSuffix(event.target.value);
                    setAutoNumberingData({
                      ...autoNumberingData,
                      isSuffix: event.target.value === 'Prefix' ? false : true,
                      alphaNumericPart: event.target.value
                    })
                  }} 
                  value="Prefix"
                  name="radio-isSuffix"
                  inputProps={{ 'aria-label': 'Prefix' }}
                  label="Prefix"
                />
                <label>Prefix</label>
              </Grid>
            </Grid>
            )}
            {autoGenerated && (
            <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
              <Grid item md={6} className="mx-auto">
                <label style={{ marginTop: '15px' }} className=" mb-2">
                Enter First Number of Sequence
                </label>
              </Grid>
              <Grid item md={6} className="mx-auto">
                <TextField
                  id="outlined-sequenceNumber"
                  placeholder="Sequence Number"
                  error={isSubmitted && (sequenceNumber ? false : true)}
                  helperText={isSubmitted && (sequenceNumber ? "" : "Field is Mandatory")}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={sequenceNumber}
                  onChange={(event) => {
                    const result = event.target.value.replace(/[^0-9]/gi, '').toUpperCase();
                    setsequenceNumber(result);
                    setAutoNumberingData({
                      ...autoNumberingData,
                      sequenceNumber: result
                    })
                  }}
                />
              </Grid>
            </Grid>
             )}
          </Grid>              
        </Grid>
      </Grid>
    </Card>
  );
};

export default CreateAutoNumberingSetupDepartment;
