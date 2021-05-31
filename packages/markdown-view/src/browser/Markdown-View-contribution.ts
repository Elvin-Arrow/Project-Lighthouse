import { injectable } from 'inversify';
import { MarkdownViewWidget } from './Markdown-View-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';


export const MarkdownViewCommand: Command = { id: 'Markdown-View:command' };

@injectable()
export class MarkdownViewContribution extends AbstractViewContribution<MarkdownViewWidget> {

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
            widgetId: MarkdownViewWidget.ID,
            widgetName: MarkdownViewWidget.LABEL,
            defaultWidgetOptions: { area: 'main', mode: 'open-to-right' },
            toggleCommandId: MarkdownViewCommand.id
        });
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
        commands.registerCommand(MarkdownViewCommand, {
            execute: () =>
                super.openView({ activate: false, reveal: true })
        });
    }


}
