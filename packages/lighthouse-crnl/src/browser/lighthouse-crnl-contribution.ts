import { injectable, inject } from "inversify";
import {
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  // MessageService,
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

import * as fs from "fs";

export const LighthouseCrnlCommand = {
  id: "LighthouseCrnl.command",
  label: "Lighthouse compile",
};

@injectable()
export class LighthouseCrnlCommandContribution implements CommandContribution {
  constructor(
    // @inject(MessageService) private readonly messageService: MessageService,
    @inject(CommandService) private readonly commandService: CommandService,
    @inject(TerminalService)
    protected readonly terminalService: TerminalService,
    @inject(EditorManager) private readonly editorManager: EditorManager
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(LighthouseCrnlCommand, {
      execute: () => {
        // let terms: TerminalWidget[] = this.terminalService.all;
        this.commandService
          .executeCommand("workbench.action.debug.start")
          .then(async () => {
            // Extract log from debugpy log
            let errLog = await this.extractLog();
            // Generate execution log

            let log = [
              {
                executionDate: this.getDate(),
                log: {
                  index: this.getIndex(),
                  executionStatus: errLog ? true : false,
                  err: {
                    text: errLog["errText"] ?? "",
                    position: errLog["errLine"] ?? "",
                  },
                },
              },
            ];

            // Save log
            let logPath = `${process.cwd}/log.json`;
            let logJson = JSON.stringify(log);
            fs.appendFile(logPath, logJson, () => {
              console.error(`Could not save log`);
            });
          });
      },
    });
  }

  /**
   * Reads the debugpy execution logs and creates a file log.json
   * in the process root directory.
   *
   */
  private async extractLog(): Promise<any> {
    var glob = require("glob");
    let logMap = {};

    await glob(
      "E:/Foundary/Lighthouse/02-Lighthouse-Experimental/plugins/lighthouse-builtin-ms-python/extension/*.log",
      function(err: any, files: any) {
        if (err) {
          return;
        } else {
          let requiredFile = files[3];
          fs.readFile(requiredFile, "utf-8", (err, data) => {
            if (err) {
              console.error("Unable to read the file");
            } else {
              try {
                let breakpoint = data.split("PyDB.do_wait_suspend")[1];
                // Sending suspend notification.
                let error = breakpoint.split(
                  "Sending suspend notification."
                )[0];
                let lineByLineErr = error.split("\r\n");

                // Getting line number from error
                let errNumberLine = lineByLineErr[1].split(" ");
                let lineNumber = errNumberLine[errNumberLine.length - 1].split(
                  ")"
                )[0];

                // Getting error text from the error
                let errText = lineByLineErr[4].split(", ")[1];

                logMap = {
                  errLine: lineNumber,
                  errText: errText,
                };

                console.log(`Error on line: ${lineNumber}`);
                console.log(errText);
              } finally {
              }
              files.forEach((file: any) => {
                fs.unlinkSync(file);
              });
            }
          });
        }
      }
    );
    return logMap;
  }

  /**
   * Returns current date in [day], [month] and [year] format
   * @returns date: string
   */
  private getDate(): string {
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
  private getIndex(): number {
    let log = fs.readFileSync(`./log.json`, "utf-8");
    let logJson = JSON.parse(log);

    if (logJson.length > 0) return logJson.length + 1;

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
    // this.when = "editorLangId == python";
  }
}
