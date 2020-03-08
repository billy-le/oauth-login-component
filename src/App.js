import React from 'react';
import * as yup from 'yup';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { useForm } from 'react-hook-form';

import './App.css';

const tabsMachine = Machine({
	id: 'tabs',
	initial: 'login',
	states: {
		login: {
			on: {
				SIGN_UP: 'sign_up',
				FORGOT_PASSWORD: 'forgot_password'
			}
		},
		sign_up: {
			on: {
				LOGIN: 'login'
			}
		},
		forgot_password: {
			on: {
				LOGIN: 'login',
				SIGN_UP: 'sign_up'
			}
		}
	}
});

const schema = yup.object().shape({
	email: yup
		.string()
		.email()
		.required(),
	password: yup.string().min(8)
});

let renderCount = 0;

function App() {
	const [tab, send] = useMachine(tabsMachine);
	const { register, handleSubmit, errors } = useForm({
		validationSchema: schema
	});

	async function onSubmit(e) {
		switch (tab.value) {
			case 'login':
				await fetch(`/api/login`, {
					method: 'POST',
					body: e
				})
					.then(res => res.json())
					.then(console.log)
					.catch(console.log);
				break;
			case 'sign_up':
				await fetch(`/api/signup`, {
					method: 'POST',
					body: e
				})
					.then(res => res.json())
					.then(console.log)
					.catch(console.log);
				break;
			case 'forgot_password':
				await fetch(`/api/forgot-password`, {
					method: 'POST',
					body: e
				})
					.then(res => res.json())
					.then(console.log)
					.catch(console.log);
		}
	}

	renderCount++;

	console.log(errors);

	return (
		<div className='app'>
			<form id='login-form' method='POST' onSubmit={handleSubmit(onSubmit)}>
				<div className={`tabs`}>
					<h2 onClick={() => send('LOGIN')}>
						<div
							style={{
								width: tab.value === 'login' ? '100%' : 0
							}}
							className='overtop'
						></div>
						Login
					</h2>
					<h2 onClick={() => send('SIGN_UP')}>
						<div
							style={{
								width: tab.value === 'sign_up' ? '100%' : 0
							}}
							className='overtop'
						></div>
						Sign Up
					</h2>
				</div>
				<div className='control'>
					<label htmlFor='email'>Email</label>
					<input type='text' name='email' ref={register}></input>
					{errors.email && <div className='error'>{errors.email.message}</div>}
				</div>
				{tab.value !== 'forgot_password' && (
					<div className='control'>
						<label htmlFor='password'>Password</label>
						<input type='password' name='password' ref={register}></input>
						{errors.password && (
							<div className='error'>{errors.password.message}</div>
						)}
					</div>
				)}
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end'
					}}
				>
					<button type='submit'>Submit</button>
				</div>
				{tab.value === 'login' ? (
					<a href='#' onClick={() => send('FORGOT_PASSWORD')}>
						Forgot My Password
					</a>
				) : null}
			</form>
			<div style={{ textAlign: 'center' }}>render count: {renderCount}</div>
		</div>
	);
}

export default App;
