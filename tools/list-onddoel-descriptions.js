const QueryEngine  = require('@comunica/query-sparql-file').QueryEngine ;
const myEngine = new QueryEngine();
const path = require('path');

(async function() {
  const bindingsStream = await myEngine.queryBindings(`
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?onddoel ?definition WHERE {
      ?onddoel skos:definition ?definition
    }
    ORDER BY ?definition`, {
      sources: [path.resolve("../schemes/onddoel.ttl")]
    });

  // Consume results as a stream (best performance)
  bindingsStream.on('data', (binding) => {
    console.log(`${binding.get('onddoel').value} ${binding.get('definition').value}`);
  });
  bindingsStream.on('end', () => {
    console.log('Done');
  });
  bindingsStream.on('error', (error) => {
    console.error(error);
  });
})();
