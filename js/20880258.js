const apiRootUrl = 'https://web1-api.vercel.app/api';
const AUTHENTICATIE_API = 'https://web1-api.vercel.app/users';
//username: web1
//password: W3b1@Project
async function loadData(request, templateId, viewId) {
    const res = await fetch(`${apiRootUrl}/${request}`);
    const data = await res.json();
    var source = document.getElementById(`${templateId}`).innerHTML;
    var template = Handlebars.compile(source);

    let isLogin = await checkLogin();
    let isShow = "hide";
    if (isLogin) isShow = "show";

    var context = { [`${viewId.replace("-", "")}`]: data, isShow: isShow };
    var productsView = document.getElementById(`${viewId}`);
    console.log(template(context))
    productsView.innerHTML = template(context);
};

async function loadBlogs(request, templateId, viewId, currentPage = 1) {
    const res = await fetch(`${apiRootUrl}/${request}?page=${currentPage}`);
    const data = await res.json();
    var source = document.getElementById(`${templateId}`).innerHTML;
    var template = Handlebars.compile(source);

    var context = { 
        [`${viewId.replace("-", "")}`]: data.data, 
        currentPage: currentPage, 
        request: request, 
        pageCount: data.pageCount 
    };
    
    var productsView = document.getElementById(`${viewId}`);
    console.log(template(context))
    productsView.innerHTML = template(context);
};

async function getAuthToken(username, password) {
    let res = await fetch(`${AUTHENTICATIE_API}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    let result = await res.json();
    if (res.status == 200) {
        return result.token;
    }
    throw new Error(result.message);
}

async function login(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        let token = await getAuthToken(username, password);
        if (token) {
            localStorage.setItem('token', token);
            location.reload();
            document.getElementsByClassName('btn-close')[0].click();
            displayControls();
        }
    } catch (error) {
        document.getElementById('errorMessage').innerHTML = error;
        displayControls(false);
    }
}

async function logout() {
    localStorage.removeItem('token');
    location.reload();
    checkLogin();
}

function displayControls(isLogin = true) {
    let linkLogins = document.getElementsByClassName('linklogin');
    let linklogouts = document.getElementsByClassName('linklogout');

    let displayLogin = 'none';
    let displayLogout = 'block';

    if (!isLogin) {
        displayLogin = 'block';
        displayLogout = 'none';
    }

    for (let i = 0; i < 2; i++) {
        linkLogins[i].style.display = displayLogin;
        linklogouts[i].style.display = displayLogout;    
    }
}

async function checkLogin() {
    let token = localStorage.getItem('token');
    if (!token) {
        displayControls(false);
        return false;
    } else {
        displayControls();
        return true;
    }
}

checkLogin();