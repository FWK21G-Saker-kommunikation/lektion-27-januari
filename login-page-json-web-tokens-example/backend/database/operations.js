const nedb = require('nedb-promise');
const database = new nedb({ filename: 'accounts.db', autoload: true });

const bcryptFunctions = require('../bcrypt');

async function getAccountByUsername(username) {
    const account = await database.find({ username: username });
    return account;
}

async function getAccountByEmail(email) {
    const account = await database.find({ email: email });
    return account;
}

async function getAccountByCookie(cookie) {
    const account = await database.find({ cookie: parseInt(cookie) });
    return account;
}

async function getAccountsByRole(user) {
    const userAccounts = await database.find({ role: 'user' });
    return userAccounts;
}

function createAccount(account) {
    database.insert(account);
}

function updateCookieOnAccount(username, cookieId) {
    database.update({ username: username }, { $set: { cookie: cookieId }});
}

function removeAccount(cookie) {
    database.remove({ cookie: parseInt(cookie)} );
}

async function changePassword(cookie, newPassword) {
    const hashedPassword = await bcryptFunctions.hashPassword(newPassword.password);
    database.update({ cookie: parseInt(cookie) }, { $set: { password: hashedPassword }});
}

module.exports = { getAccountByUsername, getAccountByEmail, createAccount, updateCookieOnAccount,
    getAccountByCookie, getAccountsByRole, removeAccount, changePassword }