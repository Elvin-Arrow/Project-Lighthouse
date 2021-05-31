import { injectable, inject } from "inversify";
import {
  CommandContribution,
  CommandRegistry,
  CommandService,
  MessageService,
} from "@theia/core/lib/common";
import {
  TabBarToolbarContribution,
  TabBarToolbarItem,
  TabBarToolbarRegistry,
} from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { EditorManager } from "@theia/editor/lib/browser";
import { DebugSessionManager } from '@theia/debug/lib/browser/debug-session-manager';
import { LoggerService } from "./log_service";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import Swal from 'sweetalert2'
import { InterventionService } from "./intervention_service";


export const LighthouseCrnlCommand = {
  id: "LighthouseCrnl.command",
  label: "Run program",
};

export const LighthouseSubmitCommand = {
  id: "LighthouseCrnl.submit",
  label: "Submit assignment",
}

@injectable()
export class LighthouseCrnlCommandContribution implements CommandContribution {
  private readonly loggerService = new LoggerService();
  private interventionService: InterventionService;

  constructor(
    @inject(CommandService) private readonly commandService: CommandService,
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(EditorManager) private readonly editorManager: EditorManager,
    @inject(DebugSessionManager)
    private readonly debugSessionManager: DebugSessionManager,
    @inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
  ) {
    this.interventionService = new InterventionService(this.messageService, this.commandService);
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(LighthouseCrnlCommand, {
      execute: () => {
        // TODO: Check for launch configrations before launch
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(() => {
            this.debugSessionManager.onDidDestroyDebugSession(() => {
              let editor = this.editorManager.currentEditor

              let filePath = editor?.getResourceUri();

              this.commandService.executeCommand('AssignmentView.command');

              if (filePath) {
                console.info(filePath.path);
              }

              this.loggerService.generateExecutionLog(this.isAssignmentDir()).then((wasError) => {
                if (wasError) {
                  console.info(`Triggering intervention`);

                  this.interventionService.triggerIntervention();
                }
              }, (reason) => {
                console.error(reason);
              });

            })
          });
      },
    });

    registry.registerCommand(LighthouseSubmitCommand, {
      execute: () => {
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(() => {

            // TODO Write the submission logic
            // Trigger the test case execution

            // Acquire test execution result

            // Update scores

            Swal.fire({
              title: 'Submission successful',
              text: 'Amazing you just submitted your assignment',
              footer: 'Your score: 10',
              icon: 'success',
            })
          });
      }
    });
  }

  private isAssignmentDir(): boolean {
    if (this.workspaceService.workspace?.name.includes('Assignment')) {
      console.info(`Assignment directory detected`);
      return true;
    }
    return false;
  }
}


@injectable()
export class LighthouseTabBarToolbarContribution
  implements TabBarToolbarContribution {
  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem(new CRnLTabBarToolbarItem());
  }
}

class CRnLTabBarToolbarItem implements TabBarToolbarItem {
  id: string;
  command: string;
  priority?: number | undefined;
  group?: string | undefined;
  tooltip?: string | undefined;
  icon?: string | (() => string) | undefined;
  when?: string | undefined;

  constructor() {
    this.id = "crnl-button";
    this.command = LighthouseCrnlCommand.id;
    this.group = "navigation";
    this.tooltip = "Compile and run";
    this.icon = "fa fa-play";
    this.when = "editorLangId == python";
  }
}

