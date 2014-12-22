(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.directive("vehiclesDir", vehiclesDir);

	function vehiclesDir($templateCache, $getService, $timeout) {
		var directive = {
			link: link,
			replace: false,
			templateUrl: 'js/views/partials/hugeform-form/vehicles-dir.html',
			restrict: 'EA'
		};
		return directive;

		function link(scope, $el) {

			scope.onChangeCar = onChangeCar;
			scope.onChangeYear = onChangeYear;
			scope.onChangeModel = onChangeModel;
			scope.onChangeTrim = onChangeTrim;
			scope.onChangeOwnership = onChangeOwnership;
			scope.onChangeUsageType = onChangeUsageType;
			scope.onRemoveVehicles = onRemoveVehicles;

			scope.cars = [];

			scope.mileageTotal = [
				'0-6000',
				'6001-10000',
				'10001-15000',
				'15001+'
			];

			var VECHICLES_SELECTED = 127, // default mask is 1111111
				ruleMaskArr = [],
				defaultVehicles = {
					'make': "",
					'year': "",
					'model': "",
					'trim': "",
					'trim_id': null,
					'ownership_type': "",
					'mileage_total': "",
					'usage_type': ""
				},
				defaultModels = {
					years: [],
					models: [],
					trims: []
				};

			scope.$watch('isFormEnabled', function (newVal) {
				if (!newVal) return;
				init(); // init directive
			});

			scope.$watch("vehicles", function () {
				selectProcessing();
				setVehiclesToOutputData();
			}, true);


			$el.find(".add-vehicle-btn").bind('click', function (eve) {
				eve.preventDefault();
				eve.stopPropagation();
				onAddVehicleRow();
			});

			$el.find(".vehicles-next-btn").bind("click", function(eve){
				scope.isFormDriverEnabled = scope.isNextBtnDisabled;
			});

			function init() {
				var dataRowModels = angular.copy(defaultModels);
				scope.rowModels.push(dataRowModels);
				getCars();
				getVehicles();
				setDefaultFields();
			}

			function getCars() {
				$getService.getCars().then(function (request) {
					if (request.statusText == 'OK') {
						scope.cars = _getValuesArray('make', request.data);
					}
				});
			}

			function getVehicles() {
				if (scope.vehicles.length < 1) {
					var defaultVehiclesItem = angular.copy(defaultVehicles);
					scope.vehicles.push(defaultVehiclesItem);
				}
			}

			function setDefaultFields(){
				var fieldToFill = [
					{
						link: "ownership_type",
						model: "ownerships"
					},{
						link: "usage_type",
						model: "usageType"
					}
				];

				fieldToFill.forEach(function(field){
					$getService.getDiscountItems(field.link).then(function(request){
						if (request.statusText == 'OK') {
							scope[field['model']] = request.data;
						}
					})
				});
			}

			// // Handler functions controls
			function onAddVehicleRow() {
				var defaultVehiclesItem = angular.copy(defaultVehicles),
					dataRowModels = angular.copy(defaultModels);
				scope.rowModels.push(dataRowModels);
				scope.vehicles.push(defaultVehiclesItem);
				scope.$apply();
			}

			function onChangeCar($index) {
				clearItems(['year', 'model', 'trim', 'trim_id'], $index);

				_getYears($index);
			}

			function onChangeYear($index) {
				clearItems(['model', 'trim', 'trim_id'], $index);

				_getModels($index);
			}

			function onChangeModel($index) {
				clearItems(['trim', 'trim_id'], $index);

				_getStyles($index);
			}

			function onChangeTrim($index) {

				if (!scope.vehicles[$index]['trim']) return;
				scope.vehicles[$index]['trim_id'] = scope.vehicles[$index]['trim']['id'];
			}

			function onChangeOwnership($index) {
				if (!scope.vehicles[$index]['ownership_type_temp']) return;

				scope.vehicles[$index]['ownership_type'] = scope.vehicles[$index]['ownership_type_temp']['id'];
			}

			function onChangeUsageType($index) {
				if (!scope.vehicles[$index]['usage_type_temp']) return;

				scope.vehicles[$index]['usage_type'] = scope.vehicles[$index]['usage_type_temp']['id'];
			}

			function onRemoveVehicles($index) {
				if(scope.vehicles.length == 1) return;

				scope.vehicles.splice($index, 1); // remove vehicle
				scope.rowModels.splice($index, 1); // remove row model for vehicle
			}

			// Private functions controls
			function _getYears($index) {
				var data = _getSelectedItems(["make"], $index);

				$getService.getCars(data).then(function (request) {
					if (request.statusText == 'OK') {
						scope.rowModels[$index]['years'] = _getValuesArray('year', request.data);
					}
				});
			}

			function _getModels($index) {
				var data = _getSelectedItems(["make", "year"], $index);

				$getService.getCars(data).then(function (request) {
					if (request.statusText == 'OK') {
						scope.rowModels[$index]['models'] = _getValuesArray('model', request.data);
					}
				});
			}

			function _getStyles($index) {
				var data = _getSelectedItems(["make", "year", "model"], $index);

				$getService.getCars(data).then(function (request) {
					if (request.statusText == 'OK') {
						scope.rowModels[$index]['trims'] = _getValuesArray(["trim", "id"], request.data);
					}
				});
			}

			/**
			 * Get data for request
			 * @param itemsArray - array of item names
			 * @param $index - index for any models
			 * @returns {{}}
			 * @private
			 */
			function _getSelectedItems(itemsArray, $index) {
				var outputData = {};

				itemsArray.forEach(function (item) {
					outputData[item] = scope.vehicles[$index][item];
				});

				return outputData;
			}

			/**
			 * Create array of values as model
			 * @param key
			 * @param dataArray
			 * @returns {Array}
			 * @private
			 */
			function _getValuesArray(key, dataArray) {
				if (!key || dataArray.length < 1) {
					throw new Error("Invalid arguments!");
				}

				var newData = [];
				dataArray.forEach(function (item) {
					if (typeof  key === "string") {
						newData.push(item[key]);

					} else {
						var data = {};

						key.forEach(function (val) {
							data[val] = item[val];
						});

						newData.push(data);
					}

				}, newData);
				return newData;
			}

			/**
			 * Clear next items
			 * @param itemsArray
			 * @param $index
			 */
			function clearItems(itemsArray, $index) {
				if (itemsArray.length < 1) {
					throw new Error("Invalid itemArray argument!");
				}

				itemsArray.forEach(function (item) {
					scope.vehicles[$index][item] = '';
				});
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
				var checkRule = scope.vehicles.length,
					fieldsCount = 7,
					ruleArray = [];

				for(var i = 0; i < fieldsCount * checkRule; i++){
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
				scope.isNextBtnDisabled = mask == VECHICLES_SELECTED;
			}

			function setVehiclesToOutputData(){
				scope.outputData['vehicles'] = scope.vehicles;

				$timeout(function(){
					collectDataToHiddenInput();
				});
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
