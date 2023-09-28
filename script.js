// Selectors
const bottomLeftArea = document.querySelector("#bottom-left-area");

// Variables
const url = "http://localhost:3000/words";
let alertTimes = 0;

// Fetch data from daily wordcloud (sample data for now)
// This will eventually be automated
fetch(url)
.then(response => response.json())
.then(words => console.log(words));

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

