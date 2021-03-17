import { ContainerModule } from 'inversify';
import { AssignmentsWidget } from './assignments-widget';
import { AssignmentsContribution } from './assignments-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, AssignmentsContribution);
    bind(FrontendApplicationContribution).toService(AssignmentsContribution);
    bind(AssignmentsWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: AssignmentsWidget.ID,
        createWidget: () => ctx.container.get<AssignmentsWidget>(AssignmentsWidget)
    })).inSingletonScope();
});
