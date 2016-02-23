define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/model-attributes', 'js/constants/scope-variables', 'js/constants/chained-keys'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, modelAttributes, scopeVars, chainedKeys) {
	controller.controller('ConversationPreviewController', ['$scope', '$parse', 'CurrentUser',
		function($scope, $parse, CurrentUser) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = 'data.pageable';

			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.conversation = s.getSingleMain();
					var authorUsername = $scope.conversation.author.username;
					var targetUsername = $scope.conversation.target.username;

					$scope.conversationUsername = targetUsername;
					$scope.conversationUser = $scope.conversation.target;
					CurrentUser.get(function(currentUser) {
						$scope.currentUsername = currentUser.username.username;
						if(typeof($scope.currentUsername) === 'undefined') {
							$scope.conversationUsername = authorUsername;
							$scope.conversationUser = $scope.conversation.author;
						} else if($scope.currentUsername === authorUsername) {
							$scope.conversationUsername = targetUsername;
							$scope.conversationUser = $scope.conversation.target;
						} else if($scope.currentUsername === targetUsername) {
							$scope.conversationUsername = authorUsername;
							$scope.conversationUser = $scope.conversation.author;
						}
					});
					
					i18n(function(t) {
						$scope.created = utils.getTimeSince($scope.conversation.created);
						$scope.createdCalendar = utils.getCalendarDate($scope.conversation.created);
						$scope.lastMessage = utils.getTimeSince($scope.conversation.lastMessage);
						$scope.lastMessageCalendar = utils.getCalendarDate($scope.conversation.lastMessage);
					});
				}
			};
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);
	controller.controller('MessageController', ['$scope', '$parse', 'CurrentUser',
		function($scope, $parse, CurrentUser) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
	
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.message = s.getSingleMain();
					var authorUsername = $scope.message.author.username;
					var targetUsername = $scope.message.target.username;
					
					CurrentUser.get(function(currentUser) {
						$scope.currentUsername = currentUser.username.username;
						if(typeof($scope.currentUsername) === 'undefined') {
							$scope.self = false;
						} else if($scope.currentUsername === authorUsername) {
							$scope.self = true;
						} else if($scope.currentUsername === targetUsername) {
							$scope.self = false;
						}
					});
					
					i18n(function(t) {
						$scope.current = t('shared:you');
						$scope.timeSince = utils.getTimeSince($scope.message.created);
						$scope.calendar = utils.getCalendarDate($scope.message.created);
					});
				}
			};
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);
});