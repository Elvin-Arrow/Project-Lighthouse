import { ContainerModule } from 'inversify';
import { LighthouseResourcesWidget } from './lighthouse-resources-widget';
import { LighthouseResourcesContribution } from './lighthouse-resources-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, LighthouseResourcesContribution);
    bind(FrontendApplicationContribution).toService(LighthouseResourcesContribution);
    bind(LighthouseResourcesWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: LighthouseResourcesWidget.ID,
        createWidget: () => ctx.container.get<LighthouseResourcesWidget>(LighthouseResourcesWidget)
    })).inSingletonScope();
});
