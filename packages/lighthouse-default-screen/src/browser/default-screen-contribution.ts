import { injectable } from "inversify";
import { DefaultScreenWidget } from "./default-screen-widget";
import {
  AbstractViewContribution,
  FrontendApplication,
  FrontendApplicationContribution,
} from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";

export const DefaultScreenCommand: Command = {
  id: "default-screen:command",
  label: "Default screen",
};

@injectable()
export class DefaultScreenContribution
  extends AbstractViewContribution<DefaultScreenWidget>
  implements FrontendApplicationContribution {
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
      widgetId: DefaultScreenWidget.ID,
      widgetName: DefaultScreenWidget.LABEL,
      defaultWidgetOptions: { area: "main" },
      toggleCommandId: DefaultScreenCommand.id,
    });
  }
  async initializeLayout(app: FrontendApplication) {
    this.openView();
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
    commands.registerCommand(DefaultScreenCommand, {
      execute: () => super.openView({ activate: false, reveal: true }),
    });
  }
}
