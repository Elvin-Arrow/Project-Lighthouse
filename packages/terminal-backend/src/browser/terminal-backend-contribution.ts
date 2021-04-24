import { Command, CommandContribution, CommandRegistry } from '@theia/core/lib/common';
import { inject, injectable } from 'inversify';
import { HelloBackendWithClientService, HelloBackendService } from '../common/protocol';


const SayHelloViaBackendCommandWithCallBack: Command = {
    id: 'sayHelloOnBackendWithCallBack.command',
    label: 'Say hello on the backend with a callback to the client',
};

const SayHelloViaBackendCommand: Command = {
    id: 'sayHelloOnBackend.command',
    label: 'Say hello on the backend',
};

@injectable()
export class TerminalBackendCommandContribution implements CommandContribution {

    constructor(
        @inject(HelloBackendWithClientService) private readonly helloBackendWithClientService: HelloBackendWithClientService,
        @inject(HelloBackendService) private readonly helloBackendService: HelloBackendService,


    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(SayHelloViaBackendCommandWithCallBack, {
            execute: () => {

               /*  let term = this.terminalService.currentTerminal;
                console.info(`Current terminal acquired: ${term?.title}`)

                if (term) {
                    console.info(`Acquiring terminal process ID...`)
                    term.onData((data) => {
                        console.info(`Terminal data: ${data}`);
                    });
                    term.processId.then((id) => {
                        console.info(`Process ID acquired ${id}, firing up logging service`)

                        this.helloBackendWithClientService.acquireTerminal(id);
                        this.helloBackendWithClientService.greet().then(r => console.log(r))
                    })
                } */
                this.helloBackendWithClientService.greet().then(r => console.log(r))

            }

        });
        registry.registerCommand(SayHelloViaBackendCommand, {
            execute: () => {
                /* let term = this.terminalService.currentTerminal;
                console.info(`Current terminal acquired: ${term?.title}`)

                if (term) {
                    console.info(`Acquiring terminal process ID...`)
                    term.processId.then((id) => {
                        console.info(`Process ID acquired, firing up logging service`)
                        this.helloBackendWithClientService.acquireTerminal(id);
                        this.helloBackendService.sayHelloTo('World').then(r => console.log(r))
                    })
                } */
                this.helloBackendService.sayHelloTo('World').then(r => console.log(r))

            }
        });
    }
}
