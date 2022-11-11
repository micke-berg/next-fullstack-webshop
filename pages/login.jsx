import Link from 'next/link';
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginScreen = () => {
	const { data: session } = useSession();

	const router = useRouter();
	const { redirect } = router.query;

	useEffect(() => {
		if (session?.user) {
			router.push(redirect || '/');
		}
	}, [redirect, router, session]);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();

	const submitHandler = async ({ email, password }) => {
		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});
			if (result.error) {
				toast.error(result.error);
			}
		} catch (err) {
			toast.error(getError(err));
		}
	};

	return (
		<Layout title="Login">
			<form
				className="mx-auto max-w-screen-md mt-6"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="mb-4 text-xl">Login</h1>
				<div className="mb-4">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						{...register('email', {
							required: 'Please enter email',
							pattern: {
								value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
								message: 'Please enter valid email',
							},
						})}
						className="w-full mb-1"
						id="email"
						autoFocus
					/>
					{errors.email && (
						<div className="text-red-500">{errors.email.message}</div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						{...register('password', {
							required: 'Please enter password',
							minLength: {
								value: 6,
								message: 'Password is more than 5 characters',
							},
						})}
						className="w-full mb-1"
						id="password"
						autoFocus
					/>
					{errors.password && (
						<div className="text-red-500">{errors.password.message}</div>
					)}
				</div>
				<div className="mb-4">
					<button className="primary-button w-full sm:w-1/6">Login</button>
				</div>
				<div className="mb-4 ">
					Don&apos;t have an account yet? &nbsp;
					<Link href="register">
						<span className="text-blue-700 cursor-pointer">Register</span>
					</Link>
				</div>
			</form>
		</Layout>
	);
};

export default LoginScreen;
