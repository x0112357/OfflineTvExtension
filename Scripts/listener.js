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

