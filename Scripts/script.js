window.onload = function() {
    showUserInfo();
};

var members = [
    {name:"Scarra", id:"UCan_L4XHfSbCKaTCcntyLTQ", twitchId:"scarra"},
    {name:"Pokimane", id:"UChXKjLEzAB1K7EZQey7Fm1Q", twitchId:"pokimane"},
    {name:"Lilypichu", id:"UCvWU1K29wCZ8j1NsXsRrKnA", twitchId:"lilypichu"},
    {name:"Disguised Toast", id:"UCUT8RoNBTJvwW1iErP6-b-A", twitchId:"disguisedtoasths"},
    {name:"Fedmyster", id:"UCOmXyEquWIIo1uAj_2LN4UA", twitchId:"fedmyster"},
    {name:"Xell", id:"UCksmCymEjGvxXEkcRWR8wbQ", twitchId:"xell_stream"},
    {name:"TheeMarkZ", id:"UCU74OVWGSmJqR1g6y-tgUHQ", twitchId:"theemarkz"},
    {name:"Based Yoona", id:"UC8GNFT4yPKeSOzPgYmmikuw", twitchId:"based_yoona"},
    {name:"Pecca", id:"UCHErZgBloHNYX6Uu_dsBVxg", twitchId:"peccapecca"},
    {name:"Albert", id:"UCrDQW9kAElm707c5z6d5r7Q", twitchId: "sleightlymusical"},
    {name:"Chris", id:null, twitchId:"chrischantor", image:"https://pbs.twimg.com/profile_images/925529875695378432/m1qkOYYA_400x400.jpg"},
    {name:"Kimi", id:"UCqssxU4UBzijbdTH3r5Losw", twitchId:"angelskimi", friends: "true"},
    {name:"Janet", id:"UCdH7fwkQ5RGVAMIAN2ufm4Q", twitchId:"xchocobars", friends: "true"},
    {name:"Jamie", id:"UCGkquZAQRiSoWTrHufGKgeg", twitchId: "igumdrop", friends: "true"},
    {name:"Aria", id:"UCitxA9Sa_GxxGSqNJEWRbuA", twitchId:"ariasaki", friends:"true"},
    {name:"Fuslie", id:"UCujyjxsq5FZNVnQro51zKSQ", twitchId: "fuslie", friends: "true"}

];

var xmlhttp = new XMLHttpRequest();

function showUserInfo(){

var channelID = "";
for(var i = 0; i < members.length-1; i++) {
    channelID += members[i].id+",";
}
channelID += members[members.length-1].id;

var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id="+channelID+"&key=AIzaSyAL50nHkaW2PQT_2LBmjnaZcaXl2bTzVG0";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var info = JSON.parse(xmlhttp.responseText);
        updateModel(info);
        renderUserInfo();
        getStreamInfo();
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.send();
}

function getTwitchIndex(twitchId) {
    for(var i = 0; i < $(".member").length; i++){
        if($($(".member")[i]).attr("twitch-id") == twitchId) {
            return i;
        }
    }
    return 0;
}

function getIndex(info, channelId){
    for(var i = 0; i < info.items.length; i++) {
        if(info.items[i].id == channelId){
            return i;
        }
    }
    return 0;
}

//function to updateModel
function updateModel(info) {
    for(var i = 0; i < members.length; i++){
        var index = getIndex(info,members[i].id);
        if(!members[i].image) {
            members[i].image = info.items[index].snippet.thumbnails.high.url;
            members[i].subCount = info.items[index].statistics.subscriberCount;
        }
    }
}

function updateModelTwitch(info) {
    for(var i = 0; i < info.streams.length; i++) {
        var index = getTwitchIndex(info.streams[i].channel.name);
        members[index].viewers = info.streams[i].viewers;
        $($(".member")[index]).find(".twitchField").html("<a target='_blank' style='text-decoration:none;font-family:arial;color:white;font-weight:bold;' href='http://twitch.tv/"+members[index].twitchId+"'><img style='resize:both;height:20px;position:relative;top:0px;margin-right:2px;' src='./Media/Icons/twitch.png'>Live</a><span style='display:inline-block;height:10px;width:10px;border-radius:100%;background-color:red;margin-left:5px;'> </span> <span class='glyphicon openModal glyphicon-share'></span>");
        $($(".member")[index]).find(".twitchField").addClass("active");
        if(!($($(".member")[index]).hasClass("friend"))) {
            pushItToTop(index);
        }
    }
    $(".openModal").click(function(event){
        openModal(event);
    });
}

function pushItToTop(index) {
    for(var i = 0; i < $(".member").length; i++){
        if(!($($(".member")[i]).find(".twitchField").hasClass("active")) && !$($(".member")[i]).hasClass("friends")) {
            $($(".member")[index]).insertBefore($($(".member")[i]));
            break;
        }
    }
}

function getStreamInfo() {

var membersString = "";
for(var i = 0; i < members.length-1; i++) {
    membersString += members[i].twitchId+",";
}
membersString += members[members.length-1].twitchId;

var url = "https://api.twitch.tv/kraken/streams/?channel="+membersString

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var obj = JSON.parse(this.responseText);
        console.log(JSON.parse(this.responseText));
        updateModelTwitch(obj);
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.setRequestHeader("Client-ID", "qvirwe4mbsponra5zrep3v00ogfkjf");
xmlhttp.send();
}

function renderUserInfo() {
    for(var i = 0; i < members.length; i++){ 
        var row = jQuery("<div>", {
          style:"width:280px;heigth:70px;margin-top:5px;",
          class:"member",
          "data-channelId": members[i].id,
          "twitch-id": members[i].twitchId
        });

        if(!members[i].friends) { 
            row.appendTo("#membersList");  
        } else {
            row.appendTo("#memberFriends");
            row.addClass("friend");
        }

        var image = jQuery("<div>", {
                style:"border-radius:5px;width:50px;height:50px;display:inline-block;background-image:url('"+members[i].image+"');background-size:cover;margin-left:5px;",
        }).appendTo(row);

       if(members[i].id != null) {
            var subs = jQuery("<div>", {
                html: "<a style='text-decoration:none;font-family:arial;color:white' target='_blank' href='http://youtube.com/channel/"+members[i].id+"'> <img style='resize:both;height:10px;position:relative;top:0px;margin-right:5px;' src='./Media/Icons/youtube.png'>"+members[i].subCount+"</a>",
                style: "display:inline-block;margin-left:10px;position:relative;bottom:20px;",
                class: "youtubeDiv"
            }).appendTo(row);

        } else {
            var subs = jQuery("<div>", {
                html: "<img style='resize:both;height:10px;position:relative;top:0px;margin-right:5px;opacity:0.1;' src='./Media/Icons/youtube.png'> n/a",
                style:"display:inline-block;margin-left:10px;position:relative;bottom:20px;",
                class: "youtubeDiv"
            }).appendTo(row);
        }

        var liveStatus = jQuery("<div>", {
            style:"display:inline-block;float:right;position:relative;top:15px;margin-right:7px;",
            class: "twitchField"
        });
        liveStatus.html("<a target='_blank' style='text-decoration:none;font-family:arial;color:grey' href='http://twitch.tv/"+members[i].twitchId+"'><img style='resize:both;height:20px;position:relative;top:0px;margin-right:5px;' src='./Media/Icons/twitch.png'>Offline</a> <span style='color:rgba(255,255,255,0.5);' class='glyphicon glyphicon-share openModal'></span>");
        liveStatus.appendTo(row);

    }
    $(".openModal").click(function(event){
        openModal(event);
    });
}

function openModal(event) {
    var channel = $(event.target).closest(".member").attr("twitch-id");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {channel: channel}, function(response) {
            console.log(response.farewell);
        });
    });
}

//function to update notification counter
function updateNotifications() {

var membersString = "";
for(var i = 0; i < members.length-1; i++) {
    membersString += members[i].twitchId+",";
}
membersString += members[members.length-1].twitchId;

var url = "https://api.twitch.tv/kraken/streams/?channel="+membersString+"?m="+Math.random();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var obj = JSON.parse(this.responseText);   
        chrome.browserAction.setBadgeBackgroundColor({color: [150, 150, 150, 128]});
        chrome.browserAction.setBadgeText({text: ''+ obj.streams.length});
        console.log(obj.streams.length);
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.setRequestHeader("Client-ID", "qvirwe4mbsponra5zrep3v00ogfkjf");
xmlhttp.send();
}