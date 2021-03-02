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
exports.AuthView = exports.LighthouseAuthenticateWidget = void 0;
var React = require("react");
var inversify_1 = require("inversify");
var react_widget_1 = require("@theia/core/lib/browser/widgets/react-widget");
var core_1 = require("@theia/core");
var browser_1 = require("@theia/workspace/lib/browser");
var Store = require("electron-store");
var path = require("path");
var LighthouseAuthenticateWidget = /** @class */ (function (_super) {
    __extends(LighthouseAuthenticateWidget, _super);
    function LighthouseAuthenticateWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.store = new Store();
        _this.password = new String();
        return _this;
    }
    LighthouseAuthenticateWidget_1 = LighthouseAuthenticateWidget;
    LighthouseAuthenticateWidget.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                this.id = LighthouseAuthenticateWidget_1.ID;
                this.title.label = LighthouseAuthenticateWidget_1.LABEL;
                this.title.caption = LighthouseAuthenticateWidget_1.LABEL;
                this.title.closable = true;
                this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
                this.update();
                return [2 /*return*/];
            });
        });
    };
    LighthouseAuthenticateWidget.prototype.render = function () {
        var _this = this;
        var lighthouseImagePath = path.join("media", "lighthouse.svg");
        console.log(lighthouseImagePath);
        return (React.createElement("div", { id: "login" },
            React.createElement("h1", { className: "text-center text-white pt-5" }, "Lighthouse Services"),
            React.createElement("p", { className: "text-center text-white m-3" }, "Please log in to continue."),
            React.createElement("div", { className: "container" },
                React.createElement("div", { id: "login-row", className: "row justify-content-center align-items-center" },
                    React.createElement("div", { id: "login-column", className: "col-md-6" },
                        React.createElement("div", { id: "login-box", className: "col-md-12" },
                            React.createElement("form", { id: "login-form", className: "form", action: "", method: "post" },
                                React.createElement("div", { className: "form-group" },
                                    React.createElement("label", { htmlFor: "username", className: "text-info" }, "Username:"),
                                    React.createElement("br", null),
                                    React.createElement("input", { type: "text", name: "username", id: "usernameInput", className: "form-control", onChange: this.updatePassword, ref: function (e) { return console.info(e === null || e === void 0 ? void 0 : e.textContent); } })),
                                React.createElement("div", { className: "form-group" },
                                    React.createElement("label", { htmlFor: "password", className: "text-info" }, "Password:"),
                                    React.createElement("br", null),
                                    React.createElement("input", { type: "password", name: "password", id: "passwordInput", className: "form-control", ref: function (c) {
                                            _this.username = c === null || c === void 0 ? void 0 : c.value;
                                            console.info("c-value: " + (c === null || c === void 0 ? void 0 : c.value));
                                        } })),
                                React.createElement("div", { className: "form-group" },
                                    React.createElement("button", { type: "button", className: "theia-button secondary btn btn-info btn-md", title: "Login", onClick: function (_a) {
                                            _this.authenticate();
                                        } }, "Login")))))))));
    };
    LighthouseAuthenticateWidget.prototype.displayMessage = function () {
        this.messageService.info("Congratulations: LighthouseAuthenticate Widget Successfully Created!");
    };
    LighthouseAuthenticateWidget.prototype.onSubmit = function (e) {
        e.preventDefault();
        var username = this.username;
        console.log(username);
    };
    LighthouseAuthenticateWidget.prototype.updatePassword = function (event) {
        this.password = event.target.value;
        console.info("Updated password to: " + this.password);
    };
    LighthouseAuthenticateWidget.prototype.authenticate = function () {
        console.info("Got " + this.username + " as username and " + this.password + " as password");
        if (this.username == "student" && this.password == "123456") {
            this.store.set("authenticated", true);
            this.refreshWorkspace();
            this.dispose();
        }
    };
    LighthouseAuthenticateWidget.prototype.refreshWorkspace = function () {
        var _b;
        if (this.workspaceService.opened) {
            var currentWorkspace = (_b = this.workspaceService.workspace) === null || _b === void 0 ? void 0 : _b.resource;
            if (currentWorkspace != undefined) {
                this.workspaceService.close();
                this.workspaceService.open(currentWorkspace);
            }
        }
    };
    var LighthouseAuthenticateWidget_1;
    LighthouseAuthenticateWidget.ID = "lighthouse-authenticate:widget";
    LighthouseAuthenticateWidget.LABEL = "LighthouseAuthenticate Widget";
    __decorate([
        inversify_1.inject(core_1.MessageService),
        __metadata("design:type", core_1.MessageService)
    ], LighthouseAuthenticateWidget.prototype, "messageService", void 0);
    __decorate([
        inversify_1.inject(browser_1.WorkspaceService),
        __metadata("design:type", browser_1.WorkspaceService)
    ], LighthouseAuthenticateWidget.prototype, "workspaceService", void 0);
    __decorate([
        inversify_1.postConstruct(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], LighthouseAuthenticateWidget.prototype, "init", null);
    LighthouseAuthenticateWidget = LighthouseAuthenticateWidget_1 = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [Object])
    ], LighthouseAuthenticateWidget);
    return LighthouseAuthenticateWidget;
}(react_widget_1.ReactWidget));
exports.LighthouseAuthenticateWidget = LighthouseAuthenticateWidget;
var AuthView = /** @class */ (function (_super) {
    __extends(AuthView, _super);
    function AuthView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            username: "",
            password: "",
        };
        return _this;
    }
    AuthView.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { id: "login" },
                React.createElement("h1", { className: "text-center text-white pt-5" }, "Lighthouse Services"),
                React.createElement("p", { className: "text-center text-white m-3" }, "Please log in to continue."),
                React.createElement("div", { className: "container" },
                    React.createElement("div", { id: "login-row", className: "row justify-content-center align-items-center" },
                        React.createElement("div", { id: "login-column", className: "col-md-6" },
                            React.createElement("div", { id: "login-box", className: "col-md-12" },
                                React.createElement("form", { id: "login-form", className: "form", action: "", method: "post" },
                                    React.createElement("div", { className: "form-group" },
                                        React.createElement("label", { htmlFor: "username", className: "text-info" }, "Username:"),
                                        React.createElement("br", null),
                                        React.createElement("input", { type: "text", name: "username", id: "usernameInput", className: "form-control", onChange: this.updateUsername })),
                                    React.createElement("div", { className: "form-group" },
                                        React.createElement("label", { htmlFor: "password", className: "text-info" }, "Password:"),
                                        React.createElement("br", null),
                                        React.createElement("input", { type: "password", name: "password", id: "passwordInput", className: "form-control", ref: function (c) {
                                                // this.username = c?.value
                                                console.info("c-value: " + (c === null || c === void 0 ? void 0 : c.value));
                                            } })),
                                    React.createElement("div", { className: "form-group" },
                                        React.createElement("button", { type: "button", className: "theia-button secondary btn btn-info btn-md", title: "Login", onClick: function (_a) {
                                                // this.authenticate();
                                            } }, "Login"))))))))));
    };
    AuthView.prototype.updateUsername = function (e) {
        this.setState({
            username: e.currentTarget.value
        });
    };
    return AuthView;
}(React.Component));
exports.AuthView = AuthView;
//# sourceMappingURL=lighthouse-authenticate-widget.js.map