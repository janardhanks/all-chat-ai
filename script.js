const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const answersContainer = document.getElementById("answersContainer");
const selectedAnswer = document.getElementById("selectedAnswer");
const copyButton = document.getElementById("copyButton");

let selectedText = "";

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

    answersContainer.innerHTML = "";

    selectedAIs.forEach((ai) => {

        const aiName = ai.value;

        const card = document.createElement("div");
        card.className = "answer-card";

        card.innerHTML = `
            <h3>${aiName}</h3>

            <div class="answer-text">
                Demo response from ${aiName} for:

                "${question}"

                Real AI API integration will be added in the next step.
            </div>

            <button class="select-answer">
                SELECT THIS ANSWER
            </button>
        `;

        answersContainer.appendChild(card);

        const selectButton = card.querySelector(".select-answer");

        selectButton.addEventListener("click", function () {

            const answerText = card.querySelector(".answer-text").innerText;

            selectedText = answerText;

            selectedAnswer.innerText = answerText;

            document.querySelectorAll(".answer-card").forEach((item) => {
                item.style.border = "1px solid #e5e7eb";
            });

            card.style.border = "2px solid #2563eb";
        });
    });
});


copyButton.addEventListener("click", async function () {

    if (selectedText === "") {
        alert("Please select an answer first.");
        return;
    }

    try {

        await navigator.clipboard.writeText(selectedText);

        alert("Selected answer copied!");

    } catch (error) {

        alert("Unable to copy the answer.");

    }
});
