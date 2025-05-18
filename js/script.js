'use strict';

/* 🔧 Ustawienia konfiguracyjne */
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleTagAttribute = 'data-tags',
  optTagsListSelector = '.tags',
  optArticleAuthorAttribute = 'data-author',
  optAuthorsListSelector = '.authors';

/* 🏷️ GENEROWANIE LISTY TYTUŁÓW ARTYKUŁÓW */
function generateTitleLinks() {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector);

  titleList.innerHTML = '';
  let html = '';

  for (const article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerText;

    const linkHTML = `<li><a href="#${articleId}">${articleTitle}</a></li>`;
    html += linkHTML;
  }

  titleList.innerHTML = html;

  const links = titleList.querySelectorAll('a');
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

/* 🔘 OBSŁUGA KLIKNIĘCIA W TYTUŁ ARTYKUŁU */
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

  const articles = document.querySelectorAll(optArticleSelector);
  for (const article of articles) {
    article.classList.remove('active');
  }
  targetArticle.classList.add('active');
}

/* 🏷️ GENEROWANIE TAGÓW I CHMURY TAGÓW */
function generateTags() {
  const allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';

    const tagString = article.getAttribute(optArticleTagAttribute);
    const tags = tagString.split(',');

    for (const tag of tags) {
      const trimmedTag = tag.trim();
      const linkHTML = `<li><a href="#tag-${trimmedTag}">${trimmedTag}</a></li>`;
      html += linkHTML;

      if (!allTags[trimmedTag]) {
        allTags[trimmedTag] = 1;
      } else {
        allTags[trimmedTag]++;
      }
    }

    tagsWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(optTagsListSelector);

  let allTagsHTML = '';


  tagList.innerHTML = allTagsHTML;


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

/* 🔘 OBSŁUGA KLIKNIĘCIA W TAG */
function tagClickHandler(event) {
  event.preventDefault();

  const clickedTag = this;
  const href = clickedTag.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const articles = document.querySelectorAll(optArticleSelector);
  for (const article of articles) {
    article.classList.remove('active');

    const tags = article.getAttribute(optArticleTagAttribute).split(',');
    const trimmedTags = tags.map(tag => tag.trim());

    if (trimmedTags.includes(tag)) {
      article.classList.add('active');
    }
  }
}

/* 📎 PODPINANIE EVENTÓW DO TAGÓW */
function addClickListenersToTags() {
  const tagLinks = document.querySelectorAll(`${optTagsListSelector} a`);
  for (const tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

/* 📎 PODPINANIE EVENTÓW DO TAGÓW W ARTYKUŁACH */
function addClickListenersToArticleTags() {
  const tagLinks = document.querySelectorAll(`${optArticleTagsSelector} a`);
  for (const tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

/* 👤 GENEROWANIE LISTY AUTORÓW */
function generateAuthors() {
  const allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const author = article.getAttribute(optArticleAuthorAttribute);

    if (!allAuthors[author]) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }

  const authorList = document.querySelector(optAuthorsListSelector);
  let allAuthorsHTML = '';

  for (const author in allAuthors) {
    allAuthorsHTML += `<li><a href="#author-${author}">${author} (${allAuthors[author]})</a></li>`;
  }

  authorList.innerHTML = allAuthorsHTML;
}


/* 🔘 OBSŁUGA KLIKNIĘCIA W AUTORA */
function authorClickHandler(event) {
  event.preventDefault();

  const clickedAuthor = this;
  const href = clickedAuthor.getAttribute('href');
  const author = href.replace('#author-', '');

  const articles = document.querySelectorAll(optArticleSelector);
  for (const article of articles) {
    article.classList.remove('active');

    const articleAuthor = article.getAttribute(optArticleAuthorAttribute);
    if (articleAuthor === author) {
      article.classList.add('active');
    }
  }
}

/* 📎 PODPINANIE EVENTÓW DO AUTORÓW */
function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll(`${optAuthorsListSelector} a`);
  for (const authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}




/* 🚀 START – uruchomienie wszystkiego */
generateTitleLinks();
generateTags();
addClickListenersToArticleTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
