import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { FaPaypal, FaStripe } from 'react-icons/fa';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

export default function PaymentScreen() {
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { shippingAddress, paymentMethod } = cart;
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

	const router = useRouter();

	const submitHandler = (e) => {
		e.preventDefault();
		if (!selectedPaymentMethod) {
			return toast.error('Payment method is required');
		}
		dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
		Cookies.set(
			'cart',
			JSON.stringify({
				...cart,
				paymentMethod: selectedPaymentMethod,
			})
		);

		router.push('/placeorder');
	};

	useEffect(() => {
		if (!shippingAddress.address) {
			return router.push('/shipping');
		}
		setSelectedPaymentMethod(paymentMethod || '');
	}, [paymentMethod, router, shippingAddress.address]);

	const paymentOptions = [
		{ option: 'PayPal', icon: <FaPaypal /> },
		{ option: 'Stripe', icon: <FaStripe /> },
		{ option: 'Cash on delivery', icon: '' },
	];

	return (
		<Layout title="Payment">
			<CheckoutWizard activeStep={2} />
			<form
				className="mx-auto max-w-screen-md md:mt-12"
				onSubmit={submitHandler}
			>
				<h1 className="mb-4 text-xl"> Payment Method</h1>
				{paymentOptions.map((payment) => (
					<div key={payment.option} className="mb-4 flex w-full">
						<div>
							<input
								type="radio"
								id={payment.option}
								name="PaymentMethod"
								className="p-2 ouline-none focus:ring-0"
								checked={selectedPaymentMethod === payment.option}
								onChange={() => setSelectedPaymentMethod(payment.option)}
							/>
							<label htmlFor={payment.option} className="p-2">
								{payment.option}
							</label>
						</div>
					</div>
				))}
				<div className="mb-4 flex justify-between">
					<button
						type="button"
						className="secondary-button flex justify-between align-middle"
						onClick={() => router.push('/shipping')}
					>
						<SlArrowLeft className="mr-2 mt-1" />
						Back
					</button>
					<button className="primary-button flex justify-between align-middle">
						Next
						<SlArrowRight className="text-white ml-2 mt-1" />
					</button>
				</div>
			</form>
		</Layout>
	);
}

PaymentScreen.auth = true;
