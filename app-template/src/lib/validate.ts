export type FieldSpec = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  options?: string[];
};

export function validate(
  values: Record<string, unknown>,
  spec: FieldSpec[],
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of spec) {
    const value = values[field.name];
    const isEmpty = value === undefined || value === null || value === "";

    if (field.required && isEmpty) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }
    if (isEmpty) continue;

    if (field.type === "number" && Number.isNaN(Number(value))) {
      errors[field.name] = `${field.label} must be a number`;
      continue;
    }

    if (field.type === "select" && field.options && !field.options.includes(String(value))) {
      errors[field.name] = `${field.label} must be one of the available options`;
    }
  }

  return errors;
}
