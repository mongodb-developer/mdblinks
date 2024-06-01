import TextInput from "@leafygreen-ui/text-input";
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';

export default function MultiBox(props) {
  let { possibleValues, value, onChange, description, label } = props;
  if (!possibleValues) possibleValues = [];
  if (possibleValues.length === 1) {
    onChange(possibleValues[0].value);
  }
  return (
    <>
      {possibleValues.length === 0 &&
        <TextInput
          label={label}
          description={description}
          onChange={e => onChange(e.target.value)}
          value={value}
        />
      }
      {possibleValues.length === 1 &&
        <TextInput
          label={label}
          description={description}
          disabled={true}
          value={possibleValues[0].value}
        />
      }
      {possibleValues.length > 1 &&
        <Combobox
          label={label}
          description={description}
          onChange={value => onChange(value)}
          value={value}
        >
          {possibleValues.map(s => <ComboboxOption key={s.value} {...s} />)}
        </Combobox>
      }
    </>
  )
}