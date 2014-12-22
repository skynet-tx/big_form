/**
 * Created by as on 11.12.2014.
 */
(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.controller("hugeform_form", hugeformForm);

	hugeformForm.$inject = [
		"$scope",
		"$cookieStore",
		"$postService",
		"$getService",
		"$timeout"
	];

	function hugeformForm($scope, $cookieStore, $postService, $getService, $timeout) {
		$scope.outputData = {};
		$scope.outputData["policy"] = {};
		$scope.outputData["id"] = getCookie();
		$scope.outputData["primary_address_postalcode"] = "";
		$scope.outputData["email"]= "";
		$scope.primary_address_postalcode = "";

		$scope.vehicles = [];
		$scope.drivers = [];
		$scope.drivers_vehicles = [];
		$scope.rowModels = [];

		$scope.isFormEnabled = false;
		$scope.isFormDriverEnabled = false;
		$scope.isFormDiscountEnabled = false;
		$scope.isNextBtnDisabled = true;
		$scope.hugeformFormSubmit = hugeformFormSubmit;

		var attempts = 0;


		$timeout(function () {
			init();
		}, 0);


		function getCookie() {
			var id = $cookieStore.get('lead_id');
			return id ? id : null;
		}

		function hugeformFormSubmit() {
			var formData = $("form#hugeform-form").serialize();

			$postService.saveFormhugeform(formData, $scope.outputData).then(function (request) {
				if (request.statusText == 'OK') {
					console.log("saved data >>", request.data);
				}
			});
		}

		function init() {
			getFormData();
		}

		function getFormData() {
			$getService.getInitData().then(function (request) {
				if (request.statusText == 'OK') {
					setFieldValues(request.data['service_data']);
					console.log(">>>", request.data)
				}
			});
		}

		function setFieldValues(formData) {
			if(!formData || formData.length == 0) return;

			$scope.outputData = formData;

			_fillPrimaryAddressPostalcode(formData.primary_address_postalcode);
			_fillVehiclesFields(formData.vehicles);
			_fillDriversFields(formData.drivers, formData.drivers_vehicles);
		}

		function _fillPrimaryAddressPostalcode(zipCode) {
			if (!zipCode) return;

			$scope.outputData["primary_address_postalcode"] = zipCode;
			$scope.isFormEnabled = true;
		}

		function _fillVehiclesFields(vehicles) {
			$scope.vehicles = vehicles;
			_setRelativeValues(vehicles);
		}

		function _setRelativeValues(vehiclesArr) {
			var fieldsToSelect = ['make', "year", 'model'], // Relative fields
				fieldToSet = ['year', 'model', ["trim", "id"]], // Relative fields
				selectedLength = fieldsToSelect.length - 1;

			vehiclesArr.forEach(function (row, key) {
				fieldsToSelect.forEach(function (field, fieldKey) {
					var arrayCopy = angular.copy(fieldsToSelect),
						paramsArr = arrayCopy.reverse().slice(selectedLength - fieldKey);

					_setVehiclesModelsData(paramsArr, fieldToSet[fieldKey], key);
				});
			});
		}

		function _setVehiclesModelsData(paramsArr, fieldToSet, $index) {
			var data = $scope.UTIL.getSelectedItems(paramsArr, $index, $scope.vehicles);

			$getService.getCars(data).then(function (request) {
				if (request.statusText == 'OK') {

					if (!$scope.rowModels[$index]) {
						$scope.rowModels[$index] = {};
					}

					if (typeof fieldToSet === "string") {
						$scope.rowModels[$index][fieldToSet + "s"] = $scope.UTIL.getValuesArray(fieldToSet, request.data);
					} else {
						$scope.rowModels[$index][fieldToSet[0] + 's'] = $scope.UTIL.getValuesArray(fieldToSet, request.data);
					}

					$scope.isFormDriverEnabled = true; // Enabled Drivers Form
					angular.element("button.vehicles-next-btn").removeAttr("disabled");
				}
			});
		}

		function _fillDriversFields(drivers, driversVehicles) {
			$scope.drivers = drivers;
			$scope.drivers_vehicles = driversVehicles;
			$scope.isFormDiscountEnabled = true;
			attempts = 0;

			_removeAttrDisabled("button.driver-next-btn");
		}

		function _removeAttrDisabled(selector){
			var $el = angular.element(selector);

			if(!$el.attr("disabled") && attempts < 10){

				attempts +=1;
				_removeAttrDisabled(selector);
			} else {
				$el.removeAttr("disabled");
			}
		}


	}


})(angular);
