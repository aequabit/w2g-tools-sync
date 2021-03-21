// ==UserScript==
// @name         watch2gether Tools
// @version      1.1
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==

namespace w2gsync {
    export type result<t = void> = Promise<t>;
    export const result = Promise;
    export interface kv_pair { [key: string]: string };

    export class helper {
        public static is_url(str: string): boolean {
            return typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://"));
        }
    }

    export interface i_state {
        titles: kv_pair;
        abort: boolean;
    }

    export const default_state = () => ({ titles: {}, abort: false });

    export class state_container {
        public static readonly state: i_state = default_state();
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

    export async function http_request<t_response = kv_pair>(url: string, query: kv_pair | null = null): result<t_response> {
        const sync_server_url = client_storage.get("server-url");
        const sync_server_token = client_storage.get("server-token");

        if (sync_server_url === null || sync_server_token === null)
            throw new Error("Sync server not configured");

        try {
            const response = await fetch(sync_server_url + url + (query !== null ? `?${new URLSearchParams(query as any)}` : ""), {
                method: 'GET',
                headers: {
                    'x-sync-token': sync_server_token,
                    ...(query !== null ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
                }
            });

            return await response.json();
        } catch (err) {
            throw new Error("Request failed: " + err.message);
        }
    }

    export interface i_api_client {
        get_titles(): result<kv_pair>;
        set_title(url: string, title: string): result;
    }

    export class api_client {
        public static async get_titles(): result<kv_pair> {
            return (await http_request<{ titles: kv_pair }>("/playlist/get-titles")).titles;
        }

        public static async set_title(url: string, title: string): result {
            return await http_request("/playlist/set-title", { url, title });
        }
    }

    export class internal {
        public static is_video_editable(playlist_video: HTMLElement): boolean {
            const title_element = playlist_video.querySelector(".w2g-list-item-title") as HTMLElement;

            const original_title = playlist_video.getAttribute("w2g-original-title");
            if (original_title !== null && helper.is_url(original_title))
                return true;

            return helper.is_url(title_element.innerText);
        }
    }
}

(async () => {
    const applySettings = playlistVideos => {
        for (const playlistVideo of playlistVideos) {
            if (!(playlistVideo))
                continue;

            const titleElement = playlistVideo.querySelector(".w2g-list-item-title");

            const originalTitle = playlistVideo.getAttribute("w2g-original-title") || titleElement.innerText;
            playlistVideo.setAttribute("w2g-original-title", originalTitle);

            const customTitleKey = Object.keys(w2gsync.state_container.state.titles || {}).find(x => x === originalTitle);
            if (customTitleKey === undefined)
                continue;

            titleElement.innerText = w2gsync.state_container.state.titles[customTitleKey];
        }
    };

    const renameVideo = (playlistVideo, title) => {
        if (w2gsync.helper.is_url(title)) {
            alert("retard alert");
            return;
        }

        const titleElement = playlistVideo.querySelector(".w2g-list-item-title");

        const originalTitle = playlistVideo.getAttribute("w2g-original-title");
        if (originalTitle === null)
            playlistVideo.setAttribute("w2g-original-title", titleElement.innerText);

        if (title.length === 0)
            title = originalTitle;

        w2gsync.state_container.state.titles[originalTitle] = title;

        titleElement.innerText = title;

        w2gsync.api_client.set_title(originalTitle, title)
            .catch(err => {
                alert("Failed to rename video: " + err.message + "\nEdit sync settings to retry");
                w2gsync.state_container.state.abort = true;
            });
    };

    const createEditControls = playlistVideos => {
        for (const playlistVideo of playlistVideos) {
            if (!w2gsync.internal.is_video_editable(playlistVideo))
                continue;

            const titleElement = playlistVideo.querySelector(".w2g-list-item-title.mod-player");

            const actionsElement = titleElement.parentElement.querySelector(".w2g-list-item-actions");
            if (actionsElement === null)
                continue;

            if (actionsElement.querySelector(".w2g-title-edit") !== null)
                continue;

            const editButton = document.createElement("a");
            editButton.className = "w2g-title-edit";
            (editButton as any).style = "margin-right: 5px;";
            editButton.href = "#";
            editButton.innerText = "edit";
            editButton.onclick = (e) =>
                renameVideo((e.target as any).parentElement.parentElement,
                    prompt("New title:", titleElement.innerText));

            actionsElement.prepend(editButton);
        }
    };

    const setOnChangeHandler = () => {
        let dragged = null;

        document.addEventListener("dragstart", e => {
            dragged = e.target;
        }, false);

        document.addEventListener("drop", e => {
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
            setTimeout(() => {
                const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                applySettings(playlistVideos);
                createEditControls(playlistVideos);
            }, 500);
        }, false);
    };

    const setRemoveHandler = () => {
        for (const deleteButton of document.querySelectorAll(".ui.remove.icon[title='Delete']") as any) {
            (deleteButton as any).onclick = e => {
                setTimeout(() => {
                    const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
                    applySettings(playlistVideos);
                    createEditControls(playlistVideos);
                }, 500);
                // const playlistVideo = e.target.parentElement.parentElement;

                // const titleElement = playlistVideo.querySelector(".w2g-list-item-title.mod-player");

            };
        }
    };

    try {
        w2gsync.state_container.state.titles = await w2gsync.api_client.get_titles();
    } catch (err) {
        alert("Failed to get titles: " + err.message + "\nEdit sync settings to retry");
        w2gsync.state_container.state.abort = true;
    }

    // ghetto retard shit
    setTimeout(() => {
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

        // Create sync tab
        const syncMenuItem = document.createElement("div");
        syncMenuItem.classList.add("w2g-sync-menu-item");
        syncMenuItem.innerText = "Sync";
        syncMenuItem.onclick = (e) => {
            if ((e.target as any).classList.contains("w2g-active"))
                return;

            (e.target as any).classList.add("w2g-active");
        };

        const sidebarMenu = document.querySelector("#w2g-sidebar-menu");
        sidebarMenu.appendChild(syncMenuItem);

        const syncMenuTab = document.createElement("div");
        syncMenuTab.classList.add("w2g-menu-tab", "w2g-sync", "w2g-scroll-vertical");
        syncMenuTab.innerHTML = `
<div class="ui fluid action input w2g-users">
    <input type="text" id="w2g-sync-server-url" placeholder="Sync server URL"></input>
</div>
<div style="margin-top: 5px" class="ui fluid action input w2g-users">
    <input type="password" id="w2g-sync-server-token" placeholder="Sync server token"></input>
</div>
<div style="margin-top: 5px" id="w2g-sync-server-save" class="ui active button">
    <i class="save outline icon"></i>
    <span>Save</span>
</div>
`;

        const contentRight = document.querySelector(".w2g-content-right");
        contentRight.appendChild(syncMenuTab);

        (document.querySelector("#w2g-sync-server-url") as any).value = w2gsync.client_storage.get("server-url") || "";
        (document.querySelector("#w2g-sync-server-token") as any).value = w2gsync.client_storage.get("server-token") || "";

        const saveButton = document.querySelector("#w2g-sync-server-save");
        (saveButton as any).onclick = async () => {
            const serverUrl = document.querySelector("#w2g-sync-server-url") as any;
            const serverToken = document.querySelector("#w2g-sync-server-token") as any;
            w2gsync.client_storage.set("server-url", serverUrl.value);
            w2gsync.client_storage.set("server-token", serverToken.value);
            w2gsync.state_container.state.abort = false;
            
            try {
                w2gsync.state_container.state.titles = await w2gsync.api_client.get_titles();
            } catch (err) {
                alert("Failed to get titles: " + err.message + "\nEdit sync settings to retry");
                w2gsync.state_container.state.abort = true;
            }
        };

        const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
        createEditControls(playlistVideos);
        applySettings(playlistVideos);
        setOnChangeHandler();
        setRemoveHandler();

        setInterval(() => {
            if (w2gsync.state_container.state.abort) return;

            w2gsync.api_client.get_titles()
                .then(titles => w2gsync.state_container.state.titles = titles)
                .catch(err => {
                    alert("Failed to get titles: " + err.message + "\nEdit sync settings to retry");
                    w2gsync.state_container.state.abort = true;
                });
        }, 5000);

        // setInterval(() => {
        //     const ok_button = document.querySelector("#ok_button");
        //     console.log(ok_button)
        //     if (ok_button !== null) {
        //         (ok_button as any).click();
        //     }
        // }, 150);

        setInterval(() => {
            const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
            applySettings(playlistVideos);
            createEditControls(playlistVideos);
        }, 2500);
    }, 2500);
})();
