import axios from "axios";
import { BASEURL } from "../config/conf";
import apicaller from "helper/Apicaller";

export const LOGIN_USER = 'LOGIN_USER';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_COMPANY_DATA = 'SET_COMPANY_DATA';
export const SET_SELECTED_EMPLOYEE = 'SET_SELECTED_EMPLOYEE';
export const ENABLE_ADMIN_VIEW = 'ENABLE_ADMIN_VIEW';
export const SET_USER = 'SET_USER';
export const SET_MAPPED_BY_USER = 'SET_MAPPED_BY_USER';
export const SET_IS_USER_MAPPED = 'SET_IS_USER_MAPPED'



export const loginAdmin = (data) => dispatch => {
    axios
        .post(`${BASEURL}/loginAdmin`, data)
        .then((userData) => {
            if (userData.status === 200) {
                console.log('userData', userData.data);
                localStorage.setItem('accessToken', userData.data.accessToken);
                localStorage.setItem('view', userData.data.view);
                dispatch({
                    type: LOGIN_USER,
                    userData: userData.data,
                    isAuthenticated: true
                })
                dispatch({
                    type: SET_COMPANY_DATA,
                    selectedCompany: userData.data.companyDetails
                })
            }
        })
        .catch((err) => {
            console.log('err', err)
            dispatch({
                type: SET_ERROR_MESSAGE,
                error: err.response.data.message
            })
            setTimeout(dispatch({
                type: SET_ERROR_MESSAGE,
                error: ""
            }), 5000);
        });
}

export const logoutUser = (accessToken) => dispatch => {
    localStorage.clear();
    apicaller('post', `${BASEURL}/logout`, {accessToken: accessToken})
        .then(res => {
            if (res.status === 200) {
                console.log('res.data', res.data)
                dispatch({
                    type: LOGOUT_USER
                })
            }
        })
}

export const setCompanyData = (data) => dispatch => {
    dispatch({
        type: SET_COMPANY_DATA,
        selectedCompany: data
    })
}

export const setUser = (data) => dispatch => {
    dispatch({
        type: SET_USER,
        user: data
    })
}
export const setMappedByUser = (data) => dispatch => {
    dispatch({
        type: SET_MAPPED_BY_USER,
        mappedByUser: data
    })
}
export const setIsUserMapped = (data) => dispatch => {
    dispatch({
        type: SET_IS_USER_MAPPED,
        isUserMapped: data
    })
}
export const setSelectedEmployee = (data) => dispatch => {
    dispatch({
        type: SET_SELECTED_EMPLOYEE,
        selectedEmployee: data
    })
}

export const setAdminViewEnable = (data) => dispatch => {
    dispatch({
        type: ENABLE_ADMIN_VIEW,
        isAdminViewEnabled: data
    })
}