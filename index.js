const comments = JSON.parse(localStorage.getItem("comments")) || []

var iframe = document.getElementById('myIframe');
var commentSection = document.getElementsByClassName('commentsSections')[0]
let pendingComment = false;
let xCoordinate, yCoordinate;

iframe.addEventListener('load', function () {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    let iframeBody = iframeDoc.querySelector("body")
    iframeBody.style = "user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
    if (comments.length) {
        comments?.forEach((val, index) => {
            let newlyCreatedNode = craeteNewCommentNode(index + 1, index, val?.xCoordinate, val?.yCoordinate)
            let newlyCreatedComment = createNewCommentContainer(val?.comment, index, parseInt(val?.xCoordinate) + 50, parseInt(val?.yCoordinate))

            addHoverEvent(newlyCreatedNode, newlyCreatedComment)
            addDragEvent(newlyCreatedNode)
            // const node = iframeDoc.createElement("p");
            // const textnode = document.createTextNode(index + 1);
            // node.appendChild(textnode);
            // node.classList.add('commentNode')
            // node.id = index
            // node.style = `position: absolute;width: 40px; height: 40px;top: ${val?.yCoordinate}px;left: ${val?.xCoordinate}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
            // node.addEventListener('click', nodeClick)
            // iframeDoc.body.appendChild(node);
            // addDragEvent(iframeDoc)
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
        var scrollLeft = iframe.contentWindow.scrollX || iframe.contentDocument.documentElement.scrollLeft;
        var scrollTop = iframe.contentWindow.scrollY || iframe.contentDocument.documentElement.scrollTop;
        createNewComment(iframeDoc, comments.length + 1, x, scrollTop + y)
    });
    iframeDoc.addEventListener("mouseup", (event) => {
        let draggableElemnts = iframeDoc.querySelectorAll(".commentNode")
        draggableElemnts.forEach((val, index) => {
            val.removeEventListener("mousemove", onMouseDrag);
        })
    });

    function createNewComment(iframeDoc, number, x, y) {
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
        let newlyCreatedNode = craeteNewCommentNode(number, comments.length, x - 20, y - 20)
        addDragEvent(newlyCreatedNode)
        // const node = iframeDoc.createElement("p");
        // const textnode = document.createTextNode(number);
        // node.appendChild(textnode);
        // node.classList.add('commentNode')
        // node.id = comments.length
        // node.style = `position: absolute;width: 40px; height: 40px;top: ${y - 20}px;left: ${x - 20}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
        // node.addEventListener('click', nodeClick)
        // iframeDoc.body.appendChild(node);
        // addDragEvent(iframeDoc)

        xCoordinate = x - 20
        yCoordinate = y - 20
        pendingComment = true
    }

    function craeteNewCommentNode(commentNumber, commentId, xAxis, yAxis) {
        const node = iframeDoc.createElement("p");
        const textnode = document.createTextNode(commentNumber);
        node.appendChild(textnode);
        node.classList.add('commentNode')
        node.id = commentId
        node.style = `position: absolute;width: 40px; height: 40px;top: ${yAxis}px;left: ${xAxis}px;display: flex;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF;border-radius: 50%;cursor: pointer;`
        node.addEventListener('click', nodeClick)
        iframeDoc.body.appendChild(node);
        // addDragEvent(iframeDoc)

        return node
    }

    function createNewCommentContainer(comment, id, xAxis, yAxis) {
        const commentContainer = iframeDoc.createElement("div");
        const textnode = document.createTextNode(comment);
        commentContainer.appendChild(textnode);
        commentContainer.classList.add('commentContainer')
        commentContainer.id = id
        commentContainer.style = `display: none; padding: 5px 10px;position: absolute; top: ${yAxis}px;left: ${xAxis}px;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF; background-color: red;`
        iframeDoc.body.appendChild(commentContainer);
        return commentContainer
    }

    function addDragEvent(newlyCreatedNode) {
        // let draggableElemnts = iframeDoc.querySelectorAll(".commentNode")

        // REMOVING PREVIOS EVENTS
        // draggableElemnts.forEach((val, index) => {
        //     val.removeEventListener('mousedown', onMouseDownHandler)
        // })

        // ADDING NEW EVENTS
        // draggableElemnts.forEach((val, index) => {
        //     val.addEventListener('mousedown', onMouseDownHandler)
        // })
        console.log(newlyCreatedNode)
        newlyCreatedNode.addEventListener('mousedown', onMouseDownHandler)
    }

    function onMouseDownHandler(event) {
        event.target.addEventListener("mousemove", onMouseDrag);
    }

    function onMouseDrag(event) {
        event.stopPropagation()
        const commentContainer = iframeDoc.body.querySelectorAll('.commentContainer')
        commentContainer[event.target.id].style.display = 'none'

        // UPDATING NODE POSITION ON DRAG
        let draggingElem = event.target
        let getContainerStyle = window.getComputedStyle(draggingElem);
        let leftValue = parseInt(getContainerStyle.left);
        let topValue = parseInt(getContainerStyle.top);
        draggingElem.style.left = `${leftValue + event.movementX}px`;
        draggingElem.style.top = `${topValue + event.movementY}px`;

        // UPDATING COMMENT POSITION OF DRAGGED NODE
        commentContainer[event.target.id].style.left = `${leftValue + event.movementX + 50}px`;
        commentContainer[event.target.id].style.top = `${topValue + event.movementY}px`;

        // UPDATING IN LOCAL ARRAY
        comments[draggingElem.id].xCoordinate = `${leftValue + event.movementX}`
        comments[draggingElem.id].yCoordinate = `${topValue + event.movementY}`

        // UPDATING IN LOCAL STORAGE FOR REFRESH 
        const data = JSON.parse(localStorage.getItem("comments"))
        data[draggingElem.id].xCoordinate = `${leftValue + event.movementX}`
        data[draggingElem.id].yCoordinate = `${topValue + event.movementY}`
        localStorage.setItem("comments", JSON.stringify(data))
    }

    function nodeClick(event) {
        event.stopPropagation()
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

        // CREATING COMMENT CONTAINER
        let newlyComment = createNewCommentContainer(comment, comments.length - 1, xCoordinate + 50, yCoordinate)
        // const commentContainer = iframeDoc.createElement("div");
        // const textnode = document.createTextNode(comment);
        // commentContainer.appendChild(textnode);
        // commentContainer.classList.add('commentContainer')
        // commentContainer.id = comments.length - 1
        // commentContainer.style = `display: none; padding: 5px 10px;position: absolute; top: ${yCoordinate}px;left: ${xCoordinate + 50}px;align-items: center;justify-content: center;z-index: 1000;background-color: #83B4FF; background-color: red;`
        // iframeDoc.body.appendChild(commentContainer);

        let newlyCreatedNode = commentNodes[commentNodes.length - 1]
        let newlyCreatedComment = newlyComment
        addHoverEvent(newlyCreatedNode, newlyCreatedComment)
        // commentNodes[comments.length - 1].addEventListener('mouseover', (event) => {
        //     allCommentContainer[event.target.id].style.display = 'flex'
        // })

        // commentNodes[comments.length - 1].addEventListener('mouseout', (event) => {
        //     allCommentContainer[event.target.id].style.display = 'none'
        // })


        localStorage.setItem("comments", JSON.stringify(comments));
    }

    function addHoverEvent(commentNode, commentContainer) {
        commentNode.addEventListener('mouseover', (event) => {
            commentContainer.style.display = 'flex'
        })

        commentNode.addEventListener('mouseout', (event) => {
            commentContainer.style.display = 'none'
        })
    }
});


