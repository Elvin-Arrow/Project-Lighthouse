import { injectable, inject } from "inversify";
import { LighthouseDashboardWidget } from "./lighthouse-dashboard-widget";
import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { CommandService } from "@theia/core";
import Store = require("electron-store");

export const LighthouseDashboardCommand: Command = {
	id: "lighthouse-dashboard:command",
};

@injectable()
export class LighthouseDashboardContribution extends AbstractViewContribution<
LighthouseDashboardWidget
> implements FrontendApplicationContribution {

	@inject(FrontendApplicationStateService)
	private readonly stateService: FrontendApplicationStateService;

	@inject(CommandService)
	private readonly commandService: CommandService;

	private readonly store: Store;

	constructor() {
		super({
			widgetId: LighthouseDashboardWidget.ID,
			widgetName: LighthouseDashboardWidget.LABEL,
			defaultWidgetOptions: { area: "main" },
			toggleCommandId: LighthouseDashboardCommand.id,
		});

		this.store = new Store();
	}

	async onStart(app: FrontendApplication): Promise<void> {
		if (this.store.get('authenticated')) {
			this.stateService.reachedState('ready').then(
				() => {
					this.openView({ reveal: true });
					this.commandService.executeCommand('AssignmentView.command');
				}
				
			);
		}
	}

	registerCommands(commands: CommandRegistry): void {
		commands.registerCommand(LighthouseDashboardCommand, {
			execute: () =>
				super.openView({ activate: false, reveal: true, toggle: true }),
		});
	}
}
