import { MessageService } from "@theia/core";
import Store = require("electron-store");

export class InterventionService {
    private readonly store: Store = new Store();
    private readonly messageService: MessageService;

    constructor(messageService: MessageService) {
        this.messageService = messageService;
    }

    public triggerIntervention() {
        if (this.shouldInterventionFire()) {
            let exp = this.store.get('exception');

            if (exp) {
                switch (exp) {
                    case "SyntaxError":
                        this.messageService.warn('You seem to be struggling with the syntax of your code, maybe I can help you figure something out', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                // TODO: Navigate to relevant resource
                            }
                        });
                        break;

                    case "NameError":
                        this.messageService.warn('You seem to be struggling with the variable declaration, let me tell you a few things about variable declaration', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                console.info('Taking you to variables section');
                                this.store.set('resource', 'variable');
                                // TODO: Navigate to relevant resource
                            }
                        });
                        break;

                    case "TypeError":
                        this.messageService.warn('Think you need my help figuring out the type casting?', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                // TODO: Navigate to relevant resource
                            }
                        });
                        break;

                    case "ZeroDivisionError":
                        this.messageService.warn('Divison by zero is a sin, let me help you guide a bit', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                // TODO: Navigate to relevant resource
                            }
                        });
                    default:
                        this.messageService.warn('Struggling are you? Maybe the book of wisdom can help', 'Guide me', 'No thanks').then(value => {
                            if (value == 'Guide me') {
                                this.store.set('resource', 'basics');
                                // TODO: Navigate to relevant resource
                            }
                        });
                        break;
                }
            }
        }
    }

    private shouldInterventionFire(): boolean {
        // TODO: Check for threshold
        return true;
    }
}