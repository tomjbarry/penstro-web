define([], function() {
	var second = 1000;
	var hour = second * 60 * 60;
	var day = hour * 24;
	var week = day * 7;
	var month = day * 30;
	var year = day * 355;
	var decade = day * 3552;
	return {
		HOUR: hour,
		DAY: day,
		WEEK: week,
		MONTH: month,
		YEAR: year,
		DECADE: decade
	};
});