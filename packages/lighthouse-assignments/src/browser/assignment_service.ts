import * as fs from "fs";
import path = require('path');
const homedir = require('os').homedir();
import Store = require("electron-store");
import { FileStat } from "@theia/filesystem/lib/common/files";

export class AssignmentService {
    private readonly store: Store = new Store();

    public getAssignments(): Record<string, any>[] {
        // Look for assignments in the home directory
        // const assignmentPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'assignments.json');
        const assignmentPath = path.join(process.cwd(), 'resources', 'assignments.json');

        let rawJson = fs.readFileSync(assignmentPath, "utf-8");

        let assignmentsData = JSON.parse(rawJson);

        return assignmentsData;
    }

    public get assignmentsBaseDir(): string {
        return path.join(process.cwd(), 'resources');
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

            this.writeDebugConfiguration(this.resolveResourcePath(path.join(assignment.name, '.theia'), 'launch.json'));

            filesCreated = true;
            console.info('Files created successfully');

        } catch (e) {
            console.error(`Failed to creat files ${e}`);
        }

        return filesCreated;
    }

    public curateAssignmentStats(): void {
        let assignmentStats: Record<string, any>[] = [];
        let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

        if (fs.existsSync(statsPath)) {
            // Assinment stats exist append to them
            assignmentStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
        }

        let assignmentsPath = path.join(this.assignmentsBaseDir, 'assignments.json');
        let assignments = JSON.parse(fs.readFileSync(assignmentsPath, 'utf-8'));

        if (Array.isArray(assignments)) {
            assignments.forEach((assignment) => {
                if (!this.assignmentExists(assignmentStats, assignment.id)) {
                    assignmentStats.push({
                        "id": assignment.id,
                        "area": assignment.area,
                        "timespent": 0,
                        "numberOfCompilations": 0,
                        "numberOfErrors": 0,
                        "completed": false,
                        "score": 0
                    });
                }

            })

        }

        fs.writeFile(statsPath, JSON.stringify(assignmentStats), () => { });
    }

    public assignmentFilesExist(assignmentName: string): boolean {
        console.info('Checking if files exist');
        let codeFile = path.join(this.resolveAssignmentPath(assignmentName), 'main.py');
        let instructionsFile = path.join(this.resolveAssignmentPath(assignmentName), 'instructions.md');
        let testFile = path.join(this.resolveAssignmentPath(assignmentName), 'a-test.py');

        return fs.existsSync(codeFile) && fs.existsSync(instructionsFile) && fs.existsSync(testFile);
    }

    public isAssignmentWorkspace(files: FileStat[]): boolean {
        let flag = false;
        files.forEach(file => {
            if (file.name == 'instructions.md') {
                flag = true;
            };
        })
        return flag;
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

    private resolveResourcePath(assignmentName: string, resourceName: string) {
        let assignmentPath = this.resolveAssignmentPath(assignmentName);
        console.info(`Resolved file path to: ${path.join(assignmentPath, resourceName)}`);

        return path.join(assignmentPath, resourceName);
    }


    private assignmentExists(stats: Record<string, any>[], id: string): boolean {
        let doesExist = false;
        stats.forEach(stat => {
            if (stat.id == id) doesExist = true;
        })
        return doesExist;
    }


    /**
     * Write the debug launch configuration for the given directory
     * @param configPath 
     */
    private writeDebugConfiguration(configPath: string): void {
        let config = {
            "configurations": [
                {
                    "name": "Python: Current File",
                    "type": "python",
                    "request": "launch",
                    "program": "${file}",
                    "console": "integratedTerminal",
                    "logToFile": true
                }
            ]
        }

        fs.writeFile(configPath, JSON.stringify(config), (err) => {
            if (err) console.error(err);
        })
    }
}