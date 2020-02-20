'use strict';

import ContentEditable from 'react-contenteditable'; // todo require as const instead of import

const React = require('react');
const Bibliography = require('./bibliography');
const PropTypes = require('prop-types');
const cx = require('classnames');


class Tag extends React.PureComponent {
	constructor(props) {
		super(props);
		this.tagContentEditable = React.createRef();
		this.state = {
			content: this.getContent(this.props.rawItemKey)
		}
	}

	handleTagChange = evt => {
		let newTag = evt.target.value;
		this.setState( {content: newTag} );
		this.props.onDebateTagChanged(this.props.rawItemKey, newTag);
	};

	getContent(rawItemKey) {
		try {
			let result = this.props.debateTags.find(item => item.key === rawItemKey);
			return result.tag;
		} catch (TypeError) {
			return 'Enter a new tag...'; // todo make this a placeholder, not next
		}
	}

	render() {
		return (
			<ContentEditable
				innerRef={this.tagContentEditable}
				html={this.state.content}
				onChange={this.handleTagChange}
				className="card-tag"
			/>
		);
	}
}

module.exports = Tag;
