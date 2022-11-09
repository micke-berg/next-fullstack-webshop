import { SlArrowLeftCircle, SlBag } from 'react-icons/sl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProducScreen = (props) => {
	const [buttons, setButtons] = useState(false);
	const { product } = props;
	const { state, dispatch } = useContext(Store);
	const router = useRouter();
	if (!product) {
		return <Layout title="Produt Not Found">Produt Not Found</Layout>;
	}

	const addToCartHandler = async () => {
		const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);

		if (data.countInStock < quantity) {
			return toast.error('Sorry. Product is out of stock');
		}
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

		toast.success('Item was added to your cart!', {
			autoClose: 1000,
			hideProgressBar: true,
			closeOnClick: true,
			progress: undefined,
		});
		setButtons(true);
	};

	// const updateCartHandler = (item, qty) => {
	// 	const quantity = Number(qty);
	// 	dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
	// };

	const handleGoToCart = () => {
		router.push('/cart');
		setButtons(false);
	};

	const handleContinueShopping = () => {
		setButtons(false);
	};

	return (
		<Layout title={product.name}>
			<div className="flex pb-4">
				<Link href="/" className="flex items-center text-gray-500 text-sm">
					<SlArrowLeftCircle className="h-5 w-5 mr-2" />
					Back to products
				</Link>
				<Link href="/">
					<span className="text-gray-500 text-sm">
						&nbsp;/ {product.category}
					</span>
				</Link>
			</div>
			<div className="grid md:grid-cols-4 md:gap-3">
				<div className="md:col-span-2 mb-4">
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						layout="responsive"
					></Image>
				</div>
				<div>
					<ul className="mb-4 font-thin w-full ">
						<li>
							<h1 className="text-lg border-b border-black mb-1 inline-block font-medium ">
								{product.brand}
							</h1>
						</li>
						<span className="text-neutral-900 font-light">
							<li>
								<span className="font-normal text-sm">
									{product.name.toUpperCase()} -{' '}
								</span>
								<span className="text-sm">{product.category}</span>
							</li>
							<li className="text-sm">
								{product.rating} of {product.numReviews} reviews
							</li>
							<li className="text-sm">{product.decription}</li>
							<li className="text-sm">
								{product.countInStock > 0
									? `- ${product.countInStock} In stock`
									: 'Out of stock'}{' '}
							</li>
						</span>
					</ul>
				</div>
				<div>
					<div className="mb-4">
						<div className="mb-2 flex justify-between font-normal">
							<div>Price</div>
							<div>$ {product.price}</div>
						</div>
						{/* {!buttons ? (
							<div>
								<div className="mb-2">Select quantity</div>
								<select
									className="w-full mb-4"
									value={product.quantity}
									// onChange={(e) => updateCartHandler(product, e.target.value)}
								>
									{[...Array(product.countInStock).keys()].map((x) => (
										<option key={x + 1} value={x + 1}>
											{x + 1}
										</option>
									))}
								</select>
							</div>
						) : null} */}

						{!buttons ? (
							<button
								className="flex justify-between accent-button w-full "
								onClick={addToCartHandler}
							>
								Add to cart <SlBag className="h-4 w-4 relative top-1" />
							</button>
						) : (
							<div>
								<button
									className="accent-button w-full"
									onClick={handleGoToCart}
								>
									Go to cart
								</button>
								<button
									className="secondary-button w-full mt-4 border-1 bg-white"
									onClick={handleContinueShopping}
								>
									Continue Shopping
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ProducScreen;

export async function getServerSideProps(context) {
	const { params } = context;
	const { slug } = params;

	await db.connect();
	const product = await Product.findOne({ slug }).lean();
	await db.disconnect();
	return {
		props: {
			product: product ? db.convertDocToObj(product) : null,
		},
	};
}
