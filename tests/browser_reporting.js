function reportResultToServer(result, sync, port) {
  port = port || 8888;
  if (reportResultToServer.reported) {
    // Only report one result per test, even if the test misbehaves and tries to report more.
    reportErrorToServer("excessive reported results from " + ('' + window.location).substr(0, 80) + ", sending " + result + ", test will fail");
  }
  reportResultToServer.reported = true;

  var xhr = new XMLHttpRequest();
  if (typeof Module === 'object' && Module && Module['pageThrewException']) result = 12345;
  xhr.open('GET', 'http://localhost:' + port + '/report_result?' + result + '|' + ('' + window.location).substr(0, 80), !sync);
  xhr.send();
  if (typeof Module === 'object' && Module && !Module['pageThrewException'] /* for easy debugging, don't close window on failure */) setTimeout(function() { window.close() }, 1000);
}

function maybeReportResultToServer(result, sync, port) {
  if (reportResultToServer.reported) return;
  reportResultToServer(result, sync, port);
}

function reportErrorToServer(message) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', encodeURI('http://localhost:8888?stderr=' + message));
  xhr.send();
}

if (typeof window === 'object' && window) {
  window.addEventListener('error', function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI('http://localhost:8888?exception=' + e.message + ' / ' + e.target + ' from ' + ('' + window.location).substr(0, 80)));
    xhr.send();
  });
}
