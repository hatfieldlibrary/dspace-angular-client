## Advanced Search Components

The advanced search filter and list components differ from the equivalent discovery components.  

In discovery, the filter component is a child of the list component and updates happen in the context of the list component and it's children.  The discovery filter is a loader and a new search is executed whenever a new filter is added. This is identical to how all other loaders work.

In advanced search, the filter component and the list component are siblings and updates happen in the context of the advanced search component parent and it's children.  The advanced filter updates the query context without executing the search.  Searches are initiated in the advanced search component parent when the user hits the submit button.

Both discovery and advanced search share components farther down the tree (i.e.: discover-filter-component and discover-detail-component).
