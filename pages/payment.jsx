import React from 'react';
import { useState } from 'react';
import { FaPaypal, FaStripe } from 'react-icons/fa';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PaymentScreen = () => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { shippingAddress, paymentMethod } = cart;

	const router = useRouter();
	const paymentOptions = [
		{ option: 'PayPal', icon: <FaPaypal /> },
		{ option: 'Stripe', icon: <FaStripe /> },
		{ option: 'Cash on delivery', icon: '' },
	];

	console.log('cart', cart.shippingAddress);

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

	return (
		<Layout title="Payment">
			<CheckoutWizard activeStep={2} />
			<form className="w-auto mwx-w-svreen-md" onSubmit={submitHandler}>
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
						{/* {payment.icon} */}
					</div>
				))}
				<div className="mb-4 flex justify-between">
					<button
						type="button"
						className="secondary-button"
						onClick={() => router.push('/shipping')}
					>
						Back
					</button>
					<button className="primary-button">Next</button>
				</div>
			</form>
		</Layout>
	);
};

export default PaymentScreen;
