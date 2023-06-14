import { getComments, postComments } from "./modules/API.js";
import { renderloginComponent } from "./components/login-component.js";
import { userName } from "./components/login-component.js";

let comments = [];
let token = null;

const needTrueDate = (date) => {
    const newDate = new Date(Date.parse(date));
    const year = newDate.getFullYear().toString().slice(2);
    const month = ("0" + (newDate.getMonth() + 1)).slice(-2);
    const day = ("0" + newDate.getDate()).slice(-2);
    const hours = ("0" + newDate.getHours()).slice(-2);
    const minutes = ("0" + newDate.getMinutes()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const receivedComments = () => {

    return getComments({ token }).then((responseData) => {
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

receivedComments();

const updateComments = () => {
    const buttonElement = document.getElementById('add-button');
    const nameElement = document.getElementById('name');
    let commentsElement = document.getElementById('comments');
    postComments({
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
        token,
    })
        .then(() => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            nameElement.value = '';
            commentsElement.value = '';
            return;
        })
        .catch((error) => {
            console.warn(error);
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            if (error.message === 'Сервер упал') {
                alert('Сервер упал');
            } else if (error.message === 'Неверный запрос') {
                commentsElement.classList.add("errorColorInput");
                commentsElement.classList.add("errorBoxShadowInput");
                alert('Имя или комментарий должны быть не короче 3-х символов');
            } else {
                alert('Кажется, что-то пошло не так, повторите позже');
            }
        });
    receivedComments();
};

function renderComments(comments) {

    const appEl = document.getElementById("app");

    let commentsHtml = comments.map((comment, index) => {
        return `<li class="comment">
  <div class="comment-header">
    <div>${comment.name}</div>
    <div>${comment.date}</div>
  </div>
  <div class="comment-body">
    <div class="comment-text">
      ${comment.text}
    </div>
    </div>
  </div>
  <div class="comment-footer">
    <div class="isLiked">
      <span class="isLiked-counter">${comment.likes}</span>
      <button data-index='${index}' class="${comment.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
    </div>
</li>`;

    }).join('');

    if (!token) {
        renderloginComponent({ commentsHtml, appEl, renderComments, comments, setToken: (newToken) => { token = newToken } });
        return;
    }

    const appHtml =
        `
  <ul class="comments" id="list">
  
    <!-- Список рендерится из JS -->
    ${commentsHtml}
    
  </ul>
  <div class="add-form">
 
    <input type="text" class="add-form-name" id="name" placeholder="Введите ваше имя" value = "${userName}" disabled/>
    <textarea type="textarea" class="add-form-text" id="comments" placeholder="Введите ваш коментарий"
      rows="4"></textarea>
    <div class="add-form-row">
      <button class="add-form-button" id="add-button">Написать</button>
    </div>
    
  </div>`

    appEl.innerHTML = appHtml;

    const buttonElement = document.getElementById('add-button');
    const nameElement = document.getElementById('name');
    let commentsElement = document.getElementById('comments');

    function answerElements() {
        const commentElements = document.querySelectorAll(".comment");
        for (const commentElement of commentElements) {
            commentElement.addEventListener("click", (event) => {
                const nameAuthor = commentElement.querySelector(".comment-header div:first-child").textContent;
                const textAuthor = commentElement.querySelector(".comment-text").textContent;
                commentsElement.value = `>${textAuthor.trim()}\n${nameAuthor}, `;
                commentsElement.focus();
            });
        }
    };

    function isLikedElements(comments) {
        const isLikedButtonsElements = document.querySelectorAll('.like-button');

        for (const isLikedButtonsElement of isLikedButtonsElements) {
            isLikedButtonsElement.addEventListener('click', () => {
                const index = isLikedButtonsElement.dataset.index;
                if (comments[index].isLiked) {
                    comments[index].likes -= 1;
                    comments[index].isLiked = false;
                } else {
                    comments[index].likes += 1;
                    comments[index].isLiked = true;
                }
                renderComments(comments);
            });
        };

        const likeButtons = document.querySelectorAll('.like-button');
        for (const button of likeButtons) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        }
    };
    buttonElement.addEventListener("click", () => {
        nameElement.classList.remove("errorColorInput");
        nameElement.classList.remove("errorBoxShadowInput");
        commentsElement.classList.remove("errorColorInput");
        commentsElement.classList.remove("errorBoxShadowInput");
        if (nameElement.value === "" || commentsElement.value === "") {
            if (nameElement.value === "") {
                nameElement.classList.add("errorColorInput");
                nameElement.classList.add("errorBoxShadowInput");
            }
            if (commentsElement.value === "") {
                commentsElement.classList.add("errorColorInput");
                commentsElement.classList.add("errorBoxShadowInput");
            }
            return;
        }

        buttonElement.disabled = true;
        buttonElement.textContent = "Комментарий добавляется...";

        updateComments();
        receivedComments();

    })

    isLikedElements(comments);
    answerElements();
};