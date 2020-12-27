import { ContainerModule } from 'inversify';
import { WidgetTestWidget } from './widget-test-widget';
import { WidgetTestContribution } from './widget-test-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    FrontendApplicationContribution
    bindViewContribution(bind, WidgetTestContribution);
    bind(FrontendApplicationContribution).toService(WidgetTestContribution);
    bind(WidgetTestWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: WidgetTestWidget.ID,
        createWidget: () => ctx.container.get<WidgetTestWidget>(WidgetTestWidget)
    })).inSingletonScope();
});
