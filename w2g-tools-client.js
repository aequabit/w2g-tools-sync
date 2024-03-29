// ==UserScript==
// @name         watch2gether Tools
// @version      2.1
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
    w2gtools.DEFAULT_PLAYER_VOLUME = 0.3;
    // TODO: Specify for elements
    // TODO: Save selectors and promises, check all in single loop
    function wait_for(conditional, interval = 20) {
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
    class client_storage {
        static get(key) {
            return localStorage.getItem(client_storage.STORAGE_PREFIX + key);
        }
        static set(key, value) {
            localStorage.setItem(client_storage.STORAGE_PREFIX + key, value.toString());
        }
    }
    client_storage.STORAGE_PREFIX = "_w2g-sync-";
    w2gtools.client_storage = client_storage;
})(w2gtools || (w2gtools = {}));
(() => __awaiter(this, void 0, void 0, function* () {
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        yield w2gtools.wait_for(() => document.querySelectorAll(".w2g-menu")[3] !== undefined);
        // Create scroll down control
        const menu = document.querySelectorAll(".w2g-menu")[3];
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
    }), 1);
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        // Wait for volume slider
        yield w2gtools.wait_for(() => document.querySelector("#volume_slider") !== null || document.querySelector(".player-volume>div>input") !== null);
        yield w2gtools.wait_for(() => document.querySelector("#video_container>video") !== null || document.querySelector("#video_container>audio") !== null);
        const volume_slider = document.querySelector("#volume_slider") || document.querySelector(".player-volume>div>input");
        const video_element = document.querySelector("#video_container>video") || document.querySelector("#video_container>audio");
        console.log(volume_slider);
        video_element.onvolumechange = e => {
            if (!(e.target instanceof HTMLVideoElement) && !(e.target instanceof HTMLAudioElement))
                return;
            const _video_element = e.target;
            w2gtools.client_storage.set("player_volume", _video_element.volume.toString());
        };
        const player_volume_str = w2gtools.client_storage.get("player_volume");
        const player_volume = player_volume_str === null ? w2gtools.DEFAULT_PLAYER_VOLUME : parseFloat(player_volume_str);
        volume_slider.value = Math.trunc(player_volume * 100).toString();
        video_element.volume = player_volume;
        setInterval(() => {
            const _volume_slider = document.querySelector("#volume_slider") || document.querySelector(".player-volume>div>input");
            const _video_element = document.querySelector("#video_container>video") || document.querySelector("#video_container>audio");
            const player_volume_str = w2gtools.client_storage.get("player_volume");
            const player_volume = player_volume_str === null ? w2gtools.DEFAULT_PLAYER_VOLUME : parseFloat(player_volume_str);
            if (_video_element.volume !== player_volume) {
                _volume_slider.value = Math.trunc(player_volume * 100).toString();
                _video_element.volume = player_volume;
            }
        }, 250);
    }), 1);
}))();
