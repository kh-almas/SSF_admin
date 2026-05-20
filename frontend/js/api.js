'use strict';

const apiPath = '/api/v1';

function getCookie(name) {
    return decodeURIComponent(
        document.cookie
            .split('; ')
            .find((row) => row.startsWith(name + '='))
            ?.split('=')[1] || ''
    );
}

function getUserToken() {
    return getCookie('userToken') || window.sessionStorage.userToken || '';
}

function getUserId() {
    return getCookie('userId') || window.sessionStorage.userId || '';
}

function getUserEmail() {
    return getCookie('email') || window.localStorage.email || '';
}

let userEmail = getUserEmail();
let userId = getUserId();
let userToken = getUserToken();

function authHeaders() {
    return {
        'x-access-token': getUserToken(),
    };
}

let isOidcMode = false;

// const userEmail =
//     window.localStorage.email ||
//     decodeURIComponent(
//         document.cookie
//             .split('; ')
//             .find(row => row.startsWith('email='))
//             ?.split('=')[1] || ''
//     );

// let userId =
//     window.sessionStorage.userId ||
//     decodeURIComponent(
//         document.cookie
//             .split('; ')
//             .find(row => row.startsWith('userId='))
//             ?.split('=')[1] || ''
//     );

// let userToken =
//     window.sessionStorage.userToken ||
//     decodeURIComponent(
//         document.cookie
//             .split('; ')
//             .find((row) => row.startsWith('userToken='))
//             ?.split('=')[1] || ''
//     );



// API USER

function userAdminCreate(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/user/admin-create`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

function userLogin(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/user/login`,
        data: data,
    }).then((response) => response.data);
}

function userConfirmation(token) {
    return axios({
        method: 'GET',
        url: `${apiPath}/user/confirmation${token}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function userGetAll() {
    return axios({
        method: 'GET',
        url: `${apiPath}/user/all`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function userGet(id) {
    return axios({
        method: 'GET',
        url: `${apiPath}/user/${id}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function userGetMe() {
    return axios({
        method: 'GET',
        url: `${apiPath}/user/me`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function userUpdate(id, data) {
    return axios({
        method: 'PATCH',
        url: `${apiPath}/user/${id}`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

function userDelete(id) {
    return axios({
        method: 'DELETE',
        url: `${apiPath}/user/${id}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function userDeleteALL() {
    return axios({
        method: 'DELETE',
        url: `${apiPath}/user/deleteALL`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

// API ROOM

function roomCreate(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/room`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

function roomFindBy(userId) {
    return axios({
        method: 'GET',
        url: `${apiPath}/room/findBy/${userId}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function roomDeleteFindBy(userId) {
    return axios({
        method: 'DELETE',
        url: `${apiPath}/room/findBy/${userId}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function roomGet(id) {
    return axios({
        method: 'GET',
        url: `${apiPath}/room/${id}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function roomUpdate(id, data) {
    return axios({
        method: 'PATCH',
        url: `${apiPath}/room/${id}`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

function roomDelete(id) {
    return axios({
        method: 'DELETE',
        url: `${apiPath}/room/${id}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

function roomDeleteALL() {
    return axios({
        method: 'DELETE',
        url: `${apiPath}/room/deleteALL`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

// API SMS

function smsSend(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/sms`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

// API USER INVITATION

function userSendInvitation(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/user/invite`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

// API DASHBOARD

function getDashboardStats() {
    return axios({
        method: 'GET',
        url: `${apiPath}/dashboard/stats`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

// API CONFIG

function getConfig() {
    return axios({
        method: 'GET',
        url: `/config`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

// API MiroTalk SFU

function getTokenSFU() {
    return axios({
        method: 'GET',
        url: `${apiPath}/token/SFU/${userToken}`,
        headers: authHeaders(),
    }).then((response) => response.data);
}

// API RESET PASSWORD

function passwordResetRequest(email) {
    return axios({
        method: 'POST',
        url: `${apiPath}/password/reset/request`,
        data: { email },
    }).then((response) => response.data);
}

function passwordResetVerify(token) {
    return axios({
        method: 'GET',
        url: `${apiPath}/password/reset/verify/${token}`,
    }).then((response) => response.data);
}

function passwordResetConfirm(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/password/reset/confirm`,
        data: data,
    }).then((response) => response.data);
}

function passwordChange(data) {
    return axios({
        method: 'POST',
        url: `${apiPath}/password/change`,
        headers: authHeaders(),
        data: data,
    }).then((response) => response.data);
}

// API OIDC

function getOidcStatus() {
    return axios({
        method: 'GET',
        url: `/oidc/status`,
    }).then((response) => response.data);
}
