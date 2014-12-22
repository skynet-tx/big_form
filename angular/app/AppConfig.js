/**
 * Created by as on 11.12.2014.
 */
(function (ng) {
	"use strict";

	ng
		.module("hugeform")
		.config(config);

	function config($logProvider) {
		$logProvider.debugEnabled(true);
	}

})(angular);
