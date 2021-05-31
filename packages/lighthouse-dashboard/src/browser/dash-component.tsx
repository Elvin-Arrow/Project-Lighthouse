import * as React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Store = require("electron-store");
import { CommandService } from "@theia/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


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
		const data = [
			{
				name: 'Week 0',
				Performance: 0,
			},
			{
				name: 'Week 2',
				Performance: 10,
			},
			{
				name: 'Week 4',
				Performance: 30,
			},
			{
				name: 'Week 6',
				Performance: 35,
			},
			{
				name: 'Week 8',
				Performance: 50,
			},
			{
				name: 'Week 10',
				Performance: 60,
			},
			{
				name: 'Week 12',
				Performance: 80,
			},
			{
				name: 'Week 14',
				Performance: 90,
			},
			{
				name: 'Week 16',
				Performance: 90,
			},
		];
		return (
			<>
				<div id="report-header">
					<h5>Full Progress Report</h5>
					<button className="theia-button" onClick={(_a) => this.setState({ screen: 'Dashboard' })}>Go to Dashboard</button>
				</div>
				<div className="left">
					<div id="graph-container">
						<LineChart width={420} height={220} data={data}>
							<XAxis dataKey="name" />
							<YAxis />
							<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
							<Line type="monotone" dataKey="Performance" stroke="#82ca9d" />
							<Tooltip />
						</LineChart>
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
						<div className="metric-data">25</div>
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
							<td>2 (Class Average: 2)</td>
							<td>9 (Class Average: 7)</td>
							<td>Good</td>
						</tr>
						<tr>
							<td>Conditionals</td>
							<td>1 (Class Average: 1)</td>
							<td>8 (Class Average: 8)</td>
							<td>Good</td>
						</tr>
						<tr>
							<td>Loops</td>
							<td>1 (Class Average: 1)</td>
							<td>8 (Class Average: 6)</td>
							<td>Average</td>
						</tr>
						<tr>
							<td>Lists</td>
							<td>1 (Class Average: 1)</td>
							<td>7 (Class Average: 6)</td>
							<td>Average</td>
						</tr>
						<tr>
							<td>Functions</td>
							<td>-</td>
							<td>-</td>
							<td>-</td>
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