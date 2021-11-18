<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function modal_block_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'modal_block-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'modal_block-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'modal_block-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'modal_block-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'scc/modal-block', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'modal_block-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'modal_block-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'modal_block-cgb-block-editor-css',
			'render_callback' => 'block_render_callback',
		)
	);

	function block_render_callback ($attributes, $content) {
		$id = $attributes['selectedUser'];
		$first_name = get_the_author_meta('first_name', $id);
		$last_name = get_the_author_meta('last_name', $id);
		$email = get_the_author_meta('email', $id);
		$full_name = $first_name . ' ' . $last_name;
		$bio = get_the_author_meta('description', $id);
		$avatar = get_simple_local_avatar($id);
		$position = get_the_author_meta('position', $id);
		?>
		<div class="wp-block wp-block-scc-modal-block">
			<?php echo $avatar; ?>
			<h3><?php echo __($full_name, 'wp-modal-block'); ?></h3>
			<p><?php echo __($position, 'wp-modal-block'); ?></p>
			<button class="wp-button-block">
				<?php echo __('Meet ' . $first_name, 'wp-modal-block'); ?>
			</button>
			<div class="scc-modal-block__popup">
				<?php echo $avatar; ?>
				<h3><?php echo __($full_name, 'wp-modal-block'); ?></h3>
				<p><?php echo __($bio, 'wp-modal-block'); ?></p>
				<div class="wp-block-button scc-modal-block__contact">
					<a class="wp-block-button__link" href="mailto:<?php echo $email; ?>" target="_blank">
						<?php echo __('Contact ' . $first_name, 'wp-modal-block'); ?>
					</a>
				</div>
			</div>
		</div>
		<?php
	}
}

// Hook: Block assets.
add_action( 'init', 'modal_block_cgb_block_assets' );

add_action( 'show_user_profile', 'extra_user_profile_fields' );
add_action( 'edit_user_profile', 'extra_user_profile_fields' );
function extra_user_profile_fields( $user ) { ?>
    <h3><?php _e("Extra profile information", "blank"); ?></h3>

    <table class="form-table">
    <tr>
        <th><label for="position"><?php _e("Position"); ?></label></th>
        <td>
            <input type="text" name="position" id="position" value="<?php echo esc_attr( get_the_author_meta( 'position', $user->ID ) ); ?>" class="regular-text" /><br />
            <span class="description"><?php _e("Please enter your position / job title."); ?></span>
        </td>
    </tr>
    </table>
<?php }

add_action( 'personal_options_update', 'save_extra_user_profile_fields' );
add_action( 'edit_user_profile_update', 'save_extra_user_profile_fields' );
function save_extra_user_profile_fields( $user_id ) {
    if ( empty( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], 'update-user_' . $user_id ) ) {
        return;
    }

    if ( !current_user_can( 'edit_user', $user_id ) ) {
        return false;
    }
    update_user_meta( $user_id, 'position', $_POST['position'] );
}
