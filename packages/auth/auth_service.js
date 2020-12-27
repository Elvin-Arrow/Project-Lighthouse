const path = require("path")
const { get } = require("http")
const fs = require('fs')


function login(username, password) {
    // Invoke the API with received username and password
    let url = 'http://127.0.0.1:5000/?username=' + username;
    url = url + '&password=' + password


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    
    return xmlHttp.responseText;
}

function storeAuthStatus(username) {
    authFilePath = 'C:\\Users\\mtbm9\\Lighthouse\\auth.json';

    authStatus = {
        username: username,
        authenticated: true
    };

    content = JSON.stringify(authStatus);

    fs.writeFileSync(authFilePath, content);

}
