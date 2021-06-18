import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import { EditorManager } from "@theia/editor/lib/browser";
import Store = require("electron-store");
import fs = require("fs");
import path = require('path');
const homedir = require('os').homedir();

export const LighthouseObserverCommand = {
    id: 'LighthouseObserver.command',
    label: "Observe editor"
};

@injectable()
export class LighthouseObserverCommandContribution implements CommandContribution {
    private timeoutId: number;
    private isActive: boolean;
    private store: Store = new Store();

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(EditorManager) private readonly editorManager: EditorManager
    ) {
        this.isActive = true;
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LighthouseObserverCommand, {
            execute: () => {
                console.info(`Observing the editor...`);
                let editor = this.editorManager.currentEditor;

                if (editor) {
                    editor.editor.onDocumentContentChanged((e) => {
                        console.info(e.contentChanges);
                        this.resetTimer()
                    })
                }
            }
        });
    }

    private startTimer(): void {
        // wait 5 minutes before calling goInactive
        console.info(`Waiting for 5 minutes...`);
        this.timeoutId = window.setTimeout(() => {
            this.messageService.info("User is now inactive");

            // Store the timing
            this.storeTime();

            this.isActive = false;
            this.store.set('isActive', this.isActive);
        }, 60000);
    }

    private goActive(): void {
        if (!this.isActive) {
            this.messageService.info("I missed you, good to have you back ❤");
        }

        this.isActive = true;
        this.store.set('isActive', this.isActive);

        this.startTimer();
    }

    private resetTimer(): void {
        console.info(`Resetting timer`);
        try {
            window.clearTimeout(this.timeoutId);
            this.goActive();
        } finally { }
    }

    private storeTime(): void {
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let stats = fs.readFileSync(statsPath, 'utf-8')

            // Always true, condition added to enable smart suggestions
            if (Array.isArray(stats)) {
                let id = this.store.get('assignmentId');

                if (id) {
                    console.info(`Updating time stats for assignment Id: ${id}`);

                    stats.forEach(stat => {
                        if (stat.id == id) {
                            let time = new Date().getTime();
                            stat.timespent = time - stat.timespent
                            console.info(`Updated stat\n${stat}`);
                        }

                    });

                    fs.writeFile(statsPath, stats, (err) => {
                        if (err) console.error(`Failed to save the time stats`);
                    });
                }
            }
        }


    }


}

@injectable()
export class LighthouseObserverMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: LighthouseObserverCommand.id,
            label: LighthouseObserverCommand.label
        });
    }
}

