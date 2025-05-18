'use strict';

/* 🔧 Kompilacja szablonów Handlebars */
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

/* 🔍 Ustawienia selektorów i atrybutów */
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleTagAttribute = 'data-tags',
  optTagsListSelector = '.tags.list',
  optArticleAuthorSelector = '.post-author .list',
  optArticleAuthorAttribute = 'data-author',
  optAuthorsListSelector = '.authors.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

/* 🔢 Oblicza minimalne i maksymalne wystąpienia tagów */
function calculateTagsParams(tags) {
  const counts = Object.values(tags);
  return {
    min: Math.min(...counts),
    max: Math.max(...counts)
  };
}

/* 🔠 Dobiera klasę chmury tagów w zależności od liczby wystąpień */
function calculateTagClass(count, params) {
  if (params.max === params.min) {
    // jeśli wszystkie tagi mają tę samą liczbę, wybierz klasę środkową
    return optCloudClassPrefix + Math.ceil(optCloudClassCount / 2);
  }
  const normalized = count - params.min;
  const range = params.max - params.min;
  const fraction = normalized / range;
  const classNumber = Math.floor(fraction * (optCloudClassCount - 1)) + 1;
  return `${optCloudClassPrefix}${classNumber}`;
}

/* 🏷️ Generowanie listy tytułów artykułów */
function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  titleList.innerHTML = '';
  for (const article of articles) {
    const data = {
      id: article.id,
      title: article.querySelector(optTitleSelector).innerText
    };
    titleList.innerHTML += templates.articleLink(data);
  }

  /* Obsługa kliknięcia w tytuł */
  titleList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      document.querySelectorAll(optTitleListSelector + ' a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll(optArticleSelector).forEach(a => a.classList.remove('active'));
      document.querySelector(link.getAttribute('href')).classList.add('active');
    });
  });
}

/* 🏷️ Generowanie tagów w artykułach i chmury tagów */
function generateTags() {
  const allTags = {};

  /* 1) Tagi per-article */
  document.querySelectorAll(optArticleSelector).forEach(article => {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    const tagsArray = article.getAttribute(optArticleTagAttribute)
      .split(',')
      .map(t => t.trim());
    let html = '';

    for (const tag of tagsArray) {
      html += templates.articleTag({ tag });
      allTags[tag] = (allTags[tag] || 0) + 1;
    }
    tagsWrapper.innerHTML = html;
  });

  /* 2) Chmura tagów w prawej kolumnie */
  const tagList = document.querySelector(optTagsListSelector);
  const params = calculateTagsParams(allTags);
  const tagsData = { tags: [] };

  for (const tag in allTags) {
    tagsData.tags.push({
      tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], params)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(tagsData);
}

/* 🔘 Obsługa kliknięcia w tag */
function tagClickHandler(event) {
  event.preventDefault();
  const href = this.getAttribute('href');
  const tag = href.replace('#tag-', '');

  /* usuń aktywne klasy ze wszystkich tagów */
  document.querySelectorAll('a.active[href^="#tag-"]').forEach(l => l.classList.remove('active'));
  /* zaznacz wszystkie linki do tego samego tagu */
  document.querySelectorAll(`a[href="${href}"]`).forEach(l => l.classList.add('active'));

  /* przefiltruj listę artykułów */
  generateTitleLinks(`[data-tags~="${tag}"]`);
}

/* 📎 Dodaje nasłuchiwanie kliknięcia dla tagów */
function addClickListenersToTags() {
  document.querySelectorAll(`${optTagsListSelector} a, ${optArticleTagsSelector} a`)
    .forEach(link => link.addEventListener('click', tagClickHandler));
}

/* 👤 Generowanie autorów w artykułach i listy autorów */
function generateAuthors() {
  const allAuthors = {};

  /* 1) Autor per-article */
  document.querySelectorAll(optArticleSelector).forEach(article => {
    const author = article.getAttribute(optArticleAuthorAttribute);
    const authorWrap = article.querySelector(optArticleAuthorSelector);
    authorWrap.innerHTML = templates.articleAuthor({ author });
    allAuthors[author] = (allAuthors[author] || 0) + 1;
  });

  /* 2) Chmura autorów w prawej kolumnie */
  const authorsData = { authors: [] };
  for (const author in allAuthors) {
    authorsData.authors.push({
      author,
      count: allAuthors[author]
    });
  }
  document.querySelector(optAuthorsListSelector).innerHTML = templates.authorCloudLink(authorsData);
}

/* 🔘 Obsługa kliknięcia w autora */
function authorClickHandler(event) {
  event.preventDefault();
  const href = this.getAttribute('href');
  const author = href.replace('#author-', '');

  /* usuń aktywne klasy ze wszystkich autorów */
  document.querySelectorAll('a.active[href^="#author-"]').forEach(l => l.classList.remove('active'));
  /* zaznacz wszystkie linki do tego samego autora */
  document.querySelectorAll(`a[href="${href}"]`).forEach(l => l.classList.add('active'));

  /* przefiltruj listę artykułów */
  generateTitleLinks(`[data-author="${author}"]`);
}

/* 📎 Dodaje nasłuchiwanie kliknięcia dla autorów */
function addClickListenersToAuthors() {
  document.querySelectorAll(`${optAuthorsListSelector} a, ${optArticleAuthorSelector} a`)
    .forEach(link => link.addEventListener('click', authorClickHandler));
}

/* 🚀 Uruchom wszystko */
generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
