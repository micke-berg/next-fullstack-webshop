import { SlArrowLeftCircle, SlBag } from 'react-icons/sl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import { Store } from '../../utils/Store';

const ProducScreen = () => {
	const { state, dispatch } = useContext(Store);
	const [buttons, setButtons] = useState(false);

	const router = useRouter();
	const { query } = useRouter();
	const { slug } = query;
	const product = data.products.find((x) => x.slug === slug);
	if (!product) {
		return <div>Produt Not Found</div>;
	}
	const addToCartHandler = () => {
		const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		if (product.countInStock < quantity) {
			alert('Sorry. Product is out of stock');
			return;
		}

		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
		setButtons(true);
	};

	const handleGoToCart = () => {
		router.push('/cart');
		setButtons(false);
	};

	const handleContinueShopping = () => {
		router.push('/');
		setButtons(false);
	};

	return (
		<Layout title={product.name}>
			<div className="flex pb-4">
				<Link href="/">
					<a className="flex items-center text-gray-500 text-sm">
						<SlArrowLeftCircle className="h-5 w-5 mr-2" />
						Back to products
					</a>
				</Link>
				<span className="text-gray-500 text-sm">
					&nbsp; / {product.category}
				</span>
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
					<ul className="mb-4 font-thin">
						<li>
							<h1 className="text-lg font-normal">{product.name}</h1>
						</li>
						<li>Category: {product.category}</li>
						<li>{product.brand}</li>
						<li>
							{product.rating} of {product.numReviews} reviews
						</li>
						<li>{product.decription}</li>
					</ul>
				</div>
				<div>
					<div className="mb-4">
						<div className="mb-1 flex justify-between font-thin">
							<div>Price</div>
							<div>$ {product.price}</div>
						</div>
						<div className="flex mb-2 justify-between font-thin">
							<div>Status</div>
							<div>{product.countInStock > 0 ? 'In stock' : 'Unavailible'}</div>
						</div>
						{!buttons ? (
							<button
								className="flex justify-between primary-button w-full "
								onClick={addToCartHandler}
							>
								Add to cart <SlBag className="h-4 w-4 relative top-1" />
							</button>
						) : (
							<div>
								<button
									className="primary-button w-full"
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
