'use strict';

/* 🔁 Generowanie listy tytułów artykułów */
function generateTitleLinks() {
    const titleList = document.querySelector('.titles');
    const articles = document.querySelectorAll('.column-center article');

    titleList.innerHTML = '';

    for (const article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector('h3').innerText;
        const linkHTML = `<li><a href="#${articleId}">${articleTitle}</a></li>`;
        titleList.innerHTML += linkHTML;
    }

    const links = document.querySelectorAll('.titles a');
    for (const link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

/* 📎 Obsługa kliknięcia tytułu */
function titleClickHandler(event) {
    event.preventDefault();

    const clickedLink = this;
    const href = clickedLink.getAttribute('href');
    const targetArticle = document.querySelector(href);

    const links = document.querySelectorAll('.titles a');
    for (const link of links) {
        link.classList.remove('active');
    }
    clickedLink.classList.add('active');

    const articles = document.querySelectorAll('.column-center article');
    for (const article of articles) {
        article.classList.remove('active');
    }
    targetArticle.classList.add('active');
}

/* 🔖 Generowanie tagów z chmurą wagową */
function generateTags() {
    const allTags = {};
    const articles = document.querySelectorAll('.column-center article');

    for (const article of articles) {
        const tagString = article.getAttribute('data-tags');
        const tags = tagString.split(',');

        for (const tag of tags) {
            const trimmedTag = tag.trim();
            allTags[trimmedTag] = (allTags[trimmedTag] || 0) + 1;
        }
    }

    const tagList = document.querySelector('.tags');
    tagList.innerHTML = '';

    const counts = Object.values(allTags);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    function calculateTagClass(count) {
        const classNumber = Math.floor(((count - min) / (max - min)) * 4 + 1);
        return `tag-size-${classNumber}`;
    }

    for (const tag in allTags) {
        const tagClass = calculateTagClass(allTags[tag]);
        const tagHTML = `<li><a href="#tag-${tag}" class="${tagClass}">${tag}</a></li>`;
        tagList.innerHTML += tagHTML;
    }
}

/* 📎 Obsługa kliknięcia tagu */
function tagClickHandler(event) {
    event.preventDefault();

    const clickedTag = this;
    const href = clickedTag.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const articles = document.querySelectorAll('.column-center article');

    for (const article of articles) {
        article.classList.remove('active');

        const tags = article.getAttribute('data-tags').split(',');
        if (tags.includes(tag)) {
            article.classList.add('active');
        }
    }
}

/* 📎 Podpinanie eventów do tagów */
function addClickListenersToTags() {
    const tagLinks = document.querySelectorAll('.tags a');
    for (const tagLink of tagLinks) {
        tagLink.addEventListener('click', tagClickHandler);
    }
}

/* 👤 Generowanie listy autorów */
function generateAuthors() {
    const allAuthors = new Set();
    const articles = document.querySelectorAll('.column-center article');

    for (const article of articles) {
        const author = article.getAttribute('data-author');
        allAuthors.add(author);
    }

    const authorList = document.querySelector('.authors');
    authorList.innerHTML = '';

    for (const author of allAuthors) {
        const authorHTML = `<li><a href="#author-${author}">${author}</a></li>`;
        authorList.innerHTML += authorHTML;
    }
}

/* 📎 Obsługa kliknięcia autora */
function authorClickHandler(event) {
    event.preventDefault();

    const clickedAuthor = this;
    const href = clickedAuthor.getAttribute('href');
    const author = href.replace('#author-', '');

    const articles = document.querySelectorAll('.column-center article');

    for (const article of articles) {
        article.classList.remove('active');

        const articleAuthor = article.getAttribute('data-author');
        if (articleAuthor === author) {
            article.classList.add('active');
        }
    }
}

/* 📎 Podpinanie eventów do autorów */
function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('.authors a');
    for (const authorLink of authorLinks) {
        authorLink.addEventListener('click', authorClickHandler);
    }
}

/* 🚀 Uruchomienie wszystkiego */
generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
