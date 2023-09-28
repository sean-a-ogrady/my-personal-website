// Selectors
const bottomLeftArea = document.querySelector("#bottom-left-area");
const container = document.querySelector('#word-cloud-container');
const background = document.querySelector('#background');

// Variables
const url = "http://localhost:3000/words";
let alertTimes = 0;
const width = container.offsetWidth;
const height = container.offsetHeight;
const pageWidth = background.offsetWidth;
const pageHeight = background.offsetHeight;

// Fetch data from daily wordcloud (sample data for now)
// This will eventually be automated
fetch(url)
    .then(response => response.json())
    .then(words => initializeWordCloud(words));

// Initialize word cloud
function initializeWordCloud(words) {

    const svg = d3.select("#word-cloud-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("font-weight", "bold");


    // Define color scales for sentiment
    const colorScalePositive = d3.scaleLinear()
        .domain([0, 5])
        .range(["#d3d3d3", "green"]);

    const colorScaleNegative = d3.scaleLinear()
        .domain([-5, 0])
        .range(["red", "#d3d3d3"]);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map(word => {
            return { text: word.word, size: Math.sqrt(word.frequency) * 20, sentiment: word.sentiment };
        }))
        .padding(5)
        .rotate(() => {
            const angles = [0, 90, 270];
            return angles[Math.floor(Math.random() * 3)];
        })
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", `translate(${pageWidth / 2},${pageHeight / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", d => {
                // Change color based on sentiment
                if (d.sentiment > 0) {
                    return colorScalePositive(d.sentiment);
                } else if (d.sentiment < 0) {
                    return colorScaleNegative(d.sentiment);
                } else {
                    return "#d3d3d3";  // Grey for neutral sentiment
                }
            })
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text);
    }
}



function clickAlert() {
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