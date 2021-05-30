/**
 * Generated using theia-extension-generator
 */
import { LighthouseCrnlCommandContribution, LighthouseTabBarToolbarContribution } from './lighthouse-crnl-contribution';
import {
    CommandContribution,
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(LighthouseCrnlCommandContribution);
    bind(TabBarToolbarContribution).to(LighthouseTabBarToolbarContribution);

});
