// ==UserScript==
// @name         watch2gether Tools
// @version      2.0
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var w2gtools;
(function (w2gtools) {
    function wait_for(conditional, interval = 200) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const _wait_for_interval = setInterval(() => {
                    if (conditional() === true) {
                        clearInterval(_wait_for_interval);
                        resolve();
                    }
                }, interval);
            });
        });
    }
    w2gtools.wait_for = wait_for;
})(w2gtools || (w2gtools = {}));
(() => __awaiter(this, void 0, void 0, function* () {
    // ghetto retard shit
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        // Create scroll down control
        const menu = document.querySelectorAll(".w2g-menu")[3];
        yield w2gtools.wait_for(() => document.querySelectorAll(".w2g-menu")[3] !== undefined);
        const scrollUpButton = document.createElement("div");
        scrollUpButton.className = "mod_pl_interaction";
        scrollUpButton.setAttribute("title", "Skip to top");
        scrollUpButton.onclick = () => {
            const list = document.querySelector("div.w2g-list-items.w2g-items.w2g-scroll-vertical");
            list.scrollTop = 0;
        };
        const upIcon = document.createElement("i");
        upIcon.className = "chevron up icon";
        scrollUpButton.appendChild(upIcon);
        const scrollDownButton = document.createElement("div");
        scrollDownButton.className = "mod_pl_interaction";
        scrollDownButton.onclick = () => {
            const list = document.querySelector("div.w2g-list-items.w2g-items.w2g-scroll-vertical");
            list.scrollTop = list.scrollHeight;
        };
        const downIcon = document.createElement("i");
        downIcon.className = "chevron down icon";
        scrollDownButton.appendChild(downIcon);
        menu.appendChild(scrollUpButton);
        menu.appendChild(scrollDownButton);
    }), 2500);
}))();
