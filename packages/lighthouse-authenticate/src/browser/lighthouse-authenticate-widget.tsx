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

        return  <div id="login">
                    {/* <img src='../../src/browser/media/lighthouse.svg' alt='Lighthouse' /> */}
                    <h1 className="text-center text-white pt-5">Lighthouse Services</h1>
                    <p className="text-center text-white m-3">Please log in to continue.</p>
                    <div className="container">
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <form id="login-form" className="form" action="" method="post">
                                        <div className="form-group">
                                            <label htmlFor="username" className="text-info">Username:</label><br />
                                            <input type="text" name="username" id="username" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password" className="text-info">Password:</label><br />
                                            <input type="text" name="password" id="password" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            {/* <input type="submit" name="submit" className="btn btn-info btn-md" value="submit" /> */}
                                            <button type="button" className='theia-button secondary btn btn-info btn-md' title='Display Message' onClick={_a => this.displayMessage()}>Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        // return <div id='widget-container'>
        //     <div className='row'>
        //         <div className='col-md-8 mx-auto'>
        //             <h1>Welcome to Lighthouse</h1>
        //             {/* <img src='lighthouse.png' alt='Lighthouse' /> */}
        //             <h3>Sign in to continue</h3>
        //             <div className=''></div>
        //             <div className='form-control'>
        //                 <label htmlFor='username'>Username</label>
        //                 <input id='usernameInput' type='text' />
        //             </div>
        //             <div className='form-control'>
        //                 <label htmlFor='password'>Password</label>
        //                 <input id='passwordInput' type='password' />
        //             </div>
        //             <button className='theia-button secondary' title='Display Message' onClick={_a => this.displayMessage()}>Display Message</button>
        //         </div>
        //     </div>
        // </div>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: LighthouseAuthenticate Widget Successfully Created!');
    }

}
