// components/forms/TableForm.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/context/ThemeContext'
import { Table } from '@/types/table.types'

// Schéma de validation
const tableSchema = z.object({
  numero: z.number().int().positive('Le numéro doit être positif'),
  nom: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
})

export type TableFormData = z.infer<typeof tableSchema>

interface TableFormProps {
  onSubmit: (data: TableFormData) => void
  initialData?: Partial<Table>
  isSubmitting?: boolean
  submitButtonText?: string
}

export default function TableForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = 'Enregistrer',
}: TableFormProps) {
  const { isDarkMode } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      numero: initialData?.numero || undefined,
      nom: initialData?.nom || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Numéro de table */}
        <div>
          <label
            htmlFor="numero"
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Numéro de table <span className="text-red-500">*</span>
          </label>
          <input
            id="numero"
            type="number"
            min="1"
            {...register('numero', { valueAsNumber: true })}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="Ex: 1"
          />
          {errors.numero && (
            <p className="mt-1 text-sm text-red-500">{errors.numero.message}</p>
          )}
        </div>

        {/* Nom de table */}
        <div>
          <label
            htmlFor="nom"
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Nom de la table <span className="text-red-500">*</span>
          </label>
          <input
            id="nom"
            type="text"
            {...register('nom')}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="Ex: Table des mariés"
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
          )}
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Enregistrement...' : submitButtonText}
        </button>
      </div>
    </form>
  )
}