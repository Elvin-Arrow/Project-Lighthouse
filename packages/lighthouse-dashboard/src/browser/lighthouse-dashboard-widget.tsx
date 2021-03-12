import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
// import { Model } from "./model";

@injectable()
export class LighthouseDashboardWidget extends ReactWidget {
  static readonly ID = "lighthouse-dashboard:widget";
  static readonly LABEL = "Lighthouse Dashboard";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

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
    const header = `Welcome to the Lighthouse Dashboard!`;
    return (
      <div id="widget-container">
        <AlertMessage type="INFO" header={header} />
        <div>
          <h1>Lighthouse Dashoard</h1>
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

    const temp = (
      <table id="table1">
        <tr>
          <th>Sr Number</th>
          <th>Number of compiles</th>
          <th>Errors</th>
          <th>Language</th>
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

  protected attemptAssignments(): void {
    this.messageService.info(
      "Soon you would be able to attempt assignments within Lighthouse!"
    );
  }
  protected displayMessage(): void {
    this.messageService.info(
      "Congratulations: Lighthouse Dashboard Widget Successfully Created!"
    );
  }
}
