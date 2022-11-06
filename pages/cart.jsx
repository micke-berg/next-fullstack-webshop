import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { SlArrowLeftCircle, SlClose } from 'react-icons/sl';
import { TfiTrash } from 'react-icons/tfi';

import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CartScreen = () => {
	const { state, dispatch } = useContext(Store);
	const router = useRouter();
	const [cartItemsCount, setCartItemsCount] = useState(0);
	const {
		cart: { cartItems },
	} = state;

	useEffect(() => {
		setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0));
	}, [cartItems]);

	const removeItemHandler = (item) => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
	};

	const updateCartHandler = (item, qty) => {
		const quantity = Number(qty);
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
	};

	return (
		<Layout title="Shopping Cart">
			{cartItems.length !== 0 && (
				<Link href="/">
					<a className="flex items-center text-gray-500 text-sm">
						<SlArrowLeftCircle className="h-5 w-5 mr-2" />
						Continue shopping
					</a>
				</Link>
			)}
			<h1 className="mb-6 mt-2 text-xl border-b pb-4 pt-4">
				Shopping Cart ({cartItemsCount})
			</h1>
			{cartItems.length === 0 ? (
				<div className="flex flex-col">
					Cart is empty!{' '}
					<Link href="/">
						<button className="black-button w-full md:w-1/4 mt-4">
							<a>Go shopping</a>
						</button>
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3 mb-4">
						<table className="min-w-full">
							<thead className="border-b text-bold">
								<tr>
									<th className="pr-5 text-left">Item</th>
									<th className="p-5 text-right">Quantity</th>
									<th className="p-5 text-right">Price</th>
									<th className="p-5 text-center">Action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item) => (
									<tr key={item.slug} className="border-b text-gray-500">
										<td>
											<Link href={`/product/${item.slug}`}>
												<a className="flex items-center ">
													<Image
														src={item.image}
														alt={item.name}
														width={70}
														height={70}
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
												<TfiTrash className="h-5 w-5" />
												{/* <SlClose className="h-5 w-5"></SlClose> */}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div>
						<ul>
							<li>
								<div className="pb-3 text-gray-600">
									Subtotal: ${' '}
									{cartItems.reduce(
										(prev, current) => prev + current.quantity * current.price,
										0
									)}
								</div>
							</li>
							<li>
								<button
									onClick={() => router.push('login?redirect=/shipping')}
									className="black-button w-full"
								>
									Check out{' '}
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
