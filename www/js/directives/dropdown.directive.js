
WebApp.directive("dropdown", function($rootScope) {
  return {
    restrict: "E",
    templateUrl: "views/dropdown.html",
    scope: {
      placeholder: "@",
      list: "=",
      selected: "=",
      property: "@"
    },
    link: function(scope, element, attrs) {
      scope.listVisible = false;
      scope.isPlaceholder = true;

      if(attrs.orient === 'top') {
        element.find('.dropdown-list').css('top', '0px');
      }

      scope.select = function(item) {
        scope.isPlaceholder = false;
        scope.selected = item;
        scope.$parent.updateSelectedSource(item);
      };

      scope.isSelected = function(item) {
        if (scope.selected == undefined) {
          return false;
        }
        return item[scope.property] === scope.selected[scope.property];
      };

      scope.show = function() {
        scope.listVisible = !scope.listVisible;
      };

      $rootScope.$on("documentClicked", function(inner, target) {
        if (!$(target[0]).is(".dropdown-display") && !$(target[0]).parents(".dropdown-display").length > 0)
          scope.$apply(function () {
            scope.listVisible = false;
          });
      });

      scope.$watch("selected", function(value) {
        if (scope.selected != undefined) {
          scope.isPlaceholder = scope.selected[scope.property] === undefined;
          scope.display = scope.selected[scope.property];
        }
      });
    }
  }
});
