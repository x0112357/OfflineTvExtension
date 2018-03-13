chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url :"from the extension");
        if (request.channel) {
            renderModal(request.channel);
            sendResponse({farewell: "goodbye"});
        }
});

function renderModal(channel) {
	if($("#twitchWindow_"+channel).length <= 0){
  	var modal = $("<div>", {
  		style:"position:fixed;z-index:5000;width:450px;height:300px;bottom:5px;left:5px;background-color:white;font-family:arial;",
  		id:"twitchWindow_"+channel,
      class:"twitchPopup"
  	}).prependTo($("body"));

  	var header = $("<div>", {
  		style:"width:100%;height:10%;display:inline-block;background-color:#262626;cursor:pointer;margin-bottom:0px;color:white;text-align:center;padding-top:8px;font-size:14px;",
  		id:"twitchWindowHeader",
  		html: "<b>"+channel+"</b> <span class='removeModal' style='float:right;display:inline-block;color:rgba(255,255,255,0.5);font-weigth:bold;margin-right:10px;margin-bottom:3px;'> X </span>"
  	}).appendTo(modal);

  	var body = $("<div>", {
  		style:"width:100%;height:99%;display:inline-block;background-color:grey;pointer:cursor;margin-bottom:0px;",
  	}).appendTo(modal);

  	var iframe = $("<iframe>", {
  		src:"https://player.twitch.tv/?channel="+channel,
  		style:"width:100%;height:99%;border:none;margin-top:0"
  	}).appendTo(body);

  	$(".removeModal").click(function(){
  		closeModal(event);
  	});

  	//Make the DIV element draggagle:
  	dragElement(document.getElementById(("twitchWindow_"+channel)));
  }
}

function closeModal(event) {
	$(event.target).closest(".twitchPopup").remove();
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id+"Header")) {
    document.getElementById(elmnt.id+"Header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}