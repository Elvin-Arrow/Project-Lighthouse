import * as React from 'react';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
export declare class LighthouseDashboardWidget extends ReactWidget {
    static readonly ID = "lighthouse-dashboard:widget";
    static readonly LABEL = "Lighthouse Dashboard";
    protected readonly messageService: MessageService;
    protected init(): Promise<void>;
    protected render(): React.ReactNode;
    private getTable;
    protected attemptAssignments(): void;
    protected displayMessage(): void;
}
//# sourceMappingURL=lighthouse-dashboard-widget.d.ts.map