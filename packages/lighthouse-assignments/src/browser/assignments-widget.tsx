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
          <div id="assignment-container-1 pad">
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

        console.info(`Setting assignment info as\nAssignment ID: ${assignment.id}\nAssignment name: ${assignment.name}\nAssignment area: ${assignment.area}`);

        this.store.set('assignmentId', assignment.id);
        this.store.set('assignmentName', assignment.name);
        this.store.set('assignmentArea', assignment.area);
        this.store.set('isAssignmentWorkspace', true);

      } catch (e) {
        console.error(`Error while opening workspace\n${e}`);
      }

      this.dispose();
    } else {
      this.messageService.info(
        "Could not open the assignment"
      );
    }
  }
}
