import { CommandService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import * as React from "react";
import { EditorManager } from "@theia/editor/lib/browser";
import Store = require("electron-store");
import { ElectronCommands } from "@theia/core/lib/electron-browser/menu/electron-menu-contribution";

export class Toolbox extends React.Component<{ workspaceService: WorkspaceService, commandService: CommandService, editorManager: EditorManager }, {}> {
    private readonly store: Store = new Store();

    constructor(props: { workspaceService: WorkspaceService, commandService: CommandService, editorManager: EditorManager }) {
        super(props);

        // this.state = {
        // 	screen: "python"
        // };
    }

    public render(): React.ReactNode {
		let instructionsBtn, divider, submitBtn;
        // let errLens = this.store.get('errLens', true);

        // Only show assignment controls if it is an assignment workspace
        if (this.isAssignmentWorkspace) {
            
			instructionsBtn = <button className="theia-button secondary" title="View instructions" onClick={(_a) => this.props.commandService.executeCommand('Markdown-View:command')}>View Instructions</button>

            submitBtn = <button className="theia-button" title="Submit assignment" onClick={(_a) => this.props.commandService.executeCommand('LighthouseCrnl.submit')}>Submit Assignment</button>

			divider = <hr />
        }

        return (
            <div id="toolbox-container">
				<div className="toolbox-section">
					<button className="theia-button" title="Launch Dashboard" onClick={(_a) => this.showDashboard()}>View Dashboard</button>

					<button className="theia-button" title="View Resources" onClick={(_a) => this.props.commandService.executeCommand('lighthouse-resources:command')}>View Resources</button>

					<button className="theia-button" title="Toggle error highlighting" onClick={(_a) => this.props.commandService.executeCommand('errorLens.toggle')}>Toggle Error Highlighting</button>

					<hr />
				</div>
				<div className="toolbox-section">
					{/* TODO: Add an assignments controls highlighting */}
					{instructionsBtn}
					{submitBtn}
					{divider}
				</div>

                {/* <ToggleButton icon={LabelIcon} ></ToggleButton> */}
				<div className="toolbox-section">
	                <button className="theia-button secondary" title="Logout" onClick={(_a) => this.logout()}>Logout</button>
				</div>
            </div>
        );
    }

    private get isAssignmentWorkspace(): boolean {
        let files = this.props.workspaceService.workspace?.children
        let flag = false;

        if (files) {
            files.forEach(file => {
                if (file.name == 'instructions.md') {
                    flag = true;
                };
            })
        }

        return flag;
    }

    private showDashboard(): void {
        this.props.commandService.executeCommand("lighthouse-dashboard:command");
    }

    private logout(): void {
        this.store.delete("authenticated");
        this.store.delete("username");

        if (this.props.workspaceService.opened) {
            this.props.workspaceService.close();
        } else {
            this.props.editorManager.closeAll().then(() => {
                if (this.store.get('isAssignmentWorkspace')) {
                    this.props.commandService.executeCommand('lighthouse-dashboard:dispose');
                }
                this.props.commandService.executeCommand(ElectronCommands.RELOAD.id);
            });
        }
    }
}