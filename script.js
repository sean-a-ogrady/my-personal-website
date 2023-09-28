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

    // Start with a base size
    let baseSize = 10;

    // Calculate initial scaling factor (adjustible)
    let scalingFactor = 0.5 * Math.sqrt(width * height / words.length);

    const svg = d3.select("#word-cloud-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("font-weight", "bold");


    // Define color scales for sentiment
    const colorScalePositive = d3.scaleLinear()
        .domain([0, 5])
        .range(["#6EBBCD", "green"]);

    const colorScaleNegative = d3.scaleLinear()
        .domain([-5, 0])
        .range(["red", "#6EBBCD"]);

    // Sort words by frequency so that largest words are drawn first
    words = words.sort((a, b) => b.frequency - a.frequency);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map((word, i) => {
            // Dynamic scaling based on frequency and position in the array
            let dynamicScaling = scalingFactor * (1 - i / words.length);
            // Use the scaling factor to adjust the size
            return { text: word.word, size: baseSize + Math.sqrt(word.frequency) * dynamicScaling, sentiment: word.sentiment };
        }))
        .padding(6)
        .rotate(() => {
            const angles = [0, 90, 270];
            return angles[Math.floor(Math.random() * 3)];
        })
        .text(function (d) { return d.text; })
        .font("AndaleMono")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        const paddingX = 30; // Padding from the right
        const paddingY = 30; // Padding from the bottom

        svg.append("g")
            .attr("transform", `translate(${pageWidth / 2 - paddingX},${pageHeight / 2 - paddingY})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("opacity", 0.1)
            .style("fill", d => {
                // Change color based on sentiment
                if (d.sentiment > 0) {
                    return colorScalePositive(d.sentiment);
                } else if (d.sentiment < 0) {
                    return colorScaleNegative(d.sentiment);
                } else {
                    return "#6EBBCD";  // Grey for neutral sentiment
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