// ==UserScript==
// @name         watch2gether Tools
// @version      2.1
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==

namespace w2gtools {
    export const DEFAULT_PLAYER_VOLUME = 0.3;

    // TODO: Specify for elements
    // TODO: Save selectors and promises, check all in single loop
    export async function wait_for(conditional: () => boolean, interval: number = 200): Promise<void> {
        return new Promise(resolve => {
            const _wait_for_interval = setInterval(() => {
                if (conditional() === true) {
                    clearInterval(_wait_for_interval);
                    resolve();
                }
            }, interval);
        });
    }

    export class client_storage {
        private static readonly STORAGE_PREFIX: string = "_w2g-sync-";

        public static get(key: string): string | null {
            return localStorage.getItem(client_storage.STORAGE_PREFIX + key);
        }

        public static set(key: string, value: string | number): void {
            localStorage.setItem(client_storage.STORAGE_PREFIX + key, value.toString());
        }
    }
}

(async () => {
    setTimeout(async () => {
        await w2gtools.wait_for(() => document.querySelectorAll(".w2g-menu")[3] !== undefined);

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
    }, 1);

    setTimeout(async () => {
        // Wait for volume slider
        await w2gtools.wait_for(() => document.querySelector("#volume_slider") !== null);
        await w2gtools.wait_for(() => document.querySelector("#video_container>video") !== null || document.querySelector("#video_container>audio") !== null);

        const volume_slider: HTMLInputElement = document.querySelector("#volume_slider");
        const video_element: HTMLVideoElement = document.querySelector("#video_container>video") || document.querySelector("#video_container>audio");

        video_element.onvolumechange = e => {
            if (!(e.target instanceof HTMLVideoElement) && !(e.target instanceof HTMLAudioElement)) return;
            const _video_element: HTMLVideoElement | HTMLAudioElement = e.target;
            w2gtools.client_storage.set("player_volume", _video_element.volume.toString());
        };

        const player_volume_str = w2gtools.client_storage.get("player_volume");
        const player_volume = player_volume_str === null ? w2gtools.DEFAULT_PLAYER_VOLUME : parseFloat(player_volume_str);
        volume_slider.value = Math.trunc(player_volume * 100).toString();
        video_element.volume = player_volume;

        setInterval(() => {
            const _volume_slider: HTMLInputElement = document.querySelector("#volume_slider");
            const _video_element: HTMLVideoElement = document.querySelector("#video_container>video") || document.querySelector("#video_container>audio");
            const player_volume_str = w2gtools.client_storage.get("player_volume");
            const player_volume = player_volume_str === null ? w2gtools.DEFAULT_PLAYER_VOLUME : parseFloat(player_volume_str);
            if (_video_element.volume !== player_volume) {
                _volume_slider.value = Math.trunc(player_volume * 100).toString();
                _video_element.volume = player_volume;
            }
        }, 250);
    }, 1);
})();
