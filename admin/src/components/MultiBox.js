import TextInput from "@leafygreen-ui/text-input";
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';

export default function MultiBox(props) {
  let { possibleValues, value, onChange, description, label } = props;
  if (!possibleValues) possibleValues = [];
  return (
    <>
      {possibleValues.length === 0 &&
        <TextInput
          label={label}
          description={description}
          onChange={e => onChange(e)}
          value={value}
        />
      }
      {possibleValues.length === 1 &&
        <TextInput
          label={label}
          description={description}
          onChange={e => onChange(e)}
          disabled={true}
          value={value}
        />
      }
      {possibleValues.length > 1 &&
        <Combobox
          label={label}
          description={description}
          onChange={value => onChange(value)}
          value={value}
        >
          {possibleValues.map(s => <ComboboxOption {...s} />)}
        </Combobox>
      }
    </>
  )
}