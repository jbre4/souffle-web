import React from 'react'
import ReactDOM from 'react-dom'

var style = {
    backgroundColor: 'orange',
    color: 'white',
    font: 'Arial'
}

const title = React.createElement(
    'h1',
    {id: 'title', className: 'header', style: style},
    'Hello World'
)


ReactDOM.render (
    title,
    document.getElementById('root')
)