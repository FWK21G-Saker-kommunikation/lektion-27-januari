const logoutButton = document.querySelector('#logout-button');
const emailElem = document.querySelector('#email');
const removeButton = document.querySelector('#remove-button');
const changePasswordElem = document.querySelector('#change-password-form');
const changePasswordButton = document.querySelector('#change-password');
const changePasswordInput = document.querySelector('#new-password');

function showChangePassword() {
    console.log(changePasswordElem.classList);
    changePasswordElem.classList.toggle('hide');
}

function showRemoveButton() {
    removeButton.classList.toggle('hide');
}

async function isLoggedIn() {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/loggedin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    console.log(data);

    if (data.loggedIn == false) {
        window.location.href = 'http://localhost:5000/';
    } 
}

async function logout() {
    const response = await fetch('http://localhost:5000/api/logout');
    const data = await response.json();
    console.log(data);

    if (data.success) {
        sessionStorage.clear();
        window.location.href = 'http://localhost:5000/';
    }
}

async function getAccountInformation() {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/account', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    console.log(data);
    emailElem.innerHTML = `E-post: ${data.email}`;

    if (data.role == 'admin') {
        getUserAccounts();
        showChangePassword();
    } else if (data.role == 'user') {
        showRemoveButton();
    }
}

async function removeAccount() {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/remove', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    console.log(data);
    if (data.success) {
        window.location.href = 'http://localhost:5000/';
    }
}

async function getUserAccounts() {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/user-accounts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    console.log(data);
}

async function changePassword(newPassword) {
    const token = sessionStorage.getItem('token');
    const body = {
        password: newPassword
    }

    const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data);
}

logoutButton.addEventListener('click', () => {
    logout();
});

removeButton.addEventListener('click', () => {
    removeAccount();
});

changePasswordButton.addEventListener('click', () => {
    const newPassword = changePasswordInput.value;
    changePassword(newPassword);
});

isLoggedIn();
getAccountInformation();