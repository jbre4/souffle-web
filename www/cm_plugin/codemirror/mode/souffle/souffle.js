CodeMirror.defineMode('souffle', function () {
    return {
      token: function (stream, state) {
  
        if (stream.match('.')) {
          if (stream.skipTo('.')) {
            stream.next()
            return 'tag'
          }
  
          if (!stream.eatWhile(/[\w/]/)) {
            return null
          }
  
          return 'tag'
        }
        
        stream.skipToEnd()
        return null
      }
    }
  })