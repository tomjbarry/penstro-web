define([], function() {
	
	var isFunction = function(f) {
		var getType = {};
		var validFunc = function() {};
		return (f && getType.toString.call(f) === getType.toString.call(validFunc));
	};
	
	var getErrorList = function(dto) {
		var ob = dto || {};
		var errors = ob.errors;
		if(typeof(errors) !== 'undefined' &&
				Object.prototype.toString.call(errors) === Object.prototype.toString.call([])) {
			return errors;
		}
		return [];
	};
	
	return {
		isValid: function(dto) {
			var ob = dto || {};
			var errors = ob.errors;
			if(typeof(errors) !== 'undefined' &&
					Object.prototype.toString.call(errors) === Object.prototype.toString.call([])) {
				return true;
			}
			return false;
		},
		getErrorList: getErrorList,
		getArguments: function(error) {
			// in case it is already an object in the future, this should make transitioning easy
			var args = error.arguments || [];
			var ob = {};
			for(var i = 0; i < args.length; i++) {
				ob[i] = args[i];
			}
			return ob;
		},
		getValidCode: function(error) {
			var code = error.code || 'default';
			var defaultCode = error.defaultCode;
			var args = error.arguments;
			if((typeof(args) === 'undefined' || args.length < 1) && typeof(defaultCode) !== 'undefined') {
				return defaultCode;
			}
			return code;
		},
		handleErrorsInOrder: function(dto, orderedFieldList, callback) {
			if(!isFunction(callback)) {
				return;
			}
			var list = orderedFieldList || [];
			var errors = getErrorList(dto);
			var ob = {};
			var i;
			for(i = 0; i < errors.length; i++) {
				ob[errors[i].field] = errors[i];
			}
			var resume;
			for(i = 0; i < list.length; i++) {
				if(typeof(resume) === 'undefined' || resume) {
					resume = callback(list[i], ob[list[i]]);
				}
			}
		}
	};
});