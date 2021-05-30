import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { CommandService, MessageService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ElectronCommands } from "@theia/core/lib/electron-browser/menu/electron-menu-contribution";
import { EditorManager } from "@theia/editor/lib/browser";
import Store = require("electron-store");

@injectable()
export class WidgetTestWidget extends ReactWidget {
  static readonly ID = "lighthouse-toolbox:widget";
  static readonly LABEL = "Lighthouse Toolbox";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;

  @inject(CommandService)
  protected readonly commandService: CommandService;

  @inject(EditorManager)
  protected readonly editorManager: EditorManager;

  private readonly store = new Store();

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = WidgetTestWidget.ID;
    this.title.label = WidgetTestWidget.LABEL;
    this.title.caption = WidgetTestWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-sun-o"; // example widget icon.
    this.update();
  }

  protected render(): React.ReactNode {
    if (!this.authState()) {
      // Request to authenticate
      const message = "Please login to access Lighthouse services";

      return (
        <div id="widget-container">
          <AlertMessage type="INFO" header={message} />
          <button
            className="theia-button secondary"
            title="Launch Dashboard"
            onClick={(_a) => this.lighthouseAuthenticate()}
          >
            Login to Lighthouse
          </button>
        </div>
      );
    } else {
      // Show lighthouse services
      return this.renderToolbox();
    }
  }

  private renderToolbox(): React.ReactNode {
    let instructionsBtn = null;

    if (this.isAssignmentWorkspace) {
      instructionsBtn = <div className="">
        <button
          className="theia-button secondary"
          title="View instructions"
          onClick={(_a) => this.commandService.executeCommand('Markdown-View:command')}
        >
          View instructions
        </button>
      </div>
    }

    return (
      <div id="widget-container">
        <h2>Access the dashboard</h2>
        <br></br>
        <button
          className="theia-button secondary"
          title="Launch Dashboard"
          onClick={(_a) => this.showDashboard()}
        >
          View Dashboard
        </button>
        {instructionsBtn}
        <div className="">
          <button
            className="theia-button secondary"
            title="Toggle error highlighting"
            onClick={(_a) => this.commandService.executeCommand('errorLens.toggle')}
          >
            Toggle error highlighting
          </button>
        </div>
        <div className="">
          <button
            className="theia-button secondary"
            title="Submit assignment"
            onClick={(_a) => this.commandService.executeCommand('LighthouseCrnl.submit')}
          >
            Submit assignment
          </button>
        </div>

        <div className="">
          <button
            className="theia-button secondary"
            title="Launch Dashboard"
            onClick={(_a) => this.logout()}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  private showDashboard(): void {
    this.commandService.executeCommand("lighthouse-dashboard:command");
  }

  private logout(): void {
    this.store.delete("authenticated");
    this.store.delete("username");

    // this.refreshWorkspace();
    if (this.workspaceService.opened) {
      this.workspaceService.close();
    } else {
      this.editorManager.closeAll().then(() => {
        this.commandService.executeCommand(ElectronCommands.RELOAD.id);
      });

    }

  }

  /**
   * Check whether user is authenticated or not
   */
  private authState(): boolean {
    const status = this.store.get("authenticated");

    if (status) {
      return true;
    }
    return false;
  }

  private lighthouseAuthenticate(): void {
    this.commandService.executeCommand("lighthouse-authenticate:command");
  }

  private get isAssignmentWorkspace(): boolean {
    let files = this.workspaceService.workspace?.children
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

}
