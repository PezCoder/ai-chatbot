const btn = document.querySelector('button#talk');
btn.onclick = startListening;

function startListening() {
  recognition.start();
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.addEventListener('result', e => {
  console.log('Confidence: ' + e.results[0][0].confidence);
  var message = e.results[0][0].transcript;
  console.log(`Message: ${message}`);
  socket.emit('voice message', message);
});

const socket = io();
socket.on('bot response', res => {
  console.log(res);
});
