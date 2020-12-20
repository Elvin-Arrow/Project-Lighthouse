/********************************************************************************
 * Copyright (C) 2017-2018 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import '../../src/browser/styles/index.css';

import { ContainerModule, interfaces } from 'inversify';
import { SearchInWorkspaceService, SearchInWorkspaceClientImpl } from './search-in-workspace-service';
import { SearchInWorkspaceServer, SIW_WS_PATH } from '../common/search-in-workspace-interface';
import {
    WebSocketConnectionProvider, WidgetFactory, createTreeContainer, TreeWidget, bindViewContribution, FrontendApplicationContribution, LabelProviderContribution
} from '@theia/core/lib/browser';
import { ResourceResolver } from '@theia/core';
import { SearchInWorkspaceWidget } from './search-in-workspace-widget';
import { SearchInWorkspaceResultTreeWidget } from './search-in-workspace-result-tree-widget';
import { SearchInWorkspaceFrontendContribution } from './search-in-workspace-frontend-contribution';
import { InMemoryTextResourceResolver } from './in-memory-text-resource';
import { SearchInWorkspaceContextKeyService } from './search-in-workspace-context-key-service';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { bindSearchInWorkspacePreferences } from './search-in-workspace-preferences';
import { SearchInWorkspaceLabelProvider } from './search-in-workspace-label-provider';

export default new ContainerModule(bind => {
    bind(SearchInWorkspaceContextKeyService).toSelf().inSingletonScope();

    bind(SearchInWorkspaceWidget).toSelf();
    bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
        id: SearchInWorkspaceWidget.ID,
        createWidget: () => ctx.container.get(SearchInWorkspaceWidget)
    }));
    bind(SearchInWorkspaceResultTreeWidget).toDynamicValue(ctx => createSearchTreeWidget(ctx.container));

    bindViewContribution(bind, SearchInWorkspaceFrontendContribution);
    bind(FrontendApplicationContribution).toService(SearchInWorkspaceFrontendContribution);
    bind(TabBarToolbarContribution).toService(SearchInWorkspaceFrontendContribution);

    // The object that gets notified of search results.
    bind(SearchInWorkspaceClientImpl).toSelf().inSingletonScope();

    bind(SearchInWorkspaceService).toSelf().inSingletonScope();

    // The object to call methods on the backend.
    bind(SearchInWorkspaceServer).toDynamicValue(ctx => {
        const client = ctx.container.get(SearchInWorkspaceClientImpl);
        return WebSocketConnectionProvider.createProxy(ctx.container, SIW_WS_PATH, client);
    }).inSingletonScope();

    bind(InMemoryTextResourceResolver).toSelf().inSingletonScope();
    bind(ResourceResolver).toService(InMemoryTextResourceResolver);

    bindSearchInWorkspacePreferences(bind);

    bind(SearchInWorkspaceLabelProvider).toSelf().inSingletonScope();
    bind(LabelProviderContribution).toService(SearchInWorkspaceLabelProvider);
});

export function createSearchTreeWidget(parent: interfaces.Container): SearchInWorkspaceResultTreeWidget {
    const child = createTreeContainer(parent);

    child.unbind(TreeWidget);
    child.bind(SearchInWorkspaceResultTreeWidget).toSelf();

    return child.get(SearchInWorkspaceResultTreeWidget);
}
