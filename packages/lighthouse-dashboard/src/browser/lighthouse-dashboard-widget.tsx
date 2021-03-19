import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { CommandService, MessageService } from "@theia/core";
import Store = require("electron-store");
import { ErrorModel } from "./err_model";
import * as fs from "fs";

@injectable()
export class LighthouseDashboardWidget extends ReactWidget {
  static readonly ID = "lighthouse-dashboard:widget";
  static readonly LABEL = "Lighthouse Dashboard";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(CommandService)
  protected readonly commandService: CommandService;

  private readonly store = new Store();

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = LighthouseDashboardWidget.ID;
    this.title.label = LighthouseDashboardWidget.LABEL;
    this.title.caption = LighthouseDashboardWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  protected render(): React.ReactNode {
    /* const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://127.0.0.1:5000/dash/", false);
        xmlHttp.send(null);

        const rawJson = xmlHttp.response;
        const data: Map<String, any>[] = JSON.parse(rawJson);
        const table = this.getTable(data); */
    const table = this.getTable();
    // const records = this.getData();
    const username = this.store.get("username")

    // const header = `Hey... ${username}\nWelcome to the Lighthouse Dashboard!`;
    return (
      <div id="widget-container">
        {/* <AlertMessage type="INFO" header={header} /> */}
        <div>
          <h1>Hey... {username}</h1>
          <h1>Welcome to the Lighthouse Dashboard!</h1>
        </div>
        <div className="main-area">{table}</div>
        <div className="sidebar">
          <div className="links">
            <h2>Useful links</h2>
            <ul>
              <li>
                <a href="//devdocs.io/python/">Python documentation</a>
              </li>
              <li>
                <a href="//devdocs.io/cpp/">C++ documentation</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Assignments</h2>
            <button
              className="theia-button secondary"
              title="Attempt assignments"
              onClick={(_a) => this.attemptAssignments()}
            >
              Attempt assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  protected getTable(): React.ReactNode {
    /* let rows = [];

         for (let i = 0; i < data.length; ++i) {

      let model: Model = new Model(data[i]);
            rows.push(<tr>
                <td>{model.ID}</td>
                <td>{model.CompileCount}</td>
                <td>{model.Error}</td>
                <td>{model.Language}</td>
            </tr>)
    } */

    let err = this.getData();
    console.info(err);

    /* const temp2 = (
      <table id="table1">
        <tr>
          <th>Sr.no</th>
          <th>Execution Date</th>
          <th>Execution Status</th>
          <th>Error Text</th>
          <th>Error Position</th>
        </tr>
        
      </table>
    ); */

    const temp = (
      <table id="table1">
        <tr>
          <th>Number</th>
          <th>Number of compiles</th>
          <th>Number of Success</th>
          <th>Number of Errors</th>
        </tr>
        <tr>
          <td>1</td>
          <td>6</td>
          <td>NameError</td>
          <td>Python</td>
        </tr>
        <tr>
          <td>2</td>
          <td>10</td>
          <td>NameError</td>
          <td>Python</td>
        </tr>
        <tr>
          <td>3</td>
          <td>4</td>
          <td>NameError</td>
          <td>Python</td>
        </tr>
        <tr>
          <td>9</td>
          <td>18</td>
          <td>NameError</td>
          <td>Python</td>
        </tr>
      </table>
    );
    return temp;
  }

  protected getData() {
    let log = `${process.cwd}/log.json`
    let errs: ErrorModel[] = [];
    try {
      let data = fs.readFileSync(log);

      let json = JSON.parse(data.toString());
      
      let index: number = 1;
      json.forEach((element: any) => {
        errs.push(new ErrorModel(element, index));
        index++;
      });

      return errs;
    } catch(_) {
      return null;
    }

    

    
  }

  protected attemptAssignments(): void {
    // this.messageService.info(
    //   "Soon you would be able to attempt assignments within Lighthouse!"
    // );
    this.commandService.executeCommand("assignments:command");
  }
  protected displayMessage(): void {
    this.messageService.info(
      "Congratulations: Lighthouse Dashboard Widget Successfully Created!"
    );
  }
}
