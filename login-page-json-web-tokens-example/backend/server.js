const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');

const bcryptFunctions = require('./bcrypt');
const { admin, user } = require('./middleware/auth');
const { getAccountByUsername, getAccountByEmail, createAccount,
     getAccountsByRole, removeAccount, changePassword } = require('./database/operations');

app.use(express.static('../frontend'));
app.use(express.json());
app.use(cookieParser());

app.post('/api/signup', async (request, response) => {
    const credentials = request.body;
    console.log('----/API/SIGNUP-----');
    // { username: 'Alice', email:'alice@wonderland.com', password: 'pwd123' }
    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false
    }

    const usernameExists = await getAccountByUsername(credentials.username);
    const emailExists = await getAccountByEmail(credentials.email);
    console.log(usernameExists);
    console.log(emailExists);

    if (usernameExists.length > 0) {
        resObj.usernameExists = true;
    }
    if (emailExists.length > 0) {
        resObj.emailExists = true;
    }

    if(resObj.usernameExists == true || resObj.emailExists == true) {
        resObj.success = false;
    } else {
        if (credentials.username == 'ada') {
            credentials.role = 'admin'
        } else {
            credentials.role = 'user';
        }
        console.log(credentials);
        const hashedPassword = await bcryptFunctions.hashPassword(credentials.password);
        credentials.password = hashedPassword;

        console.log(credentials);
        createAccount(credentials);
    }

    response.json(resObj);
});

app.post('/api/login', async (request, response) => {
    const credentials = request.body;
    // { username: 'Ada', password: 'pwd123' }
    console.log('----/API/LOGIN-----');

    const resObj = {
        success: false,
        token: ''
    }

    const account = await getAccountByUsername(credentials.username);
    console.log(account);

    if (account.length > 0) {
        const correctPassword = await bcryptFunctions.comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;

            // Vår token blir krypterad med användarens användarnamn som kopplar vår token till användaren
            const token = jwt.sign({ username: account[0].username }, 'a1b1c1', {
                expiresIn: 600 //Går ut om 10 minuter (värdet är i sekunder)
            });
            
            resObj.token = token;
        }
    }

    response.json(resObj);
});

app.get('/api/loggedin', async (request, response) => {
    console.log('----/API/LOGGEDIN-----');
    const token = request.headers.authorization.replace('Bearer ', '');

    let resObj = {
        loggedIn: false
    }

    try {
        const data = jwt.verify(token, 'a1b1c1');

        console.log(data);
    
        if (data) {
            resObj.loggedIn = true;
        }
    } catch (error) {
        resObj.errorMessage = 'Token expired';
    }

    response.json(resObj);
});

app.get('/api/logout', (request, response) => {
    response.clearCookie('loggedIn');

    console.log('----/API/LOGOUT-----');

    const resObj = {
        success: true
    }

    response.json(resObj);
});

app.get('/api/account', async (request, response) => {
    console.log('----/API/ACCOUNT-----');
    const token = request.headers.authorization.replace('Bearer ', '');

    const resObj = {
        email: '',
        role: ''
    }

    try {
        const data = jwt.verify(token, 'a1b1c1');

        const account = await getAccountByUsername(data.username);

        if (account.length > 0) {
            resObj.email = account[0].email;
            resObj.role = account[0].role;
        }
    } catch (error) {
        resObj.errorMessage = 'Token expired';
    }

    response.json(resObj);
});

app.get('/api/remove', user, (request, response) => {
    console.log('----/API/REMOVE-----');
    const token = request.headers.authorization.replace('Bearer ', '');

    const resObj = {
        success: true
    }

    try {
        const data = jwt.verify(token, 'a1b1c1');

        removeAccount(data.username);
    } catch (error) {
        resObj.success = false;
        resObj.errorMessage = 'Token expired';
    }

    response.json(resObj);
});

app.get('/api/user-accounts', admin, async (request, response) => {
    console.log('----/API/USER-ACCOUNTS-----');
    const token = request.headers.authorization.replace('Bearer ', '');

    const resObj = {
        success: false,
        accounts: ''
    }
    try {
        const data = jwt.verify(token, 'a1b1c1');

        const userAccounts = await getAccountsByRole('user');

        if (userAccounts.length > 0) {
            resObj.success = true;
            resObj.accounts = userAccounts;
        }   
    } catch (error) {
        resObj.errorMessage = 'Token expired';
    }

    response.json(resObj);
});

app.post('/api/change-password', admin, async (request, response) => {
    const newPassword = request.body;
    // { password: 'hej123' }
    const token = request.headers.authorization.replace('Bearer ', '');

    const resObj = {
        success: true
    }

    try {
        const data = jwt.verify(token, 'a1b1c1');

        changePassword(data.username, newPassword);      
    } catch (error) {
        resObj.success = false;
        resObj.errorMessage = 'Token expired';
    } 
    
    response.json(resObj);
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});