// returns a string of length n filled with character x
function stringInit(n,x) {
  for (var i=0, s =''; i<n; i++) s+=x
  return s
}

// pastes s1 on s0 at position pos truncated at s0's initial size and returns the resulting string
function stringPaste(s0,s1,pos) {
  pos = parseInt(pos)
  var pastedS
  if (pos<0) {
    pastedS = s1.substr(Math.abs(pos)) // crop the beginning of the pasted word
    pos = 0
  }
  else {
    pastedS = s1.substr(0,s0.length-pos); // crop s1 to fit within s0
  }
  return s0.substr(0,pos) + pastedS + s0.substr(pos+pastedS.length)
}

function _stringPasteTester() {
  var testBuf = '12345678901234567890'
  var testPaste = 'Geo'
  var tests = {
        '-4' : '12345678901234567890',
        '-3' : '12345678901234567890',
        '-2' : 'o2345678901234567890',
        '-1' : 'eo345678901234567890',
         '0' : 'Geo45678901234567890',
         '1' : '1Geo5678901234567890',
        '16' : '1234567890123456Geo0',
        '17' : '12345678901234567Geo',
        '18' : '123456789012345678Ge',
        '19' : '1234567890123456789G',
        '20' : '12345678901234567890',
        '21' : '12345678901234567890',
  }
  sortedKeys(tests).forEach(function(pos) {
    assert(stringPaste(testBuf,testPaste,pos) == tests[pos], 
      'testing stringPaste("'+testBuf+'","'+testPaste+'","'+pos+'") -> "'+
         stringPaste(testBuf,testPaste,pos)+'" == "'+tests[pos]+'"')
  });
}

function unsortedKeys(hash) {
  var keys = []
  for (var k in hash) keys.push(k)
  return keys
}

function sortedKeys(hash) { return unsortedKeys(hash).sort() }

function escapeHTML(s) {
  s = s.replace(/&/g, "&amp;")
  s = s.replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/'/g, "&apos;").
      replace(/"/g, "&quot;").
      replace(/ /g, "&nbsp;").
      replace(/[\u0080-\uFFFF]/g, function (c) {
          var code = c.charCodeAt(0)
          return '&#' + code + ';'
          // if we want hex:
          var hex = code.toString(16)
          return '&#x' + hex + ';'
      })
  return s;
}