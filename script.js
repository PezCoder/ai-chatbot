const messengerObj = messenger();
const btn = document.querySelector('button#talk');
btn.onclick = function() {
  messengerObj.you();
  recognition.start();
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.addEventListener('result', e => {
  var message = e.results[0][0].transcript;
  messengerObj.you(message);
  messengerObj.bot();
  socket.emit('voice message', message);
});

recognition.onsoundstart = toggleBtnAnimation;
recognition.onsoundend = toggleBtnAnimation;

function toggleBtnAnimation() {
  if (btn.classList.contains('animate')) {
    // remove class after animation is done
    var event = btn.addEventListener("animationiteration", ele => {
      console.log('ended');
      btn.classList.remove('animate');
      btn.removeEventListener('animationiteration', event);
    });
  } else {
    btn.classList.add('animate');
  }
}

const socket = io();
socket.on('bot response', botMessage => {
  speak(botMessage);
  messengerObj.bot(botMessage);
});

function speak(textToSpeak) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'en-IN';
  synth.speak(utterance);
}

// Handle updating of bot & you messages
function messenger() {
  const you = document.querySelector('#you');
  const bot = document.querySelector('#bot');

  function updateMessage(msg) {
    console.log('this is ', this);
    msg = msg || this.getAttribute('default-message');
    this.innerHTML = '&nbsp;' + msg;
  }

  return {
    bot: updateMessage.bind(bot),
    you: updateMessage.bind(you)
  }
}
