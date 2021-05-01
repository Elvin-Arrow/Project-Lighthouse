import { injectable, inject } from "inversify";
import { BackendClient, HelloBackendWithClientService } from "../common/protocol";
import { ProcessManager } from "@theia/process/lib/node/process-manager"
import * as fs from 'fs'

@injectable()
export class HelloBackendWithClientServiceImpl implements HelloBackendWithClientService {
    @inject(ProcessManager) protected readonly processManager: ProcessManager;

    private client?: BackendClient;


    acquireTerminal(terminalID: number): void {
        console.info(`This is backend service, we have the terminal ID: ${terminalID}`);
        let process = this.processManager.get(terminalID);

        setTimeout(() => {
            console.info(`Process is ${process?.id}`)

            if (process) {
                console.info(`Terminal process acquired`);
                process.onError((err) => {
                    fs.writeFileSync('log.log', err.message)
                    console.info(`Error recorded: ${err}`);
                })
                process.errorStream.on('error', (err) => {
                    fs.writeFileSync('log.log', err.message)
                    console.info(`Terminal error: ${err}`);
                });
                process.outputStream.on('data', (data) => {
                    console.info(`Terminal data: ${data}`);
                })
                process.inputStream.on('error', (err) => {
                    console.info(`Terminal error: ${err}`);
                })
            }
        }, 1000);

    }




    greet(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client ? this.client.getName().then(greet => resolve('Hello ' + greet))
                : reject('No Client');
        })

    }
    dispose(): void {
        // do nothing
    }
    setClient(client: BackendClient): void {
        this.client = client;
    }

}
