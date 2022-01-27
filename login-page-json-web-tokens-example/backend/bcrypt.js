const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}

async function comparePassword(password, hash) {
    const isTheSame = await bcrypt.compare(password, hash);
    console.log('Password correct: ', isTheSame);
    return isTheSame;
}

async function checkPassword() {
    const hashPwd = await hashPassword();
    comparePassword('hej123', hashPwd);
    comparePassword('pwd123', hashPwd);
}

module.exports = { hashPassword, comparePassword };
