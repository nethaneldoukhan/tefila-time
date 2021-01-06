const DOMAINE = 'https://mighty-chamber-84336.herokuapp.com'

// get zmanim of location
async function getZmanimLoc(loc) {
    try{
        const response = await fetch(`${DOMAINE}/calendar/zmanimLoc?city=${loc[0]}&country=${loc[1]}`, {
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err);
        return 50;
    }
}

async function checkExistEmail(email) {
    const setting = {
        'email': email
    };
    const data = refactURI(setting);
    try{
        const response = await fetch(`${DOMAINE}/auth/checkExistEmail`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'POST',
            body: data
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function createUser(form) {
    const setting = {
        'lName': form[1],
        'fName': form[0],
        'email': form[2],
        'password': form[3],
        'token': form[6],
        'createDate': form[7]
    };
    const data = refactURI(setting);
    try{
        const response = await fetch(`${DOMAINE}/auth/sign-up`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'PUT',
            body: data
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function login(email, password) {
    const setting = {
        'email': email,
        'password': password
    };
    const data = refactURI(setting);
    console.log(setting);
    try{
        const response = await fetch(`${DOMAINE}/auth/sign-in`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'POST',
            body: data
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function checkExistSynagogue(form) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/checkExistSynagogue`, {
            method: 'POST',
            body: form
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function addSynagogue(form) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/addSynagogue`, {
            method: 'POST',
            body: form
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err);
        return 50;
    }
}

async function addTefila(form) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/addTefila`, {
            method: 'POST',
            body: form
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err);
        return 50;
    }
}

async function removeData(data) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/deleteData`, {
            method: 'DELETE',
            body: data
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function delSynagogue(data) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/deleteSynagogue`, {
            method: 'DELETE',
            body: data
        });
        console.log(response);
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function existNewLetter(synagogueId, email) {
    const setting = {
        'synagogueId': synagogueId,
        'email': email
    };
    const data = refactURI(setting);
    try{
        const response = await fetch(`${DOMAINE}/synagogue/checkExistNewLetter`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'POST',
            body: data
        });
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function addToNewLetter(form) {
    try{
        const response = await fetch(`${DOMAINE}/synagogue/addToNewLetter`, {
            method: 'POST',
            body: form
        });
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function sendEmailForgot(form) {
    try{
        const response = await fetch(`${DOMAINE}/forgot_password/sendForgotEmail`, {
            method: 'POST',
            body: form
        });
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

async function getDataAutoComplete () {
    try{
        const response = await fetch(`${DOMAINE}/search/synagoguesAutoComplete`, {
            method: 'GET'
        });
        return response.json();
    } catch(err) {
        console.log(err);
    }
}

function refactURI(object) {
    const data = Object.keys(object).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
    }).join('&');
    return data;
}


export {
    getZmanimLoc,
    checkExistEmail,
    createUser,
    login,
    checkExistSynagogue,
    addSynagogue,
    addTefila,
    removeData,   
    delSynagogue, 
    existNewLetter,
    addToNewLetter,
    sendEmailForgot,
    getDataAutoComplete
};