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

    const aiCheckboxes = document.querySelectorAll(
        '.ai-selection input[type="checkbox"]:checked'
    );

    if (aiCheckboxes.length === 0) {
        alert("Please select at least one AI.");
        return;
    }

    answersContainer.innerHTML = "";

    aiCheckboxes.forEach(function (checkbox) {

        const aiName = checkbox.value;

        const card = document.createElement("div");
        card.className = "answer-card";

        card.innerHTML = `
            <h3>${aiName}</h3>

            <div class="answer-text">
                Demo answer from ${aiName}.

                Your question was:
                ${question}

                Real AI connection will be added next.
            </div>

            <button class="select-answer">
                SELECT THIS ANSWER
            </button>
        `;

        answersContainer.appendChild(card);

        const selectButton = card.querySelector(".select-answer");

        selectButton.addEventListener("click", function () {

            selectedText = card.querySelector(".answer-text").innerText;

            selectedAnswer.innerText = selectedText;

            document.querySelectorAll(".answer-card").forEach(function (otherCard) {
                otherCard.style.border = "1px solid #e5e7eb";
            });

            card.style.border = "2px solid #2563eb";
        });

    });

});


copyButton.addEventListener("click", function () {

    if (selectedText === "") {
        alert("Please select an answer first.");
        return;
    }

    navigator.clipboard.writeText(selectedText)
        .then(function () {
            alert("Selected answer copied!");
        })
        .catch(function () {
            alert("Copy failed. Please try again.");
        });

});
