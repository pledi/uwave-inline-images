// ==UserScript==
// @name         Inline Images
// @namespace    https://welovekpop.club/
// @version      0.1
// @description  Displays inline images in the uwave chat.
// @author       k_p
// @match        https://welovekpop.club/
// @grant        none
// ==/UserScript==

var imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|gifv|bmp))/i; // Which image links to embed as an img tag
var chatLines; // the chatmessages container

function getNewMessage() {
    return chatLines.children[chatLines.children.length - 1].getElementsByClassName("ChatMessage-text")[0];
}

// Searches for image links in the message and inserts the image below the message
function embedImages(messageDiv) {
    var imageUrlMatches = messageDiv.innerHTML.match(imageRegex);
    var duplicate = messageDiv.innerHTML.includes("inline-image-js");

    if (imageUrlMatches !== null && !duplicate) {
        var imageUrl = imageUrlMatches[0];

        // Create link so you can link to the URL
        var imageInsert = document.createElement("a");
        imageInsert.href = imageUrl;
        imageInsert.target = "_blank";
        imageInsert.title = "inline-image-js";
        imageInsert.style.display = "block";

        // Create image that's reasonably sized
        var newImage = document.createElement("img");
        newImage.src = imageUrl;
        newImage.style.maxHeight = "200px";
        newImage.style.maxWidth = "100%";

        imageInsert.appendChild(newImage);

        messageDiv.appendChild(imageInsert);
    }
}

// Function to find and process new messages (triggered by update)
function processNewMessages() {
    var newMessage = getNewMessage();
    embedImages(newMessage);
}

// Find the chat-lines and set up observer or refresh timer
function initialize() {
    chatLines = document.getElementsByClassName("ChatMessages")[0];

    // Firefox doesn't seem to like the observer, so we'll fallback to a safe polling-style for non-Chrome
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        // Set up observer to trigger processing each time a new message is added
        var observer = new MutationObserver(processNewMessages);
        var config = {
            attributes: false,
            childList: true,
            characterData: false
        };
        observer.observe(document.getElementsByClassName("ChatMessages")[0], config);
    } else {
        var refreshInterval = setInterval(function() {
            chatLines = document.getElementsByClassName("ChatMessages")[0];
            processNewMessages();
        }, 500);
    }
}

uw.ready.then(setTimeout(function(){initialize();}, 3000));
