import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { CommandService, /* MessageService */ } from "@theia/core";
// import ProgressBar from "@ramonak/react-progress-bar";
import { DashComponent } from './dash-component';


// import Store = require("electron-store");
// import { ErrorModel } from "./err_model";
// import * as fs from "fs";

@injectable()
export class LighthouseDashboardWidget extends ReactWidget {
	static readonly ID = "lighthouse-dashboard:widget";
	static readonly LABEL = "Lighthouse Dashboard";


	// @inject(MessageService)
	// protected readonly messageService!: MessageService;

	@inject(CommandService)
	protected readonly commandService: CommandService;

	// private readonly store = new Store();

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
		return <DashComponent commandService={this.commandService} />;
	}
}
