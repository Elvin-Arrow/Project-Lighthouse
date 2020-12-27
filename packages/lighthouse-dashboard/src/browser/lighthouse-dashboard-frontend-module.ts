import { ContainerModule } from 'inversify';
import { LighthouseDashboardWidget } from './lighthouse-dashboard-widget';
import { LighthouseDashboardContribution } from './lighthouse-dashboard-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, LighthouseDashboardContribution);
    bind(FrontendApplicationContribution).toService(LighthouseDashboardContribution);
    bind(LighthouseDashboardWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: LighthouseDashboardWidget.ID,
        createWidget: () => ctx.container.get<LighthouseDashboardWidget>(LighthouseDashboardWidget)
    })).inSingletonScope();
});
