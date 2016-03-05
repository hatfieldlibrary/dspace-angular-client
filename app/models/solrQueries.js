/**
 * Created by mspalti on 3/4/16.
 */

module.exports = {

  /**
   * From within a collection the user can browse by a list of all authors.  The result is a list of author
   * facets containing the author's name and number of hits (currently excluded).
   */
  listCollectionAuthor: 'http://localhost:1234/solr/search/select?facet=true&facet.mincount=1&facet.offset=0&rows=0&f.bi_2_dis_filter.facet.sort=index&fl=handle,search.resourcetype,search.resourceid&start=0&f.bi_2_dis_filter.facet.limit=-1&q=*:*&facet.field=bi_2_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.%s:%s&wt=json',

  /**
   * From within a collection the user can browse by a list of all titles or a list of items by date.  The
   * result returned by solr is a list of object with title, author, publisher, dateIssued, handle and resource id.
   */
  listCollectionItem: 'http://localhost:1234/solr/search/select?sort=%s+%s&start=%s&q=location.%s:%s&fl=dc.title,author,dc.publisher,dateIssued.year,handle,search.resourceid,numFound&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&wt=json',

  /**
   * Executes a query by field within a collection.
   * In DSpace 5.4, this is equivalent to a browse query, e.g.: /handle/10177/7/browse?value=Abbott%2C+Teresa+M.&type=author
   */
  browseCollectionTerms: 'http://localhost:1234/solr/search/select?q=*:*&fl=handle,search.resourcetype,search.resourceid,dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.%s:%s&fq={!field+f=bi_2_dis_value_filter}%s&fq=search.resourcetype:2&start=%s&wt=json&version=2',

//  browseCommunity: '',

  /**
   * Discovery query. Should work as global search or scoped to location.
   */
  discover: 'http://localhost:1234/solr/search/select?f.dc.title_hl.hl.snippets=5&f.dc.title_hl.hl.fragsize=0&spellcheck=true&sort=score+desc&spellcheck.q=%s&f.fulltext_hl.hl.fragsize=250&hl.fl=dc.description.abstract_hl&hl.fl=dc.title_hl&hl.fl=dc.contributor.author_hl&hl.fl=fulltext_hl&wt=json&spellcheck.collate=true&hl=true&version=2&rows=10&f.fulltext_hl.hl.snippets=2&f.dc.description.abstract_hl.hl.snippets=2&f.dc.contributor.author_hl.hl.snippets=5&fl=handle,search.resourcetype,search.resourceid&start=%s&q=%s&f.dc.contributor.author_hl.hl.fragsize=0&hl.usePhraseHighlighter=true&f.dc.description.abstract_hl.hl.fragsize=250&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)%s'

};
