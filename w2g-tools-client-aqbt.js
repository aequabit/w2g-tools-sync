 // ==UserScript==
// @name         watch2gether Tools
// @version      1.1
// @description  yeet
// @author       aequabit
// @match 		 *://w2g.tv/*
// @grant        unsafeWindow
// ==/UserScript==

(() => {
    const SYNC_SERVER_TOKEN = "84c8d5d8-08ef-48f1-8956-14fd114c93f3";
    const SYNC_SERVER_BASE_URL = "https://w2g-sync.aqbt.pw";

    const hex = str => str.split("")
        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");

    const getTitles = async () => {
        const response = await fetch(`${SYNC_SERVER_BASE_URL}/playlist/get-titles`);
        const json = await response.json();
        return json.titles;
    };

    const encodeQueryString = data => {
        const formBody = [];
        for (const [key, value] of Object.entries(data))
            formBody.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        return formBody.join("&");
    };

    const setTitle = async (url, title) => {
        const query = encodeQueryString({ url, title });
        const response = await fetch(`${SYNC_SERVER_BASE_URL}/playlist/set-title?${query}`, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'X-Sync-Token': SYNC_SERVER_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
    };

    let state = { titles: {} };

    const isUrl = str => typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://"));

    const isVideoEditable = playlistVideo => {
        const titleElement = playlistVideo.querySelector(".w2g-list-item-title");

        const originalTitle = playlistVideo.getAttribute("w2g-original-title");
        if (originalTitle !== null && isUrl(originalTitle))
            return true;

        return isUrl(titleElement.innerText);
    };

    const applySettings = playlistVideos => {
        for (const playlistVideo of playlistVideos) {
            if (!isVideoEditable(playlistVideo))
                continue;

            const titleElement = playlistVideo.querySelector(".w2g-list-item-title");

            const originalTitle = playlistVideo.getAttribute("w2g-original-title") || titleElement.innerText;
            playlistVideo.setAttribute("w2g-original-title", originalTitle);

            //const customTitle = localStorage.getItem(`_title_${hex(originalTitle)}`);
            const customTitleKey = Object.keys(state.titles).find(x => x === originalTitle);
            if (customTitleKey === undefined)
                continue;

            titleElement.innerText = state.titles[customTitleKey];
        }
    };

    const renameVideo = (playlistVideo, title) => {
        if (isUrl(title)){
            alert("retard alert");
            return;
        }

        const titleElement = playlistVideo.querySelector(".w2g-list-item-title");

        const originalTitle = playlistVideo.getAttribute("w2g-original-title");
        if (originalTitle === null)
            playlistVideo.setAttribute("w2g-original-title", titleElement.innerText);

        if (title.length === 0)
            title = originalTitle;

        titleElement.innerText = title;
        //localStorage.setItem(`_title_${hex(originalTitle)}`, title);
        setTitle(originalTitle, title);
    };

    const createEditControls = playlistVideos => {
        for (const playlistVideo of playlistVideos) {
            if (!isVideoEditable(playlistVideo))
                continue;

            const titleElement = playlistVideo.querySelector(".w2g-list-item-title.mod-player");

            const actionsElement = titleElement.parentElement.querySelector(".w2g-list-item-actions");
            if (actionsElement === null)
                continue;

            if (actionsElement.querySelector(".w2g-title-edit") !== null)
                continue;

            const editButton = document.createElement("a");
            editButton.className = "w2g-title-edit";
            editButton.style = "margin-right: 5px;";
            editButton.href = "#";
            editButton.innerText = "edit";
            editButton.onclick = e =>
                renameVideo(e.target.parentElement.parentElement,
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
        for (const deleteButton of document.querySelectorAll(".ui.remove.icon[title='Delete']")) {
            deleteButton.onclick = e => {
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

    getTitles().then(titles => state.titles = titles);

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

        const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
        createEditControls(playlistVideos);
        applySettings(playlistVideos);
        setOnChangeHandler(playlistVideos);
        setRemoveHandler();

        setInterval(() => {
            getTitles().then(titles => state.titles = titles);
        }, 5000);

        setInterval(() => {
            const playlistVideos = document.querySelectorAll(".w2g-list-item.darker-item.mod_pl_drag");
            applySettings(playlistVideos);
            createEditControls(playlistVideos);
        }, 2500);
    }, 2500);
})();
