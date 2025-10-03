import ExpiryBadge from "./ExpiryBadge";
import QuantityStepper from "./QuantityStepper";
import { useMedStore } from "../store/medStore";
import type { Med } from "../types";

type Props = {
    med: Med;
    onOpen?: (id: string) => void;
};

export default function MedCard({ med, onOpen }: Props) {
    const consumeOne = useMedStore((s) => s.consumeOne);
    const restock = useMedStore((s) => s.restock);
    const low = (med.quantity ?? 0) < (med.minQty ?? 0);

    return (
        <div className={`card ${low ? "ring-amber-300 bg-amber-50/60" : ""}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{med.name}</h3>
                    {med.form && <p className="text-sm text-zinc-500">{med.form}</p>}
                    <div className="mt-1">
                        <ExpiryBadge expDate={med.expDate} />
                    </div>
                </div>

                {onOpen && (
                    <button onClick={() => onOpen(med.id)} className="btn">
                        Szczegóły
                    </button>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <QuantityStepper
                    value={med.quantity}
                    unit={med.unit}
                    onDec={() => consumeOne(med.id)}
                    onInc={() => restock(med.id, 1)}
                />
                <div className="text-xs text-zinc-500">
                    {med.location || "—"} · do: {new Date(med.expDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
