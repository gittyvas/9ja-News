const fs = require("fs");
const path = require("path");

// Load config + articles
const config = require("./site-config.js");
const articles = JSON.parse(fs.readFileSync("./data/articles.json", "utf-8"));

// Load template
const template = fs.readFileSync("./templates/article-template.html", "utf-8");

// Output folder
const outputDir = "./dist/articles";
fs.mkdirSync(outputDir, { recursive: true });

function getRelated(current, all) {
    return all
        .filter(a =>
            a.slug !== current.slug &&
            a.tags?.some(tag => current.tags?.includes(tag))
        )
        .slice(0, 2)
        .map(a => `/articles/${a.slug}.html`);
}

articles.forEach(article => {

    const canonical = `${config.baseUrl}/articles/${article.slug}.html`;
    const related = getRelated(article, articles);

    const html = template

        // BASIC SEO
        .replace(/__TITLE__/g, article.title)
        .replace(/__DESCRIPTION__/g, article.description)

        // CONTENT
        .replace(/__INTRO_PARAGRAPH__/g, article.intro || "")
        .replace(/__CONTENT__/g, article.content)

        // IMAGE
        .replace(/__IMAGE_URL__/g, article.image || "")

        // DATES
        .replace(/__DATE_PUBLISHED__/g, article.datePublished)
        .replace(/__DATE_MODIFIED__/g, article.dateModified || article.datePublished)
        .replace(/__DISPLAY_DATE__/g, new Date(article.datePublished).toDateString())

        // CANONICAL (IMPORTANT SEO SIGNAL)
        .replace(/__CANONICAL_URL__/g, canonical)

        // AUTHOR (GLOBAL FROM CONFIG)
        .replace(/__AUTHOR_NAME__/g, config.author.name)
        .replace(/__AUTHOR_URL__/g, config.author.url)

        // RELATED ARTICLES (AUTO GENERATED)
        .replace(/__RELATED_1__/g, related[0] || "/")
        .replace(/__RELATED_2__/g, related[1] || "/");

    // Write file
    fs.writeFileSync(
        path.join(outputDir, `${article.slug}.html`),
        html
    );

    console.log("Generated:", article.slug);
});
