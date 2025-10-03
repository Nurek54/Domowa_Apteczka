import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMedStore } from "../store/medStore";
import { uid } from "../utils/id";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Podaj nazwę leku"),
  form: z.string().optional(),
  quantity: z.coerce.number().min(0),
  unit: z.string().min(1),
  minQty: z.coerce.number().min(0),
  expDate: z.string().min(1),
  category: z.string().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
});
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export default function AddMed() {
  const addMed = useMedStore((s) => s.addMed);
  const nav = useNavigate();

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormInput, unknown, FormOutput>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        form: "",
        quantity: 1,
        unit: "szt",
        minQty: 1,
        expDate: new Date().toISOString().slice(0, 10),
        category: "",
        location: "",
        note: "",
      },
    });

  const onSubmit: SubmitHandler<FormOutput> = (data) => {
    const now = new Date().toISOString();
    addMed({
      id: uid("med"),
      name: data.name.trim(),
      form: data.form?.trim() || "",
      quantity: data.quantity,
      unit: data.unit.trim(),
      minQty: data.minQty,
      expDate: new Date(data.expDate).toISOString(),
      category: data.category?.trim() || "",
      location: data.location?.trim() || "",
      note: data.note?.trim() || "",
      photoUrl: "",
      createdAt: now,
      updatedAt: now,
    });
    nav("/");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Dodaj lek</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Nazwa</label>
          <input {...register("name")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Opis/dawka (opcjonalnie)</label>
            <input {...register("form")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
          <div>
            <label className="block text-sm mb-1">Data ważności</label>
            <input type="date" {...register("expDate")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Ilość</label>
            <input type="number" {...register("quantity")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
          <div>
            <label className="block text-sm mb-1">Jednostka</label>
            <input {...register("unit")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
          <div>
            <label className="block text-sm mb-1">Próg min.</label>
            <input type="number" {...register("minQty")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Kategoria</label>
            <input {...register("category")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
          <div>
            <label className="block text-sm mb-1">Lokalizacja</label>
            <input {...register("location")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notatka</label>
          <textarea {...register("note")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" type="submit">Zapisz</button>
          <button type="button" onClick={() => history.back()} className="btn">Anuluj</button>
        </div>
      </form>
    </div>
  );
}
