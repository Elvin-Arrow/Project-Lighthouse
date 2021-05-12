/**
 * Generated using theia-extension-generator
 */
import { LighthouseObserverCommandContribution, LighthouseObserverMenuContribution } from './lighthouse-observer-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(LighthouseObserverCommandContribution);
    bind(MenuContribution).to(LighthouseObserverMenuContribution);
});
