import { categories } from "../data/Categories";
import { useBudget } from "../hooks/useBudget";


export default function FiltreByCategory() {

    const { dispatch } = useBudget()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'add-fliter-category', payload: { id: e.target.value } })
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-10">

            <form>
                <div className=" flex flex-col md:flex-row md:items-center gap-5">
                    <label htmlFor="category">Filtrador de Gastos</label>
                    <select id="category"
                        className="bg-slate-100 p-3 flex-1 rounded"
                        onChange={handleChange}
                    >
                        <option value="">-- Todas las Categorias --</option>
                        {categories.map(category => (
                            <option
                                value={category.id}
                                key={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </form>

        </div>
    )
}
