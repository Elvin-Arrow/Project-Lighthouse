import { injectable, interfaces, Container } from 'inversify';
import { MenuModelRegistry } from '@theia/core';
import { WidgetTestWidget } from './lighthouse-toolbox';
import { AbstractViewContribution, CommonMenus, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { SourceTreeWidget } from '@theia/core/lib/browser/source-tree';

export const WidgetTestCommand: Command = { id: 'widget-test:command' };

@injectable()
export class WidgetTestContribution extends AbstractViewContribution<WidgetTestWidget> implements FrontendApplicationContribution {



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
            widgetId: WidgetTestWidget.ID,
            widgetName: WidgetTestWidget.LABEL,
            defaultWidgetOptions: { area: 'right' },
            toggleCommandId: WidgetTestCommand.id
        });
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
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
        commands.registerCommand(WidgetTestCommand, {
            execute: () => super.openView({ activate: true, reveal: true })
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
        // super.registerMenus(menus);
        menus.registerMenuAction(CommonMenus.VIEW, {
            commandId: WidgetTestCommand.id,
            label: WidgetTestWidget.LABEL,
        });
    }
}

@injectable()
export class AssignmentsWidget extends SourceTreeWidget {
    static createContainer(parent: interfaces.Container): Container {
        const child = SourceTreeWidget.createContainer(parent, {
            virtualized: false,
            scrollIfActive: true
        });

        child.unbind(SourceTreeWidget);

        return child;
    }

    static createWidget(parent: interfaces.Container): AssignmentsWidget {
        return AssignmentsWidget.createContainer(parent).get(AssignmentsWidget);
    }
}