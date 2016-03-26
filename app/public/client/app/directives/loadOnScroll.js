/**
 * Created by mspalti on 3/25/16.
 */

dspaceDirectives.directive('loadOnScroll',  function($document) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var visibleHeight = element[0].offsetHeight;

      var threshold = 400;

      console.log(element)
      

      element.bind('scroll', function () {


        console.log(visibleHeight)
        var scrollableHeight = element[0].scrollHeight;
        console.log('window ' + $window.pageYOffset)
        console.log(scrollableHeight)
        var hiddenContentHeight = scrollableHeight - visibleHeight;
        console.log(hiddenContentHeight);
        var windowEl = angular.element($window);
        console.log(scrollEl.scrollTop)
        if (scrollableHeight - windowEl.scrollTop() <= threshold) {
          // Scroll is almost at the bottom. Loading more rows
          scope.$apply(attrs.loadOnScroll);
        }
      });
      // element.scroll(function() {
      //
      //   var scrollableHeight = element.scrollHeight;
      //   var hiddenContentHeight = scrollableHeight - visibleHeight;
      //    console.log(hiddenContentHeight);
      //   if (hiddenContentHeight - element.scrollTop() <= threshold) {
      //
      //     // Scroll is almost at the bottom. Loading more rows
      //     scope.$apply(attrs.loadOnScroll);
      //   }
      // });
    }

  }
});
