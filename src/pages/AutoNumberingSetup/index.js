
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Grid, Button, Snackbar } from '@material-ui/core';
import AutoNumberingSetupDesignation from '../../components/AutoNumberingSetup/AutoNumberingSetupDesignation';
import AutoNumberingSetupLocation from '../../components/AutoNumberingSetup/AutoNumberingSetupLocation';
import AutoNumberingSetupDepartment from '../../components/AutoNumberingSetup/AutoNumberingSetupDepartment';
import AutoNumberingSetupEmployeeID from '../../components/AutoNumberingSetup/AutoNumberingSetupEmployeeID';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';

const AutoNumberingSetup = (props) => {
  const history = useHistory()
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const { selectedCompany } = props;

  const [autoNumberingDesignationData, setAutoNumberingDesignationData] = useState({
    autoGenerated: false,
    isAlphaNumeric: false,
    isSuffix: false,
    alphaNumericPart: "Prefix",
    sequenceCode: "",
    sequenceNumber: 0
  })

  const [autoNumberingLocationData, setAutoNumberingLocationData] = useState({
    autoGenerated: false,
    isAlphaNumeric: false,
    isSuffix: false,
    alphaNumericPart: "Prefix",
    sequenceCode: "",
    sequenceNumber: 0
  })

  const [autoNumberingDepartmentData, setAutoNumberingDepartmentData] = useState({
    autoGenerated: false,
    isAlphaNumeric: false,
    isSuffix: false,
    alphaNumericPart: "Prefix",
    sequenceCode: "",
    sequenceNumber: 0
  })

  // TODO: API call to get jobTypes
  const [autoNumberingEmployeeData, setAutoNumberingEmployeeData] = useState({
    autoGenerated: false,
    isAlphaNumeric: false,
    isSuffix: false,
    alphaNumericPart: "Prefix",
    sequenceCode: "",
    sequenceNumber: 0,
    basedOnJobType: false,
    autoNumberingItems: []
  })

  const[action, setAction] = useState('CREATE')

  useEffect(() => {
    getAutoNumberings();
  }, [])

  const getAutoNumberings = () => {
    apicaller('get', `${BASEURL}/autoNumbering/fetchAll`)
    .then(res => {
      if (res.status === 200 && res.data.length > 0) {
        setAction('UPDATE')
      }
    })
    .catch(err => {
      console.log('Fetchall autonumberings error', err);
    })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const save = () => {
    console.log('autoNumberingDesignationData', autoNumberingDesignationData)
    console.log('autoNumberingLocationData', autoNumberingLocationData)
    console.log('autoNumberingDepartmentData', autoNumberingDepartmentData)
    console.log('autoNumberingEmployeeData', autoNumberingEmployeeData)
    let input = {};
    if(action === "CREATE") {
      input = {
        action: action,
        autoNumberingData: [
          {
            type: "DES",
            autoGenerated: autoNumberingDesignationData.autoGenerated,
            isAlphaNumeric: autoNumberingDesignationData.autoGenerated?autoNumberingDesignationData.isAlphaNumeric:false,
            isSuffix: autoNumberingDesignationData.autoGenerated&&autoNumberingDesignationData.isAlphaNumeric?autoNumberingDesignationData.isSuffix:true,
            sequenceCode: autoNumberingDesignationData.autoGenerated&&autoNumberingDesignationData.isAlphaNumeric?autoNumberingDesignationData.sequenceCode:'',
            sequenceNumber: autoNumberingDesignationData.autoGenerated?autoNumberingDesignationData.sequenceNumber:null
          },
          {
            type: "LOC",
            autoGenerated: autoNumberingLocationData.autoGenerated,
            isAlphaNumeric: autoNumberingLocationData.autoGenerated?autoNumberingLocationData.isAlphaNumeric:false,
            isSuffix: autoNumberingLocationData.autoGenerated&&autoNumberingLocationData.isAlphaNumeric?autoNumberingLocationData.isSuffix:true,
            sequenceCode: autoNumberingLocationData.autoGenerated&&autoNumberingLocationData.isAlphaNumeric?autoNumberingLocationData.sequenceCode:'',
            sequenceNumber: autoNumberingLocationData.autoGenerated?autoNumberingLocationData.sequenceNumber:null
          },
          {
            type: "DEP",
            autoGenerated: autoNumberingDepartmentData.autoGenerated,
            isAlphaNumeric: autoNumberingDepartmentData.autoGenerated?autoNumberingDepartmentData.isAlphaNumeric:false,
            isSuffix: autoNumberingDepartmentData.autoGenerated&&autoNumberingDepartmentData.isAlphaNumeric?autoNumberingDepartmentData.isSuffix:true,
            sequenceCode: autoNumberingDepartmentData.autoGenerated&&autoNumberingDepartmentData.isAlphaNumeric?autoNumberingDepartmentData.sequenceCode:'',
            sequenceNumber: autoNumberingDepartmentData.autoGenerated?autoNumberingDepartmentData.sequenceNumber:null
          },
          {
            type: "EMP",
            autoGenerated: autoNumberingEmployeeData.autoGenerated,
            isAlphaNumeric: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.isAlphaNumeric:false,
            isSuffix: autoNumberingEmployeeData.autoGenerated&&autoNumberingEmployeeData.isAlphaNumeric?autoNumberingEmployeeData.isSuffix:true,
            sequenceCode: autoNumberingEmployeeData.autoGenerated&&autoNumberingEmployeeData.isAlphaNumeric?autoNumberingEmployeeData.sequenceCode:'',
            sequenceNumber: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.sequenceNumber:null,
            autoNumberingItems: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.autoNumberingItems:[]
          }
        ]
      }
    } else {
      input = {
        action: action,
        updateArray: [
          {
            _id: autoNumberingDesignationData._id,
            type: "DES",
            autoGenerated: autoNumberingDesignationData.autoGenerated,
            isAlphaNumeric: autoNumberingDesignationData.autoGenerated?autoNumberingDesignationData.isAlphaNumeric:false,
            isSuffix: autoNumberingDesignationData.autoGenerated&&autoNumberingDesignationData.isAlphaNumeric?autoNumberingDesignationData.isSuffix:true,
            sequenceCode: autoNumberingDesignationData.autoGenerated&&autoNumberingDesignationData.isAlphaNumeric?autoNumberingDesignationData.sequenceCode:'',
            sequenceNumber: autoNumberingDesignationData.autoGenerated?autoNumberingDesignationData.sequenceNumber:null
          },
          {
            _id: autoNumberingLocationData._id,
            type: "LOC",
            autoGenerated: autoNumberingLocationData.autoGenerated,
            isAlphaNumeric: autoNumberingLocationData.autoGenerated?autoNumberingLocationData.isAlphaNumeric:false,
            isSuffix: autoNumberingLocationData.autoGenerated&&autoNumberingLocationData.isAlphaNumeric?autoNumberingLocationData.isSuffix:true,
            sequenceCode: autoNumberingLocationData.autoGenerated&&autoNumberingLocationData.isAlphaNumeric?autoNumberingLocationData.sequenceCode:'',
            sequenceNumber: autoNumberingLocationData.autoGenerated?autoNumberingLocationData.sequenceNumber:null
          },
          {
            _id: autoNumberingDepartmentData._id,
            type: "DEP",
            autoGenerated: autoNumberingDepartmentData.autoGenerated,
            isAlphaNumeric: autoNumberingDepartmentData.autoGenerated?autoNumberingDepartmentData.isAlphaNumeric:false,
            isSuffix: autoNumberingDepartmentData.autoGenerated&&autoNumberingDepartmentData.isAlphaNumeric?autoNumberingDepartmentData.isSuffix:true,
            sequenceCode: autoNumberingDepartmentData.autoGenerated&&autoNumberingDepartmentData.isAlphaNumeric?autoNumberingDepartmentData.sequenceCode:'',
            sequenceNumber: autoNumberingDepartmentData.autoGenerated?autoNumberingDepartmentData.sequenceNumber:null
          },
          {
            _id: autoNumberingEmployeeData._id,
            type: "EMP",
            autoGenerated: autoNumberingEmployeeData.autoGenerated,
            isAlphaNumeric: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.isAlphaNumeric:false,
            isSuffix: autoNumberingEmployeeData.autoGenerated&&autoNumberingEmployeeData.isAlphaNumeric?autoNumberingEmployeeData.isSuffix:true,
            sequenceCode: autoNumberingEmployeeData.autoGenerated&&autoNumberingEmployeeData.isAlphaNumeric?autoNumberingEmployeeData.sequenceCode:'',
            sequenceNumber: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.sequenceNumber:null,
            autoNumberingItems: autoNumberingEmployeeData.autoGenerated?autoNumberingEmployeeData.autoNumberingItems:[]
          }
        ]
      }
    }
    
    console.log('input', input);
    apicaller('post', `${BASEURL}/autoNumbering/save`, input)
    .then(res => {
      if(res.status === 200) {
        console.log('res.data', res.data)
        setState({
          open: true,
          message: action === 'CREATE' ? 'Auto Numbering Setup Created Successfully' : 'Auto Numbering Setup Updated Successfully',
          toastrStyle: 'toastr-success',
          vertical: 'top',
          horizontal: 'right'
        })
        history.push('/autoNumberingSetup')
      }
    })
    .catch(err => {
      console.log('error', err)
    })
  }
  return (
    <>
      {/* <PageTitle
        titleHeading="Customer"
        titleDescription="Coming soon"
      /> */}

      <AutoNumberingSetupDesignation autoNumberingData={autoNumberingDesignationData} setAutoNumberingData={setAutoNumberingDesignationData} />
      <br />
      <AutoNumberingSetupLocation autoNumberingData={autoNumberingLocationData} setAutoNumberingData={setAutoNumberingLocationData} />
      <br />
      <AutoNumberingSetupDepartment autoNumberingData={autoNumberingDepartmentData} setAutoNumberingData={setAutoNumberingDepartmentData} />
      <br />
      <AutoNumberingSetupEmployeeID autoNumberingData={autoNumberingEmployeeData} setAutoNumberingData={setAutoNumberingEmployeeData} />
      <br />
      <Grid container direction="row">
        <Button
          className="btn-primary  mb-2 m-4 pl-4"
          onClick={(e) => save(e)}>
          Save
        </Button>
      </Grid>
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
  );
}

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AutoNumberingSetup);