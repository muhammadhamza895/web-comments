// PARENT DATA
let parentSource, message;

window.addEventListener('message', async function (event) {
    console.log('Received message (iframe):', event.data);
    if (event.data?.target === 'markup-comments') {
        message = await JSON.parse(event.data?.data)
        parentSource = event.source
        setupIframe()
    }
}, false);

function setupIframe() {
    const comments = message

    var iframe = document.getElementById('myIframe');
    var commentSection = document.getElementsByClassName('commentsSections')[0]
    let pendingComment = false;
    let xCoordinate, yCoordinate;
    let dragElem, dragElemId;

    let iframeBody = document.querySelector("body")
    iframeBody.style = "user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; overflow-x: hidden;"

    var windowWidth = window.innerWidth;
    if (comments.length) {
        comments?.forEach((val, index) => {
            let newlyCreatedNode = craeteNewCommentNode(index + 1, index, val?.xCoordinate, val?.yCoordinate, windowWidth)
            let newlyCreatedComment = createNewCommentContainer(val?.comment, index, parseInt(newlyCreatedNode.style.left) + 50, parseInt(val?.yCoordinate), windowWidth)

            addHoverEvent(newlyCreatedNode, newlyCreatedComment)
            addDragEvent(newlyCreatedNode)
        })
        localStorage.setItem("comments", JSON.stringify(comments))
    }
    else {
        localStorage.removeItem("comments");
    }
    document.addEventListener('click', function (event) {
        if (pendingComment) {
            let commentNodes = document.querySelectorAll('.commentNode')
            if (commentNodes.length) {
                commentNodes[comments.length].remove()
                document.body.querySelector('#inputCommentId').remove()
                document.body.querySelector('#subitCommentButton').remove()
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
        var scrollTop = window.scrollY;
        createNewComment(comments.length + 1, x, scrollTop + y)
    });
    document.addEventListener("mouseup", (event) => {
        const commentContainer = document.body.querySelectorAll('.commentContainer')
        if (commentContainer[dragElemId]) {
            commentContainer[dragElemId].style.visibility = 'initial'
        }
        const clickedElemVerification = (event.target.id && event.target.classList[0] == 'commentNode')
        if (comments.length && clickedElemVerification) {
            const data = JSON.parse(localStorage.getItem("comments"))[event.target.id]
            uploadComment(data)
        }
        document.removeEventListener("mousemove", onMouseDrag);
    });

    function createNewComment(number, x, y) {
        // CREATING COMMENT POINTER
        let newlyCreatedNode = craeteNewCommentNode(number, comments.length, x - 20, y - 20, windowWidth)
        let newNodeXPosition = parseInt(newlyCreatedNode.style.left)
        let newNodeYPosition = parseInt(newlyCreatedNode.style.top)

        // CREATING COMMENT INPUT ELEMENT
        let inputELemWidth = 250
        let inputELemHeight = 35

        const inputElem = document.createElement("input");
        inputElem.type = "text";
        inputElem.classList.add('inputComment')
        inputElem.setAttribute('wized', 'marker_input')
        inputElem.id = 'inputCommentId'
        inputElem.style = `
        position: absolute;width: ${inputELemWidth}px;height : ${inputELemHeight}px; top: ${newNodeYPosition + 10}px;left: ${newNodeXPosition + 40 + 10}px; z-index: 1000; color: black; border-radius: 8px; border: solid 2px #0E46A3; outline: none !important;`
        inputElem.addEventListener('click', nodeClick)

        // CREATING SUBMIT COMMENT BUTTON
        const submitComment = document.createElement("button");
        submitComment.innerText = "Submit"
        submitComment.setAttribute('wized', 'comment_submit_button')
        submitComment.id = 'subitCommentButton'
        submitComment.style = `position: absolute;width: 70px; top: ${newNodeYPosition + inputELemHeight + 20}px;left: ${newNodeXPosition + 40 + 10}px; z-index: 1000; color: black;border-radius: 8px;`
        submitComment.addEventListener("click", saveComment)


        let positionCondition = parseInt(inputElem.style.left) + parseInt(inputElem.style.width) + 10
        if (positionCondition >= windowWidth) {
            let updatedInputElemPosition = parseInt(inputElem.style.left) - inputELemWidth - 50 - 10
            let updatedSubmitBtnPosition = parseInt(submitComment.style.left) - parseInt(submitComment.style.width) - 50 - 10
            inputElem.style.left = updatedInputElemPosition + 'px'
            submitComment.style.left = updatedSubmitBtnPosition + 'px'

        }

        document.body.appendChild(inputElem);
        document.body.appendChild(submitComment);

        addDragEvent(newlyCreatedNode)

        xCoordinate = x - 20
        yCoordinate = y - 20
        pendingComment = true
    }

    function saveComment(event) {
        event.stopPropagation()
        const comment = document.body.querySelector('#inputCommentId').value
        let commentNodes = document.querySelectorAll('.commentNode')
        if (!comment) {
            commentNodes[comments.length].remove()
            document.body.querySelector('#inputCommentId').remove()
            document.body.querySelector('#subitCommentButton').remove()
            pendingComment = false;
            return
        }
        document.body.querySelector('#inputCommentId').remove()
        document.body.querySelector('#subitCommentButton').remove()
        pendingComment = false
        const newComment = {
            xCoordinate,
            yCoordinate,
            comment,
            id: comments.length
        }
        comments.push(newComment)
        let newlyCreatedNode = commentNodes[commentNodes.length - 1]
        let newNodeXPostion = parseInt(newlyCreatedNode.style.left)
        let newlyComment = createNewCommentContainer(comment, comments.length - 1, newNodeXPostion + 50, yCoordinate, windowWidth)
        addHoverEvent(newlyCreatedNode, newlyComment)
        uploadComment(newComment)
        localStorage.setItem("comments", JSON.stringify(comments));
    }

    function uploadComment(uploadindData) {
        console.log('sending',{
            target: 'markup-comments',
            data: uploadindData
        })
        if (uploadindData) {
            parentSource.postMessage({
                target: 'markup-comments',
                data: JSON.stringify(uploadindData)
            }, '*')
        }
    }

    // DOM ELEMENT CREATOR FUNCTIONS
    function craeteNewCommentNode(commentNumber, commentId, xAxis, yAxis, browserWidth) {
        let nodeWidth = 40
        const node = document.createElement("p");
        const textnode = document.createTextNode(commentNumber);
        node.appendChild(textnode);
        node.classList.add('commentNode')
        node.setAttribute('wized', 'comment_node')
        node.id = commentId
        node.style = `position: absolute;width: ${nodeWidth}px; height: 40px;top: ${yAxis}px;left: ${xAxis}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
        node.addEventListener('click', nodeClick)
        if (parseInt(xAxis) + nodeWidth + 20 >= browserWidth) {
            let updatedXAxisPosition = xAxis - (nodeWidth / 2)
            node.style.left = updatedXAxisPosition + 'px'
        }
        document.body.appendChild(node);
        return node
    }

    function createNewCommentContainer(comment, id, xAxis, yAxis, browserWidth) {
        const commentContainer = document.createElement("div");
        const textnode = document.createTextNode(comment);
        commentContainer.appendChild(textnode);
        commentContainer.classList.add('commentContainer')
        commentContainer.id = id
        commentContainer.style = `opacity: 0;border-radius: 8px; padding: 5px 10px;position: absolute; top: ${yAxis}px;left: ${xAxis}px;align-items: center;justify-content: center;z-index: 1100; background-color: #31363F; pointer-events: none;`
        document.body.appendChild(commentContainer);
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
            commentContainer.style.pointerEvents = 'initial'
            commentContainer.style.opacity = '1'
        })

        commentNode.addEventListener('mouseout', () => {
            commentContainer.style.pointerEvents = 'none'
            commentContainer.style.opacity = '0'
        })
    }

    function addDragEvent(newlyCreatedNode) {
        newlyCreatedNode.addEventListener('mousedown', onMouseDownHandler)
    }

    function onMouseDownHandler(event) {
        dragElem = event.target
        dragElemId = event.target.id
        document.addEventListener("mousemove", onMouseDrag);
    }

    function onMouseDrag(event) {
        // console.log(dragElem)
        // console.log(dragElemId)
        event.stopPropagation()
        const commentContainer = document.body.querySelectorAll('.commentContainer')
        if (commentContainer[dragElemId]) {
            commentContainer[dragElemId].style.opacity = '0'
            commentContainer[dragElemId].style.visibility = 'hidden'

            // UPDATING NODE POSITION ON DRAG
            let draggingElem = dragElem
            let getContainerStyle = window.getComputedStyle(dragElem);
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
            comments[draggingElem.id].xCoordinate = leftValue + event.movementX
            comments[draggingElem.id].yCoordinate = topValue + event.movementY

            // UPDATING IN LOCAL STORAGE FOR REFRESH
            const data = JSON.parse(localStorage.getItem("comments"))
            data[draggingElem.id].xCoordinate = `${leftValue + event.movementX}`
            data[draggingElem.id].yCoordinate = `${topValue + event.movementY}`
            localStorage.setItem("comments", JSON.stringify(data))
        }
    }

}






