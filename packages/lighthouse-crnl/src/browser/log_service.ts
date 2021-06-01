import * as fs from "fs";
import path = require('path');
import glob = require("glob");
import Store = require("electron-store");
const homedir = require('os').homedir();
import { nanoid } from 'nanoid'
import { FileStat } from "@theia/filesystem/lib/common/files";

export class LoggerService {
    private readonly store = new Store();

    /**
     * Looks for log file in the python debugpy log files and generates
     * logs based on those files. If the log files do contain exceptions
     * logs them to the user's log files otherwise, logs a plain execution.
     * 
     * @param {boolean} isAssignment
     */
    public generateExecutionLog(isAssignment: boolean): Promise<boolean> {
        console.info(`Current workspace is an assignment workpsace: ${isAssignment}`);

        let wasError: boolean = false;

        let log: Record<string, any> = {};
        let logPath = path.join(process.cwd(), 'plugins', 'lighthouse-builtin-ms-python', 'extension', '*.log');
        return new Promise<boolean>((resolve, reject) => {
            glob(
                logPath,
                (err: any, files: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let requiredFile = files[3];

                    fs.readFile(requiredFile, "utf-8", (err, data) => {
                        if (err) {
                            reject(err);
                        } else {

                            const errLog = this.parseLogForErrors(data);

                            log = this.getExecutionLog(errLog);
                            this.storeExectionLog(log);

                            // Update assignment stats
                            this.updateAssignmentStats(errLog != null);

                            if (errLog) {
                                // Execution resulted in an error
                                wasError = true;

                                // Setting exception for use in triggering intervention
                                this.store.set('exception', errLog.exception);
                            }
                        }

                        // Remove all log files
                        this.removeLogFile(files);

                        resolve(wasError);
                    });
                }
            );
        });

    }

    public get baseAssignmentPath(): string {
        return path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'assignments.json');
    }

    private parseLogForErrors(logData: string): Record<string, any> | null {
        let log: Record<string, any> | null = null;

        try {
            let breakpoint = logData.split("PyDB.do_wait_suspend")[1];

            let error = breakpoint.split(
                "Sending suspend notification."
            )[0];

            let lineByLineErr = error.split("\r\n");

            // Getting line number from error
            let errNumberLine = lineByLineErr[1].split(" ");

            let lineNumber = errNumberLine[errNumberLine.length - 1].split(
                ")"
            )[0];

            // Getting error text from the error
            let errText = lineByLineErr[4].split(", ")[1];

            let exception = errText.split('(')[0];


            log = {
                "errLine": lineNumber,
                "errText": errText,
                "exception": exception
            };
        } finally {
            return log;
        }

    }

    private getExecutionLog(errorLog: Record<string, any> | null): Record<string, any> {
        let id = this.store.get('assignmentId');
        let area = this.store.get('assignmentArea');

        console.info(`Generating log for\nAssignment id: ${id}\nAssignment area: ${area}`);

        return {
            "id": nanoid(),
            "executionDate": this.getDate(),
            "executionTime": new Date().getTime(),
            "user": this.store.get("username"),
            "wasError": errorLog != null,
            "error": errorLog != null ? errorLog : {},
            "forAssignment": this.store.get('isAssignmentWorkspace', false),
            "assignment": this.store.get('isAssignmentWorkspace', false)
                ? {
                    "id": id,
                    "area": area
                }
                : {}
        };
    }

    private storeExectionLog(log: Record<string, any>): void {
        let previousLogs: Record<string, any>[] | null = null;
        let storeLog: Record<string, any>[] = [];

        // Look for current user directory
        // Check to see if logs already exist
        const logDir = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'Logs.json');

        // Look for previous logs if any
        if (fs.existsSync(logDir)) {
            let read = fs.readFileSync(logDir, 'utf-8');
            previousLogs = JSON.parse(read);
        }

        if (previousLogs) {
            if (Array.isArray(previousLogs)) {
                previousLogs.push(log);
            }

            storeLog = previousLogs;
        } else {
            storeLog.push(log);
        }

        fs.writeFile(logDir, JSON.stringify(storeLog), (err) => console.error(err));
    }

    private removeLogFile(files: FileStat[]): void {
        files.forEach((file: any) => {
            fs.unlink(file, (err => {
                if (err) console.error(err);
            }));
        });
    }

    private updateAssignmentStats(wasError: boolean): void {
        if (this.store.get('isAssignmentWorkspace', false)) {
            // Current workspace is an assignment workspace
            const assignmentId = this.store.get('assignmentId');
            const assignmentPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

            if (fs.existsSync(assignmentPath)) {
                console.info(`Updating assignment stats for assignment: ${assignmentId}`);
                fs.readFile(assignmentPath, 'utf-8', (err, data) => {
                    if (err) console.error(err);
                    let stats: Record<string, any>[] = JSON.parse(data);

                    if (Array.isArray(stats)) {
                        stats.forEach(stat => {
                            if (stat.id == assignmentId) {
                                // Current assignment stat found
                                console.info(`Assignment ${assignmentId} found in stats files`);
                                // Update stats
                                stat.numberOfCompilations++;
                                if (wasError) stat.numberOfErrors++;

                                console.info(`Updated assignment stats for the compilation to\n${stats.toString()}`);

                                fs.writeFile(assignmentPath, JSON.stringify(stats), (err) => { if (err) console.error(err) });
                            }
                        });
                    }
                });
            }
        }
    }
    /**
   * Returns current date in [day], [month] and [year] format
   * @returns string
   */
    private getDate(): string {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();

        return dd + "/" + mm + "/" + yyyy;
    }
}