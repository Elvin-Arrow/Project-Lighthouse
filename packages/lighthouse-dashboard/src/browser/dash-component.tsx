import * as React from "react";
import { inject } from "inversify";
import ProgressBar from "@ramonak/react-progress-bar";
import Store = require("electron-store");
import { CommandService } from "@theia/core";


export class DashComponent extends React.Component<{}, { content: string }> {
	private readonly store = new Store();

	@inject(CommandService)
	protected readonly commandService: CommandService;

	constructor(props: any) {
		super(props);

		this.state = {
			content: "<div>Please select a language from the sidebar.</div>"
		};
	}

	public render(): React.ReactNode {
		const username = this.store.get("username")
		return (
			<div id="container">
				<div className="header">
					<h2>Lighthouse Dashboard</h2>
					<h6>Welcome {username}!</h6>
				</div>
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
					<button className="theia-button secondary" title="View full report" onClick={(_a) => this.viewFullReport()}>View Full Report</button>
				</div>
				<div className="right">
					<h5>The Lighthouse</h5>
					<button className="theia-button" title="View resources" onClick={(_a) => this.viewResources()}>Resources</button>
					<button className="theia-button" title="Attempt assignments" onClick={(_a) => this.attemptAssignments()}>Assignments</button>
					<div className="suggested-resources">
						<h5>Suggested Resources</h5>
						<div>Suggestion 1</div>
						<div>Suggestion 2</div>
					</div>
				</div>
			</div>
		);
	}

	protected viewFullReport(): void {

	}
	protected viewResources(): void {
		this.commandService.executeCommand("lighthouse-resources:command");
	}

	protected attemptAssignments(): void {
		this.commandService.executeCommand("assignments:command");
	}
}