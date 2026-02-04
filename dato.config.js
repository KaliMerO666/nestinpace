const htmlTag = require('html-tag');

// This function helps transforming structures like:
//
// [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]
//
// into proper HTML tags:
//
// <meta name="description" content="foobar" />

const toHtml = (tags) => (
  tags.map(({ tagName, attributes, content }) => (
    htmlTag(tagName, attributes, content)
  )).join("")
);

// Arguments that will receive the mapping function:
//
// * dato: lets you easily access any content stored in your DatoCMS
//   administrative area;
//
// * root: represents the root of your project, and exposes commands to
//   easily create local files/directories;
//
// * i18n: allows to switch the current locale to get back content in
//   alternative locales from the first argument.
//
// Read all the details here:
// https://github.com/datocms/js-datocms-client/blob/master/docs/dato-cli.md

module.exports = (dato, root, i18n) => {
module.exports = (dato, root, i18n) => {
  // Create config files
  root.createDataFile('data/settings.yml', 'yaml', {
    name: dato.site.name,
  });

  // Create content pages
  dato.works.forEach((work) => {
    root.createPost(`content/works/${work.slug}.md`, 'yaml', {
      frontmatter: {
        title: work.title,
        description: work.description,
        date: work.publishedAt,
      },
      content: work.content,
    });
  // Create a markdown file with content coming from the `about_page` item
  // type stored in DatoCMS
  root.createPost(`content/about.md`, 'yaml', {
    frontmatter: {
      title: dato.aboutPage.title,
      subtitle: dato.aboutPage.subtitle,
      photo: dato.aboutPage.photo.url({ w: 800, fm: 'jpg', auto: 'compress' }),
      seoMetaTags: toHtml(dato.aboutPage.seoMetaTags),
      menu: { main: { weight: 100 } }
    },
    content: dato.aboutPage.bio
  });

  // Create a `work` directory (or empty it if already exists)...
  root.directory('content/works', dir => {
    // ...and for each of the works stored online...
    dato.works.forEach((work, index) => {
      // ...create a markdown file with all the metadata in the frontmatter
      dir.createPost(`${work.slug}.md`, 'yaml', {
        frontmatter: {
          title: work.title,
          coverImage: work.coverImage.url({ w: 450, fm: 'jpg', auto: 'compress' }),
          image: work.coverImage.url({ fm: 'jpg', auto: 'compress' }),
          detailImage: work.coverImage.url({ w: 600, fm: 'jpg', auto: 'compress' }),
          excerpt: work.excerpt,
          seoMetaTags: toHtml(work.seoMetaTags),
          extraImages: work.gallery.map(item =>
            item.url({ h: 300, fm: 'jpg', auto: 'compress' })
          ),
          weight: index
        },
        content: work.description
      });
    });
  });
};

