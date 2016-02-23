define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/pending-actions', 'js/constants/events', 'js/constants/states', 'js/constants/forms'],
		function(controller, $, ng, i18n, validation, utils, responseCodes, pathVars, pendingActions, events, states, forms) {
	controller.controller('CreateCommentController', ['$rootScope', '$scope', '$state', '$stateParams', 'Alerts', 'Browser', 'Utils',
																										'Authentication', 'EventManager', 'CurrentUser', 'MarkdownConverter', 'pyComment',
		function($rootScope, $scope, $state, $stateParams, Alerts, Browser, Utils, Authentication, EventManager, CurrentUser, Converter, pyComment) {
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			
			var clear = function() {
				$scope.content = undefined;
				$scope.backer = undefined;
				$scope.warning = undefined;
				$scope.cost = undefined;
				$scope.alert = undefined;
				$scope.errors = {};
				$scope.optionalCollapsed = true;
				$scope.showPreview = false;
				$scope.commentLoading = false;
			};
			clear();
			
			/*
			var checkPendingActions = function() {
				CurrentUser.hasPendingAction(pendingActions.UNLINKED_PAYMENT_ID, function(result){
					if(result) {
						i18n(function(t) {
							Browser.scrollTo('content');
							Alerts.warning(t('alerts:paymentId.recommended'));
						});
					}
				}, function() {
					// do nothing, its only a warning
				});
			};
			checkPendingActions();
			*/
			
			Utils.unsavedChanges($scope, forms.CREATE_COMMENT);
			/*
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(current) {
						currentUsername = current.username.username;
					});
				} else {
					currentUsername = undefined;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());

			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			*/
			
			/*
			EventManager.manage(events.LIST_SELECT_ITEM, $scope, function(event, backer) {
				$scope.backer = backer.source.username;
			});
			*/
			
			var notAllowedMessage = 'user';
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.commentLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['content', 'backer', 'warning', 'cost'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if(code === responseCodes.NOT_FOUND_BACKER) {
						$scope.errors.backer = t('validation:notFound.backer');
					} else if(code === responseCodes.NOT_ALLOWED) {
						$scope.alert = t('alerts:comment.notAllowed.' + notAllowedMessage);
					} else {
						$scope.alert = t('alerts:comment.createError');
					}
				});
			};
			
			pscope.showCreateComment = false;
			pscope.toggleReply = function() {
				pscope.showCreateComment = !pscope.showCreateComment;
				if(pscope.showCreateComment) {
					clear();
				}
			};
			
			var success = function(code, dto, page) {
					$scope.commentLoading = false;
					$rootScope.$broadcast(events.BALANCE_CHANGE);
					$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
					pscope.showCreateComment = false;
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.commentLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			/*
			var createPostingComment = function(backer) {
				var id = $stateParams[pathVars.POSTING];
				notAllowedMessage = 'posting';
				pyComment.postingReply(success, error, apiError, id, $scope.content, backer, $scope.warning, $scope.cost);
			};
			
			var createCommentComment = function(backer) {
				var id = $stateParams[pathVars.COMMENT];
				notAllowedMessage = 'comment';
				pyComment.commentReply(success, error, apiError, id, $scope.content, backer, $scope.warning, $scope.cost);
			};
			
			var createTagComment = function(backer) {
				var name = $stateParams[pathVars.TAG];
				notAllowedMessage = 'tag';
				pyComment.tagReply(success, error, apiError, name, $scope.content, backer, $scope.warning, $scope.cost);
			};
			
			var createUserComment = function(backer) {
				var username = $stateParams[pathVars.USER];
				notAllowedMessage = 'user';
				pyComment.userReply(success, error, apiError, username, $scope.content, backer, $scope.warning, $scope.cost);
			};
			
			var createCurrentComment = function(backer) {
				notAllowedMessage = 'user';
				pyComment.userReply(success, error, apiError, currentUsername, $scope.content, backer, $scope.warning, $scope.cost);
			};*/
			
			$scope.createComment = function() {
				$scope.commentLoading = true;
				$scope.errors = {};
				$scope.alert = undefined;
				var backer;
				if($scope.cost > 0) {
					backer = $scope.backer;
				}
				
				/*
				if($state.is(states.POSTINGS_ID_CREATE_COMMENT)) {
					createPostingComment(backer);
				} else if($state.is(states.COMMENTS_ID_CREATE_COMMENT)) {
					createCommentComment(backer);
				} else if($state.is(states.TAGS_ID_CREATE_COMMENT)) {
					createTagComment(backer);
				} else if($state.is(states.USERS_ID_CREATE_COMMENT)){
					createUserComment(backer);
				} else {
					createCurrentComment(backer);
				}
				*/
				pscope.reply(success, error, apiError, $scope.content, backer, $scope.warning, $scope.cost);
			};
			
			Converter.manageEvent($scope, function() {
				var content = $scope.content;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.preview = content;
			});
		}
	]);
});