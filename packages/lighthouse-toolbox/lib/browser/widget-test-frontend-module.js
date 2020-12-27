"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var widget_test_widget_1 = require("./widget-test-widget");
var widget_test_contribution_1 = require("./widget-test-contribution");
var browser_1 = require("@theia/core/lib/browser");
require("../../src/browser/style/index.css");
exports.default = new inversify_1.ContainerModule(function (bind) {
    browser_1.FrontendApplicationContribution;
    browser_1.bindViewContribution(bind, widget_test_contribution_1.WidgetTestContribution);
    bind(browser_1.FrontendApplicationContribution).toService(widget_test_contribution_1.WidgetTestContribution);
    bind(widget_test_widget_1.WidgetTestWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(function (ctx) { return ({
        id: widget_test_widget_1.WidgetTestWidget.ID,
        createWidget: function () { return ctx.container.get(widget_test_widget_1.WidgetTestWidget); }
    }); }).inSingletonScope();
});
//# sourceMappingURL=widget-test-frontend-module.js.map