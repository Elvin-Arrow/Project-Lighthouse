import * as React from "react";
// const Logo = require("../../images/lighthouse.svg") as string;
import fs = require("fs");
import path = require('path');
import Store = require("electron-store");

export class ReactComponent extends React.Component<{}, { screen: string }> {
	private readonly store: Store = new Store();

	constructor(props: any) {
		super(props);

		this.state = {
			screen: "<div>Please select a language from the sidebar.</div>"
		};
	}

	public render(): React.ReactNode {


		let content;
		if (this.state.screen == 'python') {
			content = this.viewPythonResources();
		} else if (this.state.screen == 'cpp') {
			content = <div>C++ content coming soon...</div>;
		} else {
			content = <div>Please select a language from the sidebar.</div>;
		}
		return (
			<div id="widget-container">
				<div>
					<h1>Lighthouse Resources</h1>
					<h4>Welcome to Lighthouse Resources!</h4>
				</div>
				<div className="main-area">{content}</div>
				<div className="sidebar">
					<div className="links">
						<h2>Select language</h2>
						<ul>
							<li><a onClick={(_a) => this.languagePython()}>Python</a></li>
							<li><a onClick={(_a) => this.languageCPP()}>C++</a></li>
							<li><button onClick={this.sayHello}>Click me!</button></li>
						</ul>
					</div>
				</div>
			</div>

		);
	}

	private viewPythonResources(): JSX.Element[] {
		const resources = this.getPythonResource();
		let content: JSX.Element[] = [];
		let temp = this.store.get('resource', null);

		if (temp && temp == 'variable') {
			resources.forEach(resource => {
				if (resource.title == 'Variables' || resource.title == 'Identifiers') {
					content.push(
						<div className="resource-block">
							<div className="title">{resource.title}</div>
							<div className="description">{resource.description}<code>{resource.code}</code></div>
						</div>
					);
				}
			})
		} else {
			resources.forEach((resource) => {

				content.push(
					<div className="resource-block">
						<div className="title">{resource.title}</div>
						<div className="description">{resource.description}<code>{resource.code}</code></div>
					</div>
				);
			});
		}



		return content;
	}

	private languagePython(): void {
		this.setState({
			screen: 'python'
		}, () => { });
	}

	private languageCPP(): void {
		this.setState({
			screen: 'cpp'
		}, () => { });

		// this.setState({
		// 	content: cppContent
		// }, () => { });
	}

	private getPythonResource(): Record<string, any>[] {
		let dataPath = path.join(process.cwd(), 'resources', 'python_resources.json');
		const resource = JSON.parse((fs.readFileSync(dataPath, "utf8")));
		return resource;
	}

	protected sayHello(): void {
		let dataPath = path.join(process.cwd(), 'resources', 'python_resources.json');
		fs.readFile(dataPath, "utf8", (err: any, jsonString: any) => {
			const resource = JSON.parse(jsonString);
			console.error("The title is:", resource.title);
		});
	}
}