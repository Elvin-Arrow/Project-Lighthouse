import { injectable, inject } from "inversify";
import { HelloBackendService } from "../common/protocol";
import { ProcessManager } from "@theia/process/lib/node/process-manager";


@injectable()
export class HelloBackendServiceImpl implements HelloBackendService {
    @inject(ProcessManager) protected readonly processManager: ProcessManager;

    sayHelloTo(name: string): Promise<string> {
        return new Promise<string>(resolve => {
            resolve('Hello ' + name)
        });

    }
}
