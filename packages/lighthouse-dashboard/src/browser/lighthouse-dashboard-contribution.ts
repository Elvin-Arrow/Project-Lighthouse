import { injectable, inject } from "inversify";
import { LighthouseDashboardWidget } from "./lighthouse-dashboard-widget";
import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import Store = require("electron-store");

export const LighthouseDashboardCommand: Command = {
  id: "lighthouse-dashboard:command",
};

@injectable()
export class LighthouseDashboardContribution extends AbstractViewContribution<
LighthouseDashboardWidget
> implements FrontendApplicationContribution {

  @inject(FrontendApplicationStateService)
  protected readonly stateService: FrontendApplicationStateService;

  private readonly store: Store;

  /**
   * `AbstractViewContribution` handles the creation and registering
   *  of the widget including commands, menus, and keybindings.
   *
   * We can pass `defaultWidgetOptions` which define widget properties such as
   * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
   *
   */
  constructor() {
    super({
      widgetId: LighthouseDashboardWidget.ID,
      widgetName: LighthouseDashboardWidget.LABEL,
      defaultWidgetOptions: { area: "main" },
      toggleCommandId: LighthouseDashboardCommand.id,
    });

    this.store = new Store();
  }

  async onStart(app: FrontendApplication): Promise<void> {
    if (this.store.get('authenticated')) {
      this.stateService.reachedState('ready').then(
        () => this.openView({ reveal: true })
      );
    }
  }

  /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(LighthouseDashboardCommand, {
      execute: () =>
        super.openView({ activate: false, reveal: true, toggle: true }),
    });
  }
}
