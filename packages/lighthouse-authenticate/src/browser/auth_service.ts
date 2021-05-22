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
        return new Promise<boolean>(async (resolve, reject) => {
            if (username == "muhammad" && password == "123456") {
                // On successful validation 

                // Set user as authenticated for subsequent launches
                this.store.set("authenticated", true);

                // Store user identifier
                this.store.set("username", "muhammad");

                // Check to see if the user sign in for the first time
                if (this.isFirstAuthentication(username)) {
                    console.info('First time user');
                    // Create a folder for the user in the home directory
                    try {
                        await this.generateUserDirectory(username);
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

    private generateUserDirectory(username: string): Promise<boolean> {
        const userDir = path.join(homedir, 'lighthouse', `${username}`);
        return new Promise((resolve, reject) => {
            try {
                fs.mkdir(userDir, { recursive: true }, () => {
                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }
        })

    }
}