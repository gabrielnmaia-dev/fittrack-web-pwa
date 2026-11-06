import { useState, type FormEvent } from 'react'
import { createMeal, updateMeal } from '../../api/endpoints'
import type { Meal, MealInput } from '../../api/types'
import { apiErrorMessage, formatNumber } from '../../lib/format'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'

interface MealFormModalProps {
  open: boolean
  onClose: () => void
  dietPlanId: number
  meal?: Meal | null
  onSaved: (meal: Meal) => void
}

const emptyForm = {
  name: '',
  description: '',
  calories: 400,
}

const mealNamePresets = [
  'Café da manhã',
  'Lanche da manhã',
  'Almoço',
  'Lanche da tarde',
  'Jantar',
  'Ceia',
]

const mealCaloriePresets = [200, 350, 500, 650, 800]

export default function MealFormModal(props: MealFormModalProps) {
  if (!props.open) return null
  return <MealFormModalInner key={props.meal?.id ?? 'new'} {...props} />
}

function MealFormModalInner({
  open,
  onClose,
  dietPlanId,
  meal,
  onSaved,
}: MealFormModalProps) {
  const { toast } = useToast()
  const [form, setForm] = useState(() =>
    meal
      ? { name: meal.name, description: meal.description, calories: meal.calories }
      : emptyForm,
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const payload: MealInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      calories: form.calories,
      diet_plan: dietPlanId,
    }

    try {
      const saved = meal ? await updateMeal(meal.id, payload) : await createMeal(payload)
      toast(meal ? 'Refeição atualizada.' : 'Refeição adicionada.', 'success')
      onSaved(saved)
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar a refeição.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meal ? 'Editar refeição' : 'Nova refeição'}
      subtitle={`Adicione uma refeição ao plano. ${formatNumber(form.calories)} kcal`}
      closeOnBackdrop={!saving}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" form="meal-form" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner spinner-sm" /> Salvando...
              </>
            ) : (
              <>
                <Icon name="check" size={16} /> {meal ? 'Salvar' : 'Adicionar'}
              </>
            )}
          </button>
        </>
      }
    >
      <form id="meal-form" className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome da refeição</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Ex.: Café da manhã"
            required
            autoFocus
          />
        </label>

        <div className="preset-chips" role="group" aria-label="Sugestões de refeição">
          {mealNamePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`chip ${form.name === preset ? 'active' : ''}`}
              onClick={() => setForm({ ...form, name: preset })}
            >
              {preset}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Calorias (kcal)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={20000}
            value={form.calories}
            onChange={(event) => setForm({ ...form, calories: Number(event.target.value) })}
            required
          />
        </label>

        <div className="preset-chips" role="group" aria-label="Sugestões de calorias">
          {mealCaloriePresets.map((calories) => (
            <button
              key={calories}
              type="button"
              className={`chip ${form.calories === calories ? 'active' : ''}`}
              onClick={() => setForm({ ...form, calories })}
            >
              {formatNumber(calories)} kcal
            </button>
          ))}
        </div>

        <label className="field">
          <span>Descrição / alimentos</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Ex.: 2 ovos, aveia com frutas e café sem açúcar."
            rows={3}
            required
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
