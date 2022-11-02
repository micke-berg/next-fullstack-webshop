import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';

const Layout = ({ children, title }) => {
	const { status, data: session } = useSession();
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		setCartItemsCount(
			cart.cartItems.reduce((prev, current) => prev + current.quantity, 0)
		);
	}, [cart.cartItems]);

	const logutClickHandler = () => {
		Cookies.remove('cart');
		dispatch({ type: 'CART_RESET' });
		signOut({ callbackUrl: '/login' });
		console.log('hej');
	};

	return (
		<>
			<Head>
				<title>{title ? `${title} Webshop` : 'Webshop'}</title>
				<meta name="description" content="Fullstack webshop" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ToastContainer possition limit={1} />
			<div className="flex min-h-screen flex-col justify-between">
				<header>
					<nav className="flex h-12 px-4 justify-between items-center shadow-md">
						<Link href="/">
							<a className="text-lg font-bold">Webshop.</a>
						</Link>
						<div>
							<Link href="/cart">
								<a className="p-2">
									Cart
									{cartItemsCount > 0 && (
										<span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
											{cartItemsCount}
										</span>
									)}
								</a>
							</Link>

							{status === 'loading' ? (
								'loading'
							) : session?.user ? (
								<Menu as="div" className="relative inline-block">
									<Menu.Button className="text-blue-600">
										{session.user.name}
									</Menu.Button>
									<Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
										<Menu.Item>
											<DropdownLink className="dropdown-link" href="/profile">
												Profile
											</DropdownLink>
										</Menu.Item>
										<Menu.Item>
											<DropdownLink className="dropdown-link" href="/profile">
												Order history
											</DropdownLink>
										</Menu.Item>
										<Menu.Item>
											<a
												href="#"
												className="dropdown-link"
												onClick={logutClickHandler}
											>
												Logout
											</a>
										</Menu.Item>
									</Menu.Items>
								</Menu>
							) : (
								<Link href="/login">
									<a className="p-2">Login</a>
								</Link>
							)}
						</div>
					</nav>
				</header>
				<main className="container m-auto mt-4 px-4">{children}</main>
				<footer className="flex justify-center items-center h-10 shadow-inner">
					Copyright &copy; 2022 Webshop
				</footer>
			</div>
		</>
	);
};

export default Layout;
