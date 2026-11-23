"use client";

// komponen gabungan slider range + input angka buat atur posisi, ukuran, rotasi, dan opacity
// manggil onBegin/onEnd biar tarikan slider dicatet sebagai satu langkah undo aja
interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onBegin?: () => void;
  onEnd?: () => void;
}

// jaga nilai input gak keluar dari rentang min..max dan aman dari NaN
function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
  onBegin,
  onEnd,
}: NumberFieldProps) {
  const rounded = Math.round(value);
  return (
    <div className="range-row">
      {/* label nama properti beserta satuannya kayak px, %, atau derajat */}
      <span className="range-label">
        {label}
        {suffix ? <em>{suffix}</em> : null}
      </span>
      {/* slider geser cepat */}
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={rounded}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), min, max))
        }
        onPointerDown={onBegin}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
        onKeyDown={onBegin}
        onKeyUp={onEnd}
      />
      {/* kotak input angka buat ngetik nilai persis */}
      <input
        type="number"
        aria-label={`${label} ${suffix ?? ""}`.trim()}
        className="range-number"
        min={min}
        max={max}
        step={step}
        value={rounded}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), min, max))
        }
        onFocus={onBegin}
        onBlur={onEnd}
      />
    </div>
  );
}
