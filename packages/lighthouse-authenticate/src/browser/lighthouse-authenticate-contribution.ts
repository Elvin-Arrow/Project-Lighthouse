import { injectable } from 'inversify';
import { MenuModelRegistry } from '@theia/core';
import { LighthouseAuthenticateWidget } from './lighthouse-authenticate-widget';
import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import Store = require("electron-store");

export const LighthouseAuthenticateCommand: Command = { id: 'lighthouse-authenticate:command', label: 'Lighthouse authenticate' };

@injectable()
export class LighthouseAuthenticateContribution extends AbstractViewContribution<LighthouseAuthenticateWidget> implements FrontendApplicationContribution {

    private store: Store;
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
            widgetId: LighthouseAuthenticateWidget.ID,
            widgetName: LighthouseAuthenticateWidget.LABEL,
            defaultWidgetOptions: { area: 'main' },
            toggleCommandId: LighthouseAuthenticateCommand.id
        });
        this.store = new Store();
    }

    // Show widget on start
    async initializeLayout(app: FrontendApplication): Promise<void> {
        let authStatus = this.store.get('authenticated');

        if (authStatus == true) {
            return;
        }
        await this.openView();
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
        commands.registerCommand(LighthouseAuthenticateCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
