import axios from "axios";
axios.defaults.headers.common['authorizations'] = localStorage.getItem('accessToken')
export default async function apicaller(method, url, data) {
    let api_response = await axios({
        method,
        url,
        data
    })
        .then((res) => {
            return res;
        })
    return api_response
}