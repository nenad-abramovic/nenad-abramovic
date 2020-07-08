const terminal = document.querySelector(".terminal-input");
const infoMessage = document.querySelector(".info-msg");

let commandHistory = [];
let currentCommandIndex = 0;
const parser = math.parser();

terminal.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    parseCommand(e.target.value.toLowerCase().trim());
  }
  if (e.keyCode === 38) {
    if (currentCommandIndex > 0) {
      terminal.value = commandHistory[--currentCommandIndex];
    }
  }
  if (e.keyCode === 40) {
    if (currentCommandIndex < commandHistory.length - 1) {
      terminal.value = commandHistory[++currentCommandIndex];
    }
    if (currentCommandIndex === commandHistory.length) {
      terminal.value = "";
    }
    if (currentCommandIndex === commandHistory.length - 1) {
      currentCommandIndex++;
    }
  }
});

function parseCommand(input) {
  commandHistory.push(input);
  currentCommandIndex = commandHistory.length;

  try {
    if (input !== "") {
      let x = parser.evaluate(input);
      infoMessage.textContent = math.format(x, {
        precision: 14
      });
      terminal.value = "";
    }
  } catch (e) {
    const [command, ...params] = input.split(" ");

    switch (command) {
      case "open":
        open(params.join(" "));
        break;
      case "weather":
        weather(params.join(" "));
        break;
      case "current":
        current(params.join(" "));
        break;
      case "timer":
        timer(params.join(" "));
        break;
      case "":
        infoMessage.textContent =
          "Унеси команду. Нпр. open forum или weather surdulica";
        break;
      default:
        infoMessage.textContent = "ГРЕШКА: Непозната команда.";
        terminal.value = "";
    }
  }
}

const open = (item) => {
  switch (item.trim()) {
    case "trgovac":
      window.open(`https://trgovac.herokuapp.com/`);
      infoMessage.textContent = `Отворен пројекат ${item}.`;
      terminal.value = "";
      break;
    case "forum":
      window.open(`https://nenad-abramovic.github.io/${item}/`);
      infoMessage.textContent = `Отворен пројекат ${item}.`;
      terminal.value = "";
      break;
    case "linkedin":
      window.open(`https://www.linkedin.com/in/nenadabramovic/`);
      infoMessage.textContent = `Отворен профил на ${item}.`;
      terminal.value = "";
      break;
    case "github":
      window.open(`https://github.com/nenad-abramovic/`);
      infoMessage.textContent = `Отворен профил на ${item}.`;
      terminal.value = "";
      break;
    case "cv":
      window.open("./assets/cv.pdf");
      infoMessage.textContent = `Отворен CV.`;
      terminal.value = "";
      break;
    case "":
      infoMessage.textContent =
        "Додај параметар: sketchit, forum, weatherapp или cv";
      break;
    default:
      infoMessage.textContent = "ГРЕШКА: Непознат параметар.";
      terminal.value = "";
  }
};

const weather = async (place) => {
  infoMessage.textContent = "Сачекај пар тренутака...";
  fetch(`https://vreme-api.herokuapp.com/api/weather/${place}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        infoMessage.textContent = `Тренутна темпереатура ${(
          parseFloat(data.data.main.temp) - 273.16
        ).toFixed(2)}℃.`;
      } else {
        infoMessage.textContent = data.data.message;
      }
    })
    .catch(() => {
      infoMessage.textContent = "Нешто је пошло наопако. Пробај опет.";
    });
};

const current = (type) => {
  const locale = "sr-RS";
  switch (type.trim()) {
    case "time":
      infoMessage.textContent = `Тренутно време: ${new Date().toLocaleTimeString(
        locale
      )}.`;
      terminal.value = "";
      break;
    case "date":
      infoMessage.textContent = `Данашњи датум: ${new Date().toLocaleDateString(
        locale
      )}`;
      terminal.value = "";
      break;
    case "":
      infoMessage.textContent = "Додај параметар: time или date.";
      break;
    default:
      infoMessage.textContent = "ГРЕШКА: Непознат параметар.";
      terminal.value = "";
  }
};

const timer = (timeString) => {
  terminal.value = "";
  const time = new Date().valueOf() + parseInt(timeString) * 1000;

  if (isNaN(time.valueOf())) {
    return (infoMessage.textContent = "ГРЕШКА: Непознат параметар.");
  }

  const interval = setInterval(() => {
    const currentTime = new Date();
    if (time - currentTime > 0) {
      infoMessage.innerHTML = `Преостало време: ${(
        (time - currentTime) /
        1000
      ).toFixed(2)}.`;
    } else {
      infoMessage.textContent = `Време је истекло.`;
      clearInterval(interval);
    }
  }, 0.01);

  let stopTimer = (e) => {
    if (e.keyCode == 13) {
      clearInterval(interval);
      terminal.removeEventListener("keyup", stopTimer);
    }
  };
  terminal.addEventListener("keyup", stopTimer);
};