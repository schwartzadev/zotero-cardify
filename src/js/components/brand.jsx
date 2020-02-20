'use strict';

const React = require('react');
const { Link } = require('react-router-dom');

class Brand extends React.PureComponent {
	render() {
		return (
			<React.Fragment>
				<h1 className="brand">
					cards.cx
				</h1>
				<h2 className="sub-brand">Easily transform URLs into debate cards</h2>
			</React.Fragment>
		);
	}
}

module.exports = Brand;
