import * as fs from "fs";
import path = require('path');
import glob = require("glob");
import Store = require("electron-store");
const homedir = require('os').homedir();
import { nanoid } from 'nanoid'
import { FileStat } from "@theia/filesystem/lib/common/files";

export class LoggerService {
    private readonly store = new Store();
    private isAssignment: boolean;

    /**
     * Looks for log file in the python debugpy log files and generates
     * logs based on those files. If the log files do contain exceptions
     * logs them to the user's log files otherwise, logs a plain execution.
     * 
     * @param {boolean} isAssignment
     */
    public generateExecutionLog(isAssignment: boolean): Promise<boolean> {
        this.isAssignment = isAssignment;
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

                            if (errLog) {
                                // Execution resulted in an error
                                wasError = true;
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

        return {
            "id": nanoid(),
            "executionDate": this.getDate(),
            "executionTime": new Date().getTime(),
            "user": this.store.get("username"),
            "wasError": errorLog != null,
            "error": errorLog != null ? errorLog : {},
            "forAssignment": this.isAssignment,
            "assignment": this.isAssignment
                ? {
                    "id": id,
                    "area": area
                }
                : {}
        };
    }

    private storeExectionLog(log: Record<string, any>): void {
        let previousLogs: Record<string, any>[] | null = null;
        let store: Record<string, any>[] = [];

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

            store = previousLogs;
        } else {
            store.push(log);
        }

        fs.writeFileSync(logDir, JSON.stringify(store));
    }

    private removeLogFile(files: FileStat[]): void {
        files.forEach((file: any) => {
            fs.unlink(file, (err => {
                if (err) console.error(err);
            }));
        });
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