import { injectable, inject } from "inversify";
import {
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MessageService,
  CommandService,
} from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import {
  TabBarToolbarContribution,
  TabBarToolbarItem,
  TabBarToolbarRegistry,
} from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service";
import { TerminalWidget } from "@theia/terminal/lib/browser/base/terminal-widget";
import { EditorManager } from "@theia/editor/lib/browser";
import { DebugSessionManager } from '@theia/debug/lib/browser/debug-session-manager';
import { LoggerService } from "./log_service";
import { WorkspaceService } from "@theia/workspace/lib/browser";

import * as fs from "fs";


export const LighthouseCrnlCommand = {
  id: "LighthouseCrnl.command",
  label: "Lighthouse compile",
};

export const LighthouseSubmitCommand = {
  id: "LighthouseCrnl.submit",
  label: "Lighthouse submit",
}

@injectable()
export class LighthouseCrnlCommandContribution implements CommandContribution {
  private readonly loggerService = new LoggerService();

  constructor(
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(CommandService) protected readonly commandService: CommandService,
    @inject(TerminalService)
    protected readonly terminalService: TerminalService,
    @inject(EditorManager) private readonly editorManager: EditorManager,
    @inject(DebugSessionManager)
    private readonly debugSessionManager: DebugSessionManager,
    @inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
  ) { }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(LighthouseCrnlCommand, {
      execute: () => {
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(() => {
            this.debugSessionManager.onDidDestroyDebugSession(() => {
              let editor = this.editorManager.currentEditor

              let filePath = editor?.getResourceUri();

              // TODO fix the editor issue

              if (filePath) {
                console.info(filePath.path);
              }

              if (this.isAssignmentDir()) {
                let creds = this.getAssignmentCredentials();
                if (creds != null)
                  this.loggerService.setAssignmentCredentials(creds.id, creds.area);
              }
              this.loggerService.generateExecutionLog(this.isAssignmentDir());

            })
          });
      },
    });

    registry.registerCommand(LighthouseSubmitCommand, {
      execute: () => {
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(() => {
            console.info(`Waiting for logger`);
            setTimeout(() => {
              console.log(`Generating log`);

              // Extract log from debugpy log
              this.extractSubmissionLog();
            }, 10000);
          });
      }
    });
  }

  private isAssignmentDir(): boolean {
    if (this.workspaceService.workspace?.name.includes('Assignment')) {
      return true;
    }
    return false;
  }

  private getAssignmentCredentials(): Record<string, any> | null {
    let name = this.workspaceService.workspace?.name
    let details = null;

    if (name) {
      let assignmentPath = this.loggerService.baseAssignmentPath;


      let assignments = JSON.parse(fs.readFileSync(assignmentPath, 'utf-8'));
      if (assignments)
        assignments.forEach((assignment: Record<string, any>) => {
          if (name == assignment.name) {
            details = {
              "id": assignment.id,
              "area": assignment.area
            };
          }
        });
    }
    return details;
  }

  /**
   * Reads the debugpy execution logs and creates a file log.json
   * in the process root directory.
   *
   */
  protected extractSubmissionLog(): void {
    var glob = require("glob");
    let logMap: any;

    glob(
      "E:/Foundary/Lighthouse/02-Lighthouse-Experimental/plugins/lighthouse-builtin-ms-python/extension/*.log",
      (err: any, files: any) => {
        if (err) {
          return;
        } else {
          console.info(`Log acquired, processing...`);
          let requiredFile = files[3];
          console.info(`Processing file: ${requiredFile}`);

          fs.readFile(requiredFile, "utf-8", (err, data) => {
            if (err) {
              console.error("Unable to read the file");
            } else {
              try {
                console.info(`Parse started, splitting data...`);

                let breakpoint = data.split("PyDB.do_wait_suspend")[1];
                // Sending suspend notification.
                console.info(`First split successful`);

                let error = breakpoint.split(
                  "Sending suspend notification."
                )[0];

                console.info(`Second split successful`);

                let lineByLineErr = error.split("\r\n");
                console.info(`Third split successful`);

                // Getting line number from error
                let errNumberLine = lineByLineErr[1].split(" ");
                console.info(`Fourth split successful`);

                let lineNumber = errNumberLine[errNumberLine.length - 1].split(
                  ")"
                )[0];
                console.info(`Line number acquired`);

                // Getting error text from the error
                let errText = lineByLineErr[4].split(", ")[1];

                console.info(`Error text acquired`);

                logMap = JSON.stringify({
                  errLine: lineNumber,
                  errText: errText,
                });

                console.log(`Error on line: ${lineNumber}`);
                console.log(errText);

                this.processLog(logMap);
                this.messageService.warn('We all struggle sometimes, keep trying, it will work out');
              } catch (err) {
                console.error(`Failed to parse log: ${err}`);
                this.messageService.warn('You are awesome! You just successfully submitted the assignment');

              } finally {
                files.forEach((file: any) => {
                  fs.unlinkSync(file);
                });
              }



            }
          });
        }
      }
    );
  }

  protected processLog(errLog: Record<string, any>): void {
    console.info(`Attempting to save log`);
    // Generate execution log
    try {
      // Save log
      console.info(errLog);
      // let temp = JSON.parse(errLog);
      let logPath = `E:/Foundary/Lighthouse/02-Lighthouse-Experimental/log.json`;
      let logJson = JSON.stringify([
        {
          executionDate: this.getDate(),
          log: {
            index: this.getIndex(),
            executionStatus: errLog ? true : false,
            err: {
              text: errLog["errText"],
              position: errLog["errLine"],
            },
          },
        },
      ]);

      console.info(logJson.toString());

      fs.appendFileSync(logPath, logJson);

      console.info(`Log saved`);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Returns current date in [day], [month] and [year] format
   * @returns date: string
   */
  protected getDate(): string {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return dd + "/" + mm + "/" + yyyy;
  }

  /**
   * Reads the current log file and returns the next log index.
   * If no log entry is found, returns 1 by default
   * @returns int
   */
  protected getIndex(): number {
    let logPath = `${process.cwd}/log.json`;
    if (fs.existsSync(logPath)) {
      let log = fs.readFileSync(logPath, "utf-8");
      let logJson = JSON.parse(log);
      if (logJson.length > 0) return logJson.length + 1;
    }

    return 1;
  }

  protected sendTextToTerminal(term: TerminalWidget): void {
    let editors = this.editorManager.all;

    if (editors.length > 0) {
      // Get current editor
      let currentEditor = editors[0];
      currentEditor.editor.focus;

      let detectedLanguage = currentEditor.editor.document.languageId;
      let currentFilePath = currentEditor.editor.document.uri.split("/");

      // term.sendText(`echo Current file language is: ${detectedLanguage}\n`);
      // term.sendText(`echo Current file path: ${currentFilePath}\n`);
      // let fileName = currentFilePath[currentFilePath.length - 1];
      let path: String = "";
      for (let index = 4; index < currentFilePath.length - 1; index++) {
        const element = currentFilePath[index];
        path += index == 4 ? element : `/${element}`;
      }

      console.info(`Current file language: ${detectedLanguage}`);
      console.info(`Current path: ${path}`);

      // let logFilePath = process.cwd();
      // let command = `python ${fileName} 2>&1 | tee ${logFilePath}\\out_log.txt`;

      let cmd = `python run.py`;
      term.sendText(cmd);
      setTimeout(() => {
        term.sendText("\r");

        setTimeout(() => {
          this.parseLogFile(term);
        }, 2000);
      }, 200);
    } else {
      term.sendText("echo No file open\n");
    }
  }

  private parseLogFile(term: TerminalWidget): void {
    // let logFilePath = process.cwd();
    let logFile = "E:/Foundary/Lighthouse/python-test/log.json";
    fs.stat(logFile, (err, stats) => {
      if (err == null) {
        // file exists
        console.info("Parsing log file");
        const log = fs.readFileSync(logFile, "utf-8");
        let logJson = JSON.parse(log);
        term.sendText(`Write-Error ${logJson["err"]}`);
      } else {
        console.error("No file found");
      }
    });
  }
}

@injectable()
export class LighthouseCrnlMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(CommonMenus.EDIT_FIND, {
      commandId: LighthouseCrnlCommand.id,
      label: LighthouseCrnlCommand.label,
    });
  }
}

@injectable()
export class LighthouseTabBarToolbarContribution
  implements TabBarToolbarContribution {
  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem(new CRnLTabBarToolbarItem());
    registry.registerItem(new CRnLSubmitTabBarToolbarItem());
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

class CRnLSubmitTabBarToolbarItem implements TabBarToolbarItem {
  id: string;
  command: string;
  priority?: number | undefined;
  group?: string | undefined;
  tooltip?: string | undefined;
  icon?: string | (() => string) | undefined;
  when?: string | undefined;

  constructor() {
    this.id = "submit-button";
    this.command = LighthouseSubmitCommand.id;
    this.group = "navigation";
    this.tooltip = "Test and submit assignment";
    this.icon = "fa fa-tasks";
    // this.when = "editorLangId == python";
  }
}
