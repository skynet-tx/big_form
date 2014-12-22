/**
 * Created by as on 16.12.2014.
 */
(function (ng) {

	"use strict";

	angular
		.module("hugeform")
		.factory("$postService", postService);

	function postService($log, $http, $q) {
		var deferred = $q.defer(),
			urls = {
				saveFormhugeform: "http://google.com"
			};

		return {
			saveFormhugeform: saveFormhugeform
		};

		function saveFormhugeform(formData, data){
			var params = data || {};
			deferred.resolve();
			return _request(urls.saveFormhugeform + formData, params);
		}

		function _request(url, data) {
			b.showLoader();

			return $http({method: 'POST', data: data, url: url})
				.success(function() {
					b.hideLoader();
				})
				.error(function (data) {
					b.hideLoader();
					$log.error("GOT ERROR: ", data.error);
				});
		}
	}

})(angular);
