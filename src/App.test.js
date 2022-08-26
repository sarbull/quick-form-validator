import { filterCountries, countryValidator, usernameValidator, taxIdentifierValidator } from './App';

test('filterCountries', () => {
  expect(filterCountries(['Country', 'Altceva'], 'Country')).toStrictEqual(["Country"]);

  expect(filterCountries(['Country', 'Altceva'], 'Spain')).toStrictEqual([]);
});

test('countryValidator', () => {
  expect(countryValidator('Spain')).toStrictEqual({"isValid": true, "error": ""});
  expect(countryValidator('USA')).toStrictEqual({"isValid": true, "error": ""});

  expect(countryValidator('Romania')).toStrictEqual({"isValid": false, "error": "Your knowledge on countries is too big or provided country is not on our list"});
});

test('usernameValidator', () => {
  expect(usernameValidator('aaa')).toStrictEqual({isValid: true, error: ""});
  expect(usernameValidator('aa')).toStrictEqual({isValid: false, error: "At least 3 chars"});
  expect(usernameValidator('a1')).toStrictEqual({isValid: false, error: "Use only chars"});
  expect(usernameValidator('aa1')).toStrictEqual({isValid: false, error: "Use only chars"});
});

test('taxIdentifierValidator', () => {
  expect(taxIdentifierValidator('c', [], 'USA')).toStrictEqual({value: [], isValid: false, error: "Wrong tax identifier format"});

  expect(taxIdentifierValidator('2', ['1', '1', '1', '1', '-', 'a', 'a', 'a', '-', '2', '2', '2', '2', '2'], 'USA')).toStrictEqual({
    value: ['1', '1', '1', '1', '-', 'a', 'a', 'a', '-', '2', '2', '2', '2', '2', '2'],
    isValid: true,
    error: ""
  });
});