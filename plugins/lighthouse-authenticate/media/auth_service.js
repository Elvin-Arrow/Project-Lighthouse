import { writeFileSync } from 'fs';

/**
 * Function to verify user credentials via the Lighthouse server
 */
function autheticateWithServer(username, password) {
    // Invoke the API with received username and password
    let url = 'http://127.0.0.1:5000/?username=' + username + '&password=' + password;

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

    writeFileSync(authFilePath, content);

}
