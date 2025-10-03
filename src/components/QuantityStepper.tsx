export default function QuantityStepper({
  value, onDec, onInc, unit = "szt",
}: { value: number; onDec: () => void; onInc: () => void; unit?: string }) {
  return (
    <div className="inline-flex items-center rounded-lg ring-1 ring-zinc-300/60 overflow-hidden">
      <button onClick={onDec} className="px-2 py-1 hover:bg-zinc-100 active:scale-95">-1</button>
      <div className="px-3 py-1 text-sm min-w-16 text-center">{value} {unit}</div>
      <button onClick={onInc} className="px-2 py-1 hover:bg-zinc-100 active:scale-95">+1</button>
    </div>
  );
}
