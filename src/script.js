const terminal = document.querySelector(".terminal-input");
const infoMessage = document.querySelector(".info-msg");
const codeLines = document.querySelectorAll("code");

codeLines.forEach(elem => {
  elem.addEventListener('click', (e) => {
    let text = e.target.textContent;
    let command = e.target.parentElement.parentElement.className;
    
    if(text.startsWith(command)) {
      terminal.value = text;
    } else {
      terminal.value = `${command} ${text}`;
    }
    
    terminal.focus();
  });
});

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
          "Enter command. For example, open forum or weather surdulica";
        break;
      default:
        infoMessage.textContent = "ERROR: Unknown command.";
        terminal.value = "";
    }
  }
}

const open = (item) => {
  switch (item.trim()) {
    case "trgovac":
      window.open(`https://trgovac.herokuapp.com/`);
      infoMessage.textContent = `Opened ${item} project.`;
      terminal.value = "";
      break;
    case "forum":
      window.open(`https://nenad-abramovic.github.io/${item}/`);
      infoMessage.textContent = `Opened ${item} project.`;
      terminal.value = "";
      break;
    case "linkedin":
      window.open(`https://www.linkedin.com/in/nenadabramovic/`);
      infoMessage.textContent = `Opened ${item} profile.`;
      terminal.value = "";
      break;
    case "github":
      window.open(`https://github.com/nenad-abramovic/`);
      infoMessage.textContent = `Opened ${item} profile.`;
      terminal.value = "";
      break;
    case "cv":
      window.open("./assets/cv.pdf");
      infoMessage.textContent = `CV opened.`;
      terminal.value = "";
      break;
    case "":
      infoMessage.textContent =
        "Add parameter: trgovac, forum, linkedin, github or cv";
      break;
    default:
      infoMessage.textContent = "ERROR: Unknown parameter.";
      terminal.value = "";
  }
};

const weather = async (place) => {
  infoMessage.textContent = "Please wait...";
  fetch(`https://vreme-api.herokuapp.com/api/weather/${place}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        infoMessage.textContent = `Current temperature ${(
          parseFloat(data.data.main.temp) - 273.16
        ).toFixed(2)}℃.`;
      } else {
        infoMessage.textContent = data.data.message;
      }
    })
    .catch(() => {
      infoMessage.textContent = " Something went wrong. Please try again.";
    });
};

const current = (type) => {
  const locale = "sr-RS";
  switch (type.trim()) {
    case "time":
      infoMessage.textContent = `Current time: ${new Date().toLocaleTimeString(
        locale
      )}.`;
      terminal.value = "";
      break;
    case "date":
      infoMessage.textContent = `Todays date: ${new Date().toLocaleDateString(
        locale
      )}`;
      terminal.value = "";
      break;
    case "":
      infoMessage.textContent = "Add parameter: time or date.";
      break;
    default:
      infoMessage.textContent = "ERROR: Unknown parameter.";
      terminal.value = "";
  }
};

const timer = (timeString) => {
  terminal.value = "";
  const time = new Date().valueOf() + parseInt(timeString) * 1000;

  if (isNaN(time.valueOf())) {
    return (infoMessage.textContent = "ERROR: Unknown parameter.");
  }

  const interval = setInterval(() => {
    const currentTime = new Date();
    if (time - currentTime > 0) {
      infoMessage.innerHTML = `Time left: ${(
        (time - currentTime) /
        1000
      ).toFixed(2)}.`;
    } else {
      infoMessage.textContent = `Times up.`;
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