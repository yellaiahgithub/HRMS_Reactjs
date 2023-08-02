import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Snackbar,
  MenuItem,
  TextField,
  Switch,
  Popover
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import 'date-fns';
// List
import apicaller from 'helper/Apicaller';
import { Autocomplete } from '@material-ui/lab';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import DropZoneComponent from './DropZoneComponent';
import jsPDF from 'jspdf';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GenerateLetter = (props) => {
  const { selectedCompany } = props;
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [signingAuthority, setSigningAuthority] = useState('');
  const [selectedLetterIndex, setSelectedLetterIndex] = useState();
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState();
  const [signingAuthorityIndex, setSigningAuthorityIndex] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [letters, setLetters] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [uploadSignature, setUploadSignature] = useState(true);
  const [uploadHeader, setUploadHeader] = useState(false);
  const [uploadFooter, setUploadFooter] = useState(false);
  const [uploadedHeader, setUploadedHeader] = useState(null);
  const [uploadedFooter, setUploadedFooter] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [variables, setAllVariables] = useState([]);
  const [letterContent, setLetterContent] = useState();
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    getLetters();
    getEmployees();
    getTemplateVariables();
  }, []);

  const getTemplateVariables = () => {
    apicaller('get', `${BASEURL}/letterTemplateVariables/fetch`)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          setAllVariables(res.data);
        }
      })
      .catch((err) => {
        setBlocking(false);
        console.log('getLetter err', err);
      });
  };

  const getLetters = () => {
    setBlocking(true);
    apicaller('get', `${BASEURL}/letterTemplate/fetch`)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          console.log('res.data', res.data);
          setLetters(res.data);
        }
      })
      .catch((err) => {
        setBlocking(false);
        console.log('getLetter err', err);
      });
  };
  const getEmployees = () => {
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID;
          }
          setEmployees(res.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const preview = () => {
    setIsSubmitted(true);
    const errors = validate();
    if (errors.length == 0) setShowPreview(true);
    else {
      setState({
        open: true,
        message: errors.toString(),
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  const generateAndDownload = (e) => {
    setIsSubmitted(true);
    const errors = validate();
    if (errors.length == 0) generatePDF(true);
    else {
      setState({
        open: true,
        message: errors.toString(),
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  const generateAndEmail = (e) => {
    setIsSubmitted(true);
    const errors = validate();
    if (errors.length == 0) generatePDF(false);
    else {
      setState({
        open: true,
        message: errors.toString(),
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  const clearFields = (e) => {
    setSelectedEmployee(null);
    setSelectedLetter(null);
    setSigningAuthority(null);
    setUploadFooter(false);
    setUploadFooter(null);
    setUploadHeader(false);
    setUploadedHeader(null);
    setUploadSignature(true);
    setUploadedSignature(null);
    setSelectedLetterIndex(null);
    setSelectedEmployeeIndex(null);
    setSigningAuthorityIndex(null);
  };
  const validate = () => {
    let errors = [];
    if (!selectedEmployee)
      errors.push('Kindly Select Employee to generate Letter');
    if (!selectedLetter)
      errors.push('Kindly Select Letter type before generation');
    if (!signingAuthority)
      errors.push(
        'Kindly Select Signing Authority Employee before generating Letter'
      );
    if (uploadHeader) if (!uploadedHeader) errors.push('Kindly Upload Header');
    if (uploadFooter) if (!uploadedFooter) errors.push('Kindly Upload Footer');
    if (!uploadSignature)
      if (!uploadedSignature) errors.push('Kindly Upload Signature');
    return errors;
  };
  const generateHtml = (letter, employee, signingAuthority) => {
    if (letter?.body && employee) {
      let htmlData = letter.body
      htmlData = htmlData.replace(new RegExp('&lt;', 'g'), '<');
      htmlData = htmlData.replace(new RegExp('&gt;', 'g'), '>');

      for (let index = 0; index < variables.length; index++) {
        const variable = variables[index];
        htmlData = htmlData?.replace(
          new RegExp(variable.name, 'g'),
          templateVariableReplace(variable, employee, signingAuthority)
        );
      }
      htmlData = '&nbsp;' + htmlData;
      setLetterContent(htmlData);
    }
  };

  //replace based on type
  const templateVariableReplace = (variable, employee, signingAuthority) => {
    if (variable.type.toLowerCase() === 'Employee'.toLowerCase())
      return employee?.[variable.mappingName];
    else if (variable.type.toLowerCase() === 'SigningAuthority'.toLowerCase())
      return signingAuthority?.[variable.mappingName];
    else if (
      variable.type.toLowerCase() === 'SigningAuthoritySignature'.toLowerCase()
    ) {
      return "_____________________"
      // return "<img src={uploadedSignature} alt='sign' width='150' height='75'/>";
    }
     else if (variable.type.toLowerCase() === 'Date'.toLowerCase())
      return new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      });
  };
  const generatePDF = (download) => {
    const element = document.getElementById('downloadLetter');
    html2canvas(element).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');
      var imgWidth = 210;
      var totalPageHeight = 296;
      var pageHeight = 296;
      var headerHeight = 30;
      var headerWidth = 190;
      var footerHeight = 20;
      var footerWidth = 190;
      if (uploadHeader) pageHeight = pageHeight - headerHeight - 10;
      if (uploadFooter) pageHeight = pageHeight - footerHeight - 10;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm');
      var position = 10;
      if (uploadHeader) {
        doc.addImage(
          uploadedHeader,
          'PNG',
          10,
          position,
          headerWidth,
          headerHeight
        );
        position = position + headerHeight;
      }
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      if (uploadFooter)
        doc.addImage(
          uploadedFooter,
          'PNG',
          10,
          totalPageHeight - footerHeight - 10,
          footerWidth,
          footerHeight
        );
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        // if (uploadHeader) {
        //   doc.addImage(
        //     uploadedHeader,
        //     'PNG',
        //     10,
        //     0,
        //     headerWidth,
        //     headerHeight
        //   );
        //   // position = position - headerHeight - 10;
        // }
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        if (uploadFooter)
          doc.addImage(
            uploadedFooter,
            'PNG',
            10,
            totalPageHeight - footerHeight - 10,
            footerWidth,
            footerHeight
          );
        heightLeft -= pageHeight;
      }
      if (download)
        doc.save(
          selectedLetter.name + new Date().toLocaleDateString() + '.pdf'
        );
      else window.open(doc.output('bloburl'));
    });
  };
  return (
    <Card>
      <BlockUi
        className="p-4"
        tag="div"
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <br />
        <Grid container spacing={0}>
          <Grid item md={12}>
            <h4 className="m-2 text-center">Generate Letter</h4>
            <br />
            <Grid container>
              <Grid item container spacing={2} direction="column">
                <Grid item md={6} lg={6} xl={6}>
                  <label className="mb-2">Select Letter</label>
                  <TextField
                    id="outlined-selectedEmployee"
                    label={selectedLetter ? '' : 'Select Letter'}
                    variant="outlined"
                    fullWidth
                    select
                    size="small"
                    value={letters[selectedLetterIndex]}
                    error={isSubmitted && (selectedLetter ? false : true)}
                    helperText={
                      isSubmitted &&
                      (selectedLetter ? '' : 'Field is Mandatory')
                    }
                    onChange={(event) => {
                      setSelectedLetter(event.target.value);
                      const index = letters.findIndex(
                        (letter) => letter == event.target.value
                      );
                      if (index != -1) {
                        setSelectedLetterIndex(index);
                      } else {
                        setSelectedLetterIndex(null);
                      }
                      generateHtml(
                        event.target.value,
                        selectedEmployee,
                        signingAuthority
                      );
                    }}>
                    {letters.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} lg={6} xl={6}>
                  <div>
                    <label className=" mb-2">
                      Select Employee for whom the letter needs to be generated
                    </label>
                    <br />
                    <div>
                      <Autocomplete
                        id="combo-box-demo"
                        options={employees}
                        getOptionLabel={(option) =>
                          option.nameWithId ? option.nameWithId : ''
                        }
                        value={employees[selectedEmployeeIndex] || undefined}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="selectedEmployee"
                            error={
                              isSubmitted && (selectedEmployee ? false : true)
                            }
                            helperText={
                              isSubmitted &&
                              (selectedEmployee ? '' : 'Field is Mandatory')
                            }
                          />
                        )}
                        onChange={(event, value) => {
                          setSelectedEmployee(value);
                          generateHtml(selectedLetter, value, signingAuthority);
                          const index = employees.findIndex(
                            (emp) => emp == value
                          );
                          if (index != -1) {
                            setSelectedEmployeeIndex(index);
                          } else {
                            setSelectedEmployeeIndex(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6}>
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Add Header to the Letter
                  </label>
                  <Checkbox
                    id="outlined-uploadHeader"
                    placeholder="Is uploadHeader"
                    variant="outlined"
                    size="small"
                    checked={uploadHeader}
                    onChange={(event) => {
                      setUploadHeader(event.target.checked);
                    }}
                  />
                </Grid>
                <Grid item md={12}>
                  {uploadHeader && (
                    <DropZoneComponent
                      isHeader={true}
                      setUploadedSignature={setUploadedSignature}
                      setUploadedHeader={setUploadedHeader}
                      setUploadedFooter={setUploadedFooter}></DropZoneComponent>
                  )}
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6}>
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Add Footer to the Letter
                  </label>
                  <Checkbox
                    id="outlined-uploadFooter"
                    placeholder="Is uploadFooter"
                    variant="outlined"
                    size="small"
                    checked={uploadFooter}
                    onChange={(event) => {
                      setUploadFooter(event.target.checked);
                    }}
                  />
                </Grid>
                <Grid item md={12}>
                  {uploadFooter && (
                    <DropZoneComponent
                      isFooter={true}
                      setUploadedSignature={setUploadedSignature}
                      setUploadedHeader={setUploadedHeader}
                      setUploadedFooter={setUploadedFooter}></DropZoneComponent>
                  )}
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={6} lg={6} xl={6}>
                  <div>
                    <label className=" mb-2">Select Signigning Authority</label>
                    <br />
                    <div>
                      <Autocomplete
                        id="combo-box-demo"
                        options={employees}
                        getOptionLabel={(option) =>
                          option.nameWithId ? option.nameWithId : ''
                        }
                        value={employees[signingAuthorityIndex] || undefined}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="signingAuthority"
                            error={
                              isSubmitted && (signingAuthority ? false : true)
                            }
                            helperText={
                              isSubmitted &&
                              (signingAuthority ? '' : 'Field is Mandatory')
                            }
                          />
                        )}
                        onChange={(event, value) => {
                          setSigningAuthority(value);
                          generateHtml(selectedLetter, selectedEmployee, value);
                          const index = employees.findIndex(
                            (emp) => emp == value
                          );
                          if (index != -1) {
                            setSigningAuthorityIndex(index);
                          } else {
                            setSigningAuthorityIndex(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item md={7}>
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    To be Physically Signed &nbsp;
                  </label>
                  <Switch
                    onChange={(event) => {
                      setUploadSignature(event.target?.checked);
                    }}
                    checked={uploadSignature}
                    name="upload"
                    color="primary"
                    className="switch-small"
                  />
                </Grid>
              </Grid>
              <Grid item md={12}>
                {!uploadSignature && (
                  <DropZoneComponent
                    isSignature={true}
                    setUploadedSignature={setUploadedSignature}
                    setUploadedHeader={setUploadedHeader}
                    setUploadedFooter={setUploadedFooter}></DropZoneComponent>
                )}
              </Grid>
              <br />
              {/* <a
                onClick={(e) => {
                  setShowPreview(true);
                  // generatePDF(false);
                }}
                style={{ color: 'blue' }}>
                View Sample Letter
              </a>
              <br /> */}
            </Grid>
            <Box textAlign="right">
              <Button
                className="btn-primary mb-2 mr-3"
                type="submit"
                onClick={(e) => preview(e)}>
                Preview Letter
              </Button>
              {/* <Button
                className="btn-primary mb-2 mr-3"
                type="submit"
                onClick={(e) => generateAndDownload(e)}>
                Generate Letter & Download a copy
              </Button> */}
              {/* <Button
                className="btn-primary mb-2 mr-3"
                type="submit"
                onClick={(e) => clearFields(e)}>
                Clear Fields
              </Button> */}
              <Button
                className="btn-primary mb-2 mr-3"
                component={NavLink}
                to="./letters">
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Popover
          open={showPreview}
          onClose={(e) => setShowPreview(false)}
          style={{
            top: '0',
            left: '320px',
            right: '10px',
            maxHeight: '800px !important',
            maxWidth: '100% !important',
            margin: '0 auto',
            position: 'absolute',
            width: '100% !important',
            minWidth: '100% !important'
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center'
          }}>
          <div
            style={{
              width: '1300px',
              height: '800px'
            }}>
            {uploadHeader && (
              <img
                src={uploadedHeader}
                alt="action"
                width="100%"
                height="100"
              />
            )}
            <div id="downloadLetter">
              <div
                style={{
                  margin: '50px 50px',
                  marginTop: '100px',
                  width: '100% !important'
                }}>
                <br />
                <Grid container spacing={2} direction="column">
                  <Grid item md={11} direction="row">
                    <div dangerouslySetInnerHTML={{ __html: letterContent }} />
                  </Grid>
                </Grid>
              </div>
            </div>
            {uploadFooter && (
              <img
                src={uploadedFooter}
                alt="action"
                width="100%"
                height="100"
              />
            )}
            <br />
            <Box
              textAlign="right"
              style={{ marginRight: '10%', marginTop: '2%' }}>
              <Button
                onClick={(e) => setShowPreview(false)}
                className="btn-primary mb-2 mr-3">
                close
              </Button>
              <Button
                className="btn-primary mb-2 mr-3"
                type="submit"
                onClick={(e) => generateAndEmail(e)}>
                Generate Letter & Email to Employee
              </Button>
              <Button
                className="btn-primary mb-2 mr-3"
                type="submit"
                onClick={(e) => generateAndDownload(e)}>
                Generate Letter & Download a copy
              </Button>
            </Box>
          </div>
        </Popover>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />
        <br />
      </BlockUi>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GenerateLetter);
