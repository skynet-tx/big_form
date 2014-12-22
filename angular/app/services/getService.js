/**
 * Created by as on 12.12.2014.
 */
(function (ng) {

	"use strict";

	ng
		.module("hugeform")
		.factory("$getService", getService);

	function getService($log, $http, $location, $q) {
		var deferred = $q.defer(),
			urls = {
				getCars: "http://google.com",
				getDiscountItems: "http://google.com",
				getInitData: "http://google.com"
			};

		return {
			getCars: getCars,
			getDiscountItems: getDiscountItems,
			getInitData: getInitData
		};

		function getCars(data) {
			return _get(urls.getCars, data);
		}

		function getDiscountItems(link, data) {
			return _get(urls.getDiscountItems + link, data);
		}

		function getInitData() {
			return _get(urls.getInitData);
		}

		function _get(url, data) {
			var params = data || {};

			return $http({method: 'GET', params: params, url: url})
				.error(function (data) {
					deferred.reject(data.error);
					$log.error("GOT ERROR: ", data.error);
				});
		}
	}

})(angular);
