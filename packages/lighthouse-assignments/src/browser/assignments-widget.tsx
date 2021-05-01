import * as React from "react";
import { inject, injectable, postConstruct } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { AssignmentService } from "./assignment_service";
import { WorkspaceService } from "@theia/workspace/lib/browser"; // For handling the workspaces
import { MessageService } from "@theia/core";
import URI from "@theia/core/lib/common/uri"; // For opening the folder

@injectable()
export class AssignmentsWidget extends ReactWidget {
  static readonly ID = "assignments:widget";
  static readonly LABEL = "Assignments";

  // @inject(AssignmentService)
  // private readonly assignmentService: AssignmentService;
  @inject(MessageService)
  private readonly messageService: MessageService;

  @inject(WorkspaceService)
  private readonly workspaceService: WorkspaceService;

  private readonly assignmentService: AssignmentService;

  constructor() {
    super();
    this.assignmentService = new AssignmentService();
  }

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
    let assignments: any = [];
    let assignmentsData;
    try {
      assignmentsData = this.assignmentService.getAssignments();
    }
    catch (e) {
      console.error(`Error while firing the message service\n${e}`);
    }


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
            onClick={(_a) => {
              console.info(`Requesting assignment service to open the assignment...`);

              this.attemptAssignment(assignment.assignmentPath);

            }}
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

  public attemptAssignment(assignmentPath: string): void {
    console.info(`Openning assignment...`);

    try {
      // Close current workspace
      if (this.workspaceService.opened) {
        console.info(`A workspace is already openned`);
        const currentWorkspace = this.workspaceService.workspace?.resource;

        if (currentWorkspace != undefined) {
          console.info(`Closing current workspace`);
          this.workspaceService.close();
        }
      }

      // Open the selected assignment workspace
      let workSpaceUri: URI = new URI(
        this.assignmentService.resolveAssignmentPath(assignmentPath)
      );

      console.info(`Opening new workspace ${workSpaceUri.path}`);

      this.workspaceService.open(workSpaceUri, {
        preserveWindow: true,
      });
    } catch (e) {
      console.error(`Error while opening workspace\n${e}`)
    }

    this.workspaceService.onWorkspaceChanged((files) => {
      console.info(`Workspace changed!!!`);
      console.info(files.length);
    })

    setTimeout(() => {
      if (this.workspaceService.opened) {

        console.info(this.workspaceService.getWorkspaceRootUri);
      }
    }, 1500);

    this.dispose();

  }

  protected showMessage(): void {
    // Issue as of now: Message being fast to appear and disappear, is not readable
    this.messageService.info(
      "Assignment workspace opened. Please open the assignment files from the Explorer pane."
    );
  }

}
