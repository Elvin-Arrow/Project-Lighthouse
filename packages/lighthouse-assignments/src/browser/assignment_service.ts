import * as fs from "fs";
import path = require('path');
const homedir = require('os').homedir();
import Store = require("electron-store");

export class AssignmentService {
    private readonly store: Store = new Store();

    public getAssignments(): Record<string, any>[] {
        // Look for assignments in the home directory
        // const assignmentPath = path.join(process.cwd(), 'resources', 'assignments.json');
        const assignmentPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'assignments.json');

        let rawJson = fs.readFileSync(assignmentPath, "utf-8");

        let assignmentsData = JSON.parse(rawJson);

        return assignmentsData;
    }


    public resolveAssignmentPath(assignmentName: string): string {
        // const resourcePath = path.join(process.cwd(), 'resources', 'assignments', assignmentPath);
        let assignmentPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', assignmentName);
        if (!this.dirExists(assignmentPath)) {
            this.createAssignmentDir(assignmentPath);
        }


        return assignmentPath;
    }

    public createAssignmentFiles(assignment: Record<string, any>): boolean {
        let filesCreated = false;

        // Create files
        try {
            fs.writeFileSync(this.resolveResourcePath(assignment.name, 'main.py'), assignment.files.main,)
            fs.writeFileSync(this.resolveResourcePath(assignment.name, 'instructions.md'), assignment.files.instructions,);
            fs.writeFileSync(this.resolveResourcePath(assignment.name, 'a-test.py'), assignment.files.test,)
            filesCreated = true;
            console.info('Files created successfully');
        } catch (e) {
            console.error(`Failed to creat files ${e}`);
        }

        return filesCreated;
    }

    private dirExists(dir: string): boolean {
        if (fs.existsSync(dir)) {
            return true;
        }

        return false
    }

    private createAssignmentDir(dir: string): void {
        fs.mkdirSync(dir, { recursive: true });
    }

    public assignmentFilesExist(assignmentName: string): boolean {
        console.info('Checking if files exist');
        let codeFile = path.join(this.resolveAssignmentPath(assignmentName), 'main.py');
        let instructionsFile = path.join(this.resolveAssignmentPath(assignmentName), 'instructions.md');
        let testFile = path.join(this.resolveAssignmentPath(assignmentName), 'a-test.py');

        return fs.existsSync(codeFile) && fs.existsSync(instructionsFile) && fs.existsSync(testFile);
    }

    private resolveResourcePath(assignmentName: string, resourceName: string) {
        let assignmentPath = this.resolveAssignmentPath(assignmentName);
        console.info(`Resolved file path to: ${path.join(assignmentPath, resourceName)}`);

        return path.join(assignmentPath, resourceName);
    }


}