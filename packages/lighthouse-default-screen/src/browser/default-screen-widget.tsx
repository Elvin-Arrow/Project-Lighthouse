import * as React from 'react';
import { injectable, postConstruct } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';

@injectable()
export class DefaultScreenWidget extends ReactWidget {

    static readonly ID = 'default-screen:widget';
    static readonly LABEL = 'DefaultScreen Widget';

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = DefaultScreenWidget.ID;
        this.title.label = DefaultScreenWidget.LABEL;
        this.title.caption = DefaultScreenWidget.LABEL;
        this.title.closable = false;
        this.update();
    }

    protected render(): React.ReactNode {
        return
    }
}
