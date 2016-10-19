/**
 * Configuration for dspace REST API and solr.
 * Created by mspalti on 6/21/16.
 */
'use strict';

var config = {

  /**  development  */
  dspaceDev: {

    // full host name (e.g. 'dspace.college.edu')
    host: '158.104.3.30',

    // rest protocol can be http or https.
    protocol: 'http',

    // rest port is either standard port (e.g. 8080) or ssl port (e.g. 8443).
    port: '8080',

    // if using self-signed certificate with ssl, this should be false. Otherwise, true.
    rejectUnauthorized: true,

    // the rest API servlet context.
    context: 'rest',

    // Solr host (for development, this is localhost).
    solrHost: 'localhost',

    // protocol for solr connections cd
    solrProtocol: 'http',

    // Solr port. Use port forwarding for development on localhost if
    // not also running dspace on localhost, e.g.:
    // ssh -L 1234:127.0.0.1:8080 dspace.college.edu.
    solrPort: '8080'

  },

  /**  production  */
  dspaceProd: {

    host: 'dspace.willamette.edu',
    protocol: 'http',
    port: '8080',
    rejectUnauthorized: true,
    context: 'rest',

    solrHost: 'dspace.willamette.edu',
    solrProtocol: 'http',
    solrPort: '8080'
  }
};

module.exports = config;


