## Advanced Search Components

The advanced search filter and list components differ from the equivalent discovery components.  

In discovery, the filter component is a child of the list component.  All updates happen in the context of the list component and it's children.  The discovery filter is a loader and executes a new search whenever a new filter is added. This is identical to how all other loader work.

In advanced search, the filter component and the list component are siblings.  Updates happen in the context of the advanced search component and it's children.  The advanced filter therefore updates the query context without executing a new search.  Searches are initiated by the advanced-search-component (when the user hits the submit button).

Both discovery and advanced search share components farther down the tree (i.e.: discover-filter-component and discover-detail-component).
