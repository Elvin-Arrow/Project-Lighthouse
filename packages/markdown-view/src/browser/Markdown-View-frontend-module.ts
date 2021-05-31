import { ContainerModule } from 'inversify';
import { MarkdownViewWidget } from './Markdown-View-widget';
import { MarkdownViewContribution } from './Markdown-View-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, MarkdownViewContribution);
    bind(FrontendApplicationContribution).toService(MarkdownViewContribution);
    bind(MarkdownViewWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: MarkdownViewWidget.ID,
        createWidget: () => ctx.container.get<MarkdownViewWidget>(MarkdownViewWidget)
    })).inSingletonScope();
});
