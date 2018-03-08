chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url :"from the extension");
        if (request.channel) {
            renderModal(request.channel);
            sendResponse({farewell: "goodbye"});
        }
});

function renderModal(channel) {
	if($("#twitchWindow")){
		$("#twitchWindow").remove();
	}
	var modal = $("<div>", {
		style:"position:fixed;z-index:5000;width:450px;height:310px;border:1px solid black;bottom:5px;left:5px;background-color:white;font-family:arial;",
		id:"twitchWindow"
	}).prependTo($("body"));

	var header = $("<div>", {
		style:"width:100%;height:15%;display:inline-block;background-color:#6441a4;cursor:pointer;margin-bottom:0px;color:white;text-align:center;padding-top:5px;font-size:14px;",
		id:"twitchWindowHeader",
		html: "<b>"+channel+"</b> <span class='removeModal' style='float:right;display:inline-block;color:rgba(255,255,255,0.4);font-weigth:bold;margin-right:5px;margin-bottom:3px;'> X </span>"
	}).appendTo(modal);

	var body = $("<div>", {
		style:"width:100%;height:85%;display:inline-block;background-color:grey;pointer:cursor;margin-bottom:0px;",
	}).appendTo(modal);

	var iframe = $("<iframe>", {
		src:"https://player.twitch.tv/?channel="+channel,
		style:"width:100%;height:99%;border:none;margin-top:0"
	}).appendTo(body);

	$(".removeModal").click(function(){
		closeModal();
	});

	//Make the DIV element draggagle:
	dragElement(document.getElementById(("twitchWindow")));
}

function closeModal() {
	if($("#twitchWindow")){
		$("#twitchWindow").remove();
	}
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id+"Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id+"Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}