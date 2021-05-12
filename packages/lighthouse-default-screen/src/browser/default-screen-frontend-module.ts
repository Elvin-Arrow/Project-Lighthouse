import { ContainerModule } from 'inversify';
import { DefaultScreenWidget } from './default-screen-widget';
import { DefaultScreenContribution } from './default-screen-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, DefaultScreenContribution);
    bind(FrontendApplicationContribution).toService(DefaultScreenContribution);
    bind(DefaultScreenWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: DefaultScreenWidget.ID,
        createWidget: () => ctx.container.get<DefaultScreenWidget>(DefaultScreenWidget)
    })).inSingletonScope();
});
