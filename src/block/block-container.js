/**
 * BLOCK: modal-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

// import cuid from 'cuid';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	// ColorPalette,
} = wp.blockEditor;
const { TextControl, Panel, PanelBody, PanelRow, Button, ResponsiveWrapper } = wp.components;
const { Fragment } = wp.element;

// const id = cuid();

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'scc/modal-container', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Modal', 'wp-modal-block' ), // Block title.
	icon: 'welcome-widgets-menus', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'modal', 'wp-modal-block' ),
		__( 'popup', 'wp-modal-block' ),
		__( 'window', 'wp-modal-block' ),
	],
	// attributes: {
	// 	mediaId: {
	// 		type: 'number',
	// 		default: 0,
	// 	},
	// 	mediaUrl: {
	// 		type: 'string',
	// 		default: '',
	// 	},
	// 	header: {
	// 		type: 'string',
	// 		source: 'text',
	// 		selector: 'button',
	// 		default: 'Toggle modal',
	// 	},
	// },

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: () => {
		// const { attributes, setAttributes } = props;

		const ALLOWED_BLOCKS = [ 'scc/modal-info', 'scc/modal-popup' ];

		const TEMPLATE = [
			[ 'scc/modal-info', { } ],
			[ 'scc/modal-popup', { } ],
		];

		// const removeMedia = () => {
		// 	setAttributes( {
		// 		mediaId: 0,
		// 		mediaUrl: '',
		// 	} );
		// };

		// const onSelectMedia = ( media ) => {
		// 	setAttributes( {
		// 		mediaId: media.id,
		// 		mediaUrl: media.url,
		// 	} );
		// };

		return (
			<Fragment>
				{ /* <InspectorControls>
					<PanelRow>
						<div className="editor-post-featured-image">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectMedia }
									value={ attributes.mediaId }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button
											className={ attributes.mediaId === 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview' }
											onClick={ open }
										>
											{ attributes.mediaId === 0 && __( 'Choose an image', 'wp-modal-block' ) }
											{ props.media !== undefined && (
												<ResponsiveWrapper
													naturalWidth={ props.media.media_details.width }
													naturalHeight={ props.media.media_details.height }
												>
													<img src={ props.media.source_url } alt="" />
												</ResponsiveWrapper>
											) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ attributes.mediaId !== 0 &&
								<MediaUploadCheck>
									<MediaUpload
										title={ __( 'Replace image', 'wp-modal-block' ) }
										value={ attributes.mediaId }
										onSelect={ onSelectMedia }
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<Button onClick={ open } isDefault isLarge>{ __( 'Replace image', 'wp-modal-block' ) }</Button>
										) }
									/>
								</MediaUploadCheck>
							}
							{ attributes.mediaId !== 0 &&
								<MediaUploadCheck>
									<Button onClick={ removeMedia } isLink isDestructive>{ __( 'Remove image', 'wp-modal-block' ) }</Button>
								</MediaUploadCheck>
							}
						</div>
					</PanelRow>
				</InspectorControls> */ }
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					renderAppender={ false }
				/>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: () => {
		const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
