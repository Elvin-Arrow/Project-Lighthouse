import { ContainerModule } from 'inversify';
import { LighthouseAuthenticateWidget } from './lighthouse-authenticate-widget';
import { LighthouseAuthenticateContribution } from './lighthouse-authenticate-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, LighthouseAuthenticateContribution);
    bind(FrontendApplicationContribution).toService(LighthouseAuthenticateContribution);
    bind(LighthouseAuthenticateWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: LighthouseAuthenticateWidget.ID,
        createWidget: () => ctx.container.get<LighthouseAuthenticateWidget>(LighthouseAuthenticateWidget)
    })).inSingletonScope();
});
