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
			content: getContent(this.props.rawItemKey, this.props.debateTags)
		}
	}

	handleTagChange = evt => {
		let newTag = evt.target.value;
		this.setState( {content: newTag} );
		this.props.onDebateTagChanged(this.props.rawItemKey, newTag);
	};

	static getDerivedStateFromProps(nextProps, prevState) { // updates the tag when the props change
		let newTag = getContent(nextProps.rawItemKey, nextProps.debateTags);
		if (prevState.content == newTag) {
			return null
		} else {
			return {
				content: getContent(nextProps.rawItemKey, nextProps.debateTags)
			}
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

function getContent(rawItemKey, debateTags) {
	try {
		let result = debateTags.find(item => item.key === rawItemKey);
		return result.tag;
	} catch (TypeError) {
		return 'Enter a new tag...'; // todo make this a placeholder, not next
	}
}

module.exports = Tag;
