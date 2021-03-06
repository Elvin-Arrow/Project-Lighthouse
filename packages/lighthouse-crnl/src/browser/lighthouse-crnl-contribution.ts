import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import { TabBarToolbarContribution, TabBarToolbarItem, TabBarToolbarRegistry } from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service";
import { TerminalWidget } from "@theia/terminal/lib/browser/base/terminal-widget";
import { EditorManager } from "@theia/editor/lib/browser";

export const LighthouseCrnlCommand = {
    id: 'LighthouseCrnl.command',
    label: "Lighthouse compile"
};

@injectable()
export class LighthouseCrnlCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(TerminalService) protected readonly terminalService: TerminalService,
        @inject(EditorManager) private readonly editorManager: EditorManager,

    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LighthouseCrnlCommand, {
            execute: () => {
                let terms: TerminalWidget[] = this.terminalService
                    .all;

                if (terms.length > 0) {
                    // this.messageService.info('Terminal already created!');
                    this.sendTextToTerminal(terms[0]);
                } else {
                    this.messageService.info("Creating new terminal");
                    this.terminalService
                        .newTerminal({
                            /* title: "Lighthouse terminal",
                            shellPath:
                            "/bin/bash, bash, sh",
                             */
                        }).then((term) => {
                            this.terminalService.open(term);
                            this.sendTextToTerminal(term);
                        });
                }

            },
        });
    }

    private sendTextToTerminal(term : TerminalWidget): void {
        let editors = this.editorManager.all;

        if (editors.length > 0) {
            let currentEditor = editors[0];
            let detectedLanguage = currentEditor.editor.document.languageId;
            let currentFilePath = currentEditor.editor.document.uri.split('file://')[1];

            term.sendText(`echo Current file language is: ${detectedLanguage}\n`);
            term.sendText(`python3 ${currentFilePath}\n`);

        } else {
            term.sendText('echo No file open\n');
        }        
    }
}

@injectable()
export class LighthouseCrnlMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: LighthouseCrnlCommand.id,
            label: LighthouseCrnlCommand.label
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