CodeMirror.defineMode('souffle', function () {
    return {
      token: function (stream, state) {
        console.log(state.tokenize);
        if(stream.eatSpace()){return null;}
        if (stream.match('.')) {
          if (stream.skipTo(' ')) {
            stream.next();
            return 'keyword';
          }

          if (!stream.eatWhile(/[\w/]/)) {
            return null;
          }
          return null;
        }
        console.log(stream);
        if (stream.match(/^\/\/.*/)) return "comment";

        if (stream.match(/^[0-9\.]/, false)) {
          var floatLiteral = false;
          // Floats
          if (stream.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i)) { floatLiteral = true; }
          if (stream.match(/^[\d_]+\.\d*/)) { floatLiteral = true; }
          if (stream.match(/^\.\d+/)) { floatLiteral = true; }
          if (floatLiteral) {
            // Float literals may be "imaginary"
            stream.eat(/J/i);
            return "number";
          }
          // Integers
          var intLiteral = false;
          // Hex
          if (stream.match(/^0x[0-9a-f_]+/i)) intLiteral = true;
          // Binary
          if (stream.match(/^0b[01_]+/i)) intLiteral = true;
          // Octal
          if (stream.match(/^0o[0-7_]+/i)) intLiteral = true;
          // Decimal
          if (stream.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/)) {
            // Decimal literals may be "imaginary"
            stream.eat(/J/i);
            // TODO - Can you have imaginary longs?
            intLiteral = true;
          }
          // Zero by itself with no other piece of number.
          if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
          if (intLiteral) {
            // Integer literals may be "long"
            stream.eat(/L/i);
            return "number";
          }
        }
        stream.skipToEnd();
        return null;
      }
    }
  })
