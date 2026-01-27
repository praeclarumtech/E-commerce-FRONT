import ReactSelect, { SingleValue, StylesConfig } from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  name?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
}

const customStyles: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '44px',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#465fff' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(70, 95, 255, 0.1)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#465fff' : '#9ca3af',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '0.875rem',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1f2937',
    fontSize: '0.875rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#465fff'
      : state.isFocused
        ? '#f3f4f6'
        : 'white',
    color: state.isSelected ? 'white' : '#1f2937',
    fontSize: '0.875rem',
    padding: '10px 12px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#465fff',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#465fff' : '#9ca3af',
    '&:hover': {
      color: '#465fff',
    },
  }),
};

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value = "",
  name,
  isDisabled = false,
  isSearchable = true,
}) => {
  const selectedOption = options.find((option) => option.value === value) || null;

  const handleChange = (selected: SingleValue<Option>) => {
    onChange(selected?.value || "");
  };

  return (
    <ReactSelect<Option, false>
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      styles={customStyles}
      className={className}
      name={name}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      isClearable={false}
    />
  );
};

export default Select;
