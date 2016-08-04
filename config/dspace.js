/**
 * Configuration for dspace REST API and solr.
 * Created by mspalti on 6/21/16.
 */
'use strict';

var config = {

  /** DSpace development context */
  dspaceDev: {
    host: 'dspace.willamette.edu',
    protocol: 'http',
    port: '8080',
    // Servlet API context.
    context: 'rest',
    
    // Solr host (for development, this is localhost).
    solrHost: 'localhost',
    // Solr port. Use port forwarding for development on localhost if
    // not also running dspace on localhost, e.g.:
    // ssh -L 1234:127.0.0.1:8080 dspace.campus.edu.
    solrPort: '1234'
  },

  /** DSpace production context */
  dspaceProd: {
    host: 'dspace.willamette.edu',
    protocol: 'http',
    port: '8080',
    context: 'rest',
    solrHost: 'dspace.willamette.edu',
    solrPort: '8080'
  }
};

module.exports = config;


