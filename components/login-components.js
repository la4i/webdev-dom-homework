import { loginApi } from '../modules/API.js';

export let userName = null;

export function renderloginComponent({ commentsHtml, appEl, renderComments, comments, setToken }) {

    const appHtml =
        `
        <ul class="comments" id="list">
        <!-- Список рендерится из JS -->
        ${commentsHtml}
        </ul>
        <p class="add-coment">Чтобы добавить коментарий,<button id = "buttonAuthorization" class = "buttonAuthorizationCSS">авторизуйтесь</button></p>`

    appEl.innerHTML = appHtml;

    const scrollToTop = function () {
        window.scroll({
            top: 0
        });
    };

    document.getElementById('buttonAuthorization').addEventListener('click', () => {

        scrollToTop();

        const appHtml =
            `<div class="login-content">
            <p class="login-title">Вход "Комменты"</p>
            <input id="login-input" class="login-input" type="text" placeholder="Логин">
            <input id="password-input" class="login-input" type="password" placeholder="Пароль">
            <button id="login-button" class="login-button">Войти</button>
            <button id="reg-button" class="login-button registr">Зарегистрироваться</button>
            </div>`

        renderComments(comments);

        appEl.innerHTML = appHtml;

        document.getElementById('reg-button').addEventListener('click', () => {
            const appHtml = `
            <div class="registr-content">
            <p class="login-title">Регистрация</p>
            <input id="name-input" class="login-input" type="text" placeholder="Введите ваше имя">
            <input id="login-input" class="login-input" type="text" placeholder="Придумайте логин">
            <input id="password-input" class="login-input" type="password" placeholder="Придумайте пароль">
            <button id="reg-button" class="login-button">Зарегистрироваться</button>
            <button id="login-button" class="login-button registr">Войти</button>
          </div>`
            appEl.innerHTML = appHtml;
        })
        document.getElementById('login-button').addEventListener('click', () => {
            const login = document.getElementById('login-input').value;
            const password = document.getElementById('password-input').value;

            if (!login || !password) {
                if (!login) {
                    document.getElementById("login-input").placeholder = "Введите логин";
                    document.getElementById("login-input").classList.add("errorColorInput");
                    document.getElementById("login-input").classList.add("errorBoxShadowInput");
                }
                if (!password) {

                    document.getElementById("password-input").placeholder = "Введите пароль";
                    document.getElementById("password-input").classList.add("errorColorInput");
                    document.getElementById("password-input").classList.add("errorBoxShadowInput");
                }
                return;
            }

            loginApi({
                login: login,
                password: password,
                name: '',
            }).then((user) => {
                userName = user.user.name;
                setToken(`Bearer ${user.user.token}`);
                renderComments(comments);
            }).catch(error => {
                alert(error.message);
                document.getElementById("login-input").classList.add("errorColorInput");
                document.getElementById("login-input").classList.add("errorBoxShadowInput");
                document.getElementById("password-input").classList.add("errorColorInput");
                document.getElementById("password-input").classList.add("errorBoxShadowInput");
            });


        });
    })

}
