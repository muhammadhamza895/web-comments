var iframe = document.getElementById('myIframe');
var comments = localStorage.getItem("markupComment") || JSON.stringify([])
iframe.addEventListener('load', function () {
    var iframeWindow = iframe.contentWindow;
    iframeWindow.postMessage(comments, '*')
})

window.addEventListener('message', function (event) {
    console.log('Received message (Parent):', event.data);
    const data = JSON.parse(localStorage.getItem("markupComment")) || []
    const comingData = JSON.parse(event?.data?.data)
    if (data[comingData.id]) {
        if ((data[comingData.id].xCoordinate != comingData.xCoordinate) || (data[comingData.id].xCoordinate != comingData.xCoordinate)) {
            data[comingData.id] = comingData
            localStorage.setItem("markupComment", JSON.stringify(data))
            console.log('update')
        }
        return
    }
    data.push(comingData)
    localStorage.setItem("markupComment", JSON.stringify(data))
}, false);



{/* <script>
  window.Wized = window.Wized || [];
  var iframe = document.getElementById("myIframe");
  iframe.addEventListener("load", function () {
    console.log("iframe loaded", window.Wized);
    window.Wized.push((Wized) => {
      const comments = Wized.data.v.filtered_comments || [];
      const iframeWindow = iframe.contentWindow;
      iframeWindow.postMessage(
        {
          target: "markup-comments",
          data: JSON.stringify(comments),
        },
        "*"
      );
    });
  });
  window.addEventListener(
    "message",
    function (event) {
      console.log("Received message (Parent):", event.data);
      console.log('recieved')
      if (event.data?.target === "markup-comments") {
      console.log('condition chk')
          const parsedComments = JSON.parse(event.data?.data) || [];
      const { comment: content = "", ...restOfCommentData } =
            parsedComments[parsedComments.length - 1] || {};
      window.Wized.push((Wized) => {
        Wized.data.v.filtered_comments = [
          ...Wized.data.v.filtered_comments,
          {
            content,
            ...restOfCommentData,
          },
        ];
      });
    }
    },
    false
  );
</script>  */}


// window.addEventListener(
//     "message",
//     function (event) {
//         console.log("Received message (Parent):", event.data);
//         if (event.data?.target === "markup-comments") {
//             console.log('condition chk')
//             const parsedComments = JSON.parse(event.data?.data) || [];
//             const { comment: content = "", ...restOfCommentData } =
//                 parsedComments || {};
//             console.log(content)
//             console.log(restOfCommentData)
//             window.Wized.push((Wized) => {
//                 let data = Wized.data.v.filtered_comments
//                 if (data[restOfCommentData?.id]) {
//                     if ((data[restOfCommentData.id].xCoordinate != restOfCommentData.xCoordinate) || (data[restOfCommentData.id].xCoordinate != restOfCommentData.xCoordinate)) {
//                         data[restOfCommentData.id] = {
//                             content,
//                             ...restOfCommentData,
//                         }
//                         console.log('update')
//                     }
//                     return
//                 }
//                 Wized.data.v.filtered_comments = [
//                     ...Wized.data.v.filtered_comments,
//                     {
//                         content,
//                         ...restOfCommentData,
//                     },
//                 ];
//             });
//         }
//     },
//     false
// );