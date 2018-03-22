window.onload = function() {
    showUserInfo();
    //initializing tooltips
    $('[data-toggle="tooltip"]').tooltip();
};

var xmlhttp = new XMLHttpRequest();

var members = [
    {name:"Scarra", id:"UCan_L4XHfSbCKaTCcntyLTQ", twitchId:"scarra", twitter:"scarra"},
    {name:"Pokimane", id:"UChXKjLEzAB1K7EZQey7Fm1Q", twitchId:"pokimane", twitter:"pokimanelol"},
    {name:"Lilypichu", id:"UCvWU1K29wCZ8j1NsXsRrKnA", twitchId:"lilypichu", twitter:"lilypichu"},
    {name:"Disguised Toast", id:"UCUT8RoNBTJvwW1iErP6-b-A", twitchId:"disguisedtoasths", twitter:"disguisedtoast"},
    {name:"Fedmyster", id:"UCOmXyEquWIIo1uAj_2LN4UA", twitchId:"fedmyster", twitter:"fedmyster"},
    {name:"Xell", id:"UCksmCymEjGvxXEkcRWR8wbQ", twitchId:"xell_stream", twitter:"xelltweets"},
    {name:"TheeMarkZ", id:"UCU74OVWGSmJqR1g6y-tgUHQ", twitchId:"theemarkz", twitter:"theemarkz"},
    {name:"Based Yoona", id:"UC8GNFT4yPKeSOzPgYmmikuw", twitchId:"based_yoona", twitter:"basedyoona"},
    {name:"Chris", id:null, twitchId:"chrischantor", image:"https://pbs.twimg.com/profile_images/925529875695378432/m1qkOYYA_400x400.jpg", twitter: "chrischanto"},
    {name:"Pecca", id:"UCHErZgBloHNYX6Uu_dsBVxg", twitchId:"peccapecca", twitter:"peccapecca"},
    {name:"Albert", id:"UCrDQW9kAElm707c5z6d5r7Q", twitchId: "sleightlymusical", twitter:"THEalbertchang"},
    {name:"Kimi", id:"UCqssxU4UBzijbdTH3r5Losw", twitchId:"angelskimi", friends: "true", twitter: "AngelsKimi"},
    {name:"Janet", id:"UCdH7fwkQ5RGVAMIAN2ufm4Q", twitchId:"xchocobars", friends: "true", twitter: "xChocoBars"},
    {name:"Jamie", id:"UCGkquZAQRiSoWTrHufGKgeg", twitchId: "igumdrop", friends: "true", twitter: "iGumdrop_"},
    {name:"Aria", id:"UCitxA9Sa_GxxGSqNJEWRbuA", twitchId:"ariasaki", friends:"true", twitter: "ariasaki"},
    {name:"Fuslie", id:"UCujyjxsq5FZNVnQro51zKSQ", twitchId: "fuslie", friends: "true", twitter: "fuslie"},
    {name:"Yellowpaco", id:"UC0WpDW_SigANjRWBI1USgYw", twitchId:"yellowpaco", friends: "true", twitter: "yellowpaco"}
];

function loadPictures(index) {

var url = "https://api.twitch.tv/kraken/channels/"+members[index].twitchId;

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var stream = JSON.parse(this.responseText);
        if(index < members.length-1) {
            setPictureModel(index, stream.logo);
            index++;
            loadPictures(index);
        } else {
            setPictureModel(index, stream.logo);
            showUserInfo();
        }
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.setRequestHeader("Client-ID", "qvirwe4mbsponra5zrep3v00ogfkjf");
xmlhttp.send();
}

function setPictureModel(index, url) {
    members[index].image = url;
}

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
    var model = $(".member");
    var index = 0;
    for(var i = 0; i < model.length; i++){
        if($(model[i]).attr("twitch-id") == twitchId) {
            index = i;
            break;
        }
    }
    var classId = null;
    if($(model[index]).hasClass("friend")) {
        model = $("#memberFriends").find(".member");
        for(var i = 0; i < model.length; i++){
            if($(model[i]).attr("twitch-id") == twitchId) {
                return {model:model[i],index:i};
            }
        }
    } else {
        model = $("#membersList").find(".member");
        for(var i = 0; i < model.length; i++){
            if($(model[i]).attr("twitch-id") == twitchId) {
                return {model:model[i],index:i};
            }
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
        if(members[i].id) {
            members[i].image = info.items[index].snippet.thumbnails.high.url;
            members[i].subCount = info.items[index].statistics.subscriberCount;
        }
    }
}

function getIndexForTwitch(name) {
    for(var i = 0; i < members.length; i++) {
        if(members[i].twitchId == name) {
            return i;
            break;
        }
    }
    return 0;
}

function updateModelTwitch(info) {
    for(var i = 0; i < info.streams.length; i++) {
        var model = getTwitchIndex(info.streams[i].channel.name);
        var index = getIndexForTwitch(info.streams[i].channel.name);
        var today = new Date();
        var uptime = new Date(info.streams[i].created_at);
        uptime = today.getTime() - uptime.getTime();
        var hours = Math.floor(uptime/3600000);
        if(hours < 10) {
            hours = "0"+hours;
        }
        uptime = uptime - (hours*3600000);
        var min = Math.floor(uptime/60000);
        if(min < 10) {
            min = "0"+min;
        }
        $(model.model).find(".twitchField").html("<a data-toggle='tooltip' data-placement='left' title='Uptime "+hours+":"+min+"' target='_blank' style='text-decoration:none;font-family:arial;color:white;font-weight:bold;' href='http://twitch.tv/"+members[index].twitchId+"'><img style='resize:both;height:20px;position:relative;top:0px;margin-right:2px;' src='./Media/Icons/twitch.png'>Live</a><span style='display:inline-block;height:10px;width:10px;border-radius:100%;background-color:red;margin-left:5px;'> </span> <span class='glyphicon openModal glyphicon-share'></span>");
        $(model.model).find(".twitchField").addClass("active");
        $(model.model).addClass("active");
        if(!($(model.model).hasClass("friend"))) {
            pushItToTop(model.index, "#membersList");
        } else {
            pushItToTop(model.index, "#memberFriends");
        }
    }
    $(".openModal").click(function(event){
        openModal(event);
    });
    $('[data-toggle="tooltip"]').tooltip(); 
}

function pushItToTop(index, classId) {
    var model = $(classId).find(".member");
    //update the tab counter
    var tab = $($("[href='"+classId+"']"));
    var active = $(classId).find(".member.active").length;
    tab.find(".counter").html(" ("+active+")");
    for(var i = 0; i < model.length; i++){
        if(!($(model[i]).find(".twitchField").hasClass("active"))) {
            $(model[index]).insertBefore($(model[i]));
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

var url = "https://api.twitch.tv/kraken/streams/?channel="+membersString;

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

function loadTweets(event) {

var username = $(event.target).closest(".member").attr("twitter-id");

var url = "https://exzerobots.com/offlineTV/lastTweet.php?username="+username;

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var response = this.responseText.replace(/(\r\n\t|\n|\r\t)/gm,"");
        var obj = JSON.parse(response);
        
        var mainClass = $("#twitter_"+username);
        mainClass.html("");

        var ahref = jQuery("<a>", {
            style:"text-decoration:none;color:white;",
            href: "https://twitter.com/"+username,
            target: "_blank"
        }).prependTo(mainClass);

        var tweet = jQuery("<div>", {
            style: "cursor:pointer",
            class: "tweetBox",
            html: obj[0].lastTweet
        }).appendTo(ahref);
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.send(); 

}

function renderUserInfo() {
    $("#loading").hide();
    $("#tabs").removeClass("hide");
    for(var i = 0; i < members.length; i++){ 
        var row = jQuery("<div>", {
          style:"width:280px;heigth:70px;margin-top:5px;",
          class:"member",
          "data-channelId": members[i].id,
          "twitch-id": members[i].twitchId,
          "twitter-id": members[i].twitter
        });

        if(!members[i].friends) { 
            row.appendTo("#membersList"); 
        } else {
            row.appendTo("#memberFriends");
            row.addClass("friend");
        } 

        var image = jQuery("<div>", {
                style:"border-radius:5px;width:50px;height:50px;display:inline-block;background-image:url('"+members[i].image+"');background-size:cover;margin-left:5px;",
                title:members[i].twitchId
        }).appendTo(row);

       if(members[i].id != null) {
            var subs = jQuery("<div>", {
                html: "<span style='display:inline-block;cursor:pointer;' class='openLastVideo'> <a href='#' data-toggle='tooltip' data-placement='right' title='Subs "+members[i].subCount+"'> <img style='resize:both;height:10px;position:relative;top:0px;margin-right:5px;' src='./Media/Icons/youtube.png'> </a></span> <span> <a data-toggle='collapse' class='openTwitter' data-target='#twitter_"+members[i].twitter+"'> <img style='resize:both;height:15px;position:relative;top:0px;margin-right:5px;margin-left:10px;' src='./Media/Icons/twitter.png'> </a> </span>",
                style: "display:inline-block;margin-left:10px;position:relative;bottom:20px;",
                class: "youtubeDiv"
            }).appendTo(row);

        } else {
            var subs = jQuery("<div>", {
                html: "<img style='resize:both;height:10px;position:relative;top:0px;margin-right:5px;opacity:0.1;' src='./Media/Icons/youtube.png'><span> <a data-toggle='collapse' class='openTwitter' data-target='#twitter_"+members[i].twitter+"'> <img style='resize:both;height:15px;position:relative;top:0px;margin-right:5px;margin-left:10px;' src='./Media/Icons/twitter.png'> </a> </span> ",
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

        var lastTweet = jQuery("<div>", {
            style:"width:280px;height:70px;margin-top:5px;",
            id:"twitter_"+members[i].twitter,
            class: "collapse",
        }).appendTo(row);

        var loading = $(".progress.first").clone().removeClass("first");
        loading.find(".progress-bar").removeClass("progress-bar-danger").addClass("progress-bar-info");
        loading.appendTo(lastTweet);

    }

    $(".openTwitter").click(function(event){
        loadTweets(event);
    });

    $(".openModal").click(function(event){
        openModal(event);
    });
    $(".openLastVideo").click(function(event){
        openLastVideo(event);
    });
}

function openLastVideo(event) {

var channel = $(event.target).closest(".member").attr("data-channelid");
var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId="+channel+"&maxResults=1&order=date&type=video&key=AIzaSyAL50nHkaW2PQT_2LBmjnaZcaXl2bTzVG0";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var video = JSON.parse(this.responseText);
        var url = "https://www.youtube.com/watch?v="+video.items[0].id.videoId;
        window.open(url);
    }
}
xmlhttp.open("GET",url,true);
xmlhttp.send();

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

//test function to see more people online
function testMultipleOnline(){
    var info = {
        streams:[
            {channel:{
                    name: members[0].twitchId
                }  
            },
            {channel:{
                    name: members[15].twitchId
                }  
            },
            {channel:{
                    name: members[2].twitchId
                }  
            }, 
            {channel:{
                    name: members[14].twitchId
                }  
            },
            {channel:{
                    name: members[1].twitchId
                }  
            }
        ]
    };
    updateModelTwitch(info);
}