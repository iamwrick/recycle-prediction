<div>Teachable Machine Image Model</div>
<button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>

<script type="text/javascript">
    const URL = "./model/";  // Adjust this path to your model's directory

    let model, webcam, labelContainer, maxPredictions;

    // Initialize the model and webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        try {
            console.log("Loading model...");
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            const flip = true;
            webcam = new tmImage.Webcam(200, 200, flip);

            console.log("Setting up webcam...");
            await webcam.setup(); // Request access to webcam
            await webcam.play();
            console.log("Webcam initialized successfully.");

            window.requestAnimationFrame(loop);

            // Append webcam canvas to DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }

        } catch (error) {
            console.error("Error loading model or setting up webcam:", error);
            alert("Error: " + error.message);
        }
    }

    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        try {
            const prediction = await model.predict(webcam.canvas);
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
        } catch (error) {
            console.error("Error during prediction:", error);
        }
    }
</script>
