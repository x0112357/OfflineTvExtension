/*setInterval(function(){
loadServerMessage();
}, 1000);*/

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
  		style:"position:fixed;z-index:5000;width:450px;height:300px;bottom:5px;left:5px;background-color:#262626;font-family:arial;",
  		id:"twitchWindow_"+channel,
      class:"twitchPopup"
  	}).prependTo($("body"));

  	var header = $("<div>", {
  		style:"width:100%;height:13%;display:inline-block;background-color:#262626;cursor:pointer;margin-bottom:0px;color:white;text-align:center;padding-top:8px;font-size:14px;",
  		id:"twitchWindowHeader",
  		html: "<span style='float:left;margin-left:5px;display:inline-block;margin-bottom:0px;'> <b>"+channel+"</b> </span> <span class='resizeModal' data-value='3'> </span> <span class='resizeModal' data-value='2'> </span> <span class='resizeModal' data-value='1'> </span> <span class='resizeModal active' data-value='0'> </span> <span class='removeModal' style='float:right;display:inline-block;color:rgba(255,255,255,0.5);font-weigth:bold;margin-right:10px;margin-bottom:3px;'> X </span>"
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

    $(".resizeModal").click(function(event){
      resizeModal(event);
    });

    //change resize modal
    modal.find(".resizeModal").attr("style", "display:inline-block;width:10px;height:10px;border-radius:100%;background-color:rgba(255,255,255,0.5);margin-right:5px;margin-top:3px;float:right;").filter(".active").attr("style", $(".resizeModal").filter(".active").attr("style").replace("background-color:rgba(255,255,255,0.5);","background-color:rgba(255,255,255,0.9);"));

  	//Make the DIV element draggagle:
  	dragElement(document.getElementById(("twitchWindow_"+channel)));
  }
}

function closeModal(event) {
	$(event.target).closest(".twitchPopup").remove();
}

var modalIncrement = [1,1.2,1.4,1.6];

var w = 450;
var h = 300;

var modalIndex = 0;;

function resizeModal(event) {
  modalIndex = $(event.target).attr("data-value");
  var ratio = modalIncrement[modalIndex];
  $(event.target).closest(".twitchPopup").width(w*ratio);
  $(event.target).closest(".twitchPopup").height(h*ratio);
  $(".resizeModal").removeClass("active");
  $(event.target).addClass("active");
  //change resize modal
  $(event.target).closest(".twitchPopup").find(".resizeModal").attr("style", "display:inline-block;width:10px;height:10px;border-radius:100%;background-color:rgba(255,255,255,0.5);margin-right:5px;margin-top:3px;float:right;").filter(".active").attr("style",$(".resizeModal").filter(".active").attr("style").replace("background-color:rgba(255,255,255,0.5);","background-color:rgba(255,255,255,0.9);"));
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

var xhttp = new XMLHttpRequest();

//function to read messages
function loadServerMessage() {
  var url = "https://exzerobots.com/offlineTV/DB/serverMessage.json?"+Math.random();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var message = JSON.parse(this.responseText);
      var prevMessage = getPreviousMessage();
      if(message.currentMessage != "NULL" && prevMessage != message.currentMessage) {
        alert(message.currentMessage);
        var oldMessage = {
          message: message.currentMessage
        };
        localStorage.setItem("exzerobotsMessage",JSON.stringify(message));
      }
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}

//funciton to load the previous message from server
function getPreviousMessage() {
  if(localStorage.getItem("exzerobotsMessage")) {
    return JSON.parse(localStorage.getItem("exzerobotsMessage")).currentMessage;
  } else {
    return "NONE";
  }
}