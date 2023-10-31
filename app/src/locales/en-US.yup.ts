/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { LocaleObject } from 'yup';

export const locale: LocaleObject = {
  mixed: {
    default: 'There was an error with the provided input.',
    required: 'This field is required.',
    oneOf: ({ values }: { values: any }) => `Please enter one of the following values: ${values}`,
    notOneOf: ({ values }: { values: any }) => `Please enter a value that is not one of the following: ${values}`,
    notType: 'Please enter a valid format.',
    defined: 'This field is not defined.',
  },
  string: {
    length: ({ length }: { length: number }) => `Please enter exactly ${length} characters.`,
    min: ({ min }: { min: number }) => `Please enter at least ${min} characters.`,
    max: ({ max }: { max: number }) => `Please enter no more than ${max} characters.`,
    matches: 'Please enter a valid format.',
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid URL.',
    uuid: 'Please enter a valid UUID.',
    trim: 'Please enter without any leading or trailing whitespace.',
    lowercase: 'Please enter in lowercase.',
    uppercase: 'Please enter in uppercase.',
  },
  number: {
    min: ({ min }: { min: number }) => `Please enter a number greater than or equal to ${min}.`,
    max: ({ max }: { max: number }) => `Please enter a number less than or equal to ${max}.`,
    lessThan: ({ less }: { less: number }) => `Please enter a number less than ${less}.`,
    moreThan: ({ more }: { more: number }) => `Please enter a number greater than ${more}.`,
    positive: 'Please enter a positive number.',
    negative: 'Please enter a negative number.',
    integer: 'Please enter an integer.',
  },
  date: {
    min: ({ min }: { min: Date | string }) => `Please enter a date after ${min}.`,
    max: ({ max }: { max: Date | string }) => `Please enter a date before ${max}.`,
  },
  array: {
    length: ({ length }: { length: number }) => `Please enter exactly ${length} items.`,
    min: ({ min }: { min: number }) => `Please enter at least ${min} items.`,
    max: ({ max }: { max: number }) => `Please enter no more than ${max} items.`,
  },
  boolean: {
    isValue: 'There was an error with the provided input.',
  },
  object: {
    noUnknown: 'Please enter data with valid keys.',
  },
} as const;
