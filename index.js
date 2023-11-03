const totalQuestions = 3;
let currentQuestion = 1;
let isWarningDisplayed = false;

function showQuestion(questionNumber) {
  const questions = document.querySelectorAll(".question");
  questions.forEach((question) => {
    question.style.display = "none";
  });
  document.getElementById(`question${questionNumber}`).style.display = "block";
  currentQuestion = questionNumber;

  const paginationItems = document.querySelectorAll(".pagination li");
  paginationItems.forEach((item, index) => {
    if (index + 1 === questionNumber) {
      item.classList.add("active");
      item.style.backgroundColor = "#00A5FF"; // Изменение цвета на зеленый
    } else {
      item.classList.remove("active");
      item.style.backgroundColor = "#89D1F8"; // Изменение цвета на серый
    }
  });

  const progress = document.getElementById("progress");
  progress.innerText = `Вопрос ${questionNumber} из ${totalQuestions}`;
}

function nextQuestion(questionNumber) {
    const answerOptions = document.querySelectorAll(`input[name="answer${currentQuestion}"]`);
  let isAnswerSelected = false;

  for (let i = 0; i < answerOptions.length; i++) {
    if (answerOptions[i].checked) {
      isAnswerSelected = true;
      break;
    }
  }

  if (!isAnswerSelected && !isWarningDisplayed) {
    const warningText = document.createElement('p');
    warningText.textContent = 'Пожалуйста, выберите один из вариантов ответа!';
    warningText.classList.add('warning');
    warningText.style.color = 'red';
    const currentQuestionContainer = document.getElementById(`question${currentQuestion}`);
    currentQuestionContainer.appendChild(warningText);
    isWarningDisplayed = true;
    return;
  } else if (isAnswerSelected && isWarningDisplayed) {
    const currentQuestionContainer = document.getElementById(`question${currentQuestion}`);
    const existingWarning = currentQuestionContainer.querySelector('.warning');
    currentQuestionContainer.removeChild(existingWarning);
    isWarningDisplayed = false;
  }
  showQuestion(questionNumber);
}

function previousQuestion(questionNumber) {
  showQuestion(questionNumber);
}

function showResults() {
  const results = document.getElementById("results");
  results.style.display = "block";

  const progress = document.getElementById("progress");
  progress.style.display = "none";

  const questions = document.getElementById("quiz");
  questions.style.display = "none";

  const pagination = document.querySelector(".pagination");
  pagination.style.display = "none";

  const titleDescription = document.querySelector(".title_description");
  titleDescription.style.display = "none";

  fetch("./products.json")
    .then((response) => response.json())
    .then((data) => {
      const productsDiv = document.getElementById("products");
      let productsHTML = "";
      data.forEach((product) => {
        let oldPriceHTML = "";
        if (product.oldPrice) {
          const parsedOldPrice = parseFloat(product.oldPrice);
          oldPriceHTML = `<p class="old-price">${
            Number.isInteger(parsedOldPrice)
              ? parsedOldPrice.toFixed(2)
              : product.oldPrice
          }</p>`;
        }

        productsHTML += `
            <div class="product">
              <img class="image" src="${product.image}" alt="${product.title}">
              <div class="favorite"></div>
              <h3 class="title">${product.title}</h3>
              <div class="prices">
                ${oldPriceHTML}
                <p class="price">${product.price} руб.</p>
              </div>
            </div>
          `;
      });
      productsDiv.innerHTML = productsHTML;
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
}

showQuestion(1);
