'use client'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InviteEtendu, StatutConfirmation } from '@/types/invite-extended.types'
import { useTheme } from '@/context/ThemeContext'
import FormField from '../ui/formfield'
import Input from '../ui/input'
import Button from '../ui/button'
import Select from '../ui/select'

// Schéma de validation
const inviteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
  confirme: z.nativeEnum(StatutConfirmation),
  assiste: z.boolean().optional(),
  tableId: z.string().min(1, 'La table est requise'),
})

export type InviteFormData = z.infer<typeof inviteSchema>

interface InviteFormProps {
  onSubmit: (data: InviteFormData) => Promise<void>;
  initialData?: InviteEtendu;
  isSubmitting: boolean;
  submitButtonText: string;
  tables: Array<{ id: string; numero: number; nom: string }>;
}

export default function InviteForm({
  onSubmit,
  initialData,
  isSubmitting,
  submitButtonText,
  tables,
}: InviteFormProps) {
  const { isDarkMode } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      confirme: StatutConfirmation.EN_ATTENTE,
      assiste: false,
      tableId: '',
    }
  });

  const watchTableId = watch('tableId');
  const watchConfirme = watch('confirme');

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (initialData) {
      reset({
        nom: initialData.nom,
        prenom: initialData.prenom,
        email: initialData.email || '',
        telephone: initialData.telephone || '',
        confirme: initialData.confirme,
        assiste: initialData.assiste ?? false,
        tableId: initialData.tableId,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: InviteFormData) => {
    const cleanData: InviteFormData = {
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      email: data.email?.trim() || undefined,
      telephone: data.telephone?.trim() || undefined,
      confirme: data.confirme,
      assiste: data.assiste ?? false,
      tableId: data.tableId,
    };

    console.log('Données envoyées:', cleanData);
    await onSubmit(cleanData);
    
    if (!initialData) {
      reset();
    }
  };

  const statutOptions = [
    { value: StatutConfirmation.EN_ATTENTE, label: 'En attente' },
    { value: StatutConfirmation.OUI, label: 'Confirmé' },
    { value: StatutConfirmation.NON, label: 'Refusé' },
  ];

  const tableOptions = [
    { value: '', label: 'Sélectionnez une table' },
    ...tables.map(table => ({
      value: table.id,
      label: `Table ${table.numero} - ${table.nom}`
    }))
  ];

  return (
    <div className={`p-6 rounded-xl transition-all duration-300 ${
      isDarkMode
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white/70 border-slate-200'
    } border backdrop-blur-sm shadow-lg`}>
     
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom - REQUIS */}
          <FormField
            label="Nom"
            htmlFor="nom"
            error={errors.nom?.message}
            required={true}
          >
            <Input
              id="nom"
              placeholder="Entrez le nom"
              {...register('nom')}
            />
          </FormField>

          {/* Prénom - REQUIS */}
          <FormField
            label="Prénom"
            htmlFor="prenom"
            error={errors.prenom?.message}
            required={true}
          >
            <Input
              id="prenom"
              placeholder="Entrez le prénom"
              {...register('prenom')}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email - OPTIONNEL */}
          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
            required={false}
            helpText="Email de contact (optionnel)"
          >
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              {...register('email')}
            />
          </FormField>

          {/* Téléphone - OPTIONNEL */}
          <FormField
            label="Téléphone"
            htmlFor="telephone"
            error={errors.telephone?.message}
            required={false}
            helpText="Numéro de téléphone (optionnel)"
          >
            <Input
              id="telephone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              {...register('telephone')}
            />
          </FormField>
        </div>

        {/* Table - REQUIS */}
        <FormField
          label="Table assignée"
          htmlFor="tableId"
          error={errors.tableId?.message}
          required={true}
        >
          <Controller
            name="tableId"
            control={control}
            render={({ field }) => (
              <Select
                key={`tableId-${initialData?.id || 'new'}-${field.value}`}
                id="tableId"
                options={tableOptions}
                value={field.value || ''}
                onValueChange={(value) => {
                  console.log('Table sélectionnée:', value);
                  field.onChange(value);
                }}
                placeholder="Sélectionnez une table"
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statut de confirmation */}
          <FormField
            label="Statut de confirmation"
            htmlFor="confirme"
            error={errors.confirme?.message}
            required={true}
          >
            <Controller
              name="confirme"
              control={control}
              render={({ field }) => (
                <Select
                  key={`confirme-${initialData?.id || 'new'}-${field.value}`}
                  id="confirme"
                  options={statutOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value as StatutConfirmation);
                  }}
                />
              )}
            />
          </FormField>

          {/* Présence effective */}
          <FormField
            label="Présence"
            htmlFor="assiste"
            error={errors.assiste?.message}
            required={false}
            helpText="L'invité était-il présent ?"
          >
            <div className="flex items-center space-x-2 h-10">
              <input
                id="assiste"
                type="checkbox"
                {...register('assiste')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="assiste" className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                A assisté à l{"'"}événement
              </label>
            </div>
          </FormField>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>

      {/* Debug info - à retirer en production */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`mt-4 p-4 rounded text-sm ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p><strong>Debug:</strong></p>
          <p>Initial tableId: {initialData?.tableId || 'null'}</p>
          <p>Current form tableId: {watchTableId || 'empty'}</p>
          <p>Current statut: {watchConfirme}</p>
        </div>
      )}
    </div>
  )
}