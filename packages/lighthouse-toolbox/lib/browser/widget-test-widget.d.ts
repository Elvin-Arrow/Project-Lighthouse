import * as React from 'react';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { CommandService, MessageService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';
export declare class WidgetTestWidget extends ReactWidget {
    static readonly ID = "lighthouse-toolbox:widget";
    static readonly LABEL = "Lighthouse Toolbox";
    protected readonly messageService: MessageService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly commandService: CommandService;
    private readonly store;
    protected init(): Promise<void>;
    protected render(): React.ReactNode;
    private renderToolbox;
    protected showDashboard(): void;
    /**
     * Check whether user is authenticated or not
     */
    private authState;
    private lighthouseAuthenticate;
}
//# sourceMappingURL=widget-test-widget.d.ts.map