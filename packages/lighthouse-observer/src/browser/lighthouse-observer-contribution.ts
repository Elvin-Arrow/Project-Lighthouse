import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import { EditorManager } from "@theia/editor/lib/browser";

export const LighthouseObserverCommand = {
    id: 'LighthouseObserver.command',
    label: "Observe editor"
};

@injectable()
export class LighthouseObserverCommandContribution implements CommandContribution {
    private timeoutId: number;
    private isActive: boolean;

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(EditorManager) private readonly editorManager: EditorManager
    ) {
        this.isActive = true;
     }

    startTimer() {
        // wait 5 seconds before calling goInactive
        console.info(`Waiting for 5 seconds...`);
        this.timeoutId = window.setTimeout(() => {
            // this.goInactive.bind(this)
            this.messageService.info("User is now inactive");
            this.isActive = false;
        }, 5000);
    }

    goInactive() {
        this.messageService.info("User is now inactive");
    }

    goActive() {
        // do something
        if (!this.isActive) {
            this.messageService.info("Welcome back");
        }

        this.isActive = true;
        this.startTimer();
    }

    resetTimer(_: any) {
        console.info(`Resetting timer`);
        try {
            window.clearTimeout(this.timeoutId);
            this.goActive();
        } catch (_) {
        }
    }
    
    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LighthouseObserverCommand, {
            execute: () => {
                console.info(`Observing the editor...`);

                let editors = this.editorManager.all;

                if (editors.length > 0) {
                    console.info(`Editor handle acquired`);

                    let currentEditor = editors[0];

                    currentEditor.editor.onCursorPositionChanged(this.resetTimer.bind(this));
                }
            }
        });
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

