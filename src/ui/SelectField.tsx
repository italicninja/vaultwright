import type { OptionDef } from "./options";

export function SelectField({
  field,
  value,
  onChange,
}: {
  field: OptionDef;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{field.label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.text ?? opt.value}
          </option>
        ))}
      </select>
    </label>
  );
}
