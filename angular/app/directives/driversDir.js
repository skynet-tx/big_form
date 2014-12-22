(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.directive("driversDir", driversDir);

	function driversDir($templateCache, $timeout, $getService) {
		var directive = {
			link: link,
			replace: false,
			templateUrl: 'js/views/partials/hugeform-form/drivers-dir.html',
			restrict: 'EA'
		};
		return directive;

		function link(scope, $el) {

			scope.onClickDriverAdd = onClickDriverAdd;
			scope.onClickDriverClear = onClickDriverClear;
			scope.onClickDriverRemove = onClickDriverRemove;

			scope.isDriverNextBtnDisabled = true;
			scope.age = _.range(16, 66);
			scope.accident_count = _.range(0, 6);

			scope.driver_types = [
				{
					name: 'Primary',
					id: 'Primary'
				},
				{
					name: 'Secondary',
					id: 'Secondary'
				},
				{
					name: 'Not used',
					id: 'Not-used'
				}
			];

			var VECHICLES_SELECTED = 63, // default mask is 1111111
				ruleMaskArr = [],
				defaultDriver = {
					age: '',
					gender: '',
					education: '',
					maritalStatus: '',
					permitStatus: '',
					accidentCount: ''
				};

			scope.$watch('isFormDriverEnabled', function (newVal, oldVal) {
				if (!newVal) return;
				init(); // init directive
			});

			scope.$watch("drivers", function () {
				selectProcessing();
				setDriversToOutputData();
			}, true);

			scope.$watch("drivers_vehicles", function () {
				selectProcessing();
				setDriversToOutputData();
			}, true);

			scope.$watch('vehicles', function () {
				updateDriverVehicles();
			}, true);

			function init() {
				getSelectorValues();
				selectProcessing();
			}

			function getSelectorValues() {
				var selectorPrefixes = [
					'gender',
					'education',
					'marital_status',
					'permit_status'
				];

				_.forEach(selectorPrefixes, function (prefix) {
					$getService.getDiscountItems(prefix).then(function (request) {
						if (request.statusText == 'OK') {
							scope[prefix] = request.data;
						}
					});
				});
			}

			$el.find("button.driver-next-btn").bind('click', function () {
				scope.isFormDiscountEnabled = true;
			});

			if (_.isEmpty(scope.drivers)) {
				scope.drivers.push(angular.copy(defaultDriver));
			}

			function onClickDriverAdd() {
				scope.drivers.push(angular.copy(defaultDriver));
				updateDriverVehicles();
			}

			function onClickDriverClear(index) {
				scope.drivers[index] = angular.copy(defaultDriver);
			}

			function onClickDriverRemove(index) {
				scope.drivers.splice(index, 1);
			}

			function updateDriverVehicles() {

				var vehiclesInfo = [];
				scope.drivers_vehicles = [];

				_.forEach(scope.vehicles, function (vehicle) {
					if (_.isEmpty(vehicle.make)) {
						return true;
					}

					var info = vehicle.make;

					if (!_.isEmpty(vehicle.year)) {
						info += ' ' + vehicle.year;
					}

					if (!_.isEmpty(vehicle.model)) {
						info += ' ' + vehicle.model;
					}

					if (typeof vehicle.trim != 'undefined' && !_.isFunction(vehicle.trim.trim)) {
						info += ' ' + vehicle.trim.trim;
					}

					vehiclesInfo.push(info);
				});

				for (var i = 0; i < scope.drivers.length; i++) {
					scope.drivers_vehicles[i] = [];

					_.forEach(vehiclesInfo, function (vehicle) {
						scope.drivers_vehicles[i].push({
							name: vehicle,
							driver_type: ''
						});
					});
				}
			}

			function selectProcessing() {
				$timeout(function () {
					var selectBoxes = $el.find("select");
					if (selectBoxes.length == 0) return;

					_checkRule();
					_createRuleMask(selectBoxes);//create mask rule array
				}, 0);
			}

			function _checkRule() {
				var checkRule = scope.drivers.length,
					fieldsCount = 6 + scope.vehicles.length,
					ruleArray = [];

				for (var i = 0; i < fieldsCount * checkRule; i++) {
					ruleArray.push(1);
				}

				VECHICLES_SELECTED = scope.UTIL.toInt(scope.UTIL.arrayToString(ruleArray)); // control sum
			}

			function _createRuleMask(selectBoxes) {  // ruleMaskArr
				ruleMaskArr = []; // Clean all rules;

				for (var i = 0; i < selectBoxes.length; i++) {
					var selectedVal = angular.element(selectBoxes[i]).val();

					if (!!selectedVal && selectedVal != '' && selectedVal != null) {
						ruleMaskArr.push(1);
					} else {
						ruleMaskArr.push(0);
					}
				}

				_changeBntDisabledStatus();
			}

			function _changeBntDisabledStatus() {
				var mask = scope.UTIL.toInt(scope.UTIL.arrayToString(ruleMaskArr));
				scope.isDriverNextBtnDisabled = mask == VECHICLES_SELECTED;
			}

			function setDriversToOutputData(){
				scope.outputData['drivers'] = scope.drivers;
				scope.outputData['drivers_vehicles'] = scope.drivers_vehicles;

				collectDataToHiddenInput();
			}

			function collectDataToHiddenInput() {
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
