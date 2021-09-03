// ==UserScript==
// @name         watch2gether Tools
// @version      2.0
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==

namespace w2gtools {
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
}

(async () => {
    // ghetto retard shit
    setTimeout(async () => {
        // Create scroll down control
        const menu = document.querySelectorAll(".w2g-menu")[3];

        await w2gtools.wait_for(() => document.querySelectorAll(".w2g-menu")[3] !== undefined);

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
    }, 2500);
})();
