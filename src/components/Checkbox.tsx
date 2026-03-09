import { Checkbox, FormControlLabel } from "@mui/material";

export function LabeledCheckbox(props: {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <FormControlLabel
      control={<Checkbox checked={props.value} onChange={(_, c) => props.onChange(c)} />}
      label={props.label}
    />
  );
}
