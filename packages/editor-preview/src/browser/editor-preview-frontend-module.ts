/********************************************************************************
 * Copyright (C) 2018 Google and others.
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

import { OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import {ContainerModule} from 'inversify';
import { EditorPreviewManager } from './editor-preview-manager';
import { EditorPreviewWidgetFactory } from './editor-preview-factory';
import { bindEditorPreviewPreferences } from './editor-preview-preferences';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {

    bind(WidgetFactory).to(EditorPreviewWidgetFactory).inSingletonScope();

    bind(EditorPreviewManager).toSelf().inSingletonScope();
    bind(OpenHandler).to(EditorPreviewManager);

    bindEditorPreviewPreferences(bind);
});
