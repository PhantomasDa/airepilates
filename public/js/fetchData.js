// fetchData.js

function fetchData(url, options = {}) {
    options.headers = {
        ...options.headers,
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    };
    return fetch(url, options).then(response => {
        if (!response.ok) throw response.json().then(error => new Error(error.message));
        return response.json();
    });
}
