import { injectable, inject } from "inversify";
import { LighthouseDashboardWidget } from "./lighthouse-dashboard-widget";
import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { CommandService } from "@theia/core";
import { EditorManager } from "@theia/editor/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";

import Store = require("electron-store");
import { FileStat } from "@theia/filesystem/lib/common/files";
import fs = require('fs');

export const LighthouseDashboardCommand: Command = {
	id: "lighthouse-dashboard:command",
};

export const LighthouseDashboardDispose: Command = {
	id: "lighthouse-dashboard:dispose",
};

@injectable()
export class LighthouseDashboardContribution extends AbstractViewContribution<
LighthouseDashboardWidget
> implements FrontendApplicationContribution {

	@inject(FrontendApplicationStateService)
	private readonly stateService: FrontendApplicationStateService;

	@inject(CommandService)
	private readonly commandService: CommandService;

	@inject(EditorManager)
	private readonly editorManager: EditorManager;

	@inject(WorkspaceService)
	private readonly workspaceService: WorkspaceService;

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
		this.listenToWorkspaceChanges();
		this.store.delete('isActive'); // Set user as inactive

		if (this.store.get('authenticated')) {
			this.stateService.reachedState('ready').then(
				() => {
					this.editorManager.closeAll().then(() => {
						this.openView({ reveal: true });
						this.commandService.executeCommand('AssignmentView.command');

					});
				}
			);
		}
	}

	registerCommands(commands: CommandRegistry): void {
		commands.registerCommand(LighthouseDashboardCommand, {
			execute: () =>
				super.openView({ activate: false, reveal: true, toggle: true }),
		});

		commands.registerCommand(LighthouseDashboardDispose, {
			execute: () =>
				super.closeView(),
		})
	}

	private listenToWorkspaceChanges(): void {
		this.workspaceService.onWorkspaceChanged(files => {
			console.info(`Workspace changed, new workspace has the files: ${files.toString()}`);
			this.handleWorkspaceChange(files);
		})

		this.workspaceService.onWorkspaceLocationChanged((files => {
			console.info(`Workspace location changed, new workspace has the files: ${files?.toString()}`);
			this.handleWorkspaceChange(files);
		}))
	}

	private handleWorkspaceChange(files: FileStat[] | FileStat | undefined): void {
		if (Array.isArray(files)) {
			let isAssignmentDir = false;
			// The files received are the workspace directory itself
			files.forEach((file) => {
				let dirFiles = fs.readdirSync(file.name);

				console.info(`Reading workspace directory gave ${dirFiles.length} files`);

				dirFiles.forEach(dirFile => {
					console.info(`Workspace file: ${dirFile}`);

					if (dirFile == 'instructions.md' || dirFile == 'a-test.py') {
						this.store.set('isAssignmentWorkspace', true);
						isAssignmentDir = true;
					}
				})
			});

			if (!isAssignmentDir) {
				console.info(`New workspace is not an assignment workspace, unsetting assignment details`);
				this.store.delete('isAssignmentWorkspace')
				this.store.delete('assignmentId');
				this.store.delete('assignmentName');
				this.store.delete('assignmentArea');
			}
		} else
			console.info(files?.name);
	}
}
