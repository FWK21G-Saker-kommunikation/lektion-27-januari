const { getAccountByUsername } = require('../database/operations');
const jwt = require('jsonwebtoken');

async function admin(request, response, next) {
    const token = request.headers.authorization.replace('Bearer ', '');

    console.log('I ADMIN MIDDLEWARE');

    try {
        const data = jwt.verify(token, 'a1b1c1');
        const account = await getAccountByUsername(data.username);
        console.log(account);
        //Ifall vi inte hittar något användarkonto
        if (account.length == 0) {
            throw new Error(); //Kommer istället att hoppa till catch
        } else if (account[0].role == 'admin') { //Ifall användarkontot har rollen admin
            next(); //Kommer hoppa vidare till nästa funktionen i route:n
        } else { //I alla andra fall
            throw new Error();
        }
    } catch (error) {
        console.log('Rollen var inte admin, i catch');

        const resObj = {
            success: false,
            errorMessage: 'Unauthorized'
        }

        response.json(resObj);
    }    
}

async function user(request, response, next) {
    const token = request.headers.authorization.replace('Bearer ', '');

    console.log('I USER MIDDLEWARE');

    try {
        const data = jwt.verify(token, 'a1b1c1');
        const account = await getAccountByUsername(data.username);
        
        //Ifall vi inte hittar något användarkonto
        if (account.length == 0) {
            throw new Error(); //Kommer istället att hoppa till catch
        } else if (account[0].role == 'user') { //Ifall användarkontot har rollen user
            next(); //Kommer hoppa vidare till nästa funktionen i route:n
        } else { //I alla andra fall
            throw new Error();
        }
    } catch (error) {
        console.log('Rollen var inte user, i catch');

        const resObj = {
            success: false,
            errorMessage: 'Unauthorized'
        }

        response.json(resObj);
    }    
}

module.exports = { admin, user }