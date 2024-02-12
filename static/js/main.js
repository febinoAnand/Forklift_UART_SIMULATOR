var distance = 0.0;
var speed = 0.0;
var battPower = 0.0;
var voltage = 0.0;
var current = 0.0;
var wattHt = 0.0;
var battCapacity = 0;

var isGetValueON = false;

function sendRange() {
  var xhttp = new XMLHttpRequest();
  var responseString = "";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        distance = document.getElementById("amount").value;
        speed = document.getElementById("speed1").value;
        battPower = document.getElementById("batteryPower").value;
        voltage = document.getElementById("batteryVoltage").value;
        current = document.getElementById("batteryAmps").value;
        wattHt = document.getElementById("wattHr").value;
        battCapacity = document.getElementById("batteryCapacity").value;
        
      if(this.response === "True"){
        isGetValueON = true;
      }
      else{
        isGetValueON = false;
        document.getElementById("conBtn").innerHTML = "Connect";
      }
      // console.log(rangeValue);
    }
  };
  responseString = "distance="+distance+"&speed="+speed+"&battpower="+battPower+"&voltage="+voltage+"&current="+current+"&watthr="+wattHt+"&battcapacity="+battCapacity;
  console.log(responseString);
  xhttp.open("GET", "setValue?"+responseString, true);
  xhttp.send();
  if(isGetValueON){
    setTimeout('sendRange()', 500);  
  }
  
}


function init(){
  var xhttp = new XMLHttpRequest();
  var comportslist;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var status = this.response.split(",");

      if(status[0] === "True"){
        document.getElementById("conBtn").innerHTML = "Disconnect";
        isGetValueON = true;
        sendRange();
        document.getElementById("comports").value = status[2];

      }
      else{
        isGetValueON = false; 
        document.getElementById("conBtn").innerHTML = "Connect";
      }
      rangeValue = status[1];
      setSeekerValue(rangeValue);
    }
  };
  xhttp.open("GET", "init", true);
  xhttp.send();

  getComList();
}

function getComList(){
  var xhttp = new XMLHttpRequest();
  var comportslist;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      comportslist = this.response;
      document.getElementById("comports").innerHTML = comportslist;
    }
  };
  xhttp.open("GET", "getComList", true);
  xhttp.send();
}

function setSeekerValue(setValue){
  document.getElementById("rangeInput").value = setValue;
  document.getElementById("amount").value = setValue;
}


function toggleConnectFunction(){
  var xhttp = new XMLHttpRequest();
  var comport = document.getElementById("comports").value;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      
      // document.getElementById("test").innerHTML = this.response;

      if(this.response === 'True'){
        document.getElementById("conBtn").innerHTML = "Disconnect";
        isGetValueON = true;
        sendRange();
      }
      else{
        document.getElementById("conBtn").innerHTML = "Connect";
        isGetValueON = false;
      }
    }
  };
  xhttp.open("GET", "toggleConnect?comport="+comport, true);
  xhttp.send();
}