"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var lighthouse_dashboard_widget_1 = require("./lighthouse-dashboard-widget");
var lighthouse_dashboard_contribution_1 = require("./lighthouse-dashboard-contribution");
var browser_1 = require("@theia/core/lib/browser");
require("../../src/browser/style/index.css");
exports.default = new inversify_1.ContainerModule(function (bind) {
    browser_1.bindViewContribution(bind, lighthouse_dashboard_contribution_1.LighthouseDashboardContribution);
    bind(browser_1.FrontendApplicationContribution).toService(lighthouse_dashboard_contribution_1.LighthouseDashboardContribution);
    bind(lighthouse_dashboard_widget_1.LighthouseDashboardWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(function (ctx) { return ({
        id: lighthouse_dashboard_widget_1.LighthouseDashboardWidget.ID,
        createWidget: function () { return ctx.container.get(lighthouse_dashboard_widget_1.LighthouseDashboardWidget); }
    }); }).inSingletonScope();
});
//# sourceMappingURL=lighthouse-dashboard-frontend-module.js.map