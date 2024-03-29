import Store = require("electron-store");
import path = require("path");
const homedir = require('os').homedir();
import * as fs from "fs";

export class AuthenticationService {
    private readonly store = new Store();

    /**
     * A convenience method to authenticate user against the Lighthouse authentication
     * service API
     * @param {string} username 
     * @param {string} password 
     * @return {Promise<boolean>}
     */
    public authenticate(username: string, password: string): Promise<boolean> {
        // Validates credentials
        return new Promise<boolean>((resolve, reject) => {
            if (username == "muhammad" && password == "123456") {
                // On successful validation 

                // Set user as authenticated for subsequent launches
                this.store.set("authenticated", true);

                // Store user identifier
                this.store.set("username", "muhammad");

                // Check to see if the user signed in for the first time
                if (this.isFirstAuthentication(username)) {
                    console.info('First time user');
                    // Create a folder for the user in the home directory
                    try {
                        this.generateUserDirectory(username);
                        this.writeGlobalDefaultConfiguration();
                    } catch (err) {
                        reject(err);
                    }

                }

                try {
                    this.generatePerformanceStats(username);
                } catch (err) {
                    reject(err);
                }

                resolve(true);
            } else {
                reject(new Error('Failed to authenticate user'));
            }
        }
        );
    }

    /**
     * Checks the user directory to see if the file directories have been setup, 
     * if no files exist, it's first time authentication
     * 
     * @param username string
     * @returns boolean
     */
    private isFirstAuthentication(username: string): boolean {
        const userDir = path.join(homedir, 'lighthouse', `${username}`);
        if (fs.existsSync(userDir)) return false;

        return true;
    }

    /**
     * Generates the files for the newly authenticated user
     * @param username string
     */
    private generateUserDirectory(username: string): void {
        const userDir = path.join(homedir, 'lighthouse', `${username}`);
        fs.mkdirSync(userDir, { recursive: true });
    }

    /**
     * Write the IDE global configurations is not already setup
     * 
     */
    private writeGlobalDefaultConfiguration(): void {
        let configPath = path.join(homedir, '.theia');

        if (!fs.existsSync(configPath)) {
            // Create the dir
            fs.mkdirSync(configPath, { recursive: true });
        }

        // Write the configuration if it doesn't exist
        let config = {
            "files.exclude": {
                ".git": true,
                "/.svn": true,
                "/.hg": true,
                "/CVS": true,
                "**/.DS_Store": true,
                "a-test.*": true,
                ".theia": true,
                "instructions.md": true,
                "testing_copy.py": true,
                "__pycache__": true,
                "testing.log": true
            }
        };

        let configFilePath = path.join(configPath, 'settings.json');

        if (!fs.existsSync(configFilePath))
            fs.writeFile(configFilePath, JSON.stringify(config), (err => { console.error(err); }))
    }

    /**
     * Create the stats profile for the newly authenticated user if it doesn't
     * exist.
     * 
     * @param username string 
     */
    private generatePerformanceStats(username: string): void {
        const performanceStatsDir = path.join(homedir, 'lighthouse', `${username}`, 'performance_stats.json');

        if (fs.existsSync(performanceStatsDir)) {
            return
        } else {
            const stats =
                [
                    {
                        "area": "basics",
                        "performanceScore": 0,
                        "standing": "",
                    },
                    {
                        "area": "conditionals",
                        "performanceScore": 0,
                        "standing": "",
                    },
                    {
                        "area": "loops",
                        "performanceScore": 0,
                        "standing": "",
                    },
                    {
                        "area": "lists",
                        "performanceScore": 0,
                        "standing": "",
                    },
                    {
                        "area": "functions",
                        "performanceScore": 0,
                        "standing": "",
                    }
                ];
            fs.writeFile(performanceStatsDir, JSON.stringify(stats), (err) => { if (err) throw err });
        }
    }
}