import { useState, type FormEvent } from 'react'
import { createExercise, updateExercise } from '../../api/endpoints'
import type { Exercise, ExerciseInput } from '../../api/types'
import { MUSCLE_GROUPS, apiErrorMessage } from '../../lib/format'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'

interface ExerciseFormModalProps {
  open: boolean
  onClose: () => void
  exercise?: Exercise | null
  onSaved: (exercise: Exercise) => void
}

const emptyForm: ExerciseInput = {
  name: '',
  description: '',
  sets: 3,
  reps: 12,
  muscle_group: 'Peito',
}

const prescriptionPresets = [
  { sets: 3, reps: 10 },
  { sets: 3, reps: 12 },
  { sets: 4, reps: 10 },
  { sets: 4, reps: 12 },
  { sets: 4, reps: 15 },
]

export default function ExerciseFormModal(props: ExerciseFormModalProps) {
  if (!props.open) return null
  return <ExerciseFormModalInner key={props.exercise?.id ?? 'new'} {...props} />
}

function ExerciseFormModalInner({
  open,
  onClose,
  exercise,
  onSaved,
}: ExerciseFormModalProps) {
  const { toast } = useToast()
  const [form, setForm] = useState<ExerciseInput>(() =>
    exercise
      ? {
          name: exercise.name,
          description: exercise.description,
          sets: exercise.sets,
          reps: exercise.reps,
          muscle_group: exercise.muscle_group,
        }
      : emptyForm,
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update<K extends keyof ExerciseInput>(field: K, value: ExerciseInput[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const saved = exercise
        ? await updateExercise(exercise.id, form)
        : await createExercise(form)
      toast(exercise ? 'Exercício atualizado.' : 'Exercício criado.', 'success')
      onSaved(saved)
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar o exercício.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={exercise ? 'Editar exercício' : 'Novo exercício'}
      subtitle={
        exercise
          ? 'Atualize as informações do seu exercício.'
          : 'Adicione um exercício ao seu catálogo pessoal.'
      }
      closeOnBackdrop={!saving}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button
            type="submit"
            form="exercise-form"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner spinner-sm" /> Salvando...
              </>
            ) : (
              <>
                <Icon name="check" size={16} /> {exercise ? 'Salvar' : 'Criar exercício'}
              </>
            )}
          </button>
        </>
      }
    >
      <form id="exercise-form" className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome do exercício</span>
          <input
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Ex.: Supino reto"
            required
            autoFocus
          />
        </label>

        <label className="field">
          <span>Grupo muscular</span>
          <select
            value={form.muscle_group}
            onChange={(event) => update('muscle_group', event.target.value)}
            required
          >
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <div className="field-row field-row-2">
          <label className="field">
            <span>Séries</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={form.sets}
              onChange={(event) => update('sets', Number(event.target.value))}
              required
            />
          </label>
          <label className="field">
            <span>Repetições</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={999}
              value={form.reps}
              onChange={(event) => update('reps', Number(event.target.value))}
              required
            />
          </label>
        </div>

        <div className="preset-chips" role="group" aria-label="Sugestões de séries e repetições">
          {prescriptionPresets.map((preset) => {
            const active = form.sets === preset.sets && form.reps === preset.reps
            return (
              <button
                key={`${preset.sets}x${preset.reps}`}
                type="button"
                className={`chip ${active ? 'active' : ''}`}
                onClick={() => {
                  update('sets', preset.sets)
                  update('reps', preset.reps)
                }}
              >
                {preset.sets}×{preset.reps}
              </button>
            )
          })}
        </div>

        <label className="field">
          <span>Descrição / observações</span>
          <textarea
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Ex.: Manter escápulas retraídas e descer controlado."
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
