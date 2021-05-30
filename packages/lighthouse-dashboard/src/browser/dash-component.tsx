import * as React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Store = require("electron-store");
import { CommandService } from "@theia/core";


export class DashComponent extends React.Component<{ commandService: CommandService }, { screen: string, }> {
	private readonly store = new Store();

	constructor(props: { commandService: CommandService }) {
		super(props);

		this.state = {
			screen: "Dashboard"
		};
	}

	public render(): React.ReactNode {
		const username	= this.store.get("username")
		let content;
		if (this.state.screen == "Dashboard"){
			content = this.getDashContent()
		}
		else if (this.state.screen == "Report") {
			content = this.getReportContent()
		}
		return (
			<div id="container">
				<div className="header">
					<h2>Lighthouse Dashboard</h2>
					<h6>Welcome {username}!</h6>
				</div>
				<div>{content}</div>
			</div>
		);
	}

	private getDashContent(){
		return (
			<>
				<div className="left">
					<h5>Progress</h5>
					<div className="progress-block">
						<div className="section-title">Basics</div>
						<ProgressBar completed={80} bgColor={'#0E639C'} />
					</div>
					<div className="progress-block">
						<div className="section-title">Conditionals</div>
						<ProgressBar completed={50} bgColor={'#0E639C'} />
					</div>
					<div className="progress-block">
						<div className="section-title">Loops</div>
						<ProgressBar completed={30} bgColor={'#0E639C'} />
					</div>
					<div className="progress-block">
						<div className="section-title">Lists</div>
						<ProgressBar completed={20} bgColor={'#0E639C'} />
					</div>
					<div className="progress-block">
						<div className="section-title">Functions</div>
						<ProgressBar completed={10} bgColor={'#0E639C'} />
					</div>
					<button className="theia-button secondary" title="View full report" onClick={(_a) => this.getReportContent()}>View Full Report</button>
				</div>
				<div className="right">
					<h5>The Lighthouse</h5>
					<button className="theia-button" title="View resources" onClick={(_a) => this.viewResources()}>Resources</button>
					<button className="theia-button" title="Attempt assignments" onClick={(_a) => this.attemptAssignments()}>Assignments</button>
					<div className="suggested-resources">
						{// TODO: Updated suggested resource as per content
						}
						<h5>Suggested Resources</h5>
						<div>Suggestion 1</div>
						<div>Suggestion 2</div>
					</div>
				</div>
			</>
		);
	}

	private getReportContent() {
		return (
			<>
				<div className="left">
					<h5>Full Progress Report</h5>
				</div>
				<div className="right">
					<h5>Some heading</h5>
				</div>
			</>
		);
	}

	protected viewResources(): void {
		console.info('Attempting to view resources...');
		this.props.commandService.executeCommand("lighthouse-resources:command").then(() => {
			console.info('Resources opened');
		});
	}

	protected attemptAssignments(): void {
		console.info('Attempting to view assignments...');
		this.props.commandService.executeCommand("assignments:command");
	}
}