define([], function() {
	
	var DESTROY = 'DESTROY';
	
	return {
		BACK: 'back',
		PAYMENT: 'payment',
		PAYMENT_END: 'paymentEnd',
		PAYMENT_MODAL_OPEN: 'paymentModalOpen',
		PURCHASE_MODAL_OPEN: 'purchaseModalOpen',
		CACHE_DELAY_SHOW_TOGGLE: 'cacheDelayShowToggle',
		//PAYMENT_PROCESSING_CHANGE: 'paymentProcessingChange',
		PAYMENT_PROCESSING_SHOW_TOGGLE: 'paymentProcessingShowToggle',
		APPRECIATION_SUCCESS: 'appreciationSuccess',
		APPRECIATION_SHOW_RESPONSE: 'appreciationShowResponse',
		PAGE_CHANGE: 'pageChange',
		SINGLE_CHANGE: 'singleChange',
		SINGLE_ERROR_NOT_ALLOWED: 'singleErrorNotAllowed',
		SINGLE_ERROR_NOT_FOUND: 'singleErrorNotFound',
		SINGLE_ERROR_DENIED: 'singleErrorDenied',
		BALANCE_CHANGE: 'balanceChange',
		LOGIN_CHANGE: 'loginChange',
		PRE_LOGIN_CHANGE: 'preLoginChange',
		CUSTOM_STATE_CHANGE_START: 'customStateChangeStart',
		CUSTOM_STATE_CHANGE_SUCCESS: 'customStateChangeSuccess',
		CUSTOM_LOCATION_CHANGE_SUCCESS: 'customLocationChangeSuccess',
		LIST_SELECT_ITEM: 'listSelectItem',
		UNSAVED_CHANGES_COMPLETE: 'unsavedChangesComplete',
		PREVIEW_UPDATE_PRE: 'previewUpdatePre',
		PREVIEW_UPDATE: 'previewUpdate',
		TOUR_SECTION_CHANGE: 'tourSectionChange',
		TOUR_SHOW_TOGGLE: 'tourShowToggle',
		REGISTER_OPEN: 'registerOpen',
		LOGIN_OPEN: 'loginOpen',
		RECAPTCHA_LOADED: 'recaptchaLoaded',
		TOGGLE_AUTO_REFRESH: 'toggleAutoRefresh',
		SET_EDITOR: 'setEditor',
		destroy: function(v) {
			// ensures no collisions
			return DESTROY + v + DESTROY;
		}
	};
});