import * as React from "react";
// const Logo = require("../../images/lighthouse.svg") as string;
import fs = require("fs");
import path = require('path');
import Store = require("electron-store");
import ReactMarkdown = require('react-markdown');

export class ReactComponent extends React.Component<{}, { screen: string }> {
	private readonly store: Store = new Store();

	constructor(props: any) {
		super(props);

		this.state = {
			screen: "python"
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
							{/* <li><button onClick={this.sayHello}>Click me!</button></li> */}
						</ul>
					</div>
				</div>
			</div>

		);
	}

	private viewPythonResources(): JSX.Element[] {
		let resources = this.getPythonResource();
		let content: JSX.Element[] = [];
		let filterTags: Array<string> = [];

		// Check to see if there are any filters to be applied
		if (this.store.get('nameError')) {
			this.store.delete('nameError');
			filterTags = ['variables'];
		} else if (this.store.get('syntaxError')) {
			filterTags = ['syntax'];
		} else {
			filterTags = this.getAssignmentTags();
		}

		resources = this.filterResources(resources, filterTags);

		resources.forEach((resource) => {

			content.push(
				<div className="resource-block">
					<div className="title">{resource.title}</div>
					<div className="description">{resource.description}<ReactMarkdown children={resource.code} /></div>
				</div>
			);
		});

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
	}

	private getPythonResource(): Record<string, any>[] {
		let dataPath = path.join(process.cwd(), 'resources', 'python_resources.json');
		const resource = JSON.parse((fs.readFileSync(dataPath, "utf8")));
		return resource;
	}

	private getAssignmentTags(): Array<string> {
		let tags: Array<string> = [];

		let id = this.store.get("assignmentId");

		if (id) {
			// Get the assignment tags for the assignment
			const assignmentPath = path.join(process.cwd(), 'resources', 'assignments.json');

			const assignments = JSON.parse(fs.readFileSync(assignmentPath, 'utf-8'));

			if (Array.isArray(assignments)) {
				assignments.forEach(assignment => {
					if (assignment.id == id) {
						// Get tags
						tags = assignment.tags;
					}
				})
			}

		}

		return tags
	}

	private filterResources(resources: Record<string, any>[], tags: Array<string>): Record<string, any>[] {
		// If there are no filters, return unfiltered resources
		if (tags.length == 0) return resources;

		let filteredResources: Record<string, any>[] = [];

		resources.forEach(resource => {
			if (this.checkTagInResource(resource, tags)) {
				filteredResources.push(resource);
			}
		});

		return filteredResources;
	}

	private checkTagInResource(resource: Record<string, any>, tags: Array<string>): boolean {
		let tagExists = false;

		tags.forEach(tag => {
			if (resource.tags.includes(tag)) {
				tagExists = true;
			}
		})

		return tagExists;
	}


}