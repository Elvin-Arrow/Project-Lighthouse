import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import URI from "@theia/core/lib/common/uri"; // For opening the folder
import { WorkspaceService } from "@theia/workspace/lib/browser"; // For handling the workspaces
// import * as data from "./resources.json";
import * as fs from "fs";

const kAssignmentsJsonPath =
  "E:/Foundary/Lighthouse/workbench-01/resources/assignments.json";

@injectable()
export class AssignmentsWidget extends ReactWidget {
  static readonly ID = "assignments:widget";
  static readonly LABEL = "Assignments";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = AssignmentsWidget.ID;
    this.title.label = AssignmentsWidget.LABEL;
    this.title.caption = AssignmentsWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-code";
    this.update();
  }

  protected render(): React.ReactNode {
    // const assignmentName = `Odd or Even`;
    // The content of "assignment-container-i" will be dynamically showed where 'i' is the index number of the assignment
    let assignments: any = [];

    let assignmentsData = this.getData();

    assignmentsData.forEach((assignment: any) => {
      assignments.push(
        <div id="assignment-container-1">
          <AlertMessage type="INFO" header={assignment.title} />
          <div className="text description">
            Description: {assignment.description}
          </div>
          <div className="sub-heading deadline">
            Time: {assignment.solvingTime}
          </div>
          <button
            className="theia-button secondary"
            title="Attempt assignment"
            onClick={(_a) => this.attemptAssignment()}
          >
            Attempt
          </button>
        </div>
      );
    });

    return assignments;
    /* return (
      <div id="assignment-container-1">
        <AlertMessage type="INFO" header={assignmentName} />
        <div className="sub-heading language">Language: Python</div>
        <div className="sub-heading deadline">Deadline: 24th March, 2021</div>
        <div className="text description">
          Description: Ask the user for a number. Depending on whether the
          number is even or odd, print out an appropriate message to the user.
        </div>
        <button
          className="theia-button secondary"
          title="Attempt assignment"
          onClick={(_a) => this.attemptAssignment()}
        >
          Attempt
        </button>
      </div>
     
    ); */
  }

  private getData(): any {
    let rawJson = fs.readFileSync(kAssignmentsJsonPath, "utf-8");

    let assignmentsData = JSON.parse(rawJson);

    return assignmentsData;
  }

  private attemptAssignment(): void {
    this.dispose();
    if (this.workspaceService.opened) {
      const currentWorkspace = this.workspaceService.workspace?.resource;

      if (currentWorkspace != undefined) {
        this.workspaceService.close();
      }
    }

    let workSpaceUri: URI = new URI(
      "E:/Foundary/Lighthouse/workbench-01/resources/assignments"
    );
    console.info(workSpaceUri.path);
    this.workspaceService.open(workSpaceUri, {
      preserveWindow: true,
    });
    // Where '1' is the assignment number

    if (this.workspaceService.opened) {
      this.showMessage();
    }
  }

  protected generatePath(): string {
    let basePath = `${process.cwd()}`;
    let assignmentPath = "resources\\assignments\\assignment-1";

    let pathComponents = basePath.split("/");
    let path: string = "";

    pathComponents.forEach((pathItem) => {
      path += `${pathItem}\\`;
    });

    path += assignmentPath;

    return path;
  }
  protected showMessage(): void {
    // Issue as of now: Message being fast to appear and disappear, is not readable
    this.messageService.info(
      "Assignment workspace opened. Please open the assignment files from the Explorer pane."
    );
  }
}
