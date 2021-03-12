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

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(EditorManager) private readonly editorManager: EditorManager
    ) { }

    startTimer() {
        // wait 2 seconds before calling goInactive
        this.timeoutId = window.setTimeout(this.goInactive.bind(this), 5000);
    }

    goInactive() {
        this.messageService.info("User is now inactive");
    }

    goActive() {
        // do something
        this.startTimer();
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LighthouseObserverCommand, {
            execute: () => {
                let editors = this.editorManager.all;

                if (editors.length > 0) {
                    let currentEditor = editors[0];

                    currentEditor.editor.onCursorPositionChanged(this.resetTimer.bind(this));
                }
            }
        });
    }

    resetTimer(_: any) {
        try {
            window.clearTimeout(this.timeoutId);
            this.goActive();
        } catch (_) {
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

