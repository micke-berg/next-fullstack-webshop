// import React from 'react';

// const CheckoutWizard = ({ activeStep = 0 }) => {
// 	return (
// 		<div className="mb-4 flex flex-wrap">
// 			{['User Login', 'Shipping Adress', 'Payment Method', 'Place Order'].map(
// 				(step, index) => (
// 					<div
// 						key={step}
// 						className={`flex-1 border-b-2 mb-2 pb-2 text-center ${
// 							index <= activeStep
// 								? 'border-black text-black'
// 								: 'border-gray-400 text-gray-400'
// 						}`}
// 					>
// 						{step}
// 					</div>
// 				)
// 			)}
// 		</div>
// 	);
// };

// export default CheckoutWizard;

import Link from 'next/link';
import React, { useContext } from 'react';
import { Store } from '../utils/Store';

const CheckoutWizard = ({ activeStep = 0 }) => {
	const { state } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const pages = [
		{ page: '', title: 'User Login' },
		{ page: '/shipping', title: 'Shipping Adress' },
		{ page: '/payment', title: 'Payment Method' },
		{ page: '', title: 'Place Order' },
	];
	return (
		<div className="mb-4 flex flex-wrap">
			{pages.map((step, index) => (
				<div
					key={step.title}
					className={`flex-1 border-b-2 mb-2 pb-2 text-center ${
						index <= activeStep && cartItems.length !== 0
							? 'border-black text-black'
							: 'border-gray-400 text-gray-400'
					}`}
				>
					{cartItems.length === 0 ? (
						<span>{step.title}</span>
					) : index <= activeStep ? (
						<Link href={`${step.page}`}>{step.title}</Link>
					) : (
						<span>{step.title}</span>
					)}
				</div>
			))}
		</div>
	);
};

export default CheckoutWizard;
