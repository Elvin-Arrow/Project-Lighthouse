import { ContainerModule } from 'inversify';
import { ResourcesCppWidget } from './resources-cpp-widget';
import { ResourcesCppContribution } from './resources-cpp-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, ResourcesCppContribution);
    bind(FrontendApplicationContribution).toService(ResourcesCppContribution);
    bind(ResourcesCppWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ResourcesCppWidget.ID,
        createWidget: () => ctx.container.get<ResourcesCppWidget>(ResourcesCppWidget)
    })).inSingletonScope();
});
