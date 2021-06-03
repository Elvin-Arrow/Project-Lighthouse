import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { CommandService, MessageService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { EditorManager } from "@theia/editor/lib/browser";
import Store = require("electron-store");
import { Toolbox } from "./toolbox-component";


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
      return <Toolbox workspaceService={this.workspaceService} commandService={this.commandService} editorManager={this.editorManager}></Toolbox>;
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
}
