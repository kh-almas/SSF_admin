'use strict';

console.log('Location', window.location);

// storage
const storageUsername = window.localStorage.name || '';

// signup
const signupUsernameInput = document.getElementById('signupUsernameInput');
const signupPasswordIdInput = document.getElementById('signupPasswordIdInput');
const signupRepeatPasswordIdInput = document.getElementById('signupRepeatPasswordIdInput');
const signupBtn = document.getElementById('signupBtn');

// login
const loginUsernameInput = document.getElementById('loginUsernameInput');
const loginPasswordIdInput = document.getElementById('loginPasswordIdInput');
const loginBtn = document.getElementById('loginBtn');

// tabs
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const loginPanel = document.getElementById('loginPanel');
const signupPanel = document.getElementById('signupPanel');

// support
const supportBtn = document.getElementById('supportBtn');

const config = {
    support: true,
    //...
};
!config.support && elementDisplay(supportBtn, false);

signupUsernameInput.value = storageUsername;
signupPasswordIdInput.value = '';
signupRepeatPasswordIdInput.value = '';

loginUsernameInput.value = storageUsername;
loginPasswordIdInput.value = '';

// Tab switching
tabLogin.addEventListener('click', () => switchTab('login'));
tabSignup.addEventListener('click', () => switchTab('signup'));

function switchTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginPanel.classList.add('active');
        signupPanel.classList.remove('active');
        cleanSignUpInput();
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupPanel.classList.add('active');
        loginPanel.classList.remove('active');
        cleanLoginInput();
    }
}

loginBtn.addEventListener('click', handleLogin);

[loginUsernameInput, loginPasswordIdInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin(e);
    });
});

signupBtn.addEventListener('click', handleSignup);

[signupUsernameInput, signupPasswordIdInput, signupRepeatPasswordIdInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSignup(e);
    });
});

supportBtn.onclick = () => {
    window.open('https://codecanyon.net/user/miroslavpejic85', '_blank');
};

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

    cleanSignUpInput();

    const validationError = validateInput(loginUsernameInput, loginPasswordIdInput);
    if (validationError) {
        console.warn('Validation error:', validationError);
        popupMessage('warning', validationError);
        return false;
    }

    const data = gatherInputData(loginUsernameInput, loginPasswordIdInput);

    signupOrLogin(data);
}

function handleSignup(e) {
    e.preventDefault();
    cleanLoginInput();
    const validationError = validateInput(signupUsernameInput, signupPasswordIdInput, signupRepeatPasswordIdInput);
    if (validationError) {
        popupMessage('warning', validationError);
        return false;
    }
    Swal.fire({
        title: 'Terms & Conditions',
        html: `
<div class="terms-conditions">
    <h3>1. Introduction</h3>
    <p>By using the Room Scheduler, you agree to comply with our Terms and Conditions. Please read them carefully before using the service.</p>

    <h3>2. User Responsibilities</h3>
    <p>Do not use this service for any illegal, harmful, or abusive activities. You agree to use the service only for lawful purposes and in compliance with applicable laws and regulations.</p>

    <h3>3. Privacy & Data</h3>
    <p>We do not store your video, audio, or chat messages. Your data is processed securely and in accordance with our Privacy Policy. We may collect and use certain non-personally identifiable information for service improvement purposes.</p>

    <h3>4. Account Security</h3>
    <p>You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account or any other security breach.</p>

    <p><strong>Do you agree to these Terms & Conditions?</strong></p>
</div>
        `,
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'I Agree',
        focusCancel: true,
        allowOutsideClick: false,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    }).then((result) => {
        if (result.isConfirmed) {
            const data = gatherInputData(signupUsernameInput, signupPasswordIdInput);
            signupOrLogin(data);
        }
    });
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
    if (signupRepeatPasswordIdInput && signupPasswordIdInput.value !== signupRepeatPasswordIdInput.value) {
        return '⚠️ Repeat password field does not match!';
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

function cleanSignUpInput() {
    signupUsernameInput.value = '';
    signupPasswordIdInput.value = '';
    signupRepeatPasswordIdInput.value = '';
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
