import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
// import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { WorkspaceService } from "@theia/workspace/lib/browser";
import ReactMarkdown = require('react-markdown');
import * as fs from "fs";
import path = require('path');


@injectable()
export class MarkdownViewWidget extends ReactWidget {

    static readonly ID = 'Markdown-View:widget';
    static readonly LABEL = 'Instructions';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService;

    @postConstruct()
    protected async init(): Promise<void> {
        this.id = MarkdownViewWidget.ID;
        this.title.label = MarkdownViewWidget.LABEL;
        this.title.caption = MarkdownViewWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    protected render(): React.ReactNode {
        let currentWorkspace = this.workspaceService.workspace;
        let content = '# 404 \nNo instructions found';

        currentWorkspace?.children?.forEach((file) => {
            console.info(`File: ${file.name}`);
            if (file.name == 'readme.md') {
                const markdownPath = path.join(file.resource.path.toString());

                content = fs.readFileSync(markdownPath.substr(1), 'utf-8');

                console.log(content);

            }
        })

        return <ReactMarkdown children={content}/>

      


    }
}
