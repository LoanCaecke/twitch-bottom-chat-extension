/*************************/
/** <SHARED FUNCTIONS> */
/*************************/
async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

async function setLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

/*************************/
/** </SHARED FUNCTIONS> */
/*************************/



chrome.action.onClicked.addListener(async (tab) => {
    const chatDisplayedData = await getLocalStorageValue("chatDisplayed");
    let isChatDisplayed;

    console.log(chatDisplayedData);

    try {        
        isChatDisplayed = JSON.parse(JSON.stringify(chatDisplayedData.chatDisplayed));
    } catch (error) {
        isChatDisplayed = false;
    }

    if (isChatDisplayed) {
        await setLocalStorageValue({ 'chatDisplayed': false });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: reset
        });
        await setLocalStorageValue({ 'chatDisplayed': false });
    }
    else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: init
        });
        await setLocalStorageValue({ 'chatDisplayed': true });
    }

    // Border option
    const isBannerDisplayed = JSON.parse(JSON.stringify(await getLocalStorageValue("showBanner"))).showBanner;

    if (isBannerDisplayed) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: addBannerScript
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: removeBannerScript
        });
    }
});

async function addBannerScript() {
    document.querySelector('.gQFWRH').style.cssText += ';display:flex !important;';
}

async function removeBannerScript() {
    const twitchChat = document.getElementById('twitch-chat-embed');

    //removes only if chat is open 
    if (twitchChat) {
        document.querySelector('.gQFWRH').style.cssText += ';display:none !important;';
    }
}

/**
 * Initialize chat below video 
 */
async function init() {
    const channelInfoBannerContainer = document.querySelector('.fOsPDQ');

    const iFrame = document.createElement('iframe');
    iFrame.setAttribute('id', 'twitch-chat-embed');
    iFrame.setAttribute('src', 'https://www.twitch.tv/embed' + window.location.pathname + '/chat?darkpopout&parent=twitch.tv');
    iFrame.setAttribute('width', '100%');
    iFrame.setAttribute('height', '95%');

    channelInfoBannerContainer.append(iFrame);


    let clientH = channelInfoBannerContainer.clientHeight;

    let playerH = document.querySelector(".video-player").scrollHeight;

    channelInfoBannerContainer.style.flexDirection = 'column';
    //    channelInfoBannerContainer.style.maxHeight = '1440px';
    channelInfoBannerContainer.style.height = `calc(100vh - ${playerH}px - 16px)`;


    await setLocalStorageValue({ 'chatDisplayed': true });
}


/**
 * Removes bottom chat and reset layout style
 */
async function reset() {
    const channelInfoBannerContainer = document.querySelector('.fOsPDQ');

    channelInfoBannerContainer.style.height = 'auto';

    const twitchChat = document.getElementById('twitch-chat-embed');

    if (twitchChat) {
        // Set back the streamers banner ( because we are not des animaux )
        document.querySelector('.gQFWRH').style.cssText += ';display:flex !important;';

        twitchChat.remove();
        await setLocalStorageValue({ 'chatDisplayed': false });
    }
}