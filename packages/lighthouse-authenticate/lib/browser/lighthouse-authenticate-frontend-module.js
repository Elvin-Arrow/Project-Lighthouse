"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var lighthouse_authenticate_widget_1 = require("./lighthouse-authenticate-widget");
var lighthouse_authenticate_contribution_1 = require("./lighthouse-authenticate-contribution");
var browser_1 = require("@theia/core/lib/browser");
require("../../src/browser/style/index.css");
exports.default = new inversify_1.ContainerModule(function (bind) {
    browser_1.bindViewContribution(bind, lighthouse_authenticate_contribution_1.LighthouseAuthenticateContribution);
    bind(browser_1.FrontendApplicationContribution).toService(lighthouse_authenticate_contribution_1.LighthouseAuthenticateContribution);
    bind(lighthouse_authenticate_widget_1.LighthouseAuthenticateWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(function (ctx) { return ({
        id: lighthouse_authenticate_widget_1.LighthouseAuthenticateWidget.ID,
        createWidget: function () { return ctx.container.get(lighthouse_authenticate_widget_1.LighthouseAuthenticateWidget); }
    }); }).inSingletonScope();
});
//# sourceMappingURL=lighthouse-authenticate-frontend-module.js.map