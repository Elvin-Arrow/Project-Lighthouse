import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry } from "@theia/core/lib/common";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { WorkspaceService } from "@theia/workspace/lib/browser"; // For handling the workspaces
import { EditorManager } from "@theia/editor/lib/browser";
import { CommandService } from "@theia/core";
import { FileStat } from "@theia/filesystem/lib/common/files";
import Store = require("electron-store");
import fs = require("fs");
import path = require('path');
const homedir = require('os').homedir();

export const AssignmentViewCommand = {
    id: 'AssignmentView.command',
    label: "Say Hello"
};


@injectable()
export class AssignmentViewCommandContribution implements CommandContribution {
    private readonly store: Store = new Store();


    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(CommandService)
    private readonly commandService: CommandService;

    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(EditorManager) protected readonly editorManager: EditorManager,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(AssignmentViewCommand, {
            execute: () => {
                let currentWorkspace = this.workspaceService.workspace;

                let check = this.readmeFileExists(currentWorkspace?.children);

                if (check) {
                    this.commandService.executeCommand('lighthouse-dashboard:dispose');
                    this.store.set('inactive', true);

                    this.editorManager.closeAll().then(() => {
                        let openReadme: boolean = false;
                        currentWorkspace?.children?.forEach((file) => {
                            if (file.name == 'main.py') {
                                this.editorManager.open(file.resource).then(() => {
                                    if (openReadme)
                                        this.commandService.executeCommand('Markdown-View:command').then(() => {
                                            this.commandService.executeCommand('LighthouseObserver.command');

                                            // Start noting the time
                                            this.resetTimer();
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

    private readmeFileExists(files: FileStat[] | undefined): boolean {
        let check = false;
        try {
            files?.forEach((file) => {
                console.info(`File name: ${file.name}`);
                if (file.name == 'instructions.md') {
                    check = true;
                };
            })
        } catch (e) {
            console.error(`Error while looking up markdown files\n${e}`);
        }

        return check;
    }

    private startTimer() {
        // wait 3 minutes before calling goInactive
        console.info(`Waiting for 3 minutes...`);
        window.setTimeout(() => {
            // this.goInactive.bind(this)

            // Store the timing
            console.info(`Storing assignment activity`);
            this.storeTime();

            // Reset timer
            this.resetTimer();

        }, 180000);
    }

    private resetTimer() {
        console.info(`Starting timer`);

        if (this.store.get('isActive', false)) {
            this.startTimer();
        }
        else {
            // Wait for 1 minute before checking again
            console.info('User is inactive waiting for 1 minute');
            setTimeout(() => {
                this.resetTimer();
            }, 60000);
        }
    }

    private storeTime(): void {
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            let stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            // Always true, condition added to enable smart suggestions
            if (Array.isArray(stats)) {
                let id = this.store.get('assignmentId');

                if (id) {
                    stats.forEach(stat => {
                        if (stat.id == id) {
                            let time = new Date().getTime();
                            stat.timespent = time - stat.timespent

                            console.info(`Updated stat\n${stat}`);
                        }
                    })
                }

                fs.writeFile(statsPath, JSON.stringify(stats), () => {
                    console.info(`Updated stats - Assignments view`);
                })
            }
        }
    }
}
