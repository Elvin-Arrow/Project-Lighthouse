import * as React from "react";
// const Logo = require("../../images/lighthouse.svg") as string;

export class ReactComponent extends React.Component<{}, { content: string }> {

	constructor(props: any) {
		super(props);

		this.state = {
			content: "<div>Please select a language from the sidebar.</div>"
		};
	}

	public render(): React.ReactNode {
		return (
			<div id="widget-container">
				<div>
					<h1>Lighthouse Resources</h1>
					<h4>Welcome to Lighthouse Resources!</h4>
				</div>
				<div className="main-area" dangerouslySetInnerHTML={{ __html: this.state.content }} />
				<div className="sidebar">
					<div className="links">
						<h2>Select language</h2>
						<ul>
							<li><a onClick={(_a) => this.languagePython()}>Python</a></li>
							<li><a onClick={(_a) => this.languageCPP()}>C++</a></li>
						</ul>
					</div>
				</div>
			</div>

		);
	}

	private languagePython(): void {
		let pythonContent = '\
		<div class="resource-block">\
			<div class="title">if statement</div>\
			<div class="description">\
				The program evaluates the test expression and will execute statement(s) only if the test expression is True. If the test expression is False, the statement(s) is not executed.\
				<code>\
					if test_expression:\
					<br />\
					<span class="indent">statement(s)</span>\
				</code>\
			</div>\
			<div class="readMore"><a href="">Click here to read more...</a></div>\
		</div>\
		<div class="resource-block">\
			<div class="title">for loop</div>\
			<div class="description">\
				The val is the variable that takes the value of the item inside the sequence on each iteration. Loop continues until we reach the last item in the sequence. The body of for loop is separated from the rest of the code using indentation.\
				<code>\
					for val in sequence:\
					<br />\
					<span class="indent">statement(s)</span>\
				</code>\
			</div>\
			<div class="readMore"><a href="">Click here to read more...</a></div>\
		</div>\
		<div class="resource-block">\
			<div class="title">while loop</div>\
			<div class="description">\
				In the while loop, test expression is checked first. The body of the loop is entered only if the test_expression evaluates to True. After one iteration, the test expression is checked again. This process continues until the test_expression evaluates to False.\
				<code>\
					while test_expression:\
					<br />\
					<span class="indent">statement(s)</span>\
				</code>\
			</div>\
			<div class="readMore"><a href="">Click here to read more...</a></div>\
		</div>';

		// let temp = this.state.content == "State 1" ? "State 2" : "State 1";
		this.setState({
			content: pythonContent
		}, () => { });
	}

	private languageCPP(): void {
		let cppContent = '<h4>C++ Resources</h4>';

		// let temp = this.state.content == "State 1" ? "State 2" : "State 1";
		this.setState({
			content: cppContent
		}, () => { });
	}
}