import {
  Box,
  Button,
  Card,
  Grid,
  Snackbar,
  Table,
  Checkbox
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import 'date-fns';
// List
import apicaller from 'helper/Apicaller';

const CreateOrgChartSetup = (props) => {
  const { selectedCompany } = props;
  const history = useHistory();
  const [isSubmitted, setIsSubmitted] = useState();

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const [uuid, setUUID] = useState();
  const [attributesList, setAttributesList] = useState([]);
  const [employeeTypeList, setEmployeeTypeList] = useState([]);
  const [checkAllAttributes, setCheckAllAttributes] = useState(false);
  const [checkAllEmployeeTypes, setCheckAllEmployeeTypes] = useState(false);

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  useEffect(() => {
    getOrgChartSetup();
  }, []);

  const getOrgChartSetup = () => {
    apicaller('get', `${BASEURL}/orgChartSetup/` + selectedCompany.uuid)
      .then((res) => {
        if (res.status === 200) {
          const orgChartSetupData = res.data;
          setUUID(orgChartSetupData.uuid);
          setAttributesList(orgChartSetupData.attributesList);
          setEmployeeTypeList(orgChartSetupData.employeeTypeList);
          const unselectedAttributesList =
            orgChartSetupData.attributesList.find((rule) => !rule.isSelected);
          if (unselectedAttributesList == null) {
            setCheckAllAttributes(true);
          }
          const unselectedEmployeeTypeList =
            orgChartSetupData.employeeTypeList.find((rule) => !rule.isSelected);
          if (unselectedEmployeeTypeList == null) {
            setCheckAllEmployeeTypes(true);
          }
        }
      })
      .catch((err) => {
        console.log('get orgChartSetup by company', err);
      });
  };

  const save = (e) => {
    e.preventDefault();

    setIsSubmitted(true);
    let inputObj = {
      companyUUID: selectedCompany.uuid,
      attributesList: attributesList,
      employeeTypeList: employeeTypeList
    };
    if (uuid == null) {
      apicaller('post', `${BASEURL}/orgChartSetup/save`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            setUUID(res.data[0].uuid);
            setState({
              open: true,
              message: 'OrgChartSetup Created Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('create OrgChartSetup err', err);
        });
    } else {
      inputObj.uuid = uuid;
      apicaller('put', `${BASEURL}/orgChartSetup/update`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            setState({
              open: true,
              message: 'OrgChartSetup Updated Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('update OrgChartSetup err', err);
        });
    }
  };
  return (
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item md={10} lg={7} xl={11} className="mx-auto">
          <h4 className="m-2 text-center">{'Org Chart Setup'}</h4>
          <br />
          <Grid container>
            <Grid item container spacing={2} direction="row">
              <Grid item md={6}>
                <label className="mb-2">Org Chart Attributes</label>
              </Grid>
              <Grid item md={6}>
                <label className="mb-2">
                  Show the Following JobTypes in Direct Reports
                </label>
              </Grid>
              <Grid item md={6}>
                <div>
                  <Table className="table table-hover table-striped text-nowrap mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th>Attribute</th>
                        <th
                          style={{ width: '10%' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          <Checkbox
                            id="outlined-isOne-to-OneJob"
                            variant="outlined"
                            size="small"
                            checked={checkAllAttributes}
                            onChange={(event) => {
                              setCheckAllAttributes(event.target.checked);
                              const list = [...attributesList];
                              list.forEach((rule) => {
                                rule.isSelected = event.target.checked;
                              });
                              setAttributesList(list);
                            }}></Checkbox>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attributesList?.map((item, idx) => (
                        <tr>
                          <td>
                            <div>
                              <label
                                style={{ marginTop: '8px' }}
                                className=" mb-2">
                                {item.name}
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex ">
                              <Checkbox
                                id="isSelected"
                                variant="outlined"
                                size="small"
                                value={item.isSelected}
                                checked={item.isSelected}
                                onChange={(e) => {
                                  const list = [...attributesList];
                                  const tempItem = { ...item };
                                  tempItem.isSelected = e.target.checked;
                                  list.splice(idx, 1, tempItem);
                                  console.log(list);
                                  if (checkAllAttributes) {
                                    if (!e.target.checked) {
                                      setCheckAllAttributes(false);
                                    }
                                  } else {
                                    const unselectedRecord = list.find(
                                      (rule) => !rule.isSelected
                                    );
                                    if (unselectedRecord == null) {
                                      setCheckAllAttributes(true);
                                    }
                                  }
                                  setAttributesList(list);
                                }}></Checkbox>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <Table className="table table-hover table-striped text-nowrap mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th>Employee Type</th>
                        <th
                          style={{ width: '10%' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          <Checkbox
                            id="outlined-isOne-to-OneJob"
                            variant="outlined"
                            size="small"
                            checked={checkAllEmployeeTypes}
                            onChange={(event) => {
                              setCheckAllEmployeeTypes(event.target.checked);
                              const list = [...employeeTypeList];
                              list.forEach((rule) => {
                                rule.isSelected = event.target.checked;
                              });
                              setEmployeeTypeList(list);
                            }}></Checkbox>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeTypeList?.map((item, idx) => (
                        <tr>
                          <td>
                            <div>
                              <label
                                style={{ marginTop: '8px' }}
                                className=" mb-2">
                                {item.name}
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex ">
                              <Checkbox
                                id="isSelected"
                                variant="outlined"
                                size="small"
                                value={item.isSelected}
                                checked={item.isSelected}
                                onChange={(e) => {
                                  const list = [...employeeTypeList];
                                  const tempItem = { ...item };
                                  tempItem.isSelected = e.target.checked;
                                  list.splice(idx, 1, tempItem);
                                  console.log(list);
                                  if (checkAllEmployeeTypes) {
                                    if (!e.target.checked) {
                                      setCheckAllEmployeeTypes(false);
                                    }
                                  } else {
                                    const unselectedRecord = list.find(
                                      (rule) => !rule.isSelected
                                    );
                                    if (unselectedRecord == null) {
                                      setCheckAllEmployeeTypes(true);
                                    }
                                  }
                                  setEmployeeTypeList(list);
                                }}></Checkbox>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Grid>
              <div className="divider" />
              <div className="divider" />
            </Grid>
            <br />
          </Grid>
          <br />
          <Box textAlign="right">            
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => save(e)}>
              {'Save'}
            </Button>
          </Box>
        </Grid>
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
      <br />
      <br />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrgChartSetup);
