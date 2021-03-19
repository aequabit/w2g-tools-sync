// ==UserScript==
// @name         watch2gether Tools
// @version      1.1
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var _this = this;
var w2g;
(function (w2g) {
    var sync;
    (function (sync) {
        ;
        var helper = /** @class */ (function () {
            function helper() {
            }
            helper.is_url = function (str) {
                return typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://"));
            };
            return helper;
        }());
        sync.helper = helper;
        sync.default_state = function () { return ({ titles: {}, abort: false }); };
        var state_container = /** @class */ (function () {
            function state_container() {
            }
            state_container.state = sync.default_state();
            return state_container;
        }());
        sync.state_container = state_container;
        var client_storage = /** @class */ (function () {
            function client_storage() {
            }
            client_storage.get = function (key) {
                return localStorage.getItem(client_storage.STORAGE_PREFIX + key);
            };
            client_storage.set = function (key, value) {
                localStorage.setItem(client_storage.STORAGE_PREFIX + key, value.toString());
            };
            client_storage.STORAGE_PREFIX = "_w2g-sync-";
            return client_storage;
        }());
        sync.client_storage = client_storage;
        function http_request(url, query) {
            if (query === void 0) { query = null; }
            return __awaiter(this, void 0, void 0, function () {
                var sync_server_url, sync_server_token, response, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sync_server_url = client_storage.get("server-url");
                            sync_server_token = client_storage.get("server-token");
                            if (sync_server_url === null || sync_server_token === null)
                                throw new Error("Sync server not configured");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, fetch(sync_server_url + url + (query !== null ? "?" + new URLSearchParams(query) : ""), {
                                    method: 'GET',
                                    headers: __assign({ 'x-sync-token': sync_server_token }, (query !== null ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}))
                                })];
                        case 2:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            err_1 = _a.sent();
                            throw new Error("Request failed: " + err_1.message);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        sync.http_request = http_request;
        var api_client = /** @class */ (function () {
            function api_client() {
            }
            api_client.get_titles = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, http_request("/playlist/get-titles")];
                            case 1: return [2 /*return*/, (_a.sent()).titles];
                        }
                    });
                });
            };
            api_client.set_title = function (url, title) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, http_request("/playlist/set-title", { url: url, title: title })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            return api_client;
        }());
        sync.api_client = api_client;
        var internal = /** @class */ (function () {
            function internal() {
            }
            internal.is_video_editable = function (playlist_video) {
                var title_element = playlist_video.querySelector(".w2g-list-item-title");
                var original_title = playlist_video.getAttribute("w2g-original-title");
                if (original_title !== null && helper.is_url(original_title))
                    return true;
                return helper.is_url(title_element.innerText);
            };
            return internal;
        }());
        sync.internal = internal;
    })(sync = w2g.sync || (w2g.sync = {}));
})(w2g || (w2g = {}));
(function () { return __awaiter(_this, void 0, void 0, function () {
    var applySettings, renameVideo, createEditControls, setOnChangeHandler, setRemoveHandler, _a, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                applySettings = function (playlistVideos) {
                    var _loop_1 = function (playlistVideo) {
                        if (!(playlistVideo))
                            return "continue";
                        var titleElement = playlistVideo.querySelector(".w2g-list-item-title");
                        var originalTitle = playlistVideo.getAttribute("w2g-original-title") || titleElement.innerText;
                        playlistVideo.setAttribute("w2g-original-title", originalTitle);
                        var customTitleKey = Object.keys(w2g.sync.state_container.state.titles).find(function (x) { return x === originalTitle; });
                        if (customTitleKey === undefined)
                            return "continue";
                        titleElement.innerText = w2g.sync.state_container.state.titles[customTitleKey];
                    };
                    for (var _i = 0, playlistVideos_1 = playlistVideos; _i < playlistVideos_1.length; _i++) {
                        var playlistVideo = playlistVideos_1[_i];
                        _loop_1(playlistVideo);
                    }
                };
                renameVideo = function (playlistVideo, title) {
                    if (w2g.sync.helper.is_url(title)) {
                        alert("retard alert");
                        return;
                    }
                    var titleElement = playlistVideo.querySelector(".w2g-list-item-title");
                    var originalTitle = playlistVideo.getAttribute("w2g-original-title");
                    if (originalTitle === null)
                        playlistVideo.setAttribute("w2g-original-title", titleElement.innerText);
                    if (title.length === 0)
                        title = originalTitle;
                    w2g.sync.state_container.state.titles[originalTitle] = title;
                    titleElement.innerText = title;
                    w2g.sync.api_client.set_title(originalTitle, title)["catch"](function (err) {
                        alert("Failed to rename video: " + err.message + "\nEdit sync settings to retry");
                        w2g.sync.state_container.state.abort = true;
                    });
                };
                createEditControls = function (playlistVideos) {
                    var _loop_2 = function (playlistVideo) {
                        if (!w2g.sync.internal.is_video_editable(playlistVideo))
                            return "continue";
                        var titleElement = playlistVideo.querySelector(".w2g-list-item-title.mod-player");
                        var actionsElement = titleElement.parentElement.querySelector(".w2g-list-item-actions");
                        if (actionsElement === null)
                            return "continue";
                        if (actionsElement.querySelector(".w2g-title-edit") !== null)
                            return "continue";
                        var editButton = document.createElement("a");
                        editButton.className = "w2g-title-edit";
                        editButton.style = "margin-right: 5px;";
                        editButton.href = "#";
                        editButton.innerText = "edit";
                        editButton.onclick = function (e) {
                            return renameVideo(e.target.parentElement.parentElement, prompt("New title:", titleElement.innerText));
                        };
                        actionsElement.prepend(editButton);
                    };
                    for (var _i = 0, playlistVideos_2 = playlistVideos; _i < playlistVideos_2.length; _i++) {
                        var playlistVideo = playlistVideos_2[_i];
                        _loop_2(playlistVideo);
                    }
                };
                setOnChangeHandler = function () {
                    var dragged = null;
                    document.addEventListener("dragstart", function (e) {
                        dragged = e.target;
                    }, false);
                    document.addEventListener("drop", function (e) {
                        // const originalTitle = dragged.getAttribute("w2g-original-title");
                        // if (originalTitle !== null)
                        //     return;
                        // const titleElement = dragged.querySelector(".w2g-list-item-title");
                        // if (!titleElement.innerText.startsWith("http://") && !titleElement.innerText.startsWith("https://"))
                        //     return;
                        // const customTitle = localStorage.getItem(`_title_${hex(titleElement.innerText)}`);
                        // if (customTitle === null)
                        //     return;
                        // titleElement.innerText = customTitle;
                        // ghetto shit
                        setTimeout(function () {
                            var playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                            applySettings(playlistVideos);
                            createEditControls(playlistVideos);
                        }, 500);
                    }, false);
                };
                setRemoveHandler = function () {
                    for (var _i = 0, _a = document.querySelectorAll(".ui.remove.icon[title='Delete']"); _i < _a.length; _i++) {
                        var deleteButton = _a[_i];
                        deleteButton.onclick = function (e) {
                            setTimeout(function () {
                                var playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                                applySettings(playlistVideos);
                                createEditControls(playlistVideos);
                            }, 500);
                            // const playlistVideo = e.target.parentElement.parentElement;
                            // const titleElement = playlistVideo.querySelector(".w2g-list-item-title.mod-player");
                        };
                    }
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = w2g.sync.state_container.state;
                return [4 /*yield*/, w2g.sync.api_client.get_titles()];
            case 2:
                _a.titles = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                alert("Failed to get titles: " + err_2.message + "\nEdit sync settings to retry");
                w2g.sync.state_container.state.abort = true;
                return [3 /*break*/, 4];
            case 4:
                // ghetto retard shit
                setTimeout(function () {
                    // Create scroll down control
                    var menu = document.querySelectorAll(".w2g-menu")[3];
                    var scrollUpButton = document.createElement("div");
                    scrollUpButton.className = "mod_pl_interaction";
                    scrollUpButton.setAttribute("title", "Skip to top");
                    scrollUpButton.onclick = function () {
                        var list = document.querySelector("div.w2g-list-items.w2g-items.w2g-scroll-vertical");
                        list.scrollTop = 0;
                    };
                    var upIcon = document.createElement("i");
                    upIcon.className = "chevron up icon";
                    scrollUpButton.appendChild(upIcon);
                    var scrollDownButton = document.createElement("div");
                    scrollDownButton.className = "mod_pl_interaction";
                    scrollDownButton.onclick = function () {
                        var list = document.querySelector("div.w2g-list-items.w2g-items.w2g-scroll-vertical");
                        list.scrollTop = list.scrollHeight;
                    };
                    var downIcon = document.createElement("i");
                    downIcon.className = "chevron down icon";
                    scrollDownButton.appendChild(downIcon);
                    menu.appendChild(scrollUpButton);
                    menu.appendChild(scrollDownButton);
                    // Create sync tab
                    var syncMenuItem = document.createElement("div");
                    syncMenuItem.classList.add("w2g-sync-menu-item");
                    syncMenuItem.innerText = "Sync";
                    syncMenuItem.onclick = function (e) {
                        if (e.target.classList.contains("w2g-active"))
                            return;
                        e.target.classList.add("w2g-active");
                    };
                    var sidebarMenu = document.querySelector("#w2g-sidebar-menu");
                    sidebarMenu.appendChild(syncMenuItem);
                    var syncMenuTab = document.createElement("div");
                    syncMenuTab.classList.add("w2g-menu-tab", "w2g-sync", "w2g-scroll-vertical");
                    syncMenuTab.innerHTML = "\n<div class=\"ui fluid action input w2g-users\">\n    <input type=\"text\" id=\"w2g-sync-server-url\" placeholder=\"Sync server URL\"></input>\n</div>\n<div style=\"margin-top: 5px\" class=\"ui fluid action input w2g-users\">\n    <input type=\"password\" id=\"w2g-sync-server-token\" placeholder=\"Sync server token\"></input>\n</div>\n<div style=\"margin-top: 5px\" id=\"w2g-sync-server-save\" class=\"ui active button\">\n    <i class=\"save outline icon\"></i>\n    <span>Save</span>\n</div>\n";
                    var contentRight = document.querySelector(".w2g-content-right");
                    contentRight.appendChild(syncMenuTab);
                    document.querySelector("#w2g-sync-server-url").value = w2g.sync.client_storage.get("server-url") || "";
                    document.querySelector("#w2g-sync-server-token").value = w2g.sync.client_storage.get("server-token") || "";
                    var saveButton = document.querySelector("#w2g-sync-server-save");
                    saveButton.onclick = function () {
                        var serverUrl = document.querySelector("#w2g-sync-server-url");
                        var serverToken = document.querySelector("#w2g-sync-server-token");
                        w2g.sync.client_storage.set("server-url", serverUrl.value);
                        w2g.sync.client_storage.set("server-token", serverToken.value);
                        w2g.sync.state_container.state.abort = false;
                    };
                    var playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                    createEditControls(playlistVideos);
                    applySettings(playlistVideos);
                    setOnChangeHandler();
                    setRemoveHandler();
                    setInterval(function () {
                        if (w2g.sync.state_container.state.abort)
                            return;
                        w2g.sync.api_client.get_titles()
                            .then(function (titles) { return w2g.sync.state_container.state.titles = titles; })["catch"](function (err) {
                            alert("Failed to get titles: " + err.message + "\nEdit sync settings to retry");
                            w2g.sync.state_container.state.abort = true;
                        });
                    }, 5000);
                    setInterval(function () {
                        var playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                        applySettings(playlistVideos);
                        createEditControls(playlistVideos);
                    }, 2500);
                }, 2500);
                return [2 /*return*/];
        }
    });
}); })();
