import Store = require("electron-store");
const path = require("path");
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
                        // TODO: Pull in all the user data and store it
                    } catch (err) {
                        reject(err);
                    }

                }
                resolve(true);
            } else {
                reject(new Error('Failed to authenticate user'));
            }
        }
        );
    }

    private isFirstAuthentication(username: string): boolean {
        const userDir = path.join(homedir, 'lighthouse', `${username}`);
        if (fs.existsSync(userDir)) return false;

        return true;
    }

    private generateUserDirectory(username: string): void {
        const userDir = path.join(homedir, 'lighthouse', `${username}`);
        fs.mkdirSync(userDir, { recursive: true });
    }

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
                ".gitignore": true,
            }
        };

        let configFilePath = path.join(configPath, 'settings.json');

        if (!fs.existsSync(configFilePath))
            fs.writeFile(configFilePath, JSON.stringify(config), (err => { console.error(err); }))
    }
}