const askButton = document.getElementById("askButton");
const clearButton = document.getElementById("clearButton");

const questionInput = document.getElementById("question");

const answersContainer =
    document.getElementById("answersContainer");

const selectedAnswer =
    document.getElementById("selectedAnswer");

const copyButton =
    document.getElementById("copyButton");


let selectedText = "";


/* BACKEND URL */

const BACKEND_URL = "https://all-chat-ai-backend.onrender.com";

/* ASK ALL AI */

askButton.addEventListener("click", async function () {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Please enter a question.");
        return;
    }


    const selectedAIs = document.querySelectorAll(
        '.ai-selection input[type="checkbox"]:checked'
    );


    if (selectedAIs.length === 0) {
        alert("Please select at least one AI.");
        return;
    }


    /* Get selected AI names */

    const providers = Array.from(selectedAIs).map(
        checkbox => checkbox.value
    );


    /* Reset previous selection */

    selectedText = "";

    selectedAnswer.innerText =
        "No answer selected.";


    /* Loading */

    answersContainer.innerHTML = `
        <div class="loading">
            Generating AI responses...
        </div>
    `;


    try {

        /* Send question to backend */

        const response = await fetch(
            `${BACKEND_URL}/api/ask`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question,
                    providers: providers
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Server error."
            );

        }


        /* Remove loading */

        answersContainer.innerHTML = "";


        /* Display every AI response */

        data.results.forEach(function (result) {

            const card =
                document.createElement("div");

            card.className = "answer-card";


            /* Header */

            const header =
                document.createElement("div");

            header.className =
                "answer-header";


            const title =
                document.createElement("h3");

            title.innerText =
                result.ai;


            const label =
                document.createElement("span");

            label.className =
                "ai-label";

            label.innerText =
                "AI RESPONSE";


            header.appendChild(title);
            header.appendChild(label);


            /* Answer */

            const answerText =
                document.createElement("div");

            answerText.className =
                "answer-text";


            if (result.error) {

                answerText.innerText =
                    `Unable to get a response from ${result.ai}.

Error:
${result.error}`;

            } else {

                answerText.innerText =
                    result.answer || "No answer received.";

            }


            /* Select button */

            const selectButton =
                document.createElement("button");

            selectButton.className =
                "select-answer";

            selectButton.innerText =
                "SELECT THIS ANSWER";


            /* Build card */

            card.appendChild(header);

            card.appendChild(answerText);

            card.appendChild(selectButton);

            answersContainer.appendChild(card);


            /* SELECT */

            selectButton.addEventListener(
                "click",
                function () {

                    if (result.error) {

                        alert(
                            "This AI returned an error, so its answer cannot be selected."
                        );

                        return;
                    }


                    selectedText =
                        answerText.innerText;


                    selectedAnswer.innerText =
                        selectedText;


                    /* Remove previous selection */

                    document
                        .querySelectorAll(".answer-card")
                        .forEach(function (otherCard) {

                            otherCard.classList.remove(
                                "selected"
                            );

                        });


                    /* Highlight selected card */

                    card.classList.add("selected");


                    /* Scroll to selected answer */

                    selectedAnswer.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }
            );

        });


    } catch (error) {

        console.error(error);


        answersContainer.innerHTML = `

            <div class="empty-message">

                <div class="empty-icon">
                    AI
                </div>

                <h3>Unable to get AI responses</h3>

                <p>
                    Please make sure the ALL CHAT AI
                    backend server is running.
                </p>

            </div>

        `;

    }

});


/* COPY */

copyButton.addEventListener("click", function () {

    if (selectedText === "") {

        alert(
            "Please select an answer first."
        );

        return;
    }


    navigator.clipboard
        .writeText(selectedText)
        .then(function () {

            copyButton.innerText =
                "COPIED ✓";


            setTimeout(function () {

                copyButton.innerText =
                    "COPY SELECTED ANSWER";

            }, 2000);

        })
        .catch(function () {

            alert(
                "Unable to copy the answer."
            );

        });

});


/* CLEAR */

clearButton.addEventListener("click", function () {

    questionInput.value = "";

    answersContainer.innerHTML = `

        <div class="empty-message">

            <div class="empty-icon">
                AI
            </div>

            <h3>No answers yet</h3>

            <p>
                Enter a question and click
                <b>ASK ALL AI</b>.
            </p>

        </div>

    `;


    selectedText = "";

    selectedAnswer.innerText =
        "No answer selected.";

});
