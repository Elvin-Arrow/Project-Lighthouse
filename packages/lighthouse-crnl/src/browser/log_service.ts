import * as fs from "fs";
import path = require('path');
import glob = require("glob");
import Store = require("electron-store");
const homedir = require('os').homedir();

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
    public generateExecutionLog(isAssignment: boolean): void {
        this.isAssignment = isAssignment;

        let log: Record<string, any> = {};
        let logPath = path.join(process.cwd(), 'plugins', 'lighthouse-builtin-ms-python', 'extension', '*.log');

        glob(
            logPath,
            (err: any, files: any) => {
                if (err) {
                    return;
                }

                let requiredFile = files[3];

                fs.readFile(requiredFile, "utf-8", (err, data) => {
                    if (err) {
                        console.error("Unable to read the file");
                    } else {
                        const errLog = this.parseLogForErrors(data);

                        log = this.getExecutionLog(errLog != null);
                        this.storeExectionLog(log);

                        if (errLog) {
                            // Execution resulted in an error
                            // Store error log
                            this.storeErrorLog(log.id, errLog);

                        }
                    }
                });

                // Remove all log files
                files.forEach((file: any) => {
                    fs.unlinkSync(file);
                });
            }
        )
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


            log = {
                "errLine": lineNumber,
                "errText": errText,
            };
        } finally {
            return log;
        }

    }

    private getExecutionLog(execuionStatus: boolean): Record<string, any> {
        return {
            "id": "1",
            "executionDate": new Date().getDate(),
            "executionTime": new Date().getTime(),
            "user": this.store.get("username"),
            "wasError": execuionStatus,
            "forAssignment": this.isAssignment,
        };
    }

    private storeExectionLog(log: Record<string, any>): void {
        let previousLogs: Record<string, any> | null = null;
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
            console.log(previousLogs);
            store.push(previousLogs);
        }

        store.push(log);

        fs.writeFileSync(logDir, JSON.stringify(store));
    }

    private storeErrorLog(logId: string, errLog: Record<string, any>): void {
        let previousLogs = null;
        let store: Record<string, any>[] = [];

        let log = {
            "id": logId,
            "errLine": errLog.errLine,
            "errText": errLog.errText
        }

        const logDir = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'Error-logs.json');

        if (fs.existsSync(logDir)) {
            let read = fs.readFileSync(logDir, 'utf-8');
            previousLogs = JSON.parse(read);
        }

        if (previousLogs) {
            console.log(previousLogs);
            store.push(previousLogs);
        }

        store.push(log);

        fs.writeFileSync(logDir, JSON.stringify(store));

    }


}