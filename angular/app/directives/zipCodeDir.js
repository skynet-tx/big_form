/**
 * Created by as on 11.12.2014.
 */
(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.directive("zipCodeDir", zipCodeDir);

	function zipCodeDir($templateCache) {
		var directive = {
			link: link,
			replace: true,
			templateUrl: 'js/views/partials/hugeform-form/zip-code-dir.html',
			restrict: 'EA'
		};
		return directive;

		function link(scope, $el) {

			$el.find(".ajax-button-submit").bind("click", function(eve){
				eve.preventDefault();
				eve.stopPropagation();

				var postalcode = $el.find("input.builder-control").val();

				if(postalcode.length !== 0){
					scope.outputData['primary_address_postalcode'] = postalcode;
					scope.isFormEnabled = true;
				} else {
					delete scope.outputData['primary_address_postalcode'];
					scope.isFormEnabled = false;
				}

				scope.hugeformFormSubmit();
				scope.$apply();
			});

			$el.find('[name="primary_address_postalcode"]').bind('keyup', function(e) {
				if (e.keyCode == 13) {
					$el.find(".ajax-button-submit").click();
				}
			});

		}

	}

})(angular);
