/**
 * Methods for processing DSpace solr responses.
 * Created by mspalti on 3/28/16.
 */


(function () {


  /**
   * The author response is a facet object containing a list
   * of all authors for the collection or community. This method
   * parses the result returns the relevant data to the client.
   *
   * @param solrResponse  the solr response
   * @returns {{}}
   */
  exports.processAuthor = function (solrResponse) {

    var json = solrResponse.facet_counts.facet_fields;

    var ret = {};

    var authorArr = [];
    var authors = json.bi_2_dis_filter;

    var count = 0;
    var authorObj = {};

    for (var i = 0; i < authors.length; i++) {

      // The odd indicies in the response array contain count.
      // Set the count to authorObj.
      if (i % 2 !== 0) {
        authorObj.count = authors[i];
        authorArr[count] = authorObj;
        count++;

      }
      // The even indices contain author information.  Add to
      // the authorObj.
      else {

        authorObj = {};
        var author = authors[i].split('|||');
        // remove carriage returns, etc.
        authorObj.value = author[1].replace(/^[\n\r]+/, '');

      }

    }

    var docsArr = [];

    for (var i = 0; i < solrResponse.response.docs.length; i++) {
      docsArr[i] = solrResponse.response.docs[i];
    }

    ret.offset = solrResponse.response.start;
    ret.results = docsArr;
    ret.facets = authorArr;
    ret.count = authorArr.length;

    return ret;

  };

  exports.processSubject = function (solrResponse) {

    var json = solrResponse.facet_counts.facet_fields;

    var ret = {};

    var subjectArr = [];
    var subjects = json.bi_4_dis_filter;

    var count = 0;
    var subObj = {};


    for (var i = 0; i < subjects.length; i++) {

      // The odd indicies in the response array contain count.
      // Add the count to the author object and add the author
      // object to the return array.
      if (i % 2 !== 0) {
        subObj.count = subjects[i];
        subjectArr[count] = subObj;
        count++;

      }
      // The even indicies contain author information.  Add to
      //   the author object.
      else {

        subObj = {};
        var sub = subjects[i].split('|||');
        subObj.value = sub[1].replace(/^[\n\r]+/, '');

      }

    }

    var docsArr = [];

    for (var i = 0; i < solrResponse.response.docs.length; i++) {
      docsArr[i] = solrResponse.response.docs[i];
    }
    ret.offset = solrResponse.response.start;
    ret.results = docsArr;
    ret.facets = subjectArr;
    ret.count = subjectArr.length;

    return ret;

  };

  /**
   * Item lists returned by solr queries have a similar structure.
   * This method parses the response and returns relevant data to
   * the client.
   *
   * @param solrResponse
   * @returns {{}}
   */
  exports.processItems = function (solrResponse) {

    var json = solrResponse.response.docs;

    var ret = {};
    var resultArr = [];


    for (var i = 0; i < json.length; i++) {
      var tmp = {};
      if (json[i]['dc.title'] !== undefined) {
        tmp.title = json[i]['dc.title'][0];
      }
      if (json[i].author !== undefined) {
        // Return author as array!
        tmp.author = json[i].author;
      }
      if (json[i]["dc.publisher"] !== undefined) {
        tmp.publisher = json[i]["dc.publisher"][0];
      }
      if (json[i]['dateIssued.year'] !== undefined) {
        tmp.year = json[i]['dateIssued.year'][0];
      }
      tmp.id = json[i]['search.resourceid'];
      tmp.handle = json[i].handle;
      tmp.abstract = '';
       if (typeof json[i]['dc.description.abstract_hl'] !== 'undefined') {
         tmp.abstract = json[i]['dc.description.abstract_hl'][0];
      }
      resultArr[i] = tmp;
    }

    ret.offset = solrResponse.response.start;
    ret.results = resultArr;
    ret.count = solrResponse.response.numFound;

    return ret;

  };


  exports.processDiscoveryResult = function (json) {

    var docs = json.response.docs;
    var highlights = json.highlighting;
    var final = {};
    var resultArr = [];

    for (var i = 0; i < docs.length; i++) {

      var tmp = {};

      if (docs[i].handle !== undefined) {
        tmp.handle = docs[i].handle;
      }
      if (docs[i]['search.resourceid'] !== undefined) {
        tmp.resourceid = docs[i]['search.resourceid'];
      }
      if (docs[i]['search.resourcetype'] !== undefined) {
        tmp.resourcetype = docs[i]['search.resourcetype'];
      }
      var key = tmp.resourcetype + '-' + tmp.resourceid;

      tmp.title = highlights[key]['dc.title_hl'];
      tmp.defaultTitle = docs[i]['dc.title'][0];
      tmp.description = highlights[key]['dc.description.abstract_hl'];

      resultArr[i] = tmp;
    }

    final.offset = json.response.start;
    final.results = resultArr;
    final.count = json.response.numFound;


    return final;
  };

})();
