import axios from 'axios';
import Link from 'next/link';
import React, { useReducer } from 'react';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {
				...state,
				loading: true,
				error: '',
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				orders: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
}

const OrderHistoryScreen = () => {
	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		orders: [],
		error: '',
	});

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/history`);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchOrders();
	}, []);
	return (
		<Layout title="Order History">
			<h1 className="mb-4 text-xl">Order History</h1>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="alert-error">{error}</div>
			) : (
				<div className="overflow-x-auto">
					<form action="" className="min-w-full">
						<table>
							<thead className="text-bold border-b border-neutral-900">
								<tr>
									<th className="pr-5 text-left">ID</th>
									<th className="p-5 text-left">DATE</th>
									<th className="p-5 text-left">TOTAL</th>
									<th className="p-5 text-left">PAID</th>
									<th className="p-5 text-left">DELIVERED</th>
									<th className="p-5 text-left">ACTION</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id} className="border-b hover:bg-gray-100">
										{' '}
										<td className="pr-5 text-left">
											{order._id.substring(20, 24)}
										</td>
										<td className="p-5 text-left">
											{order.createdAt.substring(0, 10)}
										</td>
										<td className="p-5 text-left">$ {order.totalPrice}</td>
										<td className="p-5 text-left">
											{order.isPaid
												? `${order.paidAt.substring(0, 10)}`
												: 'not paid'}
										</td>
										<td className="p-5 text-left">
											{order.isDeliveredAt
												? `${order.isDeliveredAt.substring(0, 10)}`
												: 'not paid'}
										</td>
										<td className="p-5 text-left">
											<Link
												href={`/order/${order._id}`}
												className="text-blue-600"
											>
												Details
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</form>
				</div>
			)}
		</Layout>
	);
};

OrderHistoryScreen.auth = true;

export default OrderHistoryScreen;
