import { ContainerModule } from 'inversify';
import { ResourcesPythonWidget } from './resources-python-widget';
import { ResourcesPythonContribution } from './resources-python-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, ResourcesPythonContribution);
    bind(FrontendApplicationContribution).toService(ResourcesPythonContribution);
    bind(ResourcesPythonWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ResourcesPythonWidget.ID,
        createWidget: () => ctx.container.get<ResourcesPythonWidget>(ResourcesPythonWidget)
    })).inSingletonScope();
});
