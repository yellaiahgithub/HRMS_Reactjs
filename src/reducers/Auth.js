import {
    LOGIN_USER,
    SET_ERROR_MESSAGE,
    LOGOUT_USER,
    SET_COMPANY_DATA,
    SET_SELECTED_EMPLOYEE,
    ENABLE_ADMIN_VIEW,
    SET_USER,
    SET_MAPPED_BY_USER,
    SET_IS_USER_MAPPED
} from "../actions/index"

export default function Auth(
    state = {
        user: {},
        isAuthenticated: false,
        error: '',
        selectedCompany: {},
        selectedEmployee: {},
        isAdminViewEnabled: false,
        isUserMapped: false,
        mappedByUser: {},
        accessToken:null,
        modules:[],
        countriesMasterData:[],
        view:[]
    },
    action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, user: action.userData.user,selectedCompany:action.userData.companyDetails,accessToken:action.userData.accessToken,modules:action.userData.modules ,countriesMasterData:action.userData.countries,view:action.userData.view,  isAuthenticated: action.isAuthenticated };
        case SET_ERROR_MESSAGE:
            return { ...state, error: action.error };
        case LOGOUT_USER:
            return { ...state }
        case SET_COMPANY_DATA:
            return { ...state, selectedCompany: action.selectedCompany }
        case SET_SELECTED_EMPLOYEE:
            return { ...state, selectedEmployee: action.selectedEmployee}
        case SET_USER:
            return { ...state, user: action.user}
        case SET_MAPPED_BY_USER:
            return { ...state, mappedByUser: action.mappedByUser}
        case SET_IS_USER_MAPPED:
            return {...state, isUserMapped: action.isUserMapped}
        case ENABLE_ADMIN_VIEW:
            return {...state, isAdminViewEnabled: action.isAdminViewEnabled}
        default:
            break;
    }
    return state;
}