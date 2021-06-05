import * as React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Store = require("electron-store");
import { CommandService } from "@theia/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PerformanceService } from "./performance-service";

export class DashComponent extends React.Component<{ commandService: CommandService }, { screen: string, }> {
	private readonly store = new Store();
	private readonly performanceService: PerformanceService = new PerformanceService();

	constructor(props: { commandService: CommandService }) {
		super(props);

		this.state = {
			screen: "Dashboard"
		};
	}

	public render(): React.ReactNode {
		// Only render Dashboard if authenticated
		if (this.store.get('authenticated')) {
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
		} else {
			return (
				<div id="container">
					<div className="header">
						<h2>Lighthouse Dashboard</h2>
						<h6>Please login to view the Dashboard!</h6>
					</div>
				</div>);
		}
	}

	private getDashContent() {
		this.performanceService.updatePerformanceStats();
		const areaWisePerformance = this.performanceService.getPerformanceScores();

		return (
			<>
				<div className="left">
					<h5>Progress</h5>
					<div className="progress-block">
						<div className="section-title">Basics</div>
						<ProgressBar completed={areaWisePerformance[0] ?? 0} bgColor={this.performanceService.getScoreColour(areaWisePerformance[0])} />
					</div>
					<div className="progress-block">
						<div className="section-title">Conditionals</div>
						<ProgressBar completed={areaWisePerformance[1] ?? 0} bgColor={this.performanceService.getScoreColour(areaWisePerformance[1])} />
					</div>
					<div className="progress-block">
						<div className="section-title">Loops</div>
						<ProgressBar completed={areaWisePerformance[2] ?? 0} bgColor={this.performanceService.getScoreColour(areaWisePerformance[2])} />
					</div>
					<div className="progress-block">
						<div className="section-title">Lists</div>
						<ProgressBar completed={areaWisePerformance[3] ?? 0} bgColor={this.performanceService.getScoreColour(areaWisePerformance[3])} />
					</div>
					<div className="progress-block">
						<div className="section-title">Functions</div>
						<ProgressBar completed={areaWisePerformance[4] ?? 0} bgColor={this.performanceService.getScoreColour(areaWisePerformance[4])} />
					</div>
					<button className="theia-button secondary" title="View full report" onClick={(_a) => this.setState({ screen: 'Report' })}>View Full Report</button>
				</div>
				<div className="right">
					<h5>The Lighthouse</h5>
					<button className="theia-button" title="View resources" onClick={(_a) => this.viewResources()}>Resources</button>
					<button className="theia-button" title="Attempt assignments" onClick={(_a) => this.attemptAssignments()}>Assignments</button>
					<div className="suggested-resources">
						<h5>Suggested Resources</h5>
						<div>Variables</div>
						<div>Conditionals</div>
					</div>
				</div>
			</>
		);
	}

	private getReportContent() {
		let data = [
			{
				name: 'Week 0',
				Performance: 75,
			},
			{
				name: 'Week 2',
				Performance: 60,
			},
			{
				name: 'Week 4',
				Performance: 40,
			},
			{
				name: 'Week 6',
				Performance: 35,
			},
			{
				name: 'Week 8',
				Performance: 40,
			},
			{
				name: 'Week 10',
				Performance: 45,
			},
			{
				name: 'Week 12',
				Performance: 60,
			},
			{
				name: 'Week 14',
				Performance: 65,
			},
			{
				name: 'Week 16',
				Performance: 80,
			},
		];

		data = this.performanceService.graphData;
		return (
			<>
				<div id="report-header">
					<h5>Full Progress Report</h5>
					<button className="theia-button" onClick={(_a) => this.setState({ screen: 'Dashboard' })}>Go to Dashboard</button>
				</div>
				<div className="left">
					<div id="">
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
						<div className="metric-data">{this.performanceService.averageTimeSpent}</div>
					</div>
					<div className="metric-block">
						<div className="metric-title">Average Number of Errors</div>
						<div className="metric-data">{this.performanceService.averageErrors}</div>
					</div>
					<div className="metric-block">
						<div className="metric-title">Average Compilations Before Completion</div>
						<div className="metric-data">{this.performanceService.averageCompilations}</div>
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
							<td>{this.performanceService.getNumberOfAttemptedAssignments('basics')} (Class Average: _)</td>
							<td>{this.performanceService.getAverageAssignmentScore('basics')} (Class Average: _)</td>
							<td>{this.performanceService.getAreawiseStanding('basics')}</td>
						</tr>
						<tr>
							<td>Conditionals</td>
							<td>{this.performanceService.getNumberOfAttemptedAssignments('conditionals')} (Class Average: _)</td>
							<td>{this.performanceService.getAverageAssignmentScore('conditionals')} (Class Average: _)</td>
							<td>{this.performanceService.getAreawiseStanding('conditionals')}</td>
						</tr>
						<tr>
							<td>Loops</td>
							<td>{this.performanceService.getNumberOfAttemptedAssignments('loops')} (Class Average: _)</td>
							<td>{this.performanceService.getAverageAssignmentScore('loops')} (Class Average: _)</td>
							<td>{this.performanceService.getAreawiseStanding('loops')}</td>
						</tr>
						<tr>
							<td>Lists</td>
							<td>{this.performanceService.getNumberOfAttemptedAssignments('lists')} (Class Average: _)</td>
							<td>{this.performanceService.getAverageAssignmentScore('lists')} (Class Average: _)</td>
							<td>{this.performanceService.getAreawiseStanding('lists')}</td>
						</tr>
						<tr>
							<td>Functions</td>
							<td>{this.performanceService.getNumberOfAttemptedAssignments('functions')} (Class Average: _)</td>
							<td>{this.performanceService.getAverageAssignmentScore('functions')} (Class Average: _)</td>
							<td>{this.performanceService.getAreawiseStanding('functions')}</td>
						</tr>
					</table>
				</div>
			</>
		);
	}

	private viewResources(): void {
		console.info('Attempting to view resources...');
		this.props.commandService.executeCommand("lighthouse-resources:command").then(() => {
			console.info('Resources opened');
		});
	}

	private attemptAssignments(): void {
		console.info('Attempting to view assignments...');
		this.props.commandService.executeCommand("assignments:command");
	}
}