const listElement = document.getElementById('list');

import { isLikedElements } from "./main.js";
import { answerElements } from "./main.js";

export function renderComments(comments) {
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
      </div>
    </li>`;
    }).join('');

    listElement.innerHTML = commentsHtml;
    isLikedElements(comments);
    answerElements();
};
