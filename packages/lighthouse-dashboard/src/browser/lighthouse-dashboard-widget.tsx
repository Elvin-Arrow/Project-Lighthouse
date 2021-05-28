import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { CommandService, MessageService } from "@theia/core";
import { ProgressBar } from 'react-native-paper';
import Store = require("electron-store");
// import { ErrorModel } from "./err_model";
// import * as fs from "fs";

@injectable()
export class LighthouseDashboardWidget extends ReactWidget {
	static readonly ID = "lighthouse-dashboard:widget";
	static readonly LABEL = "Lighthouse Dashboard";

	@inject(MessageService)
	protected readonly messageService!: MessageService;

	@inject(CommandService)
	protected readonly commandService: CommandService;

	private readonly store = new Store();

	@postConstruct()
	protected async init(): Promise<void> {
		this.id = LighthouseDashboardWidget.ID;
		this.title.label = LighthouseDashboardWidget.LABEL;
		this.title.caption = LighthouseDashboardWidget.LABEL;
		this.title.closable = true;
		this.title.iconClass = "fa fa-window-maximize";
		this.update();
	}

	protected render(): React.ReactNode {
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
						<div className="progress-bar"></div>
					</div>
					<div className="progress-block">
						<div className="section-title">Conditionals</div>
						<div className="progress-bar"></div>
					</div>
					<div className="progress-block">
						<div className="section-title">Loops</div>
						<div className="progress-bar"></div>
					</div>
					<div className="progress-block">
						<div className="section-title">Lists</div>
						<div className="progress-bar"><ProgressBar progress={0.5}/></div>
					</div>
					<div className="progress-block">
						<div className="section-title">Functions</div>
						<div className="progress-bar"></div>
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
