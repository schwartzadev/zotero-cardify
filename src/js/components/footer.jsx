'use strict';

const React = require('react');

class Footer extends React.PureComponent {
	render() {
		return (
			<footer>
				<nav className="social-nav">
					For policy debate, by Andrew Schwartz<br/>
					Thanks to <a href="https://www.zotero.org/">Zotero</a>.
					Forked from <a href="https://github.com/zotero/bib-web">ZBib</a> on Github.
				</nav>
				{/* todo identify the proper legal compyright below */}
				<small className="copyright">
					© { (new Date()).getFullYear() } Corporation for Digital Scholarship &nbsp;•&nbsp; <a href="/faq#privacy">Privacy</a>
				</small>
			</footer>
		);
	}
}

module.exports = Footer;
