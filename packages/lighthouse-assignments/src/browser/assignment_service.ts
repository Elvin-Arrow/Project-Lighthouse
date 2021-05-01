import * as fs from "fs";
import path = require('path');



export class AssignmentService {

    
    public getAssignments(): any {
        const assignmentPath = path.join(process.cwd(), 'resources', 'assignments.json');

        let rawJson = fs.readFileSync(assignmentPath, "utf-8");

        let assignmentsData = JSON.parse(rawJson);

        return assignmentsData;
    }


    public resolveAssignmentPath(assignmentPath: string): string {
        const resourcePath = path.join(process.cwd(), 'resources', 'assignments', assignmentPath);
        return resourcePath;
    }

    
}