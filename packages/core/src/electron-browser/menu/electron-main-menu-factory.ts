/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as electron from 'electron';
import { inject, injectable } from 'inversify';
import {
    CommandRegistry, isOSX, ActionMenuNode, CompositeMenuNode,
    MAIN_MENU_BAR, MenuModelRegistry, MenuPath, MenuNode
} from '../../common';
import { Keybinding } from '../../common/keybinding';
import { PreferenceService, KeybindingRegistry } from '../../browser';
import { ContextKeyService } from '../../browser/context-key-service';
import debounce = require('lodash.debounce');
import { ContextMenuContext } from '../../browser/menu/context-menu-context';

/**
 * Representation of possible electron menu options.
 */
export interface ElectronMenuOptions {
    /**
     * Controls whether to render disabled menu items.
     * Defaults to `true`.
     */
    readonly showDisabled?: boolean;
}

@injectable()
export class ElectronMainMenuFactory {

    protected _menu: Electron.Menu | undefined;
    protected _toggledCommands: Set<string> = new Set();

    @inject(ContextKeyService)
    protected readonly contextKeyService: ContextKeyService;

    @inject(ContextMenuContext)
    protected readonly context: ContextMenuContext;

    constructor(
        @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry,
        @inject(PreferenceService) protected readonly preferencesService: PreferenceService,
        @inject(MenuModelRegistry) protected readonly menuProvider: MenuModelRegistry,
        @inject(KeybindingRegistry) protected readonly keybindingRegistry: KeybindingRegistry
    ) {
        preferencesService.onPreferenceChanged(debounce(() => {
            if (this._menu) {
                for (const item of this._toggledCommands) {
                    this._menu.getMenuItemById(item).checked = this.commandRegistry.isToggled(item);
                }
                electron.remote.getCurrentWindow().setMenu(this._menu);
            }
        }, 10));
        keybindingRegistry.onKeybindingsChanged(() => {
            const createdMenuBar = this.createMenuBar();
            if (isOSX) {
                electron.remote.Menu.setApplicationMenu(createdMenuBar);
            } else {
                electron.remote.getCurrentWindow().setMenu(createdMenuBar);
            }
        });
    }

    createMenuBar(): Electron.Menu {
        const menuModel = this.menuProvider.getMenu(MAIN_MENU_BAR);
        const template = this.fillMenuTemplate([], menuModel);
        if (isOSX) {
            template.unshift(this.createOSXMenu());
        }
        const menu = electron.remote.Menu.buildFromTemplate(template);
        this._menu = menu;
        return menu;
    }

    createContextMenu(menuPath: MenuPath, args?: any[]): Electron.Menu {
        const menuModel = this.menuProvider.getMenu(menuPath);
        const template = this.fillMenuTemplate([], menuModel, args, { showDisabled: false });
        return electron.remote.Menu.buildFromTemplate(template);
    }

    protected fillMenuTemplate(items: Electron.MenuItemConstructorOptions[],
        menuModel: CompositeMenuNode,
        args: any[] = [],
        options?: ElectronMenuOptions
    ): Electron.MenuItemConstructorOptions[] {
        const showDisabled = (options?.showDisabled === undefined) ? true : options?.showDisabled;
        for (const menu of menuModel.children) {
            if (menu instanceof CompositeMenuNode) {
                if (menu.children.length > 0) {
                    // do not render empty nodes

                    if (menu.isSubmenu) { // submenu node

                        const submenu = this.fillMenuTemplate([], menu, args, options);
                        if (submenu.length === 0) {
                            continue;
                        }

                        items.push({
                            label: menu.label,
                            submenu
                        });

                    } else { // group node

                        // process children
                        const submenu = this.fillMenuTemplate([], menu, args, options);
                        if (submenu.length === 0) {
                            continue;
                        }

                        if (items.length > 0) {
                            // do not put a separator above the first group

                            items.push({
                                type: 'separator'
                            });
                        }

                        // render children
                        items.push(...submenu);
                    }
                }
            } else if (menu instanceof ActionMenuNode) {
                const node = menu.altNode && this.context.altPressed ? menu.altNode : menu;
                const commandId = node.action.commandId;

                // That is only a sanity check at application startup.
                if (!this.commandRegistry.getCommand(commandId)) {
                    throw new Error(`Unknown command with ID: ${commandId}.`);
                }

                if (!this.commandRegistry.isVisible(commandId, ...args)
                    || (!!node.action.when && !this.contextKeyService.match(node.action.when))) {
                    continue;
                }

                // We should omit rendering context-menu items which are disabled.
                if (!showDisabled && !this.commandRegistry.isEnabled(commandId, ...args)) {
                    continue;
                }

                const bindings = this.keybindingRegistry.getKeybindingsForCommand(commandId);

                let accelerator;

                /* Only consider the first keybinding. */
                if (bindings.length > 0) {
                    const binding = bindings[0];
                    accelerator = this.acceleratorFor(binding);
                }

                items.push({
                    id: node.id,
                    label: node.label,
                    type: this.commandRegistry.getToggledHandler(commandId, ...args) ? 'checkbox' : 'normal',
                    checked: this.commandRegistry.isToggled(commandId, ...args),
                    enabled: true, // https://github.com/eclipse-theia/theia/issues/446
                    visible: true,
                    click: () => this.execute(commandId, args),
                    accelerator
                });
                if (this.commandRegistry.getToggledHandler(commandId, ...args)) {
                    this._toggledCommands.add(commandId);
                }
            } else {
                items.push(...this.handleDefault(menu, args, options));
            }
        }
        return items;
    }

    protected handleDefault(menuNode: MenuNode, args: any[] = [], options?: ElectronMenuOptions): Electron.MenuItemConstructorOptions[] {
        return [];
    }

    /**
     * Return a user visible representation of a keybinding.
     */
    protected acceleratorFor(keybinding: Keybinding): string {
        const bindingKeySequence = this.keybindingRegistry.resolveKeybinding(keybinding);
        // FIXME see https://github.com/electron/electron/issues/11740
        // Key Sequences can't be represented properly in the electron menu.
        //
        // We can do what VS Code does, and append the chords as a suffix to the menu label.
        // https://github.com/eclipse-theia/theia/issues/1199#issuecomment-430909480
        if (bindingKeySequence.length > 1) {
            return '';
        }

        const keyCode = bindingKeySequence[0];
        return this.keybindingRegistry.acceleratorForKeyCode(keyCode, '+');
    }

    protected async execute(command: string, args: any[]): Promise<void> {
        try {
            // This is workaround for https://github.com/eclipse-theia/theia/issues/446.
            // Electron menus do not update based on the `isEnabled`, `isVisible` property of the command.
            // We need to check if we can execute it.
            if (this.commandRegistry.isEnabled(command, ...args)) {
                await this.commandRegistry.executeCommand(command, ...args);
                if (this._menu && this.commandRegistry.isVisible(command, ...args)) {
                    this._menu.getMenuItemById(command).checked = this.commandRegistry.isToggled(command, ...args);
                    electron.remote.getCurrentWindow().setMenu(this._menu);
                }
            }
        } catch {
            // no-op
        }
    }

    protected createOSXMenu(): Electron.MenuItemConstructorOptions {
        return {
            label: 'Theia',
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideOthers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        };
    }

}
