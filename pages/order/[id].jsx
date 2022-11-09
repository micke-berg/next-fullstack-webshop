import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, order: action.payload, error: '' };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			state;
	}
}

export default function OrderScreen() {
	const { query } = useRouter();
	const orderId = query.id;

	const [{ loading, error, order }, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: '',
	});

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/${orderId}`);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		if (!order._id || (order._id && order._id !== orderId)) {
			fetchOrder();
		}
	}, [order, orderId]);

	const {
		shippingAddress,
		paymentMethod,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		isPaid,
		paidAt,
		isDelivered,
		deliveredAt,
	} = order;

	console.log('orderItems', orderItems);

	return (
		<Layout title={`Order ${orderId}`} background="bg-neutral-100">
			<h1 className="mb-4 text-xl">{`Order: ${orderId}`}</h1>
			{loading ? (
				<div className="alert-error">{error}</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-y-5 lg:gap-5">
					<div className="overflow-x-hidden md:col-span-3 grid gap-5">
						<div className="p-5 bg-white">
							<h2 className="mb-2 text-lg">Shipping Address</h2>
							<div className="mb-2">
								{shippingAddress ? (
									<>
										{shippingAddress?.fullName}, {shippingAddress?.address},{' '}
										{shippingAddress?.postalCode} {shippingAddress?.city},{' '}
										{shippingAddress?.country}
									</>
								) : null}
							</div>
							{isDelivered ? (
								<div className="alert-success">Delivered at {deliveredAt}</div>
							) : (
								<div className="alert-error">Not delivered</div>
							)}
						</div>
						<div className="p-5 bg-white">
							<h2 className="mb-2 text-lg">Payment Method</h2>
							<div className="mb-2">{paymentMethod}</div>
							{isPaid ? (
								<div className="alert-success">Paid at {paidAt}</div>
							) : (
								<div className="alert-error">Not paid</div>
							)}
						</div>
						<div className="p-5 bg-white">
							<h2 className="text-lg">Order Items</h2>
							<table className="min-w-full">
								<thead className="border-neutral-900 border-b text-bold">
									<tr>
										<th className="pr-5 text-left">Item</th>
										<th className="p-5 text-right">Quantity</th>
										<th className="p-5 text-right">Price</th>
										<th className="p-5 text-right">Subtotal</th>
									</tr>
								</thead>
								<tbody>
									{orderItems?.map((item) => (
										<tr
											key={item._id}
											className="h-20 border-b text-neutral-700"
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
													&nbsp; &nbsp;
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
						</div>
					</div>

					<div className="p-5 bg-white">
						<h2 className="mb-2 text-lg">Order Summary</h2>
						<ul>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Items</div>
									<div>{itemsPrice ? `$ ${itemsPrice}` : null}</div>
								</div>
							</li>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Tax</div>
									<div>{taxPrice ? `$ ${taxPrice}` : null}</div>
								</div>
							</li>
							<li>
								<div className="mb-2 flex justify-between">
									<div>Shipping Price</div>
									<div>{shippingPrice ? `$ ${shippingPrice}` : null}</div>
								</div>
							</li>
							<li>
								<div className="mt-3 pt-3 flex justify-between font-semibold border-neutral-900 border-t">
									<div>Total Price</div>
									<div>{totalPrice ? `$ ${totalPrice}` : null}</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			)}
		</Layout>
	);
}

OrderScreen.auth = true;
