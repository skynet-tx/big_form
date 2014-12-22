/**
 * Created by as on 13.12.2014.
 */
(function (ng) {

	"use strict";

	ng
		.module("hugeform")
		.run(run);

	function run($rootScope) {
		$rootScope.UTIL = {
			toInt: function (binaryString) {
				return parseInt(binaryString, 2);
			},
			toBinaryString: function (int) {
				return int.toString(2);
			},
			arrayToString: function (array, separator) {
				var string = separator || '';
				return array.join(string);
			},
			getStringFromObjVals: function (item, keyArray) {
				if (typeof item !== "object") throw new Error("OPs! Received data are incorrect");
				if (keyArray.length == 0) throw new Error("OPs! Array with keys doesn't found");
				var stringArray = [];

				keyArray.forEach(function (key) {
					var string = item[key];

					if (typeof string == "object") {
						string = string[key];
					}

					if (!string) return;

					stringArray.push(string);
				});

				return stringArray.length > 0
					? this.arrayToString(stringArray, " ")
					: '';
			},

			/**
			 * Get data for request
			 * @param itemsArray - array of item names
			 * @param $index - index for any models
			 * @returns {{}}
			 * @private
			 */
			getSelectedItems: function (itemsArray, $index, model) {
				var outputData = {};

				itemsArray.forEach(function (item) {
					outputData[item] = model[$index][item];
				});

				return outputData;
			},

			/**
			 * Create array of values as model
			 * @param key
			 * @param dataArray
			 * @returns {Array}
			 * @private
			 */
			getValuesArray: function (key, dataArray) {
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
		}
	}

})(angular);
