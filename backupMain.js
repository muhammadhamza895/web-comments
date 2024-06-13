var iframe = document.getElementById('myIframe');
var comments = localStorage.getItem("comments") || JSON.stringify([])
iframe.addEventListener('load', function () {
    var iframeWindow = iframe.contentWindow;
    iframeWindow.postMessage(comments, '*')
})

window.addEventListener('message', function (event) {
    console.log('Received message (Parent):', event.data);
    localStorage.setItem("comments", event.data)
}, false);