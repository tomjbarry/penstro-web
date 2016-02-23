define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils', 'js/constants/values',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/pending-actions', 'js/constants/events', 'js/constants/states', 'js/constants/forms'],
		function(controller, $, ng, i18n, validation, utils, values, responseCodes, pathVars, pendingActions, events, states, forms) {
	controller.controller('CreatePostingController', ['$rootScope', '$scope', '$state', 'CurrentUser', 'Alerts', 'Browser', 'Utils',
																										'Authentication', 'EventManager', 'Options', 'MarkdownConverter', 'pyPosting',
		function($rootScope, $scope, $state, CurrentUser, Alerts, Browser, Utils, Authentication, EventManager, Options, Converter, pyPosting) {
			$scope.postingLoading = false;
			$scope.title = undefined;
			$scope.content = undefined;
			$scope.preview = undefined;
			$scope.tags = undefined;
			$scope.backer = undefined;
			$scope.warning = undefined;
			$scope.cost = undefined;
			$scope.alert = undefined;
			$scope.errors = {};
			$scope.contentPreview = $scope.content;
			$scope.optionalCollapsed = true;
			$scope.imageLink = undefined;
			$scope.imageLinkHeight = undefined;
			$scope.imageLinkWidth = undefined;
			$scope.showPreview = false;
			
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
			
			Utils.unsavedChanges($scope, forms.CREATE_POSTING);
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			/*
			EventManager.manage(events.LIST_SELECT_ITEM, $scope, function(event, backer) {
				$scope.backer = backer.source.username;
			});
			*/
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.postingLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['title', 'content', 'tags', 'backer', 'warning', 'cost', 'preview', 'imageLink', 'imageWidth', 'imageHeight'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if(code === responseCodes.BALANCE) {
						$scope.errors.cost = t('validation.balance');
					} else if(code === responseCodes.NOT_FOUND_BACKER) {
						$scope.errors.backer = t('validation:notFound.backer');
					} else {
						$scope.alert = t('alerts:posting.createError');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.postingLoading = false;
				var args = {};
				args[pathVars.POSTING] = dto.result;
				$rootScope.$broadcast(events.BALANCE_CHANGE);
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
				$state.go(states.POSTINGS_ID, args, {reload: true});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.postingLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			
			$scope.createPosting = function() {
				$scope.postingLoading = true;
				$scope.errors = {};
				$scope.alert = undefined;
				var backer;
				if($scope.cost > 0) {
					backer = $scope.backer;
				}
				var parsedTags = utils.parseTags($scope.tags);
				var height, width;
				if(ng.isDefined($scope.imageHeight)) {
					height = parseInt($scope.imageHeight);
				}
				if(ng.isDefined($scope.imageWidth)) {
					width = parseInt($scope.imageWidth);
				}
				pyPosting.create(success, error, apiError, $scope.title, $scope.content, parsedTags, backer, $scope.warning, $scope.cost,
						$scope.preview, $scope.imageLink, width, height);
			};
			
			Converter.manageEvent($scope, function() {
				var content = $scope.content;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.contentPreview = content;
			});
		}
	]);
});