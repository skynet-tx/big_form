/**
 * Created by as on 15.12.2014.
 */
(function (ng) {
	ng
		.module("hugeform")
		.directive("discountDir", discountDir);

	function discountDir($templateCache, $getService) {
		var directive = {
			link: link,
			replace: false,
			templateUrl: 'js/views/partials/hugeform-form/discount-dir.html',
			restrict: 'EA'
		};
		return directive;

		function link(scope, $el) {

			scope.typeOfHome = [];
			scope.periods = getPeriods();
			scope.getVehicleString = getVehicleString;

			scope.onChangeCoverageId = onChangeCoverageId();
			scope.onChangePrimaryResidence = onChangePrimaryResidence;
			scope.onCurrentlyInsured = onCurrentlyInsured;
			scope.onChangehugeformProvider = onChangehugeformProvider;
			scope.onChangePeriod = onChangePeriod;
			scope.onChangeResidenceType = onChangeResidenceType;
			scope.onChangeCoverage = onChangeCoverage;

			scope.isShowCoverage = isShowCoverage;

			scope.isCurrentlyInsured = false;

			scope.currentlyInsuredModel = {
				hugeformProvider: '',
				coverageId: ''
			};

			init();

			$el.find("button.ajax-button-submit").bind("click", function (eve) {
				eve.preventDefault();
				eve.stopPropagation();

				collectDataToHiddenInput();
				scope.hugeformFormSubmit();
			});

			$el.find(".ajax-button-submit").bind('click', function () {
				b.fadeboxshow('Thanks for your request!');
			});

			function init() {
				scope.outputData.policy['period_temp'] = {
					name: "Per month",
					value: "1"
				};
				scope.outputData.policy['coverages'] = [];
				gethugeformProvider();
				getCoverageId();
				getTypeOfHome();
			}

			function getTypeOfHome() {
				$getService.getDiscountItems('residence_type').then(function (request) {
					if (request.statusText == 'OK') {
						scope.typeOfHome = request.data;
					}
				});
			}

			function getPeriods() {
				return [
					{
						name: "Per month",
						value: "1"
					},
					{
						name: "Per 6 Months",
						value: "6"
					},
					{
						name: "Per Year",
						value: "12"
					}
				]
			}

			function onChangePrimaryResidence() {
				_setRowDirty(".residence_type_c");
			}

			function onChangeResidenceType() {
				if (scope.outputData['residence_type_c_temp']) {
					scope.outputData['residence_type_c'] = scope.outputData['residence_type_c_temp'];
				}
			}

			function isShowCoverage() {
				return (!_.isEmpty(scope.outputData.policy['carrier_id_temp'])
				&& scope.outputData.policy.isCurrentlyInsured)
					? true
					: false;
			}

			function onCurrentlyInsured() {
				_setRowDirty(".currently-insured");
			}

			function onChangehugeformProvider() {
				if (scope.outputData.policy['carrier_id_temp']) {
					scope.outputData.policy['carrier_id'] = scope.outputData.policy['carrier_id_temp']['id'];
				}
			}

			function onChangeCoverageId() {
				if (scope.outputData.policy['coverage_id_temp']) {
					scope.outputData.policy['coverage_id'] = scope.outputData.policy['coverage_id_temp']['id'];
				}
			}

			function onChangePeriod() {
				if (scope.outputData.policy['period']) {
					scope.outputData.policy['period'] = scope.outputData.policy['period_temp']['value'];
				}
			}

			function gethugeformProvider() {
				$getService.getDiscountItems('carriers').then(function (request) {
					if (request.statusText == 'OK') {
						scope.currentlyInsuredModel['hugeformProvider'] = request.data;
					}
				});
			}

			function getCoverageId() {
				$getService.getDiscountItems('coverages').then(function (request) {
					if (request.statusText == 'OK') {
						scope.currentlyInsuredModel['coverageId'] = request.data;
					}
				});
			}

			function _setRowDirty(selector) {
				var checkmark = $el.find(selector),
					selectedClass = 'green',
					isCheckmarkSelected = checkmark.hasClass(selectedClass);

				if (!isCheckmarkSelected) {
					checkmark.addClass(selectedClass);
				}
			}

			function getVehicleString(item) {
				var defaultText = "\"Car 1 Name\" Coverage",
					receivedVehicleStr = scope.UTIL.getStringFromObjVals(item, ['make', 'year', 'model', 'trim']);

				return !receivedVehicleStr
					? defaultText
					: receivedVehicleStr;
			}

			function onChangeCoverage($index) {
				_setRowDirty(".coverage-checkmark-" + $index);
			}


			function collectDataToHiddenInput() {
				$el.find("input[type='hidden']").remove();

				$el.find("input[type='hidden']").remove();
				$el.find("select").each(function() {
					var name = $(this).attr('name'),
						value = $(this).find('option:selected').text();
					$el.append(
						'<input type="hidden" name="' + name + '[\'name\']" value="' + value + '">'
					);
				});
			}

		}
	}

})(angular);
