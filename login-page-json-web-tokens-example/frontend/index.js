const usernameElem = document.querySelector('#username');
const emailElem = document.querySelector('#email');
const password = document.querySelector('#password');
const createButtonElem = document.querySelector('#create-button');

const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const loginButton = document.querySelector('#login-button');

async function createAccount(accountInformation) {
    const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: JSON.stringify(accountInformation),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

function saveToken(token) {
    sessionStorage.setItem('token', token);
}

async function login(loginInformation) {
    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: JSON.stringify(loginInformation),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
        saveToken(data.token); //Spara token i sessionStorage för att ha åtkomst till den senare
        window.location.href = 'http://localhost:5000/loggedin.html';
    }
}

createButtonElem.addEventListener('click', () => {
    let accountInformation = {
        username: usernameElem.value,
        email: emailElem.value,
        password: password.value
    }

    createAccount(accountInformation);
    console.log(`Kontouppgifter: ${JSON.stringify(accountInformation)}`);
    //console.log('Kontouppgifter: ' + accountInformation);
});

loginButton.addEventListener('click', () => {
    let loginInformation = {
        username: loginUsername.value,
        password: loginPassword.value
    }

    login(loginInformation);
});