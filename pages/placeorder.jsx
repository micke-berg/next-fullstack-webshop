import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import Link from 'next/link';
import { Store } from '../utils/Store';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function PlaceorderScreen() {
	const [hasMounted, setHasMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { cartItems, shippingAddress, paymentMethod } = cart;
	const router = useRouter();

	useEffect(() => {
		if (!paymentMethod) {
			router.push('/payment');
		}
	}, [paymentMethod, router]);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

	const itemsPrice = round2(
		cartItems?.reduce(
			(prev, current) => prev + current.quantity * current.price,
			0
		)
	);
	const shippingPrice = itemsPrice > 200 ? 0 : 15;
	const taxPrice = round2(itemsPrice * 0.15);
	const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

	const placeOrderHandler = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post('/api/orders', {
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			});
			setLoading(false);
			dispatch({ type: 'CART_CLEAR_ITEMS' });
			Cookies.set(
				'cart',
				JSON.stringify({
					...cart,
					cartItems: [],
				})
			);
			router.push(`/order/${data._id}`);
		} catch (err) {
			console.log('object');
			setLoading(false);
			toast.error(getError(err), {
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				progress: undefined,
			});
		}
	};

	return (
		<Layout title="Place Order" background="bg-neutral-100">
			<CheckoutWizard activeStep={3} />
			<h1 className="mb-4 text-xl">Order Details</h1>
			{cartItems.length === 0 ? (
				<div className="flex flex-col">
					Cart is empty!{' '}
					<Link href="/">
						<button className="primary-button w-full md:w-1/4 mt-4">
							Go shopping
						</button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-y-5 lg:gap-5">
					<div className="overflow-x-auto md:col-span-3 grid gap-5">
						<div className="p-5  bg-white">
							<h2 className="mb-4 text-lg">Shipping Address</h2>
							<div className="mb-2">
								{shippingAddress.fullName}, {shippingAddress.address},{' '}
								{shippingAddress.city}, {shippingAddress.postalCode},{' '}
								{shippingAddress.country}
							</div>
							<div>
								<Link href="/shipping" className="font-normal">
									Edit
								</Link>
							</div>
						</div>
						<div className="p-5  bg-white">
							<h2 className="mb-4 text-lg">Payment Method</h2>
							<div className="mb-2">{paymentMethod}</div>
							<div>
								<Link href="/payment" className="font-normal">
									Edit
								</Link>
							</div>
						</div>
						<div className="overflow-x-auto p-5 bg-white">
							<h2 className="text-lg">Order Items</h2>
							<table className="min-w-full">
								<thead className="text-bold border-b border-neutral-900">
									<tr className="">
										<th className="pr-5 text-left">Item</th>
										<th className="p-5 text-right">Quantity</th>
										<th className="p-5 text-right">Price</th>
										<th className="p-5 text-right">Subtotal</th>
									</tr>
								</thead>
								<tbody>
									{cartItems.map((item) => (
										<tr
											key={item._id}
											className="border-b h-20 text-neutral-700"
										>
											<td>
												<Link
													href={`/product/${item.slug}`}
													className="flex items-center"
												>
													<Image
														src={item.image}
														alt={item.name}
														width={70}
														height={70}
													></Image>
													&nbsp;
													{item.name}
												</Link>
											</td>
											<td className="p-5 text-right">{item.quantity}</td>
											<td className="p-5 text-right">$ {item.price}</td>
											<td className="p-5 text-right">
												$ {item.quantity * item.price}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="mt-2">
								<Link href="/cart" className="font-normal">
									Edit
								</Link>
							</div>
						</div>
					</div>
					<div className="p-5 bg-white">
						<ul>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Items</div>
									<div>$ {itemsPrice}</div>
								</div>
							</li>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Tax</div>
									<div>$ {taxPrice}</div>
								</div>
							</li>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Shipping</div>
									<div>$ {shippingPrice}</div>
								</div>
							</li>
							<li>
								<div className="mb-3 mt-3 pt-3 flex justify-between font-semibold border-neutral-900 border-t">
									<div>Total Price</div>
									<div>$ {totalPrice}</div>
								</div>
							</li>
							<li>
								<button
									disabled={loading}
									onClick={placeOrderHandler}
									className="primary-button w-full mt-2"
								>
									{loading ? 'Loading' : 'Place order'}
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</Layout>
	);
}

PlaceorderScreen.auth = true;
