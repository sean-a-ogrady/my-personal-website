// Selectors
const bottomLeftArea = document.querySelector('#bottom-left-area');
const pretend = document.querySelector("#pretend");
const container = document.querySelector('#word-cloud-container');
const background = document.querySelector('#background');

// Variables
const url = "http://localhost:3000/words";
let alertTimes = 0;

// Fetch data from daily wordcloud (sample data for now)
// This will eventually be automated
fetch(url)
    .then(response => response.json())
    .then(words => initializeWordCloud(words));

// Initialize word cloud
function initializeWordCloud(words) {

    // Remove existing SVG if it exists
    d3.select("#word-cloud-container svg").remove();

    const container = document.querySelector('#word-cloud-container');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const pageWidth = background.offsetWidth;
    const pageHeight = background.offsetHeight;

    // Start with a base size
    const baseSize = 15;

    // Const opacity
    const opacity = 0.1;

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

        // Create a tooltip div that is hidden by default
        // const tooltip = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        svg.append("g")
            .attr("transform", `translate(${pageWidth / 2 - paddingX},${pageHeight / 2 - paddingY})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .attr("data-opacity", opacity)
            .style("font-size", d => d.size + "px")
            .style("opacity", opacity)
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
            .text(d => d.text)
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("opacity", 0.5)
                    .style("font-size", d.size * 1.0 + "px");

                // Fetch the definition from the dictionary API
                // fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${d.text}`)
                //     .then(response => response.json())
                //     .then(data => {
                // Assume the definition is in data[0].meaning
                // const definition = data[0].meaning;

                // Show the tooltip
                // tooltip.transition()
                //     .duration(200)
                //     .style("opacity", .9);
                // tooltip.html(`${d.text}: ${definition}`)
                //     .style("left", (d3.event.pageX) + "px")
                //     .style("top", (d3.event.pageY - 28) + "px");
                // });
            })
            // .on("mousemove", function(event, d) {
            //     // Update the tooltip position as mouse moves
            //     tooltip.style("left", (event.pageX) + "px")
            //            .style("top", (event.pageY - 28) + "px");
            // })
            .on("mouseout", function (d) {
                // Retrieve the current custom opacity
                let currentOpacity = parseFloat(d3.select(this).attr("data-opacity"));

                // Increment the opacity by a certain value (e.g., 0.1)
                let newOpacity = Math.min(currentOpacity + 0.1, 1);  // Cap at 1

                // Update the custom attribute
                d3.select(this).attr("data-opacity", newOpacity);

                d3.select(this)
                    .style("fill", function (d) {
                        if (d.sentiment > 0) {
                            return colorScalePositive(d.sentiment);
                        } else if (d.sentiment < 0) {
                            return colorScaleNegative(d.sentiment);
                        } else {
                            return "#4B4B4B";  // Dark grey for neutral sentiment on mouseout
                        }
                    })
                    .style("font-size", d.size + "px")
                    .style("opacity", newOpacity);  // Set the incremented opacity

                // Hide the tooltip
                // tooltip.transition()
                //     .duration(500)
                //     .style("opacity", 0);
            });;
    }
}

/*
EVENT LISTENERS
---------------
*/

pretend.addEventListener('click', () => {
    alertTimes++;
    switch (alertTimes) {
        case 1:
            alert("alright listen I gave you a word cloud chill");
            break;
        case 2:
            alert("cmon man I'll keep working on this I swear");
            break;
        case 3:
            alert("dude how many times I gotta tell you, cut it out bro")
            break;
        default:
            alert(">:(");
            break;
    }
});

// Redraw word cloud when window is resized
window.addEventListener('resize', () => {
    fetch(url)
        .then(response => response.json())
        .then(words => initializeWordCloud(words));
});

// This code will likely be deleted in published site
function createForm() {
    // Create form element
    const form = document.createElement('form');
    form.id = 'word-form';

    // Create input for word
    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.name = 'word';
    wordInput.placeholder = 'Enter word';
    form.appendChild(wordInput);

    // Create toggle for add or remove
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.name = 'action';
    toggle.id = 'toggle-action';
    form.appendChild(toggle);

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = 'toggleAction';
    toggleLabel.innerText = 'Check to Remove, Uncheck to Add.';
    form.appendChild(toggleLabel);

    // Create submit button
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    form.appendChild(submitButton);

    // Append form to form container
    document.querySelector("#form-container").appendChild(form);

    // Add event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const word = formData.get('word');
        const action = formData.get('action') ? 'remove' : 'add';

        // Execute fetch request based on action
        if (action === 'add') {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: word, frequency: 1, sentiment: 0 }) // example data
            }).then(response => response.json())
                .then(data => {
                    // Refresh word cloud
                    fetch(url)
                        .then(response => response.json())
                        .then(words => initializeWordCloud(words));
                });
        } else if (action === 'remove') {
            // Fetch all words to find the ID of the word to remove
            fetch(url)
                .then(response => response.json())
                .then(words => {
                    const wordToRemove = words.find(w => w.word === word);
                    if (wordToRemove) {
                        // Remove the word using its ID
                        fetch(`${url}/${wordToRemove.id}`, {
                            method: 'DELETE'
                        }).then(() => {
                            // Refresh word cloud
                            fetch(url)
                                .then(response => response.json())
                                .then(words => initializeWordCloud(words));
                        });
                    } else {
                        alert('Word not found');
                    }
                });
        }
    });
}
createForm();
