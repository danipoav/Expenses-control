import { formatCurrency } from "../helpers"

type AmountDisplayType = {
    label?: string
    amount: number
}

export default function AmountDisplay({ label, amount }: AmountDisplayType) {
    return (
        <p className=" text-2xl text-blue-600 font-bold">

            {label && `${label}: `}
            <span className="font-black text-black">{formatCurrency(amount)}</span>
        </p>
    )
}
