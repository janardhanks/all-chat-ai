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


/* ASK ALL AI */

askButton.addEventListener("click", function () {

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


    /* Loading */

    answersContainer.innerHTML = `
        <div class="loading">
            Generating AI responses...
        </div>
    `;


    /* Demo delay */

    setTimeout(function () {

        answersContainer.innerHTML = "";

        selectedAIs.forEach(function (checkbox) {

            const aiName = checkbox.value;


            const card =
                document.createElement("div");

            card.className = "answer-card";


            card.innerHTML = `

                <div class="answer-header">

                    <h3>${aiName}</h3>

                    <span class="ai-label">
                        AI RESPONSE
                    </span>

                </div>


                <div class="answer-text">
Demo response from ${aiName}.

Question:
${question}

This is currently a demonstration response.
In the next development stage, this section will receive the real response from the ${aiName} API.
                </div>


                <button class="select-answer">
                    SELECT THIS ANSWER
                </button>

            `;


            answersContainer.appendChild(card);


            /* SELECT */

            const selectButton =
                card.querySelector(".select-answer");


            selectButton.addEventListener(
                "click",
                function () {

                    selectedText =
                        card.querySelector(
                            ".answer-text"
                        ).innerText;


                    selectedAnswer.innerText =
                        selectedText;


                    document
                        .querySelectorAll(".answer-card")
                        .forEach(function (otherCard) {

                            otherCard.classList.remove(
                                "selected"
                            );

                        });


                    card.classList.add("selected");

                    selectedAnswer.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }
            );

        });

    }, 800);

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
