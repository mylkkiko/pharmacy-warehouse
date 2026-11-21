import styles from "./FormCard.module.css";

export const inputClassNames = {
    label: styles.label,
    required: styles.required,
    input: styles.input,
    section: styles.section,
    error: styles.error
};

export const selectClassNames = {
    ...inputClassNames,
    dropdown: styles.dropdown,
    option: styles.option
};

export const numberClassNames = {
    ...inputClassNames,
    controls: styles.controls,
    control: styles.control
};

/** For DateInput / DatePickerInput: the calendar dropdown is styled through popoverProps */
export const datePopoverProps = {
    classNames: { dropdown: styles.dropdown }
};

/** Two columns from 576px up, one column on phones */
export const HALF_WIDTH = { base: 12, xs: 6 };
