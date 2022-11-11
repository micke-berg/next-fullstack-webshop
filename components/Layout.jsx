import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu } from '@headlessui/react';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';
import { SlUser, SlBag } from 'react-icons/sl';

const Layout = ({ children, title, background = '' }) => {
	const { status, data: session } = useSession();
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
	}, [cart.cartItems]);

	const logoutClickHandler = () => {
		Cookies.remove('cart');
		dispatch({ type: 'CART_RESET' });
		signOut({ callbackUrl: '/login' });
	};

	return (
		<>
			<Head>
				<title>{title ? `${title} Webshop` : 'Webshop'}</title>
				<meta name="description" content="Fullstack webshop" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ToastContainer position="bottom-center" limit={1} />
			<div
				className={`flex min-h-screen flex-col justify-between ${background}`}
			>
				<header>
					<nav className="flex h-14 px-4 justify-between items-center bg-neutral-900">
						<Link href="/" className="text-lg font-bold text-white">
							Webshop.
						</Link>
						<div className="flex align-middle">
							<Link href="/cart" className="p-2 text-white relative">
								<SlBag className="h-6 w-6 mr-1 absolute right-5 top-0" />
								{cartItemsCount > 0 && (
									<span className="text-center rounded-full bg-white text-black w-5 h-5 text-xs absolute bottom-2 right-3 leading-5">
										{cartItemsCount}
									</span>
								)}
							</Link>

							{status === 'loading' ? (
								'loading'
							) : session?.user ? (
								<Menu as="div" className="relative inline-block z-10 ">
									<Menu.Button className="text-white">
										{session?.user.name}
									</Menu.Button>
									<Menu.Items className="fixed w-full md:absolute md:w-56 md:top-10 right-0 top-14 origin-top-right bg-neutral-900 border-emerald-300 border-t-2 text-white">
										<Menu.Item>
											<DropdownLink className="dropdown-link" href="/profile">
												Profile
											</DropdownLink>
										</Menu.Item>
										<Menu.Item>
											<DropdownLink
												className="dropdown-link"
												href="/order-history"
											>
												Order history
											</DropdownLink>
										</Menu.Item>
										<Menu.Item>
											<Link
												// legacyBehavior
												className="dropdown-link"
												href="#"
												onClick={logoutClickHandler}
											>
												Logout
											</Link>
										</Menu.Item>
									</Menu.Items>
								</Menu>
							) : (
								<Link href="/login">
									<SlUser className="h-6 w-6 text-white" />
								</Link>
							)}
						</div>
					</nav>
				</header>
				<main className="container m-auto mt-4 px-4">{children}</main>
				<footer className="flex justify-center items-center h-12  mt-4 text-white bg-neutral-900 text-md font-thin">
					Copyright &copy; 2022 Webshop.
				</footer>
			</div>
		</>
	);
};

export default Layout;
