const SiteClient = require('datocms-client').SiteClient;
const config = require('../dato.config.js');

const client = new SiteClient(process.env.DATO_API_TOKEN);

const DatoHelpers = require('datocms-client/lib/local/DatoHelpers').default;
const RootScope = require('datocms-client/lib/local/RootScope').default;

client.items.all({}, { allPages: true })
  .then((items) => {
    const dato = new DatoHelpers(client, items);
    const root = new RootScope(client, process.cwd());
    
    config(dato, root);
    
    console.log('✓ DatoCMS content dumped successfully');
  })
  .catch((error) => {
    console.error('Error dumping DatoCMS content:', error);
    process.exit(1);
  });
