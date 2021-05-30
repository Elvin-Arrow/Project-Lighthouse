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
		const username = this.store.get("username")
		let content;
		if (this.state.screen == "Dashboard") {
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

	private getDashContent() {
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
					<button className="theia-button secondary" title="View full report" onClick={(_a) => this.setState({ screen: 'Report' })}>View Full Report</button>
				</div>
				<div className="right">
					<h5>The Lighthouse</h5>
					<button className="theia-button" title="View resources" onClick={(_a) => this.viewResources()}>Resources</button>
					<button className="theia-button" title="Attempt assignments" onClick={(_a) => this.attemptAssignments()}>Assignments</button>
					<div className="suggested-resources">
						{// TODO: Updated suggested resource as per content
						}
						<h5>Suggested Resources</h5>
						<div>Variables</div>
						<div>Conditionals</div>
					</div>
				</div>
			</>
		);
	}

	private getReportContent() {
		return (
			<>
				<div id="report-header">
					<h5>Full Progress Report</h5>
					<button className="theia-button" onClick={(_a) => this.setState({ screen: 'Dashboard' })}>Go to Dashboard</button>
				</div>
				<div className="left">
					<div id="graph-container">
						{/* Graph to be added here */}
					</div>
				</div>
				<div className="right">
					<div className="metric-block">
						<div className="metric-title">Average Time to Complete</div>
						<div className="metric-data">25 min</div>
					</div>
					<div className="metric-block">
						<div className="metric-title">Average Number of Errors</div>
						<div className="metric-data">23</div>
					</div>
					<div className="metric-block">
						<div className="metric-title">Average Compilations Before Completion</div>
						<div className="metric-data">100 min</div>
					</div>
				</div>
				<div className="bottom">
					<table>
						<tr>
							<th>Area</th>
							<th>Assignments Attempted</th>
							<th>Average Score</th>
							<th>Performance Rating</th>
						</tr>
						<tr>
							<td>Basics</td>
							<td>2</td>
							<td>9</td>
							<td>10</td>
						</tr>
						<tr>
							<td>Conditionals</td>
							<td>1</td>
							<td>8</td>
							<td>9</td>
						</tr>
						<tr>
							<td>Loops</td>
							<td>1</td>
							<td>8</td>
							<td>7</td>
						</tr>
						<tr>
							<td>Lists</td>
							<td>1</td>
							<td>7</td>
							<td>6</td>
						</tr>
						<tr>
							<td>Functions</td>
							<td>1</td>
							<td>8</td>
							<td>9</td>
						</tr>
					</table>
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