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
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { DebugSessionManager } from '@theia/debug/lib/browser/debug-session-manager';
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service";
import { LoggerService } from "./log_service";
import Swal from 'sweetalert2'
import { InterventionService } from "./intervention_service";
import { CompilationService } from "./compile_service";
import { SubmissionService } from "./submission-service";

import Store = require("electron-store");

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
  private readonly submissionService: SubmissionService = new SubmissionService();
  private interventionService: InterventionService;
  private compilationService: CompilationService;
  private readonly store: Store = new Store();

  constructor(
    @inject(CommandService) private readonly commandService: CommandService,
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(EditorManager) private readonly editorManager: EditorManager,
    @inject(DebugSessionManager)
    private readonly debugSessionManager: DebugSessionManager,
    @inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @inject(TerminalService)
    private readonly terminalService: TerminalService,
  ) {
    this.interventionService = new InterventionService(this.messageService, this.commandService);
    this.compilationService = new CompilationService(this.workspaceService, this.editorManager);
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(LighthouseCrnlCommand, {
      execute: () => {
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(() => {
            if (this.store.get('isAssignmentWorkspace'))
              this.debugSessionManager.onDidDestroyDebugSession(() => {
                let editor = this.editorManager.currentEditor

                let filePath = editor?.getResourceUri();

                if (filePath) {
                  console.info(filePath.path);
                }

                this.loggerService.generateExecutionLog(this.isAssignmentDir()).then((wasError) => {
                  if (wasError) {
                    this.commandService.executeCommand('AssignmentView.command');
                  }

                  console.info(`Triggering intervention`);
                  this.interventionService.triggerIntervention();
                }, (reason) => {
                  console.error(reason);
                });

              })
          });
      },
    });

    registry.registerCommand(LighthouseSubmitCommand, {
      execute: () => {
        Swal.fire({ title: "Processing assignment", icon: 'info' });
        Swal.showLoading();

        this.terminalService.newTerminal({
          title: "Program test",
          useServerTitle: false
        }).then(term => {
          term.start().then(() => {
            term.activate();
            this.terminalService.open(term);
            term.show();

            let programPath = this.compilationService.getTestProgramPath();

            if (programPath) {
              term.sendText(`python ${programPath}\n\r`);

              setTimeout(() => {
                const score = this.submissionService.processAssignmentSubmission();

                Swal.hideLoading();
                Swal.fire({
                  title: score >= 5 ? 'Submission successful' : 'You can do better 😟',
                  text: this.submissionService.getSubmissionMessage(score),
                  footer: `Your score: ${score}`,
                  icon: score >= 5 ? 'success' : 'warning',
                });

                term.close();
              }, 1000)


            } else {
              setTimeout(() => {
                term.close();
                term.dispose();
                Swal.hideLoading();
                Swal.fire({
                  title: 'Submission failed',
                  text: 'Couldn\'t submit the assignment',
                  icon: 'error',
                });
              }, 250);
            }

          });

        });
      }
    });
  }

  private isAssignmentDir(): boolean {
    console.info(`Checking for assignment before generating log\nIs assignment workspace: ${this.store.get('isAssignmentWorkspace')}`);
    if (this.store.get('isAssignmentWorkspace', false)) {
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

