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

module.exports = (dato, root, i18n) => {
  // Create config files
  root.createDataFile('data/settings.yml', 'yaml', {
    name: dato.site.name,
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
