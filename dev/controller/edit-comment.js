define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/events', 'js/constants/states', 'js/constants/forms'],
		function(controller, $, ng, i18n, validation, responseCodes, pathVars, events, states, forms) {
	controller.controller('EditCommentController', ['$rootScope', '$scope', '$state', 'Browser', 'CurrentUser', 'Utils',
																										'Authentication', 'Alerts', 'MarkdownConverter', 'pyComment',
		function($rootScope, $scope, $state, Browser, CurrentUser, Utils, Authentication, Alerts, Converter, pyComment) {
			$scope.commentLoading = false;
			$scope.content = undefined;
			$scope.alert = undefined;
			$scope.errors = {};
			$scope.currentUser = undefined;
			$scope.currentUsername = undefined;
			$scope.showPreview = false;
			$scope.show = false;
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			
			Utils.unsavedChanges($scope, forms.EDIT_COMMENT);
			
			var cancel = function() {
				$scope.show = false;
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						$scope.currentUser = currentUser;
						$scope.currentUsername = currentUser.username.username;
					}, function() {
						i18n(function(t) {
							Alerts.warning(t('alerts:apiError'));
							cancel();
						});
					});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					$scope.commentLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['content'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if(code === responseCodes.NOT_ALLOWED) {
						$scope.alert = t('alerts:comment.editNotAllowed');
					} else {
						$scope.alert = t('alerts:comment.editError');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.commentLoading = false;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
				$scope.show = false;
				if(ng.isDefined(pscope.comment)) {
					if($scope.content === '') {
						$scope.content = undefined;
					}
					if($scope.preview === '') {
						$scope.preview = undefined;
					}
					pscope.comment.content = $scope.content;
					pscope.comment.preview = $scope.preview;
				}
			};
			
			var apiError = function() {
				i18n(function(t) {
					$scope.commentLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			
			$scope.editComment = function() {
				$scope.commentLoading = true;
				$scope.errors = {};
				$scope.alert = undefined;
				if(ng.isDefined(pscope.commentId)) {
					pyComment.edit(success, error, apiError, pscope.commentId, $scope.content);
				}
			};
			
			Converter.manageEvent($scope, function() {
				var content = $scope.content;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.contentPreview = content;
			});
			
			$scope.open = function() {
				if(ng.isDefined(pscope.comment)) {
					$scope.show = true;
					$scope.content = pscope.comment.content;
					$scope.$broadcast(events.SET_EDITOR, $scope.content);
				}
			};
			
			$scope.cancel = function() {
				cancel();
			};
		}
	]);
});