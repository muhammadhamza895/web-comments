const comments = JSON.parse(localStorage.getItem("comments")) || []

var iframe = document.getElementById('myIframe');
var commentSection = document.getElementsByClassName('commentsSections')[0]
let pendingComment = false;
let xCoordinate, yCoordinate

iframe.addEventListener('load', function () {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    let iframeBody = iframeDoc.querySelector("body")
    iframeBody.style = "user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
    if (comments.length) {
        comments?.forEach((val, index) => {
            const node = iframeDoc.createElement("p");
            const textnode = document.createTextNode(index + 1);
            node.appendChild(textnode);
            node.classList.add('commentNode')
            node.style = `position: absolute;width: 40px; height: 40px;top: ${val?.yCoordinate}px;left: ${val?.xCoordinate}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
            node.addEventListener('click', nodeClick)
            iframeDoc.body.appendChild(node);
            manageDraggableEvent(iframeDoc)
        })
    }
    iframeDoc.addEventListener('click', function (event) {
        if (pendingComment) {
            let commentNodes = iframeDoc.querySelectorAll('.commentNode')
            if (commentNodes.length) {
                commentNodes[comments.length].remove()
                iframeDoc.body.querySelector('#inputCommentId').remove()
                iframeDoc.body.querySelector('#subitCommentButton').remove()
                pendingComment = false;
                return
            }
        }
        let x = event.clientX;
        let y = event.clientY;
        xCoordinate = x - 20;
        yCoordinate = y - 20
        // comments.push({ xCoordinate, yCoordinate })
        console.log("Coordinate x: " + x,
            "Coordinate y: " + y);
        var scrollLeft = iframe.contentWindow.scrollX || iframe.contentDocument.documentElement.scrollLeft;
        var scrollTop = iframe.contentWindow.scrollY || iframe.contentDocument.documentElement.scrollTop;
        addCommentButton(iframeDoc, comments.length + 1, x, scrollTop + y)
    });
    iframeDoc.addEventListener("mouseup", () => {
        let draggableElemnts = iframeDoc.querySelectorAll(".commentNode")
        draggableElemnts.forEach((val, index) => {
            val.removeEventListener("mousemove", onMouseDrag);
        })
    });

    function addCommentButton(iframeDoc, number, x, y) {
        // CREATING COMMENT INPUT ELEMENT
        const inputElem = iframeDoc.createElement("input");
        inputElem.type = "text";
        inputElem.classList.add('inputComment')
        inputElem.id = 'inputCommentId'
        inputElem.style = `position: absolute;top: ${y - 10}px;left: ${x + 30}px; z-index: 1000;`
        inputElem.addEventListener('click', nodeClick)
        iframeDoc.body.appendChild(inputElem);

        // CREATING SUBMIT COMMENT BUTTON
        const submitComment = iframeDoc.createElement("button");
        submitComment.innerText = "Submit"
        submitComment.id = 'subitCommentButton'
        submitComment.style = `position: absolute;top: ${y + 20}px;left: ${x + 30}px; z-index: 1000; color: black;`
        submitComment.addEventListener("click", saveComment)
        iframeDoc.body.appendChild(submitComment);

        // CREATING COMMENT POINTER
        const node = iframeDoc.createElement("p");
        const textnode = document.createTextNode(number);
        node.appendChild(textnode);
        node.classList.add('commentNode')
        node.style = `position: absolute;width: 40px; height: 40px;top: ${y - 20}px;left: ${x - 20}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
        node.addEventListener('click', nodeClick)
        iframeDoc.body.appendChild(node);
        manageDraggableEvent(iframeDoc)

        xCoordinate = x - 20
        yCoordinate = y - 20
        pendingComment = true
    }

    function manageDraggableEvent(iframeDoc) {
        let draggableElemnts = iframeDoc.querySelectorAll(".commentNode")

        // REMOVING PREVIOS EVENTS
        draggableElemnts.forEach((val, index) => {
            val.removeEventListener('mousedown', onMouseDownHandler)
        })

        // ADDING NEW EVENTS
        draggableElemnts.forEach((val, index) => {
            val.addEventListener('mousedown', onMouseDownHandler)
        })
    }

    function onMouseDownHandler(event) {
        event.target.addEventListener("mousemove", onMouseDrag);
    }

    function onMouseDrag(event) {
        event.stopPropagation()
        let draggingElem = event.target
        let getContainerStyle = window.getComputedStyle(draggingElem);
        let leftValue = parseInt(getContainerStyle.left);
        let topValue = parseInt(getContainerStyle.top);
        draggingElem.style.left = `${leftValue + event.movementX}px`;
        draggingElem.style.top = `${topValue + event.movementY}px`;
    }

    function nodeClick(event) {
        event.stopPropagation()
    }

    function saveComment(event) {
        event.stopPropagation()
        const comment = iframeDoc.body.querySelector('#inputCommentId').value
        if (!comment) {
            let commentNodes = iframeDoc.querySelectorAll('.commentNode')
            commentNodes[comments.length].remove()
            iframeDoc.body.querySelector('#inputCommentId').remove()
            iframeDoc.body.querySelector('#subitCommentButton').remove()
            pendingComment = false;
            return
        }
        iframeDoc.body.querySelector('#inputCommentId').remove()
        iframeDoc.body.querySelector('#subitCommentButton').remove()
        pendingComment = false
        const newComment = {
            xCoordinate,
            yCoordinate,
            comment
        }
        comments.push(newComment)
        localStorage.setItem("comments", JSON.stringify(comments));
    }
});


