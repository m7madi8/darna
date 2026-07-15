"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useCreateReservation } from "@/features/reservations/use-reservations";

const schema = z.object({
  guest_name: z.string().min(2, "Name is required"),
  guest_phone: z.string().min(6, "Phone is required"),
  party_size: z.number().min(1).max(20),
  starts_at: z.string().min(1, "Start time is required"),
  duration_minutes: z.number().min(120).max(120),
  notes: z.string().optional(),
  table_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateReservationForm({
  onCreated,
  defaultTableId,
}: {
  onCreated?: () => void;
  defaultTableId?: string;
}) {
  const create = useCreateReservation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      party_size: 2,
      duration_minutes: 120,
      table_id: defaultTableId,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await create.mutateAsync({
          ...values,
          starts_at: new Date(values.starts_at).toISOString(),
        });
        reset();
        onCreated?.();
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Guest name"
          error={errors.guest_name?.message}
          {...register("guest_name")}
        />
        <Input
          label="Phone"
          error={errors.guest_phone?.message}
          {...register("guest_phone")}
        />
        <Input
          label="Party size"
          type="number"
          min={1}
          error={errors.party_size?.message}
          {...register("party_size", { valueAsNumber: true })}
        />
        <Input
          label="Starts at"
          type="datetime-local"
          error={errors.starts_at?.message}
          {...register("starts_at")}
        />
        <Input
          label="Duration (2 hours)"
          type="number"
          min={120}
          max={120}
          readOnly
          error={errors.duration_minutes?.message}
          {...register("duration_minutes", { valueAsNumber: true })}
        />
        <Input label="Table ID (optional)" {...register("table_id")} />
      </div>
      <Textarea label="Notes" {...register("notes")} />
      {create.isError ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          Could not create reservation. Verify branch context and availability.
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" loading={create.isPending}>
          Create reservation
        </Button>
      </div>
    </form>
  );
}
