const fs = require("fs");
const path = require("path");

const config = require("./site-config.js");
const articles = JSON.parse(fs.readFileSync("./data/articles.json", "utf-8"));

const articleTpl = fs.readFileSync("./templates/article-template.html", "utf-8");
const homeTpl = fs.readFileSync("./templates/index-template.html", "utf-8");

const outDir = "./dist";
const articleOut = "./dist/articles";

fs.mkdirSync(articleOut, { recursive: true });

/* =========================================================
   SORT ARTICLES (LATEST FIRST)
========================================================= */
const sorted = articles.sort((a, b) =>
  new Date(b.datePublished) - new Date(a.datePublished)
);

/* =========================================================
   BUILD ARTICLE PAGES
========================================================= */
sorted.forEach(article => {

  const canonical = `${config.baseUrl}/articles/${article.slug}.html`;

  const related = sorted
    .filter(a => a.slug !== article.slug)
    .slice(0, 2);

  const html = articleTpl
    .replace(/__TITLE__/g, article.title)
    .replace(/__DESCRIPTION__/g, article.description)
    .replace(/__IMAGE_URL__/g, article.image || "")
    .replace(/__CONTENT__/g, article.content)
    .replace(/__INTRO_PARAGRAPH__/g, article.intro || "")
    .replace(/__DATE_PUBLISHED__/g, article.datePublished)
    .replace(/__DATE_MODIFIED__/g, article.dateModified || article.datePublished)
    .replace(/__DISPLAY_DATE__/g, new Date(article.datePublished).toDateString())
    .replace(/__CANONICAL_URL__/g, canonical)
    .replace(/__RELATED_1__/g, related[0] ? `/articles/${related[0].slug}.html` : "/")
    .replace(/__RELATED_2__/g, related[1] ? `/articles/${related[1].slug}.html` : "/");

  fs.writeFileSync(
    path.join(articleOut, `${article.slug}.html`),
    html
  );
});

/* =========================================================
   BUILD HOMEPAGE
========================================================= */
const latest = sorted[0];
const rest = sorted.slice(1);

const grid = rest.map(a => `
<div class="grid-item">
    <a href="/articles/${a.slug}.html">
        <img src="${a.image}">
        <h3>${a.title}</h3>
        <p>${a.description}</p>
    </a>
</div>
`).join("");

const home = homeTpl
  .replace(/__LATEST_URL__/g, `/articles/${latest.slug}.html`)
  .replace(/__LATEST_IMAGE__/g, latest.image)
  .replace(/__LATEST_TITLE__/g, latest.title)
  .replace(/__LATEST_INTRO__/g, latest.description)
  .replace(/__ARTICLE_LIST__/g, grid);

fs.writeFileSync(path.join(outDir, "index.html"), home);

console.log("Build complete ✔");
