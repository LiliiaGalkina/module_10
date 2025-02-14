"use strict";

//Задание 1

const button = document.querySelector(".btn");
const btnFirst = document.querySelector(".btn__svg-first");
const btnSecond = document.querySelector(".btn__svg-second");

button.addEventListener("click", () => {
  btnFirst.classList.toggle("hidden");
  btnSecond.classList.toggle("hidden");
});

//Задание 2

const btnScreenSize = document.querySelector(".btn-screen-size");

btnScreenSize.addEventListener("click", () =>
  alert(
    `Ширина экрана - ${window.screen.width}px, высота экрана - ${window.screen.height}px`
  )
);

//Задание 3

const url = "wss://echo.websocket.org";

const openChatButton = document.querySelector(".open-chat");
const closeChatButton = document.querySelector(".close-chat");
const wsChatContainer = document.querySelector(".ws");
const wsInput = document.querySelector(".ws__input");
const sendMessageButton = document.querySelector(".ws__button");
const wsChat = document.querySelector(".ws__chat");

let websocket;

function writeToScreen(message) {
  let phrase = document.createElement("p");
  phrase.style.wordWrap = "break-word";
  phrase.classList.add("ws__chat-message");
  phrase.innerHTML = message;
	wsChat.appendChild(phrase);
	phrase.scrollIntoView({ behavior: "smooth" });
}

openChatButton.addEventListener("click", () => {
  wsChat.textContent = "";
	wsChatContainer.classList.remove("hidden");
	wsInput.focus();
  let wsGeolocationButton = document.createElement("button");
  wsGeolocationButton.textContent = "Гео-локация";
  wsGeolocationButton.title = "Отправить гео-локацию";
  wsChat.appendChild(wsGeolocationButton);
  wsGeolocationButton.classList.add("ws__chat-geo");
  wsGeolocationButton.classList.add("ws-btn");

  wsGeolocationButton.addEventListener("click", () => {
    const error = () => {
      alert("Невозможно получить данные о геолокации");
    };

    const success = (position) => {
      const latitude = position.coords.latitude;
		 const longitude = position.coords.longitude;
		 let linkGeoMap = document.createElement('a');
		 linkGeoMap.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
		 linkGeoMap.textContent = "Ссылка на мою гео-локацию";
		 linkGeoMap.target = "_blank";
		 linkGeoMap.classList.add("ws__chat-link");
		 wsChat.appendChild(linkGeoMap);
		 linkGeoMap.scrollIntoView({ behavior: "smooth" });
		 wsGeolocationButton.remove();

     // writeToScreen(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation не поддерживается вашим браузером");
    }
  });

  websocket = new WebSocket(url);
  websocket.onopen = function (evt) {
    writeToScreen("Welcome to the chat!");
  };
  websocket.onclose = function (evt) {
    writeToScreen("Goodbye. See you later.");
  };
  websocket.onmessage = function (evt) {
    writeToScreen(
      '<span style="color: rgb(0, 0, 0);"> RESPONSE: ' +
        evt.data +
        "</span>"
    );
  };
  websocket.onerror = function (evt) {
    writeToScreen(
      '<span style="color: red;">ERROR:  ' + evt.data + "</span>"
    );
    setTimeout(() => wsChatContainer.classList.add("hidden"), 2000);
  };
});

closeChatButton.addEventListener("click", () => {
  websocket.close();
	websocket = null;
	wsChat.textContent = "";
  setTimeout(() => wsChatContainer.classList.add("hidden"), 1000);
});

sendMessageButton.addEventListener("click", () => {
  if (wsInput.value == "") {
    alert("Вы забыли ввести сообщение");
  } else {
    let message = wsInput.value;
	  wsInput.value = "";
	  wsInput.focus();
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }
});