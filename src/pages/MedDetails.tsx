import { useParams, Link, useNavigate } from "react-router-dom";
import { useMedStore } from "../store/medStore";
import ExpiryBadge from "../components/ExpiryBadge";
import QuantityStepper from "../components/QuantityStepper";

export default function MedDetails() {
  const { medId } = useParams();
  const nav = useNavigate();
  const { meds, consumeOne, restock, removeMed } = useMedStore((s) => ({
    meds: s.meds,
    consumeOne: s.consumeOne,
    restock: s.restock,
    removeMed: s.removeMed,
  }));
  const med = meds.find((m) => m.id === (medId || ""));

  if (!med) {
    return (
      <div className="p-6">
        <div className="text-zinc-600">Nie znaleziono leku.</div>
        <Link to="/" className="btn mt-3">Wróć</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{med.name}</h2>
            <ExpiryBadge expDate={med.expDate} />
          </div>
          <Link to="/" className="btn">← Lista</Link>
        </div>

        {med.form && <p className="mt-2 text-sm text-zinc-600">{med.form}</p>}

        <div className="mt-4 flex items-center justify-between">
          <QuantityStepper
            value={med.quantity}
            unit={med.unit}
            onDec={() => consumeOne(med.id)}
            onInc={() => restock(med.id, 1)}
          />
          <div className="text-sm text-zinc-500">{med.location || "—"}</div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-zinc-500">Kategoria:</span> {med.category || "—"}</div>
          <div><span className="text-zinc-500">Próg min:</span> {med.minQty} {med.unit}</div>
          {med.note && (
            <div className="sm:col-span-2">
              <span className="text-zinc-500">Notatka:</span> {med.note}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button onClick={() => restock(med.id, 10)} className="btn">+10</button>
          <button onClick={() => restock(med.id, 1)} className="btn">+1</button>
          <button
            onClick={() => {
              if (confirm("Usunąć lek?")) {
                removeMed(med.id);
                nav("/");
              }
            }}
            className="px-3 py-2 rounded-xl bg-rose-600 text-white"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
