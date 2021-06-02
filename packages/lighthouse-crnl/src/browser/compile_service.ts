import path = require('path');
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { EditorManager } from "@theia/editor/lib/browser";


export class CompilationService {
    private readonly workspaceService: WorkspaceService;
    private readonly editorManager: EditorManager

    constructor(workspaceService: WorkspaceService, editorManager: EditorManager) {
        this.workspaceService = workspaceService;
        this.editorManager = editorManager;
    }

    public getTestProgramPath(): string | null {
        let dir = this.workspaceService.workspace?.name;

        if (dir) {
            return path.join(dir, 'a-test.py');
        }

        return null;
    }

    public openTestFile(): boolean {
        let files = this.workspaceService.workspace?.children
        let isOpen = false;

        if (files) {
            files.forEach(file => {
                if (file.name == 'a-test.py') {
                    this.editorManager.open(file.resource);
                    isOpen = true;
                }
            })
        }

        return isOpen;
    }

}