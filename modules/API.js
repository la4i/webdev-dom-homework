import { renderComments } from "./render.js";

const buttonElement = document.getElementById('add-button');
const nameElement = document.getElementById('name');
let commentsElement = document.getElementById('comments');

let comments = [];

function needTrueDate(date) {
    const newDate = new Date(Date.parse(date));
    const year = newDate.getFullYear().toString().slice(2);
    const month = ("0" + (newDate.getMonth() + 1)).slice(-2);
    const day = ("0" + newDate.getDate()).slice(-2);
    const hours = ("0" + newDate.getHours()).slice(-2);
    const minutes = ("0" + newDate.getMinutes()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export const receivedComments = () => {
    return fetch('https://webdev-hw-api.vercel.app/api/v1/Kirl_Yurch/comments', {
        method: "GET"
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер упал');
            }
            return response.json();
        })
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: needTrueDate(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            });

            comments = appComments;
            renderComments(comments);
        })
        .catch((error) => {
            console.warn(error);
            if (error.message === 'Сервер упал') {
                alert('Сервер упал, повторите позже');
            } else {
                alert('Кажется, что-то пошло не так, повторите позже');
            }
        });
}

receivedComments(comments);

export const updateComments = () => {
    fetch("https://webdev-hw-api.vercel.app/api/v1/Kirl_Yurch/comments", {
        method: "POST",
        body: JSON.stringify({
            name: nameElement.value
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;"),
            text: commentsElement.value
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;"),
            forceError: false,
        }),
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
        .then(() => {
            return receivedComments();;
        })
        .then(() => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            nameElement.value = '';
            commentsElement.value = '';
        })
        .catch((error) => {
            console.warn(error);
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            if (error.message === 'Сервер упал') {
                alert('Сервер упал');
            } else if (error.message === 'Неверный запрос') {
                alert('Имя или комментарий должны быть не короче 3-х символов');
                nameElement.classList.add("errorColorInput");
                nameElement.classList.add("errorBoxShadowInput");
                commentsElement.classList.add("errorColorInput");
                commentsElement.classList.add("errorBoxShadowInput");
            } else {
                alert('Кажется, что-то пошло не так, повторите позже');
            }
        });
    renderComments(comments);
   
}