/*
Install and import cookie-parser 
yarn add cookie-parser  --OR--  npm install cookie-parser --save  
'cookie-parser' is used to read cookies from http request
*/
const cookieParser = require('cookie-parser')

//To create server
const express = require('express');

const app = express();

/*
Let's create reference of middleware for cookie-parser
we can directly add middleware for all request by-
app.use(cookieParser());
*/
const cookieMiddleware = cookieParser()

//Let's creat routes

//Route to set cookie
app.get('/setcookies', (request, response) => {
    /*  */

    //Set cookie
    //syntax :
    //res.cookie('name-of-cookie', 'value-of-cookie', { optionsObject} )
    response.cookie('name-of-the-cookie', 'value of the cookie');

    //Adding one more cookie
    const cookieValue = {
        name: "Searching...",
        data: " C ME NO MOR "
    }
    response.cookie('another-cookie', cookieValue, { httpOnly: true })

    //Now in order to set this cookie into your browser we need to send some response
    response.send('Cookie has been set successfully!')

})

//Route to read cookie
app.get('/getcookies', cookieMiddleware, (request, response) => {
    const nameOfCookies = Object.keys(request.cookies);

    const temp = nameOfCookies.map((cookieName) => {
        const cookieValue = request.cookies[cookieName];
        console.log(cookieValue);
        return {
            name: cookieName,
            value: cookieValue           
        }
    });

    response.send({
        totalCookies:nameOfCookies.length,
        cookies:[...temp]
    });
})

//Route to clear cookies
app.get('/clear-all-cookies', cookieMiddleware, (request, response) => {

    //This will return an array with name of the all cookies
    const nameOfCookies = Object.keys(request.cookies);

    //Now lets clear all cookies. In order to clear cookie we need 'name' of the cookie
    for (cookieName of nameOfCookies) {
        response.clearCookie(cookieName);
    }

    const temp = nameOfCookies.map((cookieName) => {
        return {
            nameOfCookie: cookieName
        }
    });

    response.send({
        cookieCleared: true,
        Cookies: [...temp]
    });
})


//This will clear specific cookie
//Link => http://clearcookie/some-name => This link will clear a cookie with name 'some-name'
app.get('/clearcookie/:nameOfCookie', (request, response) => {

    response.clearCookie(request.params.nameOfCookie);
    response.send({
        cookieCleared: true,
        nameOfCookie: request.params.nameOfCookie
    });
})


//app.listen( port, callBackFunction )
app.listen(3000, () => {
    console.log("App is running on port: 3000")
})

