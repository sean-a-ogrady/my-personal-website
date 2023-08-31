const bottomLeftArea = document.getElementById("bottom-left-area");
let alertTimes = 0;
function clickAlert(){
    alertTimes++;
    switch (alertTimes) {
        case 1:
            alert("alright listen I promise I'll put something here just hold on");
            break;
        case 2:
            alert("cmon man I just told you I'll do something here, chill");
            break;
        case 3:
            alert("dude how many times I gotta tell you, cut it out bro")
            break;
        default:
            alert(">:(");
            break;
    }
}
bottomLeftArea.addEventListener('click', clickAlert);