/**
 * Defines the solr URL's used by the application.
 *
 * URL's are accessed by key.
 *
 * The URL value is a String template with (%s) placeholders.  The nodejs util.format() method can be used for string interpolation.
 *
 * Created by mspalti on 3/4/16.
 */

module.exports = {

  /**
   * From within a collection the user can browse by a list of all authors.  The result is a list of author
   * facets containing the author's name and number of hits (currently excluded).
   *
   * The location input requires the item type and dspace id.  e.g. &fq=location.coll:88
   *
   * Input: [location]
   */
  authorFacets:       'http://localhost:1234/solr/search/select?facet=true&facet.mincount=1&facet.offset=0&rows=0&f.bi_2_dis_filter.facet.sort=index&fl=handle,search.resourcetype,search.resourceid&start=0&f.bi_2_dis_filter.facet.limit=-1&q=*:*&facet.field=bi_2_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&wt=json%s',
  /**
   * From within a collection the user can browse by a list of all subjects.  The result is a list of subject
   * facets containing the subject name and number of hits (currently excluded).
   *
   * The location input requires the item type and dspace id.
   *
   * Input: [location]
   */
  subjectFacets:      'http://localhost:1234/solr/search/select?facet=true&facet.mincount=1&facet.offset=0&version=2&rows=0&f.bi_4_dis_filter.facet.sort=index&f.bi_4_dis_filter.facet.limit=-1&fl=handle,search.resourcetype,search.resourceid&start=0&q=*:*&facet.field=bi_4_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&wt=json%s',

  /**
   * Browse for all items by an author.
   *
   * The location input requires the item type and dspace id.
   *
   * Input: order, offset, terms, [location]
   */

  authorBrowse:        'http://localhost:1234/solr/search/select?sort=bi_sort_1_sort+%s&fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid&start=%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq={!field+f%3Dbi_2_dis_value_filter}%s&fq=search.resourcetype:2%s&version=2&rows=20%s',

  /**
   * Browse for all items with a given subject.
   *
   * The location input requires the item type and dspace id.
   *
   * Input: order, offset, terms, [location]
   */
  subjectBrowse:        'http://localhost:1234/solr/search/select?sort=bi_sort_1_sort+%s&fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid&start=%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq={!field+f%3Dbi_4_dis_value_filter}%s&fq=search.resourcetype:2%s&s&version=2&rows=20%s',

  /**
   * Browse all titles within a given scope.
   *
   * The location input requires the item type and dspace id.
   *
   * Input: order, offset, [location]
   */
  allTitlesBrowse:      'http://localhost:1234/solr/search/select?sort=bi_sort_1_sort+%s&fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid&start=%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2%s&version=2&rows=20%s',

  /**
   * Browse all titles by date within a given scope.
   *
   * The location input requires the item type and dspace id.
   *
   * Input: order, offset, [location]
   */
  allDatesBrowse:       'http://localhost:1234/solr/search/select?sort=bi_sort_2_sort+%s&fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid&start=%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2%s&version=2&rows=20%s',

  /**
   * Discovery query. Should work as global search or scoped to location.
   *
   * The location input uses only the dspace id. e.g. &fq=location:l88
   *
   * Input: terms, offset, terms(2), [location]
   */

  discover:             'http://localhost:1234/solr/search/select?f.dc.title_hl.hl.snippets=5&f.dc.title_hl.hl.fragsize=0&spellcheck=true&sort=score+desc&spellcheck.q=%s&f.fulltext_hl.hl.fragsize=250&hl.fl=dc.description.abstract_hl&hl.fl=dc.title_hl&hl.fl=dc.contributor.author_hl&hl.fl=fulltext_hl&wt=json&spellcheck.collate=true&hl=true&version=2&rows=10&f.fulltext_hl.hl.snippets=2&f.dc.description.abstract_hl.hl.snippets=2&f.dc.contributor.author_hl.hl.snippets=5&fl=handle,search.resourcetype,search.resourceid&start=%s&q=%s&f.dc.contributor.author_hl.hl.fragsize=0&hl.usePhraseHighlighter=true&f.dc.description.abstract_hl.hl.fragsize=250%s&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)%s',


  /**
   * input date, location
   */
  startDateLocation:     'fl=handle,search.resourcetype,search.resourceid&start=0&q=bi_sort_2_sort:+[*+TO+"%s"}&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2&version=2&rows=0%s%s',


  /**
   * input letter, location
   */
  indexLetterLocation:    'fl=handle,search.resourcetype,search.resourceid&start=0&q=bi_sort_1_sort:+[*+TO+"%s"}&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2&version=2&rows=0%s%s'

};
