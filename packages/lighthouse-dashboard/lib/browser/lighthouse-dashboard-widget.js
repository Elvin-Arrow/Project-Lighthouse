"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LighthouseDashboardWidget = void 0;
var React = require("react");
var inversify_1 = require("inversify");
var alert_message_1 = require("@theia/core/lib/browser/widgets/alert-message");
var react_widget_1 = require("@theia/core/lib/browser/widgets/react-widget");
var core_1 = require("@theia/core");
var model_1 = require("./model");
var LighthouseDashboardWidget = /** @class */ (function (_super) {
    __extends(LighthouseDashboardWidget, _super);
    function LighthouseDashboardWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LighthouseDashboardWidget_1 = LighthouseDashboardWidget;
    LighthouseDashboardWidget.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                this.id = LighthouseDashboardWidget_1.ID;
                this.title.label = LighthouseDashboardWidget_1.LABEL;
                this.title.caption = LighthouseDashboardWidget_1.LABEL;
                this.title.closable = true;
                this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
                this.update();
                return [2 /*return*/];
            });
        });
    };
    LighthouseDashboardWidget.prototype.render = function () {
        var _this = this;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://127.0.0.1:5000/dash/", false);
        xmlHttp.send(null);
        var rawJson = xmlHttp.response;
        var data = JSON.parse(rawJson);
        var table = this.getTable(data);
        var header = "Welcome to the Lighthouse Dashboard!";
        return React.createElement("div", { id: 'widget-container' },
            React.createElement(alert_message_1.AlertMessage, { type: 'INFO', header: header }),
            React.createElement("div", null,
                React.createElement("h1", null, "Lighthouse Dashoard")),
            React.createElement("div", { className: 'main-area' }, table),
            React.createElement("div", { className: 'sidebar' },
                React.createElement("div", { className: 'links' },
                    React.createElement("h2", null, "Useful links"),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("a", { href: '//devdocs.io/python/' }, "Python documentation")),
                        React.createElement("li", null,
                            React.createElement("a", { href: '//devdocs.io/cpp/' }, "C++ documentation")))),
                React.createElement("div", null,
                    React.createElement("h2", null, "Assignments"),
                    React.createElement("button", { className: 'theia-button secondary', title: 'Attempt assignments', onClick: function (_a) { return _this.attemptAssignments(); } }, "Attempt assignments"))));
    };
    LighthouseDashboardWidget.prototype.getTable = function (data) {
        var rows = [];
        for (var i = 0; i < data.length; ++i) {
            var model = new model_1.Model(data[i]);
            rows.push(React.createElement("tr", null,
                React.createElement("td", null, model.ID),
                React.createElement("td", null, model.CompileCount),
                React.createElement("td", null, model.Error),
                React.createElement("td", null, model.Language)));
        }
        var temp = React.createElement("table", { id: 'table1' },
            React.createElement("tr", null,
                React.createElement("th", null, "Sr Number"),
                React.createElement("th", null, "Number of compiles"),
                React.createElement("th", null, "Errors"),
                React.createElement("th", null, "Language")),
            rows);
        return temp;
    };
    LighthouseDashboardWidget.prototype.attemptAssignments = function () {
        this.messageService.info('Soon you would be able to attempt assignments within Lighthouse!');
    };
    LighthouseDashboardWidget.prototype.displayMessage = function () {
        this.messageService.info('Congratulations: Lighthouse Dashboard Widget Successfully Created!');
    };
    var LighthouseDashboardWidget_1;
    LighthouseDashboardWidget.ID = 'lighthouse-dashboard:widget';
    LighthouseDashboardWidget.LABEL = 'Lighthouse Dashboard';
    __decorate([
        inversify_1.inject(core_1.MessageService),
        __metadata("design:type", core_1.MessageService)
    ], LighthouseDashboardWidget.prototype, "messageService", void 0);
    __decorate([
        inversify_1.postConstruct(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], LighthouseDashboardWidget.prototype, "init", null);
    LighthouseDashboardWidget = LighthouseDashboardWidget_1 = __decorate([
        inversify_1.injectable()
    ], LighthouseDashboardWidget);
    return LighthouseDashboardWidget;
}(react_widget_1.ReactWidget));
exports.LighthouseDashboardWidget = LighthouseDashboardWidget;
//# sourceMappingURL=lighthouse-dashboard-widget.js.map