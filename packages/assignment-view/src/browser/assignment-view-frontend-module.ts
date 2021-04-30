/**
 * Generated using theia-extension-generator
 */
import { AssignmentViewCommandContribution, AssignmentViewMenuContribution } from './assignment-view-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(AssignmentViewCommandContribution);
    bind(MenuContribution).to(AssignmentViewMenuContribution);
});
