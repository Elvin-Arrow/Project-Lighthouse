import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
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
export class AssignmentViewCommandContribution implements CommandContribution, FrontendApplicationContribution {

    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandService)
    private readonly commandService: CommandService;

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
    ) { }

    async onStart(app: FrontendApplication): Promise<void> {
        this.stateService.reachedState('ready').then(() => {
            // Check which workspace is open
            console.info(`This workspace has: ${this.workspaceService.workspace?.children?.length} files`);
        });
    }

    private readmeFileExists(files: FileStat[] | undefined): boolean {
        console.info(`Looking for markdown files...`);
        let check = false;
        try {
            files?.forEach((file) => {
                console.info(`File name: ${file.name}`);
                if (file.name == 'readme.md') {
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
                this.messageService.info('Hello World!');
                let currentWorkspace = this.workspaceService.workspace;

                console.info(`This workspace has: ${currentWorkspace?.children?.length} files`);

                let check = this.readmeFileExists(currentWorkspace?.children);
                console.info(`Check: ${check}`);

                if (check) {
                    console.info(`Markdown file found`);

                    this.editorManager.closeAll().then(() => {
                        currentWorkspace?.children?.forEach((file) => {
                            console.info(`File: ${file.name}`);
                            if (file.name == 'main.py') {
                                this.editorManager.open(file.resource);    
                            } else if (file.name == 'readme.md') {
                                this.editorManager.openToSide(file.resource).then(() => {
                                    this.commandService.executeCommand('markdown-preview-enhanced.openPreviewToTheSide');
                                });    
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
