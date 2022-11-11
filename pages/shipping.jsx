import React, { useEffect, useContext } from 'react';
import { SlArrowLeftCircle } from 'react-icons/sl';

import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Link from 'next/link';

export default function ShippingScreen() {
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { shippingAddress } = cart;
	const router = useRouter();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
	} = useForm();

	useEffect(() => {
		setValue('fullName', shippingAddress.fullName);
		setValue('address', shippingAddress.address);
		setValue('city', shippingAddress.city);
		setValue('postalCode', shippingAddress.postalCode);
		setValue('country', shippingAddress.country);
	}, [setValue, shippingAddress]);

	const submitHandler = ({ fullName, address, city, postalCode, country }) => {
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: { fullName, address, city, postalCode, country },
		});
		Cookies.set(
			'cart',
			JSON.stringify({
				...cart,
				shippingAddress: {
					fullName,
					address,
					city,
					postalCode,
					country,
				},
			})
		);

		router.push('/payment');
	};

	return (
		<Layout title="Shipping Address">
			<CheckoutWizard activeStep={1} />
			<Link
				href="/cart"
				className="flex items-center text-gray-500 mb-4 text-sm"
			>
				<SlArrowLeftCircle className="h-5 w-5 mr-2" />
				Back to cart
			</Link>
			<form
				className="mx-auto max-w-screen-md"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="text-xl">Shipping Address</h1>
				<div>
					<input
						placeholder="Full Name"
						type="text"
						className="w-full mt-4 mb-1"
						id="fullName"
						autoFocus
						{...register('fullName', {
							required: 'Enter full name',
						})}
					/>
					{errors.fullName && (
						<div className="text-red-500">{errors.fullName.message}</div>
					)}
				</div>
				<div>
					<input
						placeholder="Address"
						type="text"
						className="w-full mt-4 mb-1"
						id="address"
						autoFocus
						{...register('address', {
							required: 'Enter address',
							minLength: {
								value: 3,
								message: 'Address should more than 2 characters',
							},
						})}
					/>
					{errors.address && (
						<div className="text-red-500">{errors.address.message}</div>
					)}
				</div>
				<div className="flex flex-col sm:flex-row">
					<div className="sm:mr-4 mt-4 mb-1">
						<input
							placeholder="Postal Code"
							type="text"
							className="w-full"
							id="postalCode"
							autoFocus
							{...register('postalCode', {
								required: 'Enter postalcode',
							})}
						/>
						{errors.postalCode && (
							<div className="text-red-500">{errors.postalCode.message}</div>
						)}
					</div>
					<div className="w-full mt-4 mb-1">
						<input
							placeholder="City"
							type="text"
							className="w-full"
							id="city"
							autoFocus
							{...register('city', {
								required: 'Enter city',
							})}
						/>
						{errors.city && (
							<div className="text-red-500">{errors.city.message}</div>
						)}
					</div>
				</div>
				<div className="mt-4 mb-1">
					<input
						placeholder="Country"
						type="text"
						className="w-full"
						id="country"
						autoFocus
						{...register('country', {
							required: 'Enter country',
						})}
					/>
					{errors.country && (
						<div className="text-red-500">{errors.country.message}</div>
					)}
				</div>
				<div className="mt-4 ">
					<button className="primary-button w-full sm:w-1/6">Next</button>
				</div>
			</form>
		</Layout>
	);
}

ShippingScreen.auth = true;
