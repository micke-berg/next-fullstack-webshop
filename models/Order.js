import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		orderItems: [
			{
				name: { type: String, required: true },
				quantity: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
			},
		],
		shippingAddress: {
			fullName: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: Number, required: true },
			postalCode: { type: Number, required: true },
			country: { type: Number, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		itemsPrice: { type: Number, required: true },
		shippingPrice: { type: Number, required: true },
		taxPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
		isPaid: { type: Boolean, required: true },
		isDelivered: { type: Boolean, required: true },
		paidAt: { type: Date },
		deliveredAt: { type: Date },
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.models.User || mongoose.model('Order', orderSchema);
export default Order;