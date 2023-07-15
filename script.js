//ADD YOUR API KEY HERE 
const api_key = "YOUR_API_KEY"


var streamer = false
var button = document.querySelector('.btn-red');
button.setAttribute('onclick', 'updateHTML(`<i class="fa-solid fa-circle-check"></i><span>Awaiting start.</span>`)');


window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    console.log(iceCandidate.candidate);
    var ip = fields[4];
    if (fields[7] === "srflx") {
        AddGather(ip)
        updateHTML(`<i class="fa-solid fa-circle-check"></i><span>IP address captured, click the button</span>`)
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};




function AddGather(ip) {
    var divElements = document.getElementsByClassName('gather');
    var attributeValue = "gather('" + ip + "')";
    
    for (var i = 0; i < divElements.length; i++) {
        divElements[i].setAttribute('onclick', attributeValue);
    }
}


function AddMap(loc) {
  var divElements = document.getElementsByClassName('map');
  var attributeValue = "openMap('https://maps.google.com/?q=" + loc +  "')";

  for (var i = 0; i < divElements.length; i++) {
    divElements[i].setAttribute('onclick', attributeValue);
}
}



function updateHTML(print) {
    const overlay = document.getElementById("overlay");
    const info = document.getElementById("Info");
  
    info.innerHTML = print
}


//
function openMap(link) {
  window.open(link, '_blank');
}


function gather(ip) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://ipinfo.io/${ip}/json?token=${api_key}`;
        const response = await fetch(url);
        const json = await response.json();
  
        if (!json.status) {
          AddMap(json.loc)
          if(!streamer){
            updateHTML(`
              <i class="fa-solid fa-city"></i><span>${json.city}</span><br>
              <i class="fa-solid fa-signs-post"></i><span>${json.region}</span><br>
              <i class="fa-solid fa-ethernet"></i><span>${json.org}</span><br>
              <i class="fa-solid fa-location-dot"></i><span>${json.ip}</span>
              `);
          } else {
            updateHTML(`
              <i class="fa-solid fa-city"></i><span>${json.city}</span><br>
              <i class="fa-solid fa-signs-post"></i><span>${json.region}</span><br>
              <i class="fa-solid fa-ethernet"></i><span>${json.org}</span><br>
              <i class="fa-solid fa-location-dot"></i><span>REDACTED</span>
              `);
          }

          resolve();
        } else {
          reject(new Error("Failed to get IP information."));
        }
      } catch (error) {
        reject(error);
      }
    });
  }


function streamerMode() {
  streamer = !streamer;
}





//Setting gui
var overlay = document.createElement('div');
overlay.id = 'overlay';


var Title = document.createElement('p');
Title.id = 'Title';
Title.textContent = 'Ome.tv ip check';


var Info = document.createElement('p');
Info.id = 'Info';
var infoIcon = document.createElement('i');
infoIcon.className = 'fa-solid fa-circle-check';
var infoText = document.createElement('span');
infoText.textContent = 'The loading was successful, enjoy using it.';
Info.appendChild(infoIcon);
Info.appendChild(infoText);


var buttonCheck = document.createElement('div');
buttonCheck.id = 'button';
buttonCheck.className = 'gather';
buttonCheck.textContent = 'Check';



var buttonMap = document.createElement('div');
buttonMap.id = 'button';
buttonMap.className = 'map';
buttonMap.textContent = 'Map';


var buttonStreamerMode = document.createElement('div');
buttonStreamerMode.id = 'button';
buttonStreamerMode.className = 'streamer';
buttonStreamerMode.textContent = 'Streamer Mode';
buttonStreamerMode.setAttribute('onclick', 'streamerMode()');


overlay.appendChild(Title);
overlay.appendChild(Info);
overlay.appendChild(buttonCheck);
overlay.appendChild(buttonMap);
overlay.appendChild(buttonStreamerMode);


var mainAbout = document.querySelector('main#about');


mainAbout.appendChild(overlay);



var style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');
  div #overlay {
    position: fixed;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0px 0px 10px rgba(0, 217, 255);
    border: 2px solid rgba(0,188,254,.9);
    padding: 10px 20px 10px 20px;
    bottom: 1em;
    right: 1em;
    border-radius: 10px;
    transition: cubic-bezier(0,-.01,0,1) .5s;
  }

  #overlay p#Title {
    font-size: 2vw;
    margin: 0 10vw 0 10vw;
    padding-bottom: 15px;
    text-align: center;
    font-family: 'Ubuntu', sans-serif;
    color: #00bcfe;
    text-shadow: 0px 0px 2px #00d6fe;
    user-select: none;
  }

  #overlay p#Title span {
    font-size: 1vw;
    color: #ffffff;
    text-shadow: 0px 0px 2px #ffffff;
    margin: 0 .1vw 0 .1vw;
  }

  #overlay p#Info {
    font-size: 1vw;
    text-align: left;
    font-family: 'Ubuntu', sans-serif;
    color: #fff;
    padding-bottom: 10px;
    user-select: none;
    text-shadow: 0px 0px 2px black;
  }

  #overlay p#Info span {
    text-align: center;
    font-family: 'Ubuntu', sans-serif;
    color: #ffffff;
    user-select: all;
  }

  #overlay i {
    color: #00c7ee;
    padding-right: 0.3vw;
    position: relative;
    margin: .3vw;
  }

  #overlay div#button {
    display: inline-block;
    user-select: none;
    cursor: pointer;
    font-family: 'Ubuntu', sans-serif;
    text-decoration: none;
    border-radius: 0.5vw;
    margin-bottom: 0.2vw;
    padding: .2vw 1vw;
    color: #fff;
    text-shadow: 0px 0px 3px black;
    background-color: rgb(0 188 254);
    box-shadow: 0 0 5px rgba(0,188,254,.9);
    transition: cubic-bezier(0,-.01,0,1) .5s;
  }

  #overlay div:hover#button {
    background-color: rgba(0,188,254,.5);
    transition: cubic-bezier(0,-.01,0,1) .5s;
  }`;

document.head.appendChild(style);


//setting Font Awesome
var font_awesome = document.createElement("link");

font_awesome.rel = "stylesheet";
font_awesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
font_awesome.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
font_awesome.crossOrigin = "anonymous";
font_awesome.referrerPolicy = "no-referrer";

document.head.appendChild(font_awesome);

