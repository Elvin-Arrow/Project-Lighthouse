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
    }
}