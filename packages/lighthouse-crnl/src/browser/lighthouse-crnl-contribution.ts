import { injectable, inject } from "inversify";
import {
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MessageService,
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
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(TerminalService)
    protected readonly terminalService: TerminalService,
    @inject(EditorManager) private readonly editorManager: EditorManager
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(LighthouseCrnlCommand, {
      execute: () => {
        let terms: TerminalWidget[] = this.terminalService.all;

        if (terms.length > 0) {
          // this.messageService.info('Terminal already created!');
          this.sendTextToTerminal(terms[0]);
        } else {
          this.messageService.info("Creating new terminal");
          this.terminalService
            .newTerminal({
              title: "Lighthouse terminal",
              shellPath:
                "c:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
            })
            .then((term) => {
              term.setTitle("Lighthouse Terminal");
              term.start().then(() => {
                this.sendTextToTerminal(term);
              });
              this.terminalService.open(term);
            });
        }
      },
    });
  }

  private sendTextToTerminal(term: TerminalWidget): void {
    let editors = this.editorManager.all;

    if (editors.length > 0) {
      let currentEditor = editors[0];

      currentEditor.editor.focus;
      currentEditor.editor.onCursorPositionChanged(() => {
        console.info("User is active");
      });

      let detectedLanguage = currentEditor.editor.document.languageId;
      let currentFilePath = currentEditor.editor.document.uri.split("/");

      // term.sendText(`echo Current file language is: ${detectedLanguage}\n`);
      // term.sendText(`echo Current file path: ${currentFilePath}\n`);
      let fileName = currentFilePath[currentFilePath.length - 1];

      console.info(`Current file language: ${detectedLanguage}`);

      let logFilePath = process.cwd();
      // let command = `python ${fileName} 2>&1 | tee ${logFilePath}\\out_log.txt`;
      let cmd = `python ${fileName} 2>&1 | ConvertTo-JSON | Out-File ${logFilePath}/log.json -Encoding utf8`;
      term.sendText(cmd);
      setTimeout(() => {
        term.sendText("\r");

        setTimeout(this.parseLogFile, 200);
      }, 500);
    } else {
      term.sendText("echo No file open\n");
    }
  }

  private parseLogFile(): void {
    let logFilePath = process.cwd();

    fs.stat(`${logFilePath}\\out_log.txt`, (err, stats) => {
      if (err == null) {
        // file exists
        console.info("Parsing log file");
        const logFile = fs.readFileSync("out_log.txt");
        console.info(logFile.toString());
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
