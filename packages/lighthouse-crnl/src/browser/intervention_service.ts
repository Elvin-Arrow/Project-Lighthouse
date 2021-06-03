import { CommandService, MessageService } from "@theia/core";
import Store = require("electron-store");
import path = require('path');
const homedir = require('os').homedir();
import fs = require('fs');

export class InterventionService {
    private readonly store: Store = new Store();
    private readonly messageService: MessageService;
    private readonly commandService: CommandService

    constructor(messageService: MessageService, commandService: CommandService) {
        this.messageService = messageService;
        this.commandService = commandService;
    }

    public triggerIntervention(): void {
        if (this.shouldInterventionFire()) {
            let exp = this.store.get('exception');
            this.store.delete('exception');

            if (exp) {
                switch (exp) {
                    case "SyntaxError":
                        this.messageService.warn('You seem to be struggling with the syntax of your code, maybe I can help you figure something out', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                this.store.set('syntaxError', true);
                                this.commandService.executeCommand('lighthouse-resources:command');
                            }
                        });
                        break;

                    case "NameError":
                        this.messageService.warn('You seem to be struggling with the variable declaration, let me tell you a few things about variable declaration', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                console.info('Taking you to variables section');
                                this.store.set('nameError', true);
                                this.commandService.executeCommand('lighthouse-resources:command');
                            }
                        });
                        break;

                    case "TypeError":
                        this.messageService.warn('Think you need my help figuring out the type casting?', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                this.commandService.executeCommand('lighthouse-resources:command');
                            }
                        });
                        break;

                    case "ZeroDivisionError":
                        this.messageService.warn('Divison by zero is a sin, let me help you guide a bit', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                this.commandService.executeCommand('lighthouse-resources:command');
                            }
                        });
                    default:
                        this.messageService.warn('Struggling are you? Maybe I can be of some help', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                this.commandService.executeCommand('lighthouse-resources:command');
                            }
                        });
                        break;
                }
            } else {
                this.messageService.warn('Struggling are you? Maybe I can be of some help', 'Guide me', 'No thanks').then(value => {
                    if (value == 'Guide me') {
                        this.commandService.executeCommand('lighthouse-resources:command');
                    }
                });
            }
        }
    }

    private shouldInterventionFire(): boolean {
        console.info(`\nChecking if intervention should fire\n`);
        let shouldFire = false;
        let performanceStatsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'performance_stats.json');

        if (fs.existsSync(performanceStatsPath)) {
            let stats = JSON.parse(fs.readFileSync(performanceStatsPath, 'utf-8'));

            if (Array.isArray(stats)) {
                const assignmentArea = this.store.get('assignmentArea');
                stats.forEach(stat => {
                    if (stat.area == assignmentArea) {
                        shouldFire = this.checkCompilationsAgainstAreaStanding(stat.standing);
                    }
                })
            }
        }

        return shouldFire;
    }

    private checkCompilationsAgainstAreaStanding(standing: string): boolean {
        const id = this.store.get('assignmentId');
        let comps = 0;
        let check = false;


        if (id) {
            // Acquire the current assignment stats
            let statsPath = path.join(homedir, 'lighthouse', `${this.store.get("username")}`, 'assignments', 'stats.json');

            let stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

            if (Array.isArray(stats))
                stats.forEach(stat => {
                    if (stat.id == id) {
                        // Get number of compilations
                        comps = stat.numberOfCompilations;
                        console.info(`Number of compilations acquired as: ${comps}\n\n`);
                    }
                })
        }

        switch (standing) {
            case "good":
                if (this.isError && comps % 5 == 0) check = true;
                else if (!this.isError && comps % 9) check = true;
                break;

            case "average":
                if (this.isError && comps % 4 == 0) check = true;
                else if (!this.isError && comps % 8) check = true;
                break;

            case "fair":
                if (this.isError && comps % 3 == 0) check = true;
                else if (!this.isError && comps % 7) check = true;
                break;
            default:
                if (this.isError && comps % 4 == 0) check = true;
                else if (!this.isError && comps % 7) check = true;
                break;
        }

        console.info(`Intervention should fire: ${check}\n\n`);

        return check;
    }

    /**
     * Property that checks if any exception was set by the logger service
     * when generating logs.
     */
    private get isError(): boolean {
        if (this.store.get('exception')) return true;
        return false;
    }

}