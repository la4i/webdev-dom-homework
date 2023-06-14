const host = 'https://wedev-api.sky.pro/api/v2/la4i/comments';

export function getComments({ token }) {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер упал');
            }
            return response.json();
        })
}

export function postComments({ name, text, forceError, token }) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
            name,
            text,
            forceError,
        }),
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер упал');
            }
            if (response.status === 400) {
                throw new Error('Неверный запрос');
            }
            return response.json();
        })
}

export function loginApi({ login, password }) {

    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('Неверный логин или пароль');
            }
            return response.json();

        })
}