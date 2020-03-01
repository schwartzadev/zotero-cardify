'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const cx = require('classnames');
const { withRouter } = require('react-router-dom');
const KeyHandler = require('react-key-handler').default;
const { KEYDOWN } = require('react-key-handler');
const Dropdown = require('reactstrap/lib/Dropdown').default;
const DropdownToggle = require('reactstrap/lib/DropdownToggle').default;
const DropdownMenu = require('reactstrap/lib/DropdownMenu').default;
const DropdownItem = require('reactstrap/lib/DropdownItem').default;
const Button = require('zotero-web-library/src/js/component/ui/button');
const Icon = require('zotero-web-library/src/js/component/ui/icon');

const Tag = require('./tag');


const { getHtmlNodeFromBibliography, makeBibliographyContentIterator } =require('../utils') ;

class Bibliography extends React.PureComponent {
	state = {
		clipboardConfirmations: [],
		dropdownsOpen: [],
		focusedItem: null
	}

	constructor(props) {
		super(props);
		this.timeouts = {};
	}

	componentWillUnmount() {
		Object.values(this.timeouts).forEach(t => clearTimeout(t));
		this.timeouts = {};
	}

	handleEditCitation(itemId, ev) {
		let selection = window.getSelection();
		if(selection.toString().length) {
			try {
				if(ev.target.closest('.citation') === selection.anchorNode.parentNode.closest('.citation')) {
					return;
				}
			} catch(_) {
				// selection.anchorNode.parentNode might fail in which case we open the editor
			}
		}
		if(!this.props.isReadOnly) {
			this.props.onEditorOpen(itemId);
		}
	}

	handleDeleteCitation(itemId, ev) {
		ev.stopPropagation();
		this.props.onDeleteEntry(itemId);
	}

	handleFocus(itemId) {
		this.setState({
			focusedItem: itemId
		});
	}

	handleKeyboard(ev) {
		if(document.activeElement.className == 'citation' && this.state.focusedItem) {
			this.props.onEditorOpen(this.state.focusedItem);
			ev.preventDefault();
		}
	}

	handleToggleDropdown(itemId, ev) {
		const isOpen = this.state.dropdownsOpen.includes(itemId);
		const dropdownsOpen = isOpen ?
			this.state.dropdownsOpen.filter(i => i !== itemId) :
			[ ...this.state.dropdownsOpen, itemId];

		this.setState({ dropdownsOpen });
		ev.preventDefault();
		ev.stopPropagation();
	}

	handleCopyCitationDialogOpen(itemId, ev) {
		ev.stopPropagation();
		ev.preventDefault();
		this.props.onCitationCopyDialogOpen(itemId);
	}

	get keyHandlers() {
		return [
			<KeyHandler
				key="key-handler-enter"
				keyEventName={ KEYDOWN }
				keyValue="Enter"
				onKeyHandle={ this.handleKeyboard.bind(this) }
			/>,
			<KeyHandler
				key="key-handler-space"
				keyEventName={ KEYDOWN }
				keyValue=" "
				onKeyHandle={ this.handleKeyboard.bind(this) }
			/>,
		];
	}

	renderBibliographyItem(rawItem, content) {
		return (
			<div className="card-container" key={ rawItem.key }>
				<Tag
					{ ...this.props }
					rawItemKey={ rawItem.key }
				/>
				<div key={ rawItem.key }
					className="citation"
					onFocus={ this.handleFocus.bind(this, rawItem.key) }
					onClick={ ev => this.handleEditCitation(rawItem.key, ev) }
					tabIndex={ 0 }
				>
					<div className="csl-entry-container">
						{ content }
					</div>
					<Dropdown
						isOpen={ this.state.dropdownsOpen.includes(rawItem.key) }
						toggle={ this.handleToggleDropdown.bind(this, rawItem.key) }
						className="d-md-none"
					>
						<DropdownToggle
							color={ null }
							className="btn-icon dropdown-toggle"
						>
							<Icon type={ '28/dots' } width="28" height="28" />
						</DropdownToggle>
						<DropdownMenu right className="dropdown-menu">
							{ !this.props.isNumericStyle && (
								<DropdownItem
									onClick={ this.handleCopyCitationDialogOpen.bind(this, rawItem.key) }
									className="btn"
								>
									<span className={ cx('inline-feedback', {
										'active': this.state.clipboardConfirmations.includes(rawItem.key)
									}) }>
										<span
										className="default-text"
										aria-hidden={ !this.state.clipboardConfirmations.includes(rawItem.key) }>
											{this.props.isNoteStyle ? 'Copy Note' : 'Copy Citation'}
										</span>
										<span
										className="shorter feedback"
										aria-hidden={ this.state.clipboardConfirmations.includes(rawItem.key) }>
											Copied!
										</span>
									</span>
								</DropdownItem>
							) }
							<DropdownItem
								onClick={ this.handleEditCitation.bind(this, rawItem.key) }
								className="btn"
							>
								Edit
							</DropdownItem>
							<DropdownItem
								onClick={ this.handleDeleteCitation.bind(this, rawItem.key) }
								className="btn"
							>
								Delete
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<div className="card-toolbar">
						<div className="card-tool">
							<Button
								title="Delete Entry"
								className="btn-outline-secondary btn-remove"
								onClick={ this.handleDeleteCitation.bind(this, rawItem.key) }
							>
								<Icon type={ '16/remove-sm' } width="16" height="16" />
							</Button>
						</div>
					</div>
					<script type="application/vnd.zotero.data+json">
						{ JSON.stringify(rawItem) }
					</script>
				</div>
			</div>
		);
	}

	render() {
		const { bibliography } = this.props;
		if(bibliography.items.length === 0) {
			return null;
		}

		const div = getHtmlNodeFromBibliography(bibliography);

		if(this.props.isReadOnly) {
			return (
				<React.Fragment>
					{ this.keyHandlers }
					<div className="bibliography read-only"
						dangerouslySetInnerHTML={ { __html: div.innerHTML } }
					/>
					{bibliography.items.map(rawItem => (
						<script key={ rawItem.key } type="application/vnd.zotero.data+json">
							{ JSON.stringify(rawItem) }
						</script>
					))}
				</React.Fragment>
			);
		} else {
			const bibliographyContentIterator = makeBibliographyContentIterator(
				bibliography, div
			);
			const bibliographyProcessedContent = [];
			for(var [item, content] of bibliographyContentIterator) {
				bibliographyProcessedContent.push(
					this.renderBibliographyItem(item, content)
				);
			}

			return [
				...this.keyHandlers,
				<div className="bibliography" key="bibliography">
					{ bibliographyProcessedContent }
				</div>
			];
		}
	}

	static defaultProps = {
		bibliography: []
	}

	static propTypes = {
		bibliography: PropTypes.object,
		isNoteStyle: PropTypes.bool,
		isNumericStyle: PropTypes.bool,
		isReadOnly: PropTypes.bool,
		items: PropTypes.array,
		match: PropTypes.object,
		onCitationCopyDialogOpen:  PropTypes.func.isRequired,
		onDeleteEntry: PropTypes.func.isRequired,
		onEditorOpen:  PropTypes.func.isRequired,
	}
}


module.exports = withRouter(Bibliography);
