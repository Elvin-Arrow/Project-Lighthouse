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
    private assignmentId: number | null = null;

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
                    console.info(`Assignment directory detected`);
                    this.commandService.executeCommand('lighthouse-dashboard:dispose');

                    this.editorManager.closeAll().then(() => {
                        let openReadme: boolean = false;
                        currentWorkspace?.children?.forEach((file) => {
                            console.info(`File: ${file.name}`);
                            if (file.name == 'main.py') {
                                this.editorManager.open(file.resource).then(() => {
                                    if (openReadme)
                                        this.commandService.executeCommand('Markdown-View:command').then(() => {
                                            this.commandService.executeCommand('LighthouseObserver.command');

                                            let id = this.getAssignmentId(this.workspaceService.workspace?.name);

                                            console.info(`Assignment ID acquired as: ${id}`);

                                            if (id) {
                                                this.assignmentId = id;
                                            }
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

        if (this.store.get('isActive', true)) {
            this.store.set('isActive', false);
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

            console.info('Updating stats with the new time for assignment: ' + this.assignmentId);

            // Always true, condition added to enable smart suggestions
            if (Array.isArray(stats)) {
                if (this.assignmentId) {

                    stats.forEach(stat => {
                        if (stat.id == this.assignmentId) {
                            let time = new Date().getTime();
                            stat.timespent = time - stat.timespent

                            console.info(`Updated stat\n${stat}`);
                        }
                    })
                }

                fs.writeFile(statsPath, JSON.stringify(stats), () => {
                    console.info(`Updated stats`);
                })
            }
        }
    }

    private getAssignmentId(workspaceName: string | undefined): number | null {
        let id: number | null = null;
        if (workspaceName) {
            workspaceName = workspaceName.split("\\").reverse()[0];
            console.info(`Looking for assignment: ${workspaceName}`)
            let assignPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'assignments.json');

            if (fs.existsSync(assignPath)) {
                let assignments: Record<string, any>[] = JSON.parse(fs.readFileSync(assignPath, 'utf-8'));

                if (Array.isArray(assignments)) {
                    assignments.forEach((assignment) => {

                        if (assignment.name == workspaceName) {
                            id = assignment.id;

                            console.info(`Workspace found, updating ID to: ${id}`);
                        }
                    })
                }
            }
        }
        return id;
    }
}
