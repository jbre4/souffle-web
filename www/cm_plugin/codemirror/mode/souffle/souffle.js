CodeMirror.defineMode('souffle', function () {
    return {
      token: function (stream, state) {
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
        stream.skipToEnd();
        return null;
      }
    }
  })
