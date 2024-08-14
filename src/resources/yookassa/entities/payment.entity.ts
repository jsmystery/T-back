class PaymentAmountInput {
	value: string
	currency: string
}

class PaymentMethodInput {
	type: string
	id: number
	saved: boolean
	title: string

	card: object
}

class PaymentMetadata {
	userId: number
}

class PaymentObject {
	id: string
	status: string
	amount: PaymentAmountInput
	description: string
	metadata: PaymentMetadata
	payment_method: PaymentMethodInput
	created_at: string
	expires_at: string
}

export class PaymentStatusInput {
	event:
		| 'payment.succeeded'
		| 'payment.waiting_for_capture'
		| 'payment.canceled'
		| 'refund.succeeded'

	type: string
	object: PaymentObject
}
