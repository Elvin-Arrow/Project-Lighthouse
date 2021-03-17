import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { CommandService, MessageService } from "@theia/core";

@injectable()
export class ResourcesPythonWidget extends ReactWidget {

    static readonly ID = 'resources-python:widget';
    static readonly LABEL = 'Lighthouse Resources';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = ResourcesPythonWidget.ID;
        this.title.label = ResourcesPythonWidget.LABEL;
        this.title.caption = ResourcesPythonWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-th';
        this.update();
    }

    protected render(): React.ReactNode {
        const info = "Welcome to Lighthouse Resources!"
        return (
            <div id="widget-container">
                <AlertMessage type="INFO" header={info} />
                <div><h1>Lighthouse Resources</h1></div>
                <div className="main-area">
                    <div className="resource-block">
                        <div className="title">if statement</div>
                        <div className="description">
                            The program evaluates the test expression and will execute statement(s) only if the test expression is 'True'. If the test expression is 'False', the statement(s) is not executed.
                            <code>
                                if test_expression:
                                <br />
                                <span className="indent">statement(s)</span>
                            </code>
                        </div>
                        <div className="readMore"><a href="">Click here to read more...</a></div>
                    </div>
                    <div className="resource-block">
                        <div className="title">for loop</div>
                        <div className="description">
                            The 'val' is the variable that takes the value of the item inside the sequence on each iteration. Loop continues until we reach the last item in the sequence. The body of for loop is separated from the rest of the code using indentation.
                            <code>
                                for val in sequence:
                                <br />
                                <span className="indent">statement(s)</span>
                            </code>
                        </div>
                        <div className="readMore"><a href="">Click here to read more...</a></div>
                    </div>
                    <div className="resource-block">
                        <div className="title">while loop</div>
                        <div className="description">
                            In the while loop, test expression is checked first. The body of the loop is entered only if the 'test_expression' evaluates to 'True'. After one iteration, the test expression is checked again. This process continues until the 'test_expression' evaluates to 'False'.
                            <code>
                                while test_expression:
                                <br />
                                <span className="indent">statement(s)</span>
                            </code>
                        </div>
                        <div className="readMore"><a href="">Click here to read more...</a></div>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="links">
                        <h2>Select language</h2>
                        <ul>
                            <li>Python</li>
                            <li><a onClick={(_a) => this.cppResources()}>C++</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    protected cppResources(): void {
        this.messageService.info('Language selected: C++');
        this.commandService.executeCommand("resources-cpp:command");
    }
}