import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { CommandService, MessageService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import Store = require("electron-store");

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

    private readonly store = new Store();

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
        if (!this.authState()) {
            // Request to authenticate
            const message = 'Please login to access Lighthouse services';

            return <div id='widget-container'>
            <AlertMessage type='INFO' header={message} />
            <button className='theia-button secondary' title='Launch Dashboard' onClick={_a => this.lighthouseAuthenticate()}>Login to Lighthouse</button>
        </div>
        } else {
            // Show lighthouse services
            return this.renderToolbox();
        }
        
    }

    private renderToolbox(): React.ReactNode {
        return <div id='widget-container'>
            <h2>Access the dashboard</h2>
            <br></br>
            <button className='theia-button secondary' title='Launch Dashboard' onClick={_a => this.showDashboard()}>View Dashboard</button>
        </div>
    }

    protected showDashboard(): void {
        this.commandService.executeCommand('lighthouse-dashboard:command');
    }

    /**
     * Check whether user is authenticated or not
     */
    private authState(): boolean {
        // TODO Implement authentication logic
        const status = this.store.get('authenticated');

        if (status) {
            return true;
        }
        return false;
    }

    private lighthouseAuthenticate(): void {
        // TODO Invoke the auth plugin
        this.commandService.executeCommand('lighthouse-authenticate:command');
    }

}
