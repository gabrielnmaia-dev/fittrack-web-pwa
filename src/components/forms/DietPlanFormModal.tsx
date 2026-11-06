import { useState, type FormEvent } from 'react'
import { createDietPlan, updateDietPlan } from '../../api/endpoints'
import type { DietPlan, DietPlanInput } from '../../api/types'
import { apiErrorMessage, formatNumber } from '../../lib/format'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'

interface DietPlanFormModalProps {
  open: boolean
  onClose: () => void
  plan?: DietPlan | null
  onSaved: (plan: DietPlan) => void
}

const emptyForm: DietPlanInput = {
  name: '',
  description: '',
  calories: 2000,
}

const caloriePresets = [1500, 1800, 2000, 2200, 2500, 3000]

export default function DietPlanFormModal(props: DietPlanFormModalProps) {
  if (!props.open) return null
  return <DietPlanFormModalInner key={props.plan?.id ?? 'new'} {...props} />
}

function DietPlanFormModalInner({
  open,
  onClose,
  plan,
  onSaved,
}: DietPlanFormModalProps) {
  const { toast } = useToast()
  const [form, setForm] = useState<DietPlanInput>(() =>
    plan
      ? { name: plan.name, description: plan.description, calories: plan.calories }
      : emptyForm,
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const saved = plan ? await updateDietPlan(plan.id, form) : await createDietPlan(form)
      toast(plan ? 'Dieta atualizada.' : 'Dieta criada com sucesso.', 'success')
      onSaved(saved)
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar a dieta.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={plan ? 'Editar dieta' : 'Nova dieta'}
      subtitle={
        plan
          ? 'Ajuste o nome, a descrição ou a meta diária.'
          : 'Crie um plano para organizar suas refeições.'
      }
      closeOnBackdrop={!saving}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" form="diet-form" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner spinner-sm" /> Salvando...
              </>
            ) : (
              <>
                <Icon name="check" size={16} /> {plan ? 'Salvar' : 'Criar dieta'}
              </>
            )}
          </button>
        </>
      }
    >
      <form id="diet-form" className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome da dieta</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Ex.: Plano low carb"
            required
            autoFocus
          />
        </label>

        <label className="field">
          <span>Descrição</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Objetivo, restrições, observações..."
            rows={3}
            required
          />
        </label>

        <label className="field">
          <span>Meta diária de calorias (kcal)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={20000}
            value={form.calories}
            onChange={(event) =>
              setForm({ ...form, calories: Number(event.target.value) })
            }
            required
          />
        </label>

        <div className="preset-chips">
          {caloriePresets.map((calories) => (
            <button
              key={calories}
              type="button"
              className={`chip ${form.calories === calories ? 'active' : ''}`}
              onClick={() => setForm({ ...form, calories })}
            >
              {formatNumber(calories)}
            </button>
          ))}
        </div>

        {error && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
