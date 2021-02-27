import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
var path = require('path');

@injectable()
export class LighthouseAuthenticateWidget extends ReactWidget {

    static readonly ID = 'lighthouse-authenticate:widget';
    static readonly LABEL = 'LighthouseAuthenticate Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected async init(): Promise<void> {
        this.id = LighthouseAuthenticateWidget.ID;
        this.title.label = LighthouseAuthenticateWidget.LABEL;
        this.title.caption = LighthouseAuthenticateWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    protected render(): React.ReactNode {
        const lighthouseImagePath = path.join('media', 'lighthouse.svg');
        console.log(lighthouseImagePath);

        return <div id='widget-container'>
           
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <h1>Welcome to Lighthouse</h1>
                    <img src='lighthouse-authenticate/src/browser/media/lighthouse.svg' alt="Lighthouse" />
                    <h3>Sign in to continue</h3>
                    <div className=""></div>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input id="usernameInput" type="text" />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input id="passwordInput" type="password" />
                    </div>
                    <button className='theia-button secondary' title='Display Message' onClick={_a => this.displayMessage()}>Display Message</button>
                </div>
            </div>

        </div>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: LighthouseAuthenticate Widget Successfully Created!');
    }

}
