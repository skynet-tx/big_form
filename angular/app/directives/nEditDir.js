/**
 * Created by as on 19.12.2014.
 */
(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.directive("nEditDir", nEditDir);

	function nEditDir($templateCache) {
		var directive = {
			link: link,
			replace: true,
			templateUrl: 'js/views/partials/hugeform-form/n-edit-dir.html',
			restrict: 'EA',
			scope: {
				number: "@",
				model: "@",
				param: "@"
			}
		};
		return directive;

		function link(scope, $el) {
			scope.onChangeEditableStatus = onChangeEditableStatus;
			scope.onSave = onSave;
			scope.isLableHide = false;
			scope.lableText = scope.$parent['outputData'][scope.model][scope.param] || "Driver";
			scope.indexRow = ~~scope.number + 1;

			function onChangeEditableStatus() {
				scope.isLableHide = true;
			}

			function onSave(){ // close and save
				if(!scope.lableText) return;

				scope.isLableHide = false;
				scope.$parent['outputData'][scope.model][scope.param] = scope.lableText;
			}

		}
	}
})(angular);
