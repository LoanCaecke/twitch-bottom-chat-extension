// Saves options to chrome.storage
function save_options() {
    var showBannerCheckboxValue = document.getElementById('showBanner').checked;

    chrome.storage.sync.set({
        showBanner: showBannerCheckboxValue,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options sauvegardées.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value showBanner = false.
    chrome.storage.sync.get({
        showBanner: false
    }, function (items) {
        document.getElementById('showBanner').checked = items.showBanner;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);