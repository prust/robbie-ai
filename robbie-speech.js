document.addEventListener("DOMContentLoaded", function(evt) {

  if ((!window.SpeechRecognition && !window.webkitSpeechRecognition) || !window.speechSynthesis)
    return alert("I'm sorry, but this browser does not support speech recognition and/or synthesis.");

  var recog = window.SpeechRecognition ? new SpeechRecognition() : new webkitSpeechRecognition();
  recog.continuous = true;
  recog.interimResults = true;
  recog.lang = "en-US";
  //recog.maxAlternatives = 3;

  var btn = document.getElementById('start');
  btn.addEventListener('click', function() {
    recog.start();
  });

  var final_span = document.getElementById('final');
  var interim_span = document.getElementById('interim');

  var final_transcript = '';
  var robbie = new Robbie();
  robbie.on('response', function(str) {
    final_transcript += '<div class="robbie msg">' + str + '</div>';
    final_span.innerHTML = final_transcript;

    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 2; //0 to 2
    msg.text = str;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
  });

  recog.onresult = function(evt) {
    var interim_transcript = '';
    var has_final = false;
    var this_final = '';
    for (var i = evt.resultIndex; i < evt.results.length; ++i) {
      if (evt.results[i].isFinal) {
        has_final = true;
        this_final += evt.results[i][0].transcript;
      }
      else {
        interim_transcript += evt.results[i][0].transcript;
      }
    }

    if (this_final)
      final_transcript += '<div class="user msg">' + this_final + '</div>';
    final_span.innerHTML = final_transcript;
    interim_span.innerHTML = interim_transcript;

    // Chrome's speech recognition times out every once in a while w/out calling "end" evt
    // instead of letting it do that, manually reset it after every final result
    // see: https://groups.google.com/a/chromium.org/forum/#!topic/chromium-html5/s2XhT-Y5qAc
    // TODO: double-check that we actually need to do this. Does Chrome's Web Speech Demo do this?
    if (has_final) {
      recog.stop();
      robbie.input(this_final);
    }
  };

  recog.onend = function() {
    recog.start();
  };
});
