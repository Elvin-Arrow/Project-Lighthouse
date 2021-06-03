import { CommandService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import * as React from "react";
import { EditorManager } from "@theia/editor/lib/browser";
import Store = require("electron-store");
import { ElectronCommands } from "@theia/core/lib/electron-browser/menu/electron-menu-contribution";
import { ToggleButton } from "react-native-paper";
import { LabelIcon } from "@theia/core/lib/browser/label-parser";

export class Toolbox extends React.Component<{ workspaceService: WorkspaceService, commandService: CommandService, editorManager: EditorManager }, {}> {
    private readonly store: Store = new Store();

    constructor(props: { workspaceService: WorkspaceService, commandService: CommandService, editorManager: EditorManager }) {
        super(props);

		// this.state = {
		// 	screen: "python"
		// };
    }

    public render(): React.ReactNode {
        let instructionsBtn = null;
        let submitBtn = null;
        // let errLens = this.store.get('errLens', true);

        // Only show assignment controls if it is an assignment workspace
        if (this.isAssignmentWorkspace) {
            instructionsBtn = <div className="">
                <button className="theia-button secondary" title="View instructions" onClick={(_a) => this.props.commandService.executeCommand('Markdown-View:command')}>View instructions</button>

                <ToggleButton icon={LabelIcon} ></ToggleButton>

            </div>

            submitBtn = <button className="theia-button" title="Submit assignment" onClick={(_a) => this.props.commandService.executeCommand('LighthouseCrnl.submit')}>Submit assignment</button>
        }

        return (
            <div id="toolbox-container">
                <button className="theia-button" title="Launch Dashboard" onClick={(_a) => this.showDashboard()}>View Dashboard</button>

                {
                    // TODO: Add an assignments controls highlighting
                    instructionsBtn
                }

                {submitBtn}

                <button className="theia-button" title="Toggle error highlighting" onClick={(_a) => this.props.commandService.executeCommand('errorLens.toggle')}>Toggle error highlighting</button>

				{/* <ToggleButton icon={LabelIcon} ></ToggleButton> */}

                <button className="theia-button secondary" title="Launch Dashboard" onClick={(_a) => this.logout()}>Logout</button>
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