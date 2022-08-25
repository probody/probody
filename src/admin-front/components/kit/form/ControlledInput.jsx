import React, {useEffect, useRef, useState} from 'react';

const ControlledInput = (props) => {
    const {value, onChange, onFocus, ...rest} = props;
    const [cursor, setCursor] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const input = ref.current;

        if (input && input.type !== 'number') input.setSelectionRange(cursor, cursor);

        if (input.getAttribute('data-type') === 'phone' && input.selectionStart < 2) {
            setCursor(2);
        }
    }, [ref, cursor, value]);

    const handleChange = async (e) => {
        if (ref.current.getAttribute('data-type') === 'phone') {
            if (e.target.value.replace(/\D/g, '').length > 11) return;

            if (!e.target.value.startsWith('+7')) {
                e.target.value = '+7'
            }

            const selectionStart = e.target.selectionStart,
                value = e.target.value,
                finalValue = await onChange(e)

            setCursor(selectionStart + finalValue.length - value.length);
        } else {
            onChange && onChange(e);
            setCursor(e.target.selectionStart);
        }
    };

    const handleFocus = (e) => {
        if (onFocus) {
            onFocus(e);
        }

        setCursor(e.target.value.length);
    }

    return <input ref={ref} onFocus={handleFocus} value={value} onChange={handleChange} {...rest} />;
};

export default ControlledInput;
