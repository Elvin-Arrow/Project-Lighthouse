import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { WorkspaceService } from "@theia/workspace/lib/browser"; // For handling the workspaces
import { EditorManager } from "@theia/editor/lib/browser";
import { CommandService } from "@theia/core";
import { FileStat } from "@theia/filesystem/lib/common/files";

export const AssignmentViewCommand = {
    id: 'AssignmentView.command',
    label: "Say Hello"
};

@injectable()
export class AssignmentViewCommandContribution implements CommandContribution {

    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandService)
    private readonly commandService: CommandService;

    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
    ) { }

    private readmeFileExists(files: FileStat[] | undefined): boolean {
        console.info(`Looking for markdown files...`);
        let check = false;
        try {
            files?.forEach((file) => {
                console.info(`File name: ${file.name}`);
                if (file.name == 'instructions.md') {
                    console.info(`Required file found!`);

                    check = true;
                };
            })
        } catch (e) {
            console.error(`Error while looking up markdown files\n${e}`);
        }


        return check;
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(AssignmentViewCommand, {
            execute: () => {
                let currentWorkspace = this.workspaceService.workspace;

                let check = this.readmeFileExists(currentWorkspace?.children);

                if (check) {
                    console.info(`Assignment directory detected`)
                    this.editorManager.closeAll().then(() => {
                        let openReadme: boolean = false;
                        currentWorkspace?.children?.forEach((file) => {
                            console.info(`File: ${file.name}`);
                            if (file.name == 'main.py') {
                                this.editorManager.open(file.resource).then(() => {
                                    if (openReadme)
                                        this.commandService.executeCommand('Markdown-View:command').then(() => {
                                            // TODO Start observing the editor
                                        });
                                });
                            } else if (file.name == 'instructions.md') {
                                openReadme = true;
                            }
                        })
                    });
                }
            }
        });
    }


}

@injectable()
export class AssignmentViewMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: AssignmentViewCommand.id,
            label: AssignmentViewCommand.label
        });
    }
}
