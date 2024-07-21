
import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/Categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import ErrorMesage from "./ErrorMesage";
import { useBudget } from "../hooks/useBudget";


export default function ExpenseForm() {



    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if (state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)
            [0]

            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //validar
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios')
            return
        }

        //Validar que no me pase del limite del presupuesto

        if ((expense.amount - previousAmount) > remainingBudget) {
            setError('El gasto es mayor que tu presupuesto')
            return
        }

        //Agregar o actualizar el gasto
        if (state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
        } else {
            dispatch({ type: 'add-expense', payload: { expense } })
        }

        //reiniciar state
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmount(0)
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className=" uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
            </legend>

            {error && <ErrorMesage>{error}</ErrorMesage>}

            <div className=" flex flex-col gap-2 ">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre Gasto:
                </label>
                <input type="text"
                    name="expenseName"
                    id="expenseName"
                    placeholder="Añade el nombre del gasto"
                    className="bg-slate-100 p-2"
                    value={expense.expenseName}
                    onChange={handleChange} />
            </div>

            <div className=" flex flex-col gap-2 ">
                <label htmlFor="amount" className="text-xl">
                    Cantidad:
                </label>
                <input type="number"
                    name="amount"
                    id="amount"
                    placeholder="Añade la cantidad del gasto"
                    className="bg-slate-100 p-2"
                    value={expense.amount}
                    onChange={handleChange} />
            </div>

            <div className=" flex flex-col gap-2 ">
                <label htmlFor="category" className="text-xl">
                    Categoria:
                </label>
                <select
                    name="category"
                    id="category"
                    className="bg-slate-100 p-2"
                    onChange={handleChange}
                    value={expense.category}>
                    <option value="">-- Seleccione --</option>
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className=" flex flex-col gap-2 ">
                <label htmlFor="amount" className="text-xl">
                    Fecha Gasto:
                </label>
                <DatePicker
                    className='bg-slate-100 p-2 border-0'
                    value={expense.date}
                    onChange={handleChangeDate}
                />

            </div>

            <input type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase
             font-bold rounded-lg"
                value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'} />


        </form>
    )
}
