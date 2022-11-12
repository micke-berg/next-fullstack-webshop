import { getSession } from 'next-auth/react';
import Order from '../../../../../models/Order';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
	const session = await getSession({ req });
	if (!session || (session && !session.user.isAdmin)) {
		return res.status(402).send('Error: Signin required');
	}
	await db.connect();
	const order = await Order.findById(req.query.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
		const deliverOrder = await order.save();
		await db.disconnect();
		res.send({ message: 'Order delivered successfully', order: deliverOrder });
	} else {
		db.disconnect();
		res.status(404).send({ message: 'Error: order not found' });
	}
};

export default handler;
