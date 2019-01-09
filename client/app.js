import ReactDOM from 'react-dom';
import React from 'react'
import App from './App.jsx'
import { AppContainer } from 'react-hot-loader'; //设置这里

const root = document.getElementById('root')
const render = (App) => {
	ReactDOM.render(
		<AppContainer>
			<App />
		</AppContainer>,
        root
	)
}
render(App)

if (module.hot) {
    module.hot.accept('./App.jsx', () => {
        const NextApp = require('./App.jsx').default
        render(NextApp)
    })
}