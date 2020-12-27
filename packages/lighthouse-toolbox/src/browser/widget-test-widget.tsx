import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
// import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { CommandService, MessageService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';

@injectable()
export class WidgetTestWidget extends ReactWidget {

    static readonly ID = 'lighthouse-toolbox:widget';
    static readonly LABEL = 'Lighthouse Toolbox';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = WidgetTestWidget.ID;
        this.title.label = WidgetTestWidget.LABEL;
        this.title.caption = WidgetTestWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-sun-o'; // example widget icon.
        this.update();
    }

    protected render(): React.ReactNode {
        // const header = `This is a sample widget which simply calls the messageService
        // in order to display an info message to end users.`;
        return <div id='widget-container'>
            {/* <AlertMessage type='INFO' header={header} /> */}
            <h2>Access the dashboard</h2>
            <br></br>
            <button className='theia-button secondary' title='Launch Dashboard' onClick={_a => this.displayMessage()}>Display Message</button>
        </div>
    }

    protected displayMessage(): void {
        this.commandService.executeCommand('lighthouse-dashboard:command');
    }

}
