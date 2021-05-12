import { injectable } from 'inversify';
import { MenuModelRegistry } from '@theia/core';
import { LighthouseResourcesWidget } from './lighthouse-resources-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';

export const LighthouseResourcesCommand: Command = { id: 'lighthouse-resources:command' };

@injectable()
export class LighthouseResourcesContribution extends AbstractViewContribution<LighthouseResourcesWidget> {

    constructor() {
        super({
            widgetId: LighthouseResourcesWidget.ID,
            widgetName: LighthouseResourcesWidget.LABEL,
            defaultWidgetOptions: { area: 'main' },
            toggleCommandId: LighthouseResourcesCommand.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(LighthouseResourcesCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
