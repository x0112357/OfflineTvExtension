var members;

loadMembers();

function loadMembers(){
    var xhttp = new XMLHttpRequest();
    var url = "https://exzerobots.com/offlineTV/DB/members.json?r="+Math.random();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var model = JSON.parse(this.responseText);
            setMembers(model);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function setMembers(model){
    members = model;
    showUserInfo();
}

setInterval(function(){
    getStreamInfo();
},1000);

var xmlhttp = new XMLHttpRequest();

function getStreamInfo() {

var membersString = "";
for(var i = 0; i < members.length-1; i++) {
    membersString += members[i].twitchId+",";
}
membersString += members[members.length-1].twitchId;

var url = "https://api.twitch.tv/kraken/streams/?channel="+membersString+"&m="+Math.random();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var obj = JSON.parse(this.responseText);  
        chrome.browserAction.setBadgeBackgroundColor({color: [200, 20, 20, 128]});
        chrome.browserAction.setBadgeText({text: ''+ obj.streams.length});
        console.log(obj.streams.length);
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.setRequestHeader("Client-ID", "qvirwe4mbsponra5zrep3v00ogfkjf");
xmlhttp.send();
}

