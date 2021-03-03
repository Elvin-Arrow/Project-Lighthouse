import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import Store = require("electron-store");

var path = require("path");

@injectable()
export class LighthouseAuthenticateWidget extends ReactWidget {
  static readonly ID = "lighthouse-authenticate:widget";
  static readonly LABEL = "LighthouseAuthenticate Widget";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;

  private readonly store = new Store();

  private username: String | undefined;
  private password = new String();

             

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = LighthouseAuthenticateWidget.ID;
    this.title.label = LighthouseAuthenticateWidget.LABEL;
    this.title.caption = LighthouseAuthenticateWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  protected render(): React.ReactNode {
    const lighthouseImagePath = path.join("media", "lighthouse.svg");
    console.log(lighthouseImagePath);

    

    return (
      <div id="login">
        {/* <img src='../../src/browser/media/lighthouse.svg' alt='Lighthouse' /> */}
        <h1 className="text-center text-white pt-5">Lighthouse Services</h1>
        <p className="text-center text-white m-3">Please log in to continue.</p>
        <div className="container">
          <div
            id="login-row"
            className="row justify-content-center align-items-center"
          >
            <div id="login-column" className="col-md-6">
              <div id="login-box" className="col-md-12">
                <form id="login-form" className="form" action="" method="post">
                  <div className="form-group">
                    <label htmlFor="username" className="text-info">
                      Username:
                    </label>
                    <br />
                    <input
                      type="text"
                      name="username"
                      id="usernameInput"
                      className="form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.username = e.target.value }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="text-info">
                      Password:
                    </label>
                    <br />
                    <input
                      type="password"
                      name="password"
                      id="passwordInput"
                      className="form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.password = e.target.value }
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="button"
                      className="theia-button secondary btn btn-info btn-md"
                      title="Login"
                      onClick={(_a) => {
                        this.authenticate();
                      }}
                    >
                      Login
                    </button>
                  </div>                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  protected displayMessage(): void {
    this.messageService.info(
      "Congratulations: LighthouseAuthenticate Widget Successfully Created!"
    );
  }

  private authenticate(): void {
    console.info(
      `Got ${this.username} as username and ${this.password} as password`
    );
    if (this.username == "student" && this.password == "123456") {
      this.store.set("authenticated", true);

      this.refreshWorkspace();
      this.dispose();
    }
  }

  private refreshWorkspace(): void {
    if (this.workspaceService.opened) {
      const currentWorkspace = this.workspaceService.workspace?.resource;

      if (currentWorkspace != undefined) {
        this.workspaceService.close();
        this.workspaceService.open(currentWorkspace);
      }
    }
  }
}

export class AuthView extends React.Component {
  constructor(props: {}) {
    super(props);

    this.state = {
      username: "",
      password: "",      
    };
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <div id="login">
          {/* <img src='../../src/browser/media/lighthouse.svg' alt='Lighthouse' /> */}
          <h1 className="text-center text-white pt-5">Lighthouse Services</h1>
          <p className="text-center text-white m-3">
            Please log in to continue.
          </p>
          <div className="container">
            <div
              id="login-row"
              className="row justify-content-center align-items-center"
            >
              <div id="login-column" className="col-md-6">
                <div id="login-box" className="col-md-12">
                  <form
                    id="login-form"
                    className="form"
                    action=""
                    method="post"
                  >
                    <div className="form-group">
                      <label htmlFor="username" className="text-info">
                        Username:
                      </label>
                      <br />
                      <input
                        type="text"
                        name="username"
                        id="usernameInput"
                        className="form-control"
                        onChange={this.updateUsername}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="text-info">
                        Password:
                      </label>
                      <br />
                      <input
                        type="password"
                        name="password"
                        id="passwordInput"
                        className="form-control"
                        ref={(c) => {
                          // this.username = c?.value
                          console.info(`c-value: ${c?.value}`);

                        }}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="button"
                        className="theia-button secondary btn btn-info btn-md"
                        title="Login"
                        onClick={(_a) => {
                          // this.authenticate();
                        }}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  private updateUsername(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      username: e.currentTarget.value
    });
  }
}
