'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const Input = require('zotero-web-library/src/js/component/form/input');
const Button = require('zotero-web-library/src/js/component/ui/button');

class AttributionInput extends React.PureComponent {
	state = {
		identifier: ''
	}

	componentDidMount() {
		this.setState({ identifier: this.props.identifier });
	}

	handleChange(identifier) {
		this.setState({ identifier });
	}

	handleCite() {
		const identifier = this.state.identifier;
		this.props.onSaveAttributionRequest(identifier);
	}

	render() {
		return (
			<div className="id-input-container">
				<Input
					className="form-control form-control-lg id-input" // todo make this smaller
					onChange={ this.handleChange.bind(this) }
					onCommit={ this.handleCite.bind(this) }
					placeholder="Enter a custom attribution to the end of your cards" // todo make this pull from localstorage by default
					ref = { i => this.inputField = i } // todo check this out
					tabIndex={ 0 }
					type="text"
					value={ this.state.identifier }
				/>
				<Button
					className="btn-lg btn-secondary" // todo make this smaller
					onClick={ this.handleCite.bind(this) }
				>
					Add Attribution
				</Button>
			</div>
		);
	}
}

module.exports = AttributionInput;
