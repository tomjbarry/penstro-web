define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/constants/path-variables'],
		function(controller, $, ng, utils, i18n, pathVars) {

	controller.controller('PostingNavigationController', ['$scope', '$stateParams', 'Single',
		function($scope, $stateParams, Single) {
			$scope.navigation = {
				posting: $stateParams[pathVars.POSTING]
			};
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.posting = Single.getSingleMain(s);
					$scope.navigation.replyCount = $scope.posting.replyCount;
					$scope.navigation.title = utils.getEncodedTitle($scope.posting.title);
				}
			};
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
		}
	]);
	controller.controller('CommentNavigationController', ['$scope', '$stateParams', 'Single',
		function($scope, $stateParams, Single) {
			$scope.navigation = {
				comment: $stateParams[pathVars.COMMENT]
			};
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.comment = Single.getSingleMain(s);
					$scope.navigation.replyCount = $scope.comment.replyCount;
				}
			};
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
		}
	]);
	controller.controller('TagNavigationController', ['$scope', '$stateParams', 'Single',
		function($scope, $stateParams, Single) {
			$scope.navigation = {
				tag: $stateParams[pathVars.TAG]
			};
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.tag = Single.getSingleMain(s);
					$scope.navigation.replyCount = $scope.tag.replyCount;
				}
			};
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
		}
	]);
	controller.controller('UserNavigationController', ['$scope', '$stateParams', 'Single',
		function($scope, $stateParams, Single) {
			$scope.navigation = {
				user: $stateParams[pathVars.USER]
			};
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.user = Single.getSingleMain(s);
					$scope.navigation.replyCount = $scope.user.replyCount;
					$scope.navigation.followeeCount = $scope.user.followeeCount;
					$scope.navigation.followerCount = $scope.user.followerCount;
					$scope.navigation.postingCount = $scope.user.contributedPostings;
					$scope.navigation.commentCount = $scope.user.contributedComments;
				}
			};
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
		}
	]);
	controller.controller('CurrentNavigationController', ['$scope', '$stateParams', 'Single',
		function($scope, $stateParams, Single) {
			$scope.navigation = {};
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.user = Single.getSingleMain(s);
					$scope.navigation.replyCount = $scope.user.replyCount;
					$scope.navigation.followeeCount = $scope.user.followeeCount;
					$scope.navigation.followerCount = $scope.user.followerCount;
					$scope.navigation.postingCount = $scope.user.contributedPostings;
					$scope.navigation.commentCount = $scope.user.contributedComments;
				}
			};
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
		}
	]);
});