import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CartScreen = () => {
	const { state, dispatch } = useContext(Store);

	const router = useRouter();

	const {
		cart: { cartItems },
	} = state;

	const removeItemHandler = (item) => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
	};

	const updateCartHandler = (item, qty) => {
		const quantity = Number(qty);
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
	};

	return (
		<Layout title="Shopping Cart">
			<Link href="/">
				<a className="flex items-center">
					<ArrowLeftIcon className="h-5 w-5 mr-1" />
					Continue shopping
				</a>
			</Link>
			<h1 className="mb-4 mt-2 text-xl">Shopping Cart</h1>
			{cartItems.length === 0 ? (
				<div>
					Cart is empty! <Link href="/">Go shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<table className="min-w-full">
							<thead className="border-b">
								<tr>
									<th className="px-5 text-left">Item</th>
									<th className="p-5 text-right">Quantity</th>
									<th className="p-5 text-right">Price</th>
									<th className="p-5 text-center">Action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item) => (
									<tr key={item.slug} className="border-b">
										<td>
											<Link href={`/product/${item.slug}`}>
												<a className="flex items-center">
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													></Image>
													&nbsp; &nbsp;
													{item.name}
												</a>
											</Link>
										</td>
										<td className="p-5 text-right">
											<select
												value={item.quantity}
												onChange={(e) =>
													updateCartHandler(item, e.target.value)
												}
											>
												{[...Array(item.countInStock).keys()].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</select>
										</td>
										<td className="p-5 text-right">$ {item.price}</td>
										<td className="p-5 text-center">
											<button onClick={() => removeItemHandler(item)}>
												<XCircleIcon className="h-5 w-5"></XCircleIcon>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="card p-5">
						<ul>
							<li>
								<div className="pb-3 text-xl">
									Subtotal (
									{cartItems.reduce(
										(prev, current) => prev + current.quantity,
										0
									)}
									) : ${' '}
									{cartItems.reduce(
										(prev, current) => prev + current.quantity * current.price,
										0
									)}
								</div>
							</li>
							<li>
								<button
									onClick={() => router.push('login?redirect=/shipping')}
									className="primary-button w-full"
								>
									Check Out
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
