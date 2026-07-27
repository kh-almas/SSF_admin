'use strict';

console.log('Location', window.location);

// storage
const storageUsername = window.localStorage.name || '';


// login
const loginUsernameInput = document.getElementById('loginUsernameInput');
const loginPasswordIdInput = document.getElementById('loginPasswordIdInput');
const loginBtn = document.getElementById('loginBtn');

// tabs
const loginPanel = document.getElementById('loginPanel');

loginUsernameInput.value = storageUsername;
loginPasswordIdInput.value = '';

loginBtn.addEventListener('click', handleLogin);

[loginUsernameInput, loginPasswordIdInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin(e);
    });
});

// function handleLogin(e) {
//     e.preventDefault();
//     cleanSignUpInput();
//     const validationError = validateInput(loginUsernameInput, loginEmailIdInput, loginPasswordIdInput);
//     if (validationError) {
//         popupMessage('warning', validationError);
//         return false;
//     }
//     const data = gatherInputData(loginUsernameInput, loginEmailIdInput, loginPasswordIdInput);
//     signupOrLogin(data);
// }

function handleLogin(e) {
    e.preventDefault();
    console.log('Login button clicked');

    const validationError = validateInput(loginUsernameInput, loginPasswordIdInput);
    if (validationError) {
        console.warn('Validation error:', validationError);
        popupMessage('warning', validationError);
        return false;
    }

    const data = gatherInputData(loginUsernameInput, loginPasswordIdInput);

    signupOrLogin(data);
}

function gatherInputData(usernameInput, passwordInput) {
    return {
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
    };
}

function validateInput(...inputs) {
    for (const input of inputs) {
        if (input.value.trim() === '') {
            return `⚠️ ${input.name} field empty!`;
        }
    }
    return null;
}

function signupOrLogin(data) {
    window.localStorage.name = data.username;

    userLogin(data)
        .then((res) => {
            console.log('[API] - USER LOGIN RESPONSE', res);

            if (res.message) {
                res.success ? popupMessage('success', res.message) : popupMessage('warning', res.message);

                if (res.message.includes('Pending') || res.message.includes('CodeCanyon')) {
                    switchTab('login');
                }

                return;
            }

            if (!res.token || !res._id) {
                console.error('Login response missing token or user id:', res);
                popupMessage('error', 'Login failed: token missing from server response');
                return;
            }

            document.cookie = `userId=${encodeURIComponent(res._id)}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `userToken=${encodeURIComponent(res.token)}; path=/; max-age=604800; SameSite=Lax`;

//             for live
            document.cookie =
                `userId=${encodeURIComponent(res._id)}; Path=/; Max-Age=7200; SameSite=Lax; Domain=.ssf.gov.bd; Secure`;

            document.cookie =
                `userToken=${encodeURIComponent(res.token)}; Path=/; Max-Age=7200; SameSite=Lax; Domain=.ssf.gov.bd; Secure`;
            window.sessionStorage.userId = res._id;
            window.sessionStorage.userToken = res.token;

            window.location.href = '/client/';
        })
        .catch((err) => {
            console.error('[API] - USER LOGIN ERROR', err);
            popupMessage('error', `⚠️ API USER LOGIN error: ${err.message}`);
        });
}

function elementDisplay(elem, display) {
    if (!elem) return;
    elem.style.display = display ? 'block' : 'none';
}

function cleanLoginInput() {
    loginUsernameInput.value = '';
    loginPasswordIdInput.value = '';
}

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('uil-eye', 'uil-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('uil-eye-slash', 'uil-eye');
        }
    });
});
