import * as React from 'react';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
export declare class LighthouseAuthenticateWidget extends ReactWidget {
    static readonly ID = "lighthouse-authenticate:widget";
    static readonly LABEL = "LighthouseAuthenticate Widget";
    protected readonly messageService: MessageService;
    protected init(): Promise<void>;
    protected render(): React.ReactNode;
    protected displayMessage(): void;
}
//# sourceMappingURL=lighthouse-authenticate-widget.d.ts.map