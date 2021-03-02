import * as React from "react";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
export declare class LighthouseAuthenticateWidget extends ReactWidget {
    static readonly ID = "lighthouse-authenticate:widget";
    static readonly LABEL = "LighthouseAuthenticate Widget";
    protected readonly messageService: MessageService;
    protected readonly workspaceService: WorkspaceService;
    private readonly store;
    private username;
    private password;
    constructor(props: any);
    protected init(): Promise<void>;
    protected render(): React.ReactNode;
    protected displayMessage(): void;
    onSubmit(e: Event): void;
    private updatePassword;
    private authenticate;
    private refreshWorkspace;
}
export declare class AuthView extends React.Component {
    constructor(props: {});
    render(): JSX.Element;
    private updateUsername;
}
//# sourceMappingURL=lighthouse-authenticate-widget.d.ts.map