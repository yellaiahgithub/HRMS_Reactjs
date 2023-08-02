import {
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Snackbar,
  Table,
  TextField
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

const PasswordRules = (props) => {
  const { selectedCompany } = props;

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });

  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [passwordRulesList, setPasswordRulesList] = useState([]);
  const [checkAllRules, setCheckAllRules] = useState(false);
  const [uuid, setUUID] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containsType = ['Special Character', 'Upper Case', 'Lower Case'];
  const ruleNames = ['Length Rule', 'Contains Rule', 'Repetitive Rule'];
  const minOrMaxList = ['Minimum', 'Maximum'];

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const differentFromPreviousPwds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const containsLengthList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const handlePasswordRule = (index) => (e) => {
    const newArray = passwordRulesList.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value };
      } else {
        return item;
      }
    });
    setPasswordRulesList(newArray);
  };
  useEffect(() => {
    const lengthRule = {
      ruleName: ruleNames[0],
      maxLength: null,
      minLength: null,
      status: false
    };
    const repetitiveRule = {
      ruleName: ruleNames[2],
      count: null,
      status: false
    };
    const list = [...passwordRulesList];
    list.push(lengthRule, repetitiveRule);
    containsType.forEach((type) => {
      const rule = {
        ruleName: ruleNames[1],
        type: type,
        minOrMax: null,
        length: null,
        status: false
      };
      list.push(rule);
      setPasswordRulesList(list);
    });
    apicaller('get', `${BASEURL}/password-rule/` + selectedCompany.uuid)
      .then((res) => {
        if (res.status === 200) {
          if (res.data != null) {
            setUUID(res.data.uuid);
            console.log('Password Rules', res.data);
            const lengthRule = {
              ruleName: ruleNames[0],
              maxLength: res.data.lengthRule?.maximum,
              minLength: res.data.lengthRule?.minimum,
              status: res.data.lengthRule?.status
            };
            const repetitiveRule = {
              ruleName: ruleNames[2],
              count: res.data.repetitiveRule?.count,
              status: res.data.repetitiveRule?.status
            };
            const list = [];
            list.push(lengthRule, repetitiveRule);
            res.data.containsRule.forEach((containsRule) => {
              const rule = {
                ruleName: ruleNames[1],
                type: containsRule.type,
                minOrMax: containsRule.minOrMax,
                length: containsRule.length,
                status: containsRule.status
              };
              list.push(rule);
            });
            const unselectedRecord = list.find((rule) => !rule.status);
            if (unselectedRecord == null) {
              setCheckAllRules(true);
            }
            setPasswordRulesList(list);
          }
        }
      })
      .catch((err) => {
        console.log('get Password Rules Error', err);
      });
  }, []);

  const save = () => {
    setIsSubmitted(true);
    const lengthRule = passwordRulesList.find(
      (rule) => rule.ruleName.toLowerCase() === ruleNames[0].toLowerCase()
    );
    if (
      lengthRule.status &&
      Number(lengthRule?.maxLength) < Number(lengthRule?.minLength)
    ) {
      setState({
        open: true,
        message:
          'Length Rule error: Max length should be greater than Min length',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    } else {
      const inputObj = {};
      inputObj.companyUUID = selectedCompany.uuid;
      inputObj.containsRule = [];
      inputObj.uuid = uuid;
      for (let index = 0; index < passwordRulesList.length; index++) {
        const rule = passwordRulesList[index];
        if (rule.ruleName.toLowerCase() === ruleNames[0].toLowerCase()) {
          inputObj.lengthRule = {
            minimum: Number(rule.minLength),
            maximum: Number(rule.maxLength),
            status: rule.status
          };
        }
        if (rule.ruleName.toLowerCase() === ruleNames[1].toLowerCase()) {
          const containsRule = {
            minOrMax: rule.minOrMax,
            length: rule.length,
            status: rule.status,
            type: rule.type
          };
          inputObj.containsRule.push(containsRule);
        }
        if (rule.ruleName.toLowerCase() === ruleNames[2].toLowerCase()) {
          inputObj.repetitiveRule = {
            count: rule.count,
            status: rule.status
          };
        }
      }
      if (uuid) {
        apicaller(
          'patch',
          `${BASEURL}/password-rule/` + selectedCompany.uuid,
          inputObj
        )
          .then((res) => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'Password Rules Updated Sucessfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            console.log('Save Password Rules Error', err);
          });
      } else {
        apicaller('post', `${BASEURL}/password-rule`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setUUID(res.data[0].uuid);
              setState({
                open: true,
                message: 'Password Rules Created Sucessfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            console.log('Save Password Rules Error', err);
          });
      }
    }
  };
  return (
    <Card>
      <br />
      <h4 className="text-center">Password Rules</h4>
      <br />
      <Grid item container direction="row" spacing={2}>
        <Grid item md={11} className="mx-auto">
          <div>
            <Table className="table table-hover table-striped text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th
                    style={{ width: '10%' }}
                    className="font-size-lg font-weight-bold pb-4 text-capitalize"
                    scope="col">
                    <Checkbox
                      id="outlined-isOne-to-OneJob"
                      variant="outlined"
                      size="small"
                      checked={checkAllRules}
                      onChange={(event) => {
                        setCheckAllRules(event.target.checked);
                        const list = [...passwordRulesList];
                        list.forEach((rule) => {
                          rule.status = event.target.checked;
                        });
                        setPasswordRulesList(list);
                      }}></Checkbox>
                  </th>
                  <th className="text-left">Rule Name</th>
                  <th className="text-left">Rule Description</th>
                </tr>
              </thead>
              <tbody>
                {passwordRulesList?.map((item, idx) => (
                  <tr>
                    <td>
                      <div className="d-flex ">
                        <Checkbox
                          id="status"
                          variant="outlined"
                          size="small"
                          value={item.status}
                          checked={item.status}
                          onChange={(e) => {
                            const list = [...passwordRulesList];
                            const tempItem = { ...item };
                            tempItem.status = e.target.checked;
                            list.splice(idx, 1, tempItem);
                            console.log(list);
                            if (checkAllRules) {
                              if (!e.target.checked) {
                                setCheckAllRules(false);
                              }
                            } else {
                              const unselectedRecord = list.find(
                                (rule) => !rule.status
                              );
                              if (unselectedRecord == null) {
                                setCheckAllRules(true);
                              }
                            }
                            setPasswordRulesList(list);
                          }}></Checkbox>
                      </div>
                    </td>
                    <td className="text-left">
                      <div>
                        <label style={{ marginTop: '8px' }} className=" mb-2">
                          {item.ruleName}
                        </label>
                      </div>
                    </td>
                    <td>
                      {item.ruleName?.toLowerCase() ==
                      ruleNames[0].toLowerCase() ? (
                        <>
                          {' '}
                          <Grid item container direction="row" spacing={1}>
                            <Grid item md={3.5} className="text-center mb-2">
                              <label
                                style={{ marginTop: '8px' }}
                                className="text-center mb-2">
                                {'Password Length should be'}
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <Grid item container direction="row" spacing={1}>
                                <Grid item md={2}>
                                  <label
                                    style={{ marginTop: '8px' }}
                                    className=" mb-2">
                                    {'Maximum'}
                                  </label>
                                </Grid>
                                <Grid item md={2}>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    name="maxLength"
                                    value={item.maxLength}
                                    disabled={!item.status}
                                    fullWidth
                                    type="number"
                                    error={
                                      isSubmitted &&
                                      item.status &&
                                      Number(item.maxLength) <
                                        Number(item.minLength)
                                    }
                                    onChange={handlePasswordRule(
                                      idx
                                    )}></TextField>
                                </Grid>
                                <Grid item md={2}>
                                  <label
                                    style={{ marginTop: '8px' }}
                                    className=" mb-2">
                                    {'Minimum'}
                                  </label>
                                </Grid>
                                {'   '}
                                <Grid item md={2}>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    name="minLength"
                                    type="number"
                                    fullWidth
                                    disabled={!item.status}
                                    value={item.minLength}
                                    error={
                                      isSubmitted &&
                                      item.status &&
                                      Number(item.maxLength) <
                                        Number(item.minLength)
                                    }
                                    onChange={handlePasswordRule(
                                      idx
                                    )}></TextField>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        ''
                      )}
                      {item.ruleName?.toLowerCase() ==
                      ruleNames[1].toLowerCase() ? (
                        <>
                          <Grid item container direction="row" spacing={2}>
                            <Grid item md={3.5} className="text-center mb-2">
                              <label
                                style={{ marginTop: '8px' }}
                                className=" mb-2">
                                {'Password Should Contain'}
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <Grid item container direction="row" spacing={1}>
                                <Grid item md={3} className="text-center mb-2">
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    name="minOrMax"
                                    select
                                    fullWidth
                                    disabled={!item.status}
                                    value={item.minOrMax}
                                    onChange={handlePasswordRule(idx)}>
                                    {minOrMaxList.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item md={2} className="text-center mb-2">
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    name="length"
                                    select
                                    fullWidth
                                    value={item.length}
                                    disabled={!item.status}
                                    onChange={handlePasswordRule(idx)}>
                                    {containsLengthList.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item md={2} className="text-center mb-2">
                                  {'      '}
                                  <label
                                    style={{ marginTop: '8px' }}
                                    className=" mb-2">
                                    {item.type}
                                  </label>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        ''
                      )}
                      {item.ruleName?.toLowerCase() ==
                      ruleNames[2].toLowerCase() ? (
                        <>
                          <Grid item container direction="row" spacing={2}>
                            <Grid item md={3.5} className="text-center mb-2">
                              <label
                                style={{ marginTop: '8px' }}
                                className=" mb-2">
                                {'Significantly Different from'}
                              </label>
                            </Grid>
                            <Grid item md={8}>
                              <Grid item container direction="row" spacing={1}>
                                <Grid item md={2} className="text-center mb-2">
                                  <label
                                    style={{ marginTop: '8px' }}
                                    className=" mb-2">
                                    {'Previous'}
                                  </label>
                                </Grid>
                                <Grid item md={2} className="text-center mb-2">
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    name="count"
                                    select
                                    fullWidth
                                    value={item.count}
                                    disabled={!item.status}
                                    onChange={handlePasswordRule(idx)}>
                                    {differentFromPreviousPwds.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item md={2} className="text-center mb-2">
                                  <label
                                    style={{ marginTop: '8px' }}
                                    className=" mb-2">
                                    {'Passwords'}
                                  </label>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <br />
          {passwordRulesList?.length > 0 && passwordRulesList[0].status && (
            <>
              <label>
                * Password Should be Minimum of {passwordRulesList[0].minLength}{' '}
                Characters Long and Maximum {passwordRulesList[0].maxLength}{' '}
                Characters Long.
              </label>
              <br />
            </>
          )}
          {passwordRulesList?.length > 1 && passwordRulesList[1].status && (
            <>
              <label>
                * Password Should not be Same as last{' '}
                {passwordRulesList[1].count}.
              </label>
              <br />
            </>
          )}
          {passwordRulesList?.length > 2 && passwordRulesList[2].status && (
            <>
              <label>
                * Password Should be Contain {passwordRulesList[2].minOrMax}{' '}
                {passwordRulesList[2].length} {passwordRulesList[2].type}.
              </label>
              <br />
            </>
          )}
          {passwordRulesList?.length > 3 && passwordRulesList[3].status && (
            <>
              <label>
                * Password Should be Contain {passwordRulesList[3].minOrMax}{' '}
                {passwordRulesList[3].length} {passwordRulesList[3].type}.
              </label>
              <br />
            </>
          )}
          {passwordRulesList?.length > 4 && passwordRulesList[4].status && (
            <>
              <label>
                * Password Should be Contain {passwordRulesList[4].minOrMax}{' '}
                {passwordRulesList[4].length} {passwordRulesList[4].type}.
              </label>
              <br />
            </>
          )}
        </Grid>
      </Grid>
      <div className="float-right" style={{ marginRight: '2.5%' }}>       
        <Button onClick={(e) => save(e)} className="btn-primary mb-2 mr-3 m-2">
          Save
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
      <br />
      <br />
    </Card>
  );
};
const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordRules);
