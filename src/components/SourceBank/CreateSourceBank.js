import {
  Box,
  Button,
  Card,
  Grid,
  Snackbar,
  TextField,
  Table,
  Dialog
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import 'date-fns';
// List
import apicaller from 'helper/Apicaller';
import { Autocomplete } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateSourceBank = (props) => {
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Source Bank' : 'Create Source Bank';

  const [uuid, setUUID] = useState();
  const [bankUUID, setBankUUID] = useState();
  const [sourceBankIndex, setSourceBankIndex] = useState();
  const [sourceBranchIndex, setSourceBranchIndex] = useState();
  const [branchUUID, setBranchUUID] = useState();
  const [ifscCode, setIfscCode] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [accountName, setAccountName] = useState();
  const [accountType, setAccountType] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [currency, setCurrency] = useState();
  const [targetBranches, setTargetBranches] = useState([]);
  const [allBanksData, setAllBanksData] = useState([]);
  const [selectedBank, setSelectedBank] = useState();
  const [selectedBranch, setSelectedBranch] = useState();
  const [addressModal, setAddressModal] = useState(false);
  const toggle3 = () => setAddressModal(!addressModal);

  const accountTypes = [
    'Savings Account',
    'Current Account',
    'Salary Account',
    'Overdraft Account'
  ];

  const currencies = ['INR', 'USD', 'POUND'];
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleRemoveTargetBranchClick = (i) => {
    const list = [...targetBranches];
    list.splice(i, 1);
    setTargetBranches(list);
  };

  const handleAddTargetBranchClick = () => {
    const list = [...targetBranches];
    list.push({
      bankUUID: null,
      branchUUID: null
    });
    setTargetBranches(list);
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  const getSourceBank = (allBanks) => {
    apicaller('get', `${BASEURL}/sourceBank/fetchByUUID/` + id)
      .then((res) => {
        if (res.status === 200) {
          const sourceBankData = res.data[0];
          setUUID(sourceBankData.uuid);
          setBankUUID(sourceBankData.bankUUID);
          setBranchUUID(sourceBankData.branchUUID);
          setIfscCode(sourceBankData.ifscCode);
          setAccountNumber(sourceBankData.accountNumber);
          setAccountName(sourceBankData.accountName);
          setAccountType(sourceBankData.accountType);
          setPhoneNumber(sourceBankData.phoneNumber);
          setCurrency(sourceBankData.currency);
          setTargetBranches(sourceBankData.targetBranches);
          const bankIndex = allBanks.findIndex(
            (bank) => bank.uuid == sourceBankData.bankUUID
          );
          const bank = bankIndex != -1 ? allBanks[bankIndex] : null;
          setSelectedBank(bank);
          setSourceBankIndex(bankIndex != -1 ? bankIndex : null);
          const branchIndex = bank?.branches?.findIndex(
            (branch) => branch.uuid == sourceBankData.branchUUID
          );
          const branch = branchIndex != -1 ? bank?.branches[branchIndex] : null;
          setSelectedBranch(branch);
          setSourceBranchIndex(branchIndex != -1 ? branchIndex : null);
        }
      })
      .catch((err) => {
        console.log('get source bank by id', err);
      });
  };

  const getAllBanks = () => {
    apicaller('get', `${BASEURL}/bank/fetchBanksWithBranches`)
      .then((res) => {
        if (res.status === 200) {
          const allBanksData = res.data;
          setAllBanksData(allBanksData);
          if (id) {
            getSourceBank(allBanksData);
          } else {
            handleAddTargetBranchClick();
          }
        }
      })
      .catch((err) => {
        console.log('fetch all banks', err);
      });
  };

  const save = (e) => {
    e.preventDefault();
    //to do service call

    setIsSubmitted(true);
    let reqTargetBankDetails = [];
    targetBranches.forEach((target) => {
      reqTargetBankDetails.push({
        bankUUID: target.bankUUID,
        branchUUID: target.branchUUID
      });
    });
    let inputObj = {
      uuid: uuid,
      bankUUID: bankUUID,
      branchUUID: branchUUID,
      ifscCode: ifscCode,
      accountNumber: accountNumber,
      accountName: accountName,
      accountType: accountType,
      phoneNumber: phoneNumber,
      currency: currency,
      targetBranches: reqTargetBankDetails,
    };
    const isValid =
      inputObj.bankUUID?.length > 0 &&
      inputObj.branchUUID?.length > 0 &&
      inputObj.accountNumber?.length > 0 &&
      inputObj.accountName?.length > 0 &&
      inputObj.accountType?.length > 0;
    let isTargetBranchValid = true;
    for (let index = 0; index < targetBranches.length; index++) {
      isTargetBranchValid =
        targetBranches[index].bankUUID?.length > 0 &&
        targetBranches[index].branchUUID?.length > 0;
      if (!isTargetBranchValid) break;
    }
    if (isValid && isTargetBranchValid) {
      if (inputObj.uuid == null) {
        apicaller('post', `${BASEURL}/sourceBank/save`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setUUID(res.data[0].uuid);
              setState({
                open: true,
                message: 'SourceBank Created Successfully',
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
            console.log('create SourceBank err', err);
          });
      } else {
        apicaller('put', `${BASEURL}/sourceBank/update`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'SourceBank Updated Successfully',
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
            console.log('update SourceBank err', err);
          });
      }
    } else {
      setState({
        open: true,
        message:
          'Errors exists in this page kindly resolve them before saving.',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  return (
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item xs={10} md={10} lg={7} xl={11} className="mx-auto">
          <h4 className="m-2 text-center">{saveButtonLabel}</h4>
          <br />
          <Grid container>
            <Grid item container spacing={2} direction="row">
              <Grid item md={6}>
                <label className="mb-2">Source Bank Name *</label>
                <br />
                <Autocomplete
                  id="combo-box-demo"
                  options={allBanksData}
                  getOptionLabel={(option) => option.name}
                  value={selectedBank || undefined}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select"
                      variant="outlined"
                      fullWidth
                      size="small"
                      name="selectedBank"
                      required={false}
                      error={isSubmitted && !selectedBank}
                      helperText={
                        isSubmitted && !selectedBank
                          ? 'Source Bank is Mandatory'
                          : null
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = allBanksData.findIndex(
                      (bank) => bank.name == value?.name
                    );
                    if (index != -1) {
                      setSelectedBank(value);
                      setBankUUID(value?.uuid);
                      setSourceBankIndex(index);
                    } else {
                      setSelectedBank(null);
                      setBankUUID(null);
                      setSourceBankIndex(null);
                    }
                    setSourceBranchIndex(null);
                    setSelectedBranch(null);
                    setBranchUUID(null);
                  }}
                />
              </Grid>
              <Grid item md={12} className="mx-auto">
                <Card className='p-4' >
                  <br />
                  <Grid container spacing={2}>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={11}>
                        <label className="mb-2 p-2">Source Bank Branch </label>
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">Select Branch *</label>
                        <Autocomplete
                          id="combo-box-demo"
                          options={selectedBank ? selectedBank?.branches : []}
                          getOptionLabel={(option) =>
                            option.name ? option.name : ''
                          }
                          noOptionsText={
                            selectedBank ? 'Not Available' : 'select bank first'
                          }
                          value={
                            sourceBranchIndex != null
                              ? selectedBank?.branches[sourceBranchIndex]
                              : null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="selectedBranch"
                              required={false}
                              error={isSubmitted && !selectedBranch}
                              helperText={
                                isSubmitted && !selectedBranch
                                  ? 'Source Bank is Mandatory'
                                  : null
                              }
                              value={
                                sourceBranchIndex != null
                                  ? selectedBank?.branches[sourceBranchIndex]
                                  : null
                              }
                            />
                          )}
                          onChange={(event, value) => {
                            const index = selectedBank.branches?.findIndex(
                              (bank) => bank.name == value?.name
                            );
                            setIfscCode(value?.ifscCode);
                            if (index != -1) {
                              setSelectedBranch(value);
                              setBranchUUID(value?.uuid);
                              setSourceBranchIndex(index);
                            } else {
                              setSelectedBranch(null);
                              setBranchUUID(null);
                              setSourceBranchIndex(null);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">IFSC Code </label>
                        <TextField
                          id="outlined-description"
                          placeholder="IFSC Code"
                          type="text"
                          variant="outlined"
                          fullWidth
                          size="small"
                          disabled={true}
                          value={ifscCode}
                          onChange={(event) => {
                            setIfscCode(event.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">Bank Account Number *</label>
                        <TextField
                          id="outlined-account-number"
                          placeholder="Account Number"
                          type="text"
                          label="Account Number"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={accountNumber}
                          required={false}
                          error={isSubmitted && !accountNumber}
                          helperText={
                            isSubmitted && !accountNumber
                              ? 'Account Number is Mandatory'
                              : null
                          }
                          onChange={(event) => {
                            setAccountNumber(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">Account Name *</label>
                        <TextField
                          id="outlined-account-name"
                          placeholder="Account Name"
                          label="Account Name"
                          type="text"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={accountName}
                          required={false}
                          error={isSubmitted && !accountName}
                          helperText={
                            isSubmitted && !accountName
                              ? 'Account Name is Mandatory'
                              : null
                          }
                          onChange={(event) => {
                            setAccountName(event.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">Account Type *</label>
                        <Autocomplete
                          id="combo-box-demo"
                          options={accountTypes}
                          getOptionLabel={(option) => option}
                          noOptionsText={
                            accountTypes
                              ? 'Not Available'
                              : 'Account Types not available'
                          }
                          value={accountType || undefined}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="accountType"
                              required={false}
                              error={isSubmitted && !accountType}
                              helperText={
                                isSubmitted && !accountType
                                  ? 'Account Type is Mandatory'
                                  : null
                              }
                            />
                          )}
                          onChange={(event, value) => {
                            setAccountType(value);
                          }}
                        />
                      </Grid>
                      <Grid item md={5} className="mx-auto">
                        <label className="mb-2">Phone Number</label>
                        <TextField
                          id="outlined-description"
                          placeholder="Phone Number"
                          type="text"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={phoneNumber}
                          onChange={(event) => {
                            setPhoneNumber(event.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={5} className="mx-auto"></Grid>{' '}
                      <Grid item md={5} className="mx-auto">
                        <label>Currency</label>
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="row">
                      <Grid item md={5} className="mx-auto">
                        <Button
                          className="btn-primary mb-2 mr-3"
                          onClick={(e) => setAddressModal(true)}>
                          View Address
                        </Button>
                      </Grid>
                      <Grid item md={5} className="mx-auto">
                        <Autocomplete
                          id="combo-box-demo"
                          options={currencies}
                          getOptionLabel={(option) => option}
                          noOptionsText={
                            currencies
                              ? 'Not Available'
                              : 'currencies are not available'
                          }
                          value={currency || undefined}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="currency"
                            />
                          )}
                          onChange={(event, value) => {
                            setCurrency(value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                </Card>
              </Grid>
              <Grid item container direction="row" spacing={2}></Grid>
              <Grid item container direction="row" spacing={2}>
                <Grid item md={12} className="mx-auto">
                  <Button
                    style={{ paddingTop: '1%' }}
                    disabled={readOnly}
                    onClick={handleAddTargetBranchClick}
                    className="float-right btn-primary mb-2">
                    {'Add Target Bank'}
                  </Button>
                </Grid>
                <Grid item md={12} className="mx-auto">
                  <div className='flex-column flex-md-row table-responsive-md'>
                    <Table className="table table-hover table-striped text-nowrap mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th style={{ width: '40%' }} className="text-center">
                            Bank Name
                          </th>
                          <th style={{ width: '40%' }} className="text-center">
                            Branch Name
                          </th>
                          <th style={{ width: '20%' }} className="text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {targetBranches?.map((item, idx) => (
                          <tr>
                            <td className="text-center">
                              <div>
                                <Autocomplete
                                  id="combo-box-demo"
                                  options={allBanksData}
                                  getOptionLabel={(option) => option.name}
                                  getOptionSelected={(option, value) =>
                                    option.name === value?.name
                                  }
                                  noOptionsText={'Banks not available'}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      name="selectedBank"
                                      required={true}
                                      error={
                                        isSubmitted && !targetBranches[idx].bank
                                      }
                                      helperText={
                                        isSubmitted && !targetBranches[idx].bank
                                          ? 'Target Bank is Mandatory'
                                          : null
                                      }
                                    />
                                  )}
                                  onChange={(e, value) => {
                                    const newArray = targetBranches.map(
                                      (item, i) => {
                                        if (idx === i) {
                                          return {
                                            bankUUID: value?.uuid,
                                            bank: value
                                          };
                                        } else {
                                          return item;
                                        }
                                      }
                                    );
                                    newArray[idx].branchIndex = null;
                                    setTargetBranches(newArray);
                                  }}
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <Autocomplete
                                  id="combo-box-demo"
                                  options={item.bank ? item.bank?.branches : []}
                                  getOptionLabel={(option) => option.name}
                                  noOptionsText={
                                    item.bank
                                      ? 'Not Available'
                                      : 'select bank first'
                                  }
                                  value={
                                    item?.branchIndex != null
                                      ? item?.bank?.branches[
                                          item?.branchIndex
                                        ] || undefined
                                      : null
                                  }
                                  filterOptions={(options) => {
                                    let filteredBranches = [];
                                    options.forEach((option) => {
                                      const found = targetBranches.find(
                                        (target) =>
                                          item.branchUUID !=
                                            target.branchUUID &&
                                          target.branchUUID == option.uuid
                                      );
                                      if (!found) {
                                        filteredBranches.push(option);
                                      }
                                    });
                                    return filteredBranches;
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      name="selectedTargetBranch"
                                      value={
                                        item?.branchIndex != null
                                          ? item?.bank?.branches[
                                              item?.branchIndex
                                            ] || undefined
                                          : null
                                      }
                                      required={true}
                                      error={
                                        isSubmitted &&
                                        !targetBranches[idx].branch
                                      }
                                      helperText={
                                        isSubmitted &&
                                        !targetBranches[idx].branch
                                          ? 'Target Branch is Mandatory'
                                          : null
                                      }
                                    />
                                  )}
                                  onChange={(e, value) => {
                                    const branchidx =
                                      item.bank.branches.findIndex(
                                        (branch) => branch.name == value?.name
                                      );
                                    const newArray = targetBranches.map(
                                      (item, i) => {
                                        if (idx === i) {
                                          return {
                                            ...item,
                                            branchUUID: value?.uuid,
                                            branch: value
                                          };
                                        } else {
                                          return item;
                                        }
                                      }
                                    );
                                    if (branchidx != -1) {
                                      newArray[idx].branchIndex = branchidx;
                                    } else {
                                      newArray[idx].branchIndex = null;
                                    }
                                    setTargetBranches(newArray);
                                  }}
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <Button
                                  disabled={readOnly}
                                  onClick={() =>
                                    handleRemoveTargetBranchClick(idx)
                                  }
                                  className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon
                                    icon={['fas', 'times']}
                                    className="font-size-sm"
                                  />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <Dialog
                    open={addressModal}
                    onClose={toggle3}
                    classes={{ paper: 'shadow-lg rounded' }}>
                    <div className="p-5">
                      <h4 className="text-center"> Branch Address</h4>
                      {!selectedBranch && (
                        <>
                          <p className="text-center" style={{ color: 'red' }}>
                            *** Branch is not selected yet ***
                          </p>
                        </>
                      )}
                      <div>
                        <Grid item container direction="row">
                          <Grid
                            item
                            md={12}
                            container
                            className="mx-auto"
                            direction="row">
                            <Grid item md={3} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                Line one
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                {selectedBranch
                                  ? selectedBranch?.addressLine1
                                    ? selectedBranch?.addressLine1
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                          <Grid item md={12} container direction="row">
                            <Grid item md={3}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                Line two
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                {selectedBranch
                                  ? selectedBranch?.addressLine2
                                    ? selectedBranch?.addressLine2
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                          <Grid item md={12} container direction="row">
                            <Grid item md={3}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                City
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                {selectedBranch
                                  ? selectedBranch?.city
                                    ? selectedBranch?.city
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                          <Grid item md={12} container direction="row">
                            <Grid item md={3}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                State
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                {selectedBranch
                                  ? selectedBranch?.state
                                    ? selectedBranch?.state
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                          <Grid item md={12} container direction="row">
                            <Grid item md={3}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                Country
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                {selectedBranch
                                  ? selectedBranch?.country
                                    ? selectedBranch?.country
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                          <Grid item md={12} container direction="row">
                            <Grid item md={3}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                Pin Code
                              </label>
                            </Grid>
                            <Grid item md={1} className="mx-auto">
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                :
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <label
                                style={{ marginTop: '15px' }}
                                className="mb-2">
                                {selectedBranch
                                  ? selectedBranch?.pinCode
                                    ? selectedBranch?.pinCode
                                    : '-'
                                  : '-'}
                              </label>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                      <div className="pt-4">
                        <Button
                          onClick={toggle3}
                          className="btn-neutral-primary btn-pill mx-1">
                          <span className="btn-wrapper--label">Cancel</span>
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                </Grid>
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
              component={NavLink}
              to="./sourceBank">
              Cancel
            </Button>
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => save(e)}>
              {saveButtonLabel}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateSourceBank);
