const ACTIVE_CLASS = 'scc-modal-block--active';

function addButtonListeners() {
	// Open button clicks
	const openButtons = document.querySelectorAll( '.scc-modal-info__open' );
	openButtons.forEach( ( button ) => {
		button.addEventListener( 'click', function( e ) {
			openModalBlock( e.target.closest( '.wp-block-scc-modal-container' ) );
		} );
	} );

	// Close button clicks
	const closeButtons = document.querySelectorAll( '.scc-modal-popup__close' );
	closeButtons.forEach( ( button ) => {
		button.addEventListener( 'click', function( e ) {
			closeModalBlock( e.target.closest( '.wp-block-scc-modal-container' ) );
		} );
	} );

	// Overlays click
	const overlays = document.querySelectorAll( '.wp-block-scc-modal-popup' );
	overlays.forEach( ( overlay ) => {
		overlay.addEventListener( 'click', function( e ) {
			if ( e.target === this ) {
				closeModalBlock( e.target.closest( '.wp-block-scc-modal-container' ) );
			}
		} );
	} );

	// Escape key press
	document.addEventListener( 'keydown', function( event ) {
		if ( event.key === 'Escape' && document.body.classList.contains( ACTIVE_CLASS ) ) {
			const activeModal = document.querySelector( '.wp-block-scc-modal-container.modal-open' );

			closeModalBlock( activeModal );
		}
	} );
}

function openModalBlock( modal ) {
	document.body.classList.add( ACTIVE_CLASS );
	modal.classList.add( 'modal-open' );

	const popup = modal.querySelector( '.wp-block-scc-modal-popup' );
	const closeButton = modal.querySelector( '.scc-modal-popup__close' );
	closeButton.focus();
	trapFocus( popup );
}

function closeModalBlock( modal ) {
	document.body.classList.remove( ACTIVE_CLASS );
	modal.classList.remove( 'modal-open' );

	const openButton = modal.querySelector( '.scc-modal-info__open' );
	openButton.focus();
}

window.addEventListener( 'load', function() {
	addButtonListeners();
} );

function trapFocus( element ) {
	const focusableEls = element.querySelectorAll( 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])' );
	const firstFocusableEl = focusableEls[ 0 ];
	const lastFocusableEl = focusableEls[ focusableEls.length - 1 ];
	const KEYCODE_TAB = 9;

	element.addEventListener( 'keydown', function( e ) {
		const isTabPressed = ( e.key === 'Tab' || e.keyCode === KEYCODE_TAB );

		// eslint-disable-next-line space-unary-ops
		if ( !isTabPressed ) {
			return;
		}

		if ( e.shiftKey ) /* shift + tab */ {
			if ( document.activeElement === firstFocusableEl ) {
				lastFocusableEl.focus();
				e.preventDefault();
			}
		} else /* tab */ {
			// eslint-disable-next-line no-lonely-if
			if ( document.activeElement === lastFocusableEl ) {
				firstFocusableEl.focus();
				e.preventDefault();
			}
		}
	} );
}
