import * as React from "react";
import { inject, injectable, postConstruct } from "inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { AssignmentService } from "./assignment_service";
import { WorkspaceService } from "@theia/workspace/lib/browser"; // For handling the workspaces
import { MessageService } from "@theia/core";
import URI from "@theia/core/lib/common/uri"; // For opening the folder
import Store = require("electron-store");

@injectable()
export class AssignmentsWidget extends ReactWidget {
  static readonly ID = "assignments:widget";
  static readonly LABEL = "Assignments";

  private readonly store: Store = new Store();

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
    let assignmentsData: Record<string, any>[];
    try {
      assignmentsData = this.assignmentService.getAssignments();
      assignmentsData.forEach((assignment) => {
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

                this.attemptAssignment(assignment);

              }}
            >
              Attempt
            </button>
          </div>
        );
      });
    }
    catch (e) {
      console.error(`Error while firing the message service\n${e}`);
    }




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

  public attemptAssignment(assignment: Record<string, any>): void {
    console.info(`Openning assignment...`);
    let flag = true;
    // Create assignment files if not already exisitng
    if (!this.assignmentService.assignmentFilesExist(assignment.name)) {
      flag = this.assignmentService.createAssignmentFiles(assignment);
    }

    if (flag) {
      this.assignmentService.curateAssignmentStats();
      // Acquire assignment path
      let assignmentPath = this.assignmentService.resolveAssignmentPath(assignment.name);

      try {
        // Close current workspace
        if (this.workspaceService.opened) {
          const currentWorkspace = this.workspaceService.workspace?.resource;

          if (currentWorkspace != undefined) {
            this.workspaceService.close();
          }
        }

        // Open the selected assignment workspace
        this.workspaceService.open(new URI().resolve(assignmentPath), {
          preserveWindow: true,
        });
        this.store.set('assignmentId', assignment.id);
        this.store.set('assignmentName', assignment.name);
        this.store.set('assignmentArea', assignment.area);

      } catch (e) {
        console.error(`Error while opening workspace\n${e}`);
      }

      this.workspaceService.onWorkspaceChanged((files) => {
        if (this.assignmentService.isAssignmentWorkspace(files)) {
          this.store.set('isAssignmentWorkspace', true);
        } else {
          this.store.set('isAssignmentWorkspace', false);
          this.store.set('assignmentId', null);
          this.store.set('assignmentName', null);
          this.store.set('assignmentArea', null);
        }
        console.info(`Workspace changed!!!`);
        console.info(files.length);
      });

      this.dispose();
    } else {
      this.messageService.info(
        "Could not open the assignment"
      );
    }



  }
}
