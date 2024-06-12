const comments = JSON.parse(localStorage.getItem("comments")) || []

var iframe = document.getElementById('myIframe');
var commentSection = document.getElementsByClassName('commentsSections')[0]
let pendingComment = false;
let xCoordinate, yCoordinate;
let dragElem, dragElemId;

iframe.addEventListener('load', function () {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    let iframeBody = iframeDoc.querySelector("body")
    iframeBody.style = "user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; overflow-x: hidden;"

    var windowWidth = window.innerWidth;
    if (comments.length) {
        comments?.forEach((val, index) => {
            let newlyCreatedNode = craeteNewCommentNode(index + 1, index, val?.xCoordinate, val?.yCoordinate, windowWidth)
            let newlyCreatedComment = createNewCommentContainer(val?.comment, index, parseInt(newlyCreatedNode.style.left) + 50, parseInt(val?.yCoordinate), windowWidth)

            addHoverEvent(newlyCreatedNode, newlyCreatedComment)
            addDragEvent(newlyCreatedNode)
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
        console.log("Coordinate x: " + x,
            "Coordinate y: " + y);
        var scrollTop = iframe.contentWindow.scrollY || iframe.contentDocument.documentElement.scrollTop;
        createNewComment(iframeDoc, comments.length + 1, x, scrollTop + y)
    });
    iframeDoc.addEventListener("mouseup", (event) => {
        const commentContainer = iframeDoc.body.querySelectorAll('.commentContainer')
        commentContainer[dragElemId].style.visibility = 'initial'
        iframeDoc.removeEventListener("mousemove", onMouseDrag);
    });

    function createNewComment(iframeDoc, number, x, y) {
        // CREATING COMMENT POINTER
        let newlyCreatedNode = craeteNewCommentNode(number, comments.length, x - 20, y - 20, windowWidth)
        let newNodeXPosition = parseInt(newlyCreatedNode.style.left)
        let newNodeYPosition = parseInt(newlyCreatedNode.style.top)

        // CREATING COMMENT INPUT ELEMENT
        let inputELemWidth = 250
        let inputELemHeight = 35

        const inputElem = iframeDoc.createElement("input");
        inputElem.type = "text";
        inputElem.classList.add('inputComment')
        inputElem.id = 'inputCommentId'
        inputElem.style = `position: absolute;width: ${inputELemWidth}px;height : ${inputELemHeight}px; top: ${newNodeYPosition + 10}px;left: ${newNodeXPosition + 40 + 10}px; z-index: 1000;`
        inputElem.addEventListener('click', nodeClick)

        // CREATING SUBMIT COMMENT BUTTON
        const submitComment = iframeDoc.createElement("button");
        submitComment.innerText = "Submit"
        submitComment.id = 'subitCommentButton'
        submitComment.style = `position: absolute;width: 70px; top: ${newNodeYPosition + inputELemHeight + 20}px;left: ${newNodeXPosition + 40 + 10}px; z-index: 1000; color: black;`
        submitComment.addEventListener("click", saveComment)


        let positionCondition = parseInt(inputElem.style.left) + parseInt(inputElem.style.width) + 10
        if (positionCondition >= windowWidth) {
            let updatedInputElemPosition = parseInt(inputElem.style.left) - inputELemWidth - 50 - 10
            let updatedSubmitBtnPosition = parseInt(submitComment.style.left) - parseInt(submitComment.style.width) - 50 - 10
            inputElem.style.left = updatedInputElemPosition + 'px'
            submitComment.style.left = updatedSubmitBtnPosition + 'px'

        }

        iframeDoc.body.appendChild(inputElem);
        iframeDoc.body.appendChild(submitComment);

        addDragEvent(newlyCreatedNode)

        xCoordinate = x - 20
        yCoordinate = y - 20
        pendingComment = true
    }

    function saveComment(event) {
        event.stopPropagation()
        const comment = iframeDoc.body.querySelector('#inputCommentId').value
        let commentNodes = iframeDoc.querySelectorAll('.commentNode')
        if (!comment) {
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
        let newlyCreatedNode = commentNodes[commentNodes.length - 1]
        let newNodeXPostion = parseInt(newlyCreatedNode.style.left)
        let newlyComment = createNewCommentContainer(comment, comments.length - 1, newNodeXPostion + 50, yCoordinate, windowWidth)
        addHoverEvent(newlyCreatedNode, newlyComment)
        localStorage.setItem("comments", JSON.stringify(comments));
    }


    // DOM ELEMENT CREATOR FUNCTIONS
    function craeteNewCommentNode(commentNumber, commentId, xAxis, yAxis, browserWidth) {
        let nodeWidth = 40
        const node = iframeDoc.createElement("p");
        const textnode = document.createTextNode(commentNumber);
        node.appendChild(textnode);
        node.classList.add('commentNode')
        node.id = commentId
        node.style = `position: absolute;width: ${nodeWidth}px; height: 40px;top: ${yAxis}px;left: ${xAxis}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
        node.addEventListener('click', nodeClick)
        if (parseInt(xAxis) + nodeWidth + 20 >= browserWidth) {
            let updatedXAxisPosition = xAxis - (nodeWidth / 2)
            node.style.left = updatedXAxisPosition + 'px'
        }
        iframeDoc.body.appendChild(node);
        return node
    }

    function createNewCommentContainer(comment, id, xAxis, yAxis, browserWidth) {
        const commentContainer = iframeDoc.createElement("div");
        const textnode = document.createTextNode(comment);
        commentContainer.appendChild(textnode);
        commentContainer.classList.add('commentContainer')
        commentContainer.id = id
        commentContainer.style = `opacity: 0; padding: 5px 10px;position: absolute; top: ${yAxis}px;left: ${xAxis}px;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF; background-color: red;`
        iframeDoc.body.appendChild(commentContainer);
        if (xAxis + commentContainer.offsetWidth + 10 >= browserWidth) {
            let updatedXAxisPosition = parseInt(xAxis - commentContainer.offsetWidth - 50 - 10)
            commentContainer.style.left = updatedXAxisPosition + 'px'
        }
        return commentContainer
    }

    // EVENTS FUNCTIONS
    function nodeClick(event) {
        event.stopPropagation()
    }

    function addHoverEvent(commentNode, commentContainer) {
        commentNode.addEventListener('mouseover', () => {
            commentContainer.style.opacity = '1'
        })

        commentNode.addEventListener('mouseout', () => {
            commentContainer.style.opacity = '0'
        })
    }

    function addDragEvent(newlyCreatedNode) {
        newlyCreatedNode.addEventListener('mousedown', onMouseDownHandler)
    }

    function onMouseDownHandler(event) {
        dragElem = event.target
        dragElemId = event.target.id
        iframeDoc.addEventListener("mousemove", onMouseDrag);
    }

    function onMouseDrag(event) {
        event.stopPropagation()
        const commentContainer = iframeDoc.body.querySelectorAll('.commentContainer')
        commentContainer[dragElemId].style.opacity = '0'
        commentContainer[dragElemId].style.visibility = 'hidden'

        // UPDATING NODE POSITION ON DRAG
        let draggingElem = dragElem
        let getContainerStyle = window.getComputedStyle(draggingElem);
        let leftValue = parseInt(getContainerStyle.left);
        let topValue = parseInt(getContainerStyle.top);
        draggingElem.style.left = leftValue + event.movementX <= 0 ? 0 : `${leftValue + event.movementX}px`;
        draggingElem.style.top = topValue + event.movementY <= 0 ? 0 : `${topValue + event.movementY}px`;

        // UPDATING COMMENT POSITION OF DRAGGED NODE
        let condition1 = parseInt(draggingElem.style.left) + 50 + commentContainer[dragElemId].clientWidth >= windowWidth - 40
        if (condition1) {
            commentContainer[dragElemId].style.left = `${parseInt(draggingElem.style.left) - commentContainer[dragElemId].clientWidth - 10}px`
        } else {
            commentContainer[dragElemId].style.left = `${parseInt(draggingElem.style.left) + 50}px`
        }
        commentContainer[dragElemId].style.top = draggingElem.style.top;

        // UPDATING IN LOCAL ARRAY
        comments[draggingElem.id].xCoordinate = leftValue + event.movementX + 50
        comments[draggingElem.id].yCoordinate = topValue + event.movementY

        // UPDATING IN LOCAL STORAGE FOR REFRESH 
        const data = JSON.parse(localStorage.getItem("comments"))
        data[draggingElem.id].xCoordinate = `${leftValue + event.movementX}`
        data[draggingElem.id].yCoordinate = `${topValue + event.movementY}`
        localStorage.setItem("comments", JSON.stringify(data))
    }

});




