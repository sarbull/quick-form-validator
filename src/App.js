import { Alert, TextInput, Button, Group, LoadingOverlay } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { useState } from 'react';

const NOT_EMPTY = 'Not empty';
const AT_LEAST_3_CHARS = 'At least 3 chars';
const USE_ONLY_CHARS = 'Use only chars';
const SELECT_A_COUNTRY_FROM_THE_LIST = 'Select a country from the list';
const YOUR_KNOWLEDGE_ON_COUNTRIES_IS_TOO_BIG = 'Your knowledge on countries is too big or provided country is not on our list';
const SET_TAX_IDENTIFIER = 'Set tax identifier';
const WRONG_TAX_IDENTIFIER_FORMNAT = 'Wrong tax identifier format';
const COUNTRIES = ['Spain', 'Italy', 'Greece', 'France', 'Germany', 'USA', 'Canada'];

const emptyForm = {
  username: { value: '', isValid: false, isPristine: true, error: NOT_EMPTY },
  country: { value: '', isValid: false, isPristine: true, error: SELECT_A_COUNTRY_FROM_THE_LIST },
  taxIdentifier: { value: null, isValid: false, isPristine: true, error: SET_TAX_IDENTIFIER }
};

const taxIdentifierCountryMap = {
  USA: {
    string: '____-___-_____',
    isValid: (string) => /^\d{4}-.{3}-\d{5,7}$/.test(string),
    replace: (string) => string.replace(/(\d{4})(.{3})(\d{5,7})/, '$1-$2-$3'),
    push: (c, data) => {
      if(data.length >= 0 && data.length <= 4) {
        const isNumber = /^[0-9]$/.test(c);

        if(isNumber) {
          data.push(c);
        }
      }

      if(data.length === 4) {
        data.push('-');

        return data;
      }

      if(data.length >= 4 && data.length <= 8) {
        const isLetter = /^[a-zA-Z]$/.test(c);

        if(isLetter) {
          data.push(c);
        }
      }

      if(data.length === 8) {
        data.push('-');

        return data;
      }

      if(data.length >= 8 && data.length <= 15) {
        const isNumber = /^[0-9]$/.test(c);

        if(isNumber) {
          data.push(c);
        }
      }

      return data;
    }
  },
  Canada: {
    string: '__________-__',
    isValid: (string) => /^(\d|A|B|D){10}-(.{2})$/.test(string),
    replace: (string) => string.replace(/((\d|A|B|D){10})(.{2})/, '$1-$2'),
    push: (c, data) => {
      if(data.length >= 0 && data.length <= 10) {
        const isNumber = /^[0-9]$/.test(c);

        if(isNumber) {
          data.push(c);
        }
      }

      if(data.length === 10) {
        data.push('-');

        return data;
      }

      if(data.length >= 10 && data.length <= 12) {
        const isLetter = /^[a-zA-Z]$/.test(c);

        if(isLetter) {
          data.push(c);
        }
      }

      return data;
    }
  },
  any: {
    string: '',
    replace: (string) => string,
    isValid: () => true,
    push: (c, data) => { data.push(c); return data; }
  }
};

export const filterCountries = (countries, value) => countries.filter(c => {
  if(value.length > 0) {
    const country = c.toLowerCase();
    const inputCountry = value.toLocaleLowerCase();

    return country.search(inputCountry) >= 0;
  } else {
    return true;
  }
});

export const countryValidator = (country) => {
  let error = !COUNTRIES.includes(country) ? SELECT_A_COUNTRY_FROM_THE_LIST : '';

  if(filterCountries(COUNTRIES, country).length === 0) {
    error = YOUR_KNOWLEDGE_ON_COUNTRIES_IS_TOO_BIG;
  }

  return {
    isValid: COUNTRIES.includes(country),
    error: error
  };
};

export const usernameValidator = (username) => {
  let validation = {};

  if(username.length === 0) {
    validation = {
      isValid: false,
      error: NOT_EMPTY
    };
  }

  if(username.length > 0) {
    validation = {
      isValid: false,
      error: AT_LEAST_3_CHARS
    };
  }

  if(username.length >= 3) {
    validation = {
      isValid: true,
      error: ''
    };
  }

  if (/[^a-zA-Z]/.test(username)) {
    validation = {
      isValid: false,
      error: USE_ONLY_CHARS
    }
  }

  return validation;
};

export const taxIdentifierValidator = (key, data, country) => {
  if(!['USA', 'Canada'].includes(country)) {
    country = 'any';
  }

  let value = data;

  if(key) {
    value = taxIdentifierCountryMap[country].push(key, data);
  }

  const isValid = taxIdentifierCountryMap[country].isValid(value.join(''));

  return {
    value: value,
    isValid: isValid,
    error: !isValid ? WRONG_TAX_IDENTIFIER_FORMNAT : ''
  };
};

const validateField = (field, value) => {
  let fieldData = {};

  switch(field) {
    case 'username':
      const usernameValidation = usernameValidator(value);

      fieldData = {
        value: value,
        isPristine: false,
        isValid: usernameValidation.isValid,
        error: usernameValidation.error
      };
      break;
    case 'country':
      const countryValidation = countryValidator(value);

      fieldData = {
        value: value,
        isPristine: false,
        isValid: countryValidation.isValid,
        error: countryValidation.error
      }
      break;
    case 'taxIdentifier':
      const taxIdentifierValidation = taxIdentifierValidator(value.key, value.value, value.country);

      fieldData = {
        value: taxIdentifierValidation.value,
        isPristine: false,
        isValid: taxIdentifierValidation.isValid,
        error: taxIdentifierValidation.error
      }
      break;
    default:
      console.log('FIELD_NOT_IMPLEMENTED');
      break;
  }

  return {
    [field]: {
      ...fieldData
    }
  }
};

export const gatherData = (form) => {
  const keys = Object.keys(form);

  let data = {};

  keys.map(k => {
    if(Array.isArray(form[k].value)) {
      let value = form[k].value.join('');
      data[k] = value;
    } else {
      data[k] = form[k].value;
    }
  });

  return data;
};

function App() {
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => setForm({...emptyForm});

  const submit = () => {
    setIsLoading(true);

    setTimeout(() => {
      console.log('data => ', gatherData(form));

      setForm(emptyForm);
      setIsLoading(false);
    }, 500);
  };

  const filteredCountries = filterCountries(COUNTRIES, form.country.value);

  return (
    <div style={{ maxWidth: 320, margin: '100px auto' }}>
      <LoadingOverlay visible={isLoading} />

      <TextInput mt="xl"
                 label="Username"
                 placeholder="Username"
                 value={form.username.value}
                 error={!form.username.isValid && !form.username.isPristine ? form.username.error : ''}
                 onChange={(e) => {
                   const field = validateField('username', e.target.value);

                   setForm({...form, ...field})
                 }} />

      <>
        <TextInput mt="xl"
                  label="Country"
                  placeholder="Country"
                  value={form.country.value}
                  error={!form.country.isValid && !form.country.isPristine ? form.country.error : ''}
                  onChange={(e) => {
                    const field = validateField('country', e.target.value);

                    setForm({
                      ...form,
                      ...field
                    })
                  }} />

          <ul>{ (form.country.value.length >= 0 && !form.country.isPristine && !form.country.isValid)
          && filteredCountries.map((c, index) => {
            return <li key={index} onClick={() => {
              setForm({
                ...form,
                country: { ...form.country, value: c, error: '', isValid: true},
                taxIdentifier: { ...form.taxIdentifier, value: [] }
              })
            }}>{ c }</li>;
          }) }
          </ul>
      </>

      <TextInput mt="xl"
                 label="Tax identifier"
                 placeholder="Tax identifier"
                 value={form.taxIdentifier.value ? form.taxIdentifier.value.join('') : ''}
                 error={!form.taxIdentifier.isValid && !form.taxIdentifier.isPristine ? form.taxIdentifier.error : ''}
                 onChange={(e) => {
                   if(e.nativeEvent.inputType === 'deleteContentBackward') {
                     const taxIdentifierValidation = taxIdentifierValidator(null, e.target.value.split(''), form.country.value);

                     setForm({
                       ...form,
                       taxIdentifier: {
                         ...form.taxIdentifier,
                         value: e.target.value.split(''),
                         isValid: taxIdentifierValidation.isValid,
                         error: taxIdentifierValidation.error
                        }
                     })
                   }
                 }}
                 onKeyPress={(e) => {
                  const field = validateField('taxIdentifier', {
                    key: e.key,
                    value: form.taxIdentifier.value || [],
                    country: form.country.value
                  });

                  setForm({...form, ...field});
                 }} />

      { Object.keys(form).map(k => !form[k].isValid && !form[k].isPristine).filter(f => f === true).length > 0 && <>
        <Alert mt="xl" icon={<IconAlertCircle size={16} />} title="Bummer!" color="red">
          Please check the form!
        </Alert>
      </> }

      <Group position="center" mt="xl">
        <Button onClick={() => submit() }>Submit</Button>
        <Button onClick={() => resetForm() }>Reset</Button>
      </Group>
    </div>
  );
}

export default App;
