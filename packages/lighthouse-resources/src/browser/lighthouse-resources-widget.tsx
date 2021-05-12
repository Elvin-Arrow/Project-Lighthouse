import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { CommandService, MessageService } from "@theia/core";
import { ReactComponent } from './react-component';

@injectable()
export class LighthouseResourcesWidget extends ReactWidget {

    static readonly ID = 'lighthouse-resources:widget';
    static readonly LABEL = 'Lighthouse Resources';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = LighthouseResourcesWidget.ID;
        this.title.label = LighthouseResourcesWidget.LABEL;
        this.title.caption = LighthouseResourcesWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-th';
        this.update();
    }

    protected render(): React.ReactNode {
        return <ReactComponent />;

        // const content = "Please select a language from the sidebar.";
        // const info = "Welcome to Lighthouse Resources!"
        // return (
        //     <div id="widget-container">
        //         <AlertMessage type="INFO" header={info} />
        //         <div><h1>Lighthouse Resources</h1></div>
        //         <div className="main-area">{content}</div>
        //         <div className="sidebar">
        //             <div className="links">
        //                 <h2>Select language</h2>
        //                 <ul>
        //                     <li><a onClick={(_a) => this.pythonResources()}>Python</a></li>
        //                     <li><a onClick={(_a) => this.cppResources()}>C++</a></li>
        //                 </ul>
        //             </div>
        //         </div>
        //     </div>
        // );
    }
    // protected pythonResources(): void {
    //     this.messageService.info('Language selected: Python');
    //     this.commandService.executeCommand("resources-python:command");
    // }
    // protected cppResources(): void {
    //     this.messageService.info('Language selected: C++');
    //     this.commandService.executeCommand("resources-cpp:command");
    // }
}