// Code Reference : https://formik.org/docs/tutorial

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import axios from 'axios';
import './styles.css';
import './styles-custom.css';

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <>
      <label className="checkbox">
        <input {...field} {...props} type="checkbox" />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

// Styled components ....
const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: '❌ ';
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

const MySelect = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
      <StyledSelect {...field} {...props} />
      {meta.touched && meta.error ? (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      ) : null}
    </>
  );
};

// And now we can use these
const DataForm = () => {
  const [result, setResult] = useState('');

  return (
    <>
      <h1>Credit Card Approval Prediction</h1>
      <Formik
        initialValues={{
          children: '',
          income: '',
          birth_days: '',
          employed_days: '',
          family_size: '',
          income_type: '',
          education: '',
          family: '',
          house: '',
          car: false,
          reality: false,
          mobile: false,
          workphone: false,
          phone: false,
          email: false,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log('values: ', values);
          for (const key in values) {
            if (typeof values[key] == 'boolean') {
              values[key] = values[key] ? 1 : 0;
            } else if (
              typeof values[key] === 'string' ||
              values[key] instanceof String
            ) {
              values[key] = parseInt(values[key]);
            } else if (
              typeof values[key] == 'number' &&
              Number.isNaN(values[key])
            ) {
              values[key] = 0;
            }
          }

          async function modelPredict() {
            let payload = values;

            let res = await axios.post(
              'http://18.204.218.240/predict',
              payload
            );

            let data = res.data;
            console.log(data);

            if (data.statusCode === 200) {
              const credit = data['data'].result
                ? 'Credit Card Not Approved'
                : 'Credit Card Approved';
              setResult(credit);
            }
          }

          modelPredict();
          setSubmitting(false);
        }}
      >
        <Form>
          <MyTextInput
            label="No of kids"
            name="children"
            type="number"
            placeholder="2"
          />
          <MyTextInput
            label="Income"
            name="income"
            type="number"
            placeholder="100000"
          />
          <MyTextInput
            label="Age in Days"
            name="birth_days"
            type="number"
            placeholder="20000"
          />
          <MyTextInput
            label="Employment in Days"
            name="employed_days"
            type="number"
            placeholder="1000"
          />
          <MyTextInput
            label="Family Size"
            name="family_size"
            type="number"
            placeholder="3"
          />
          <MySelect label="Income Type" name="income_type">
            <option value="0">Commercial associate</option>
            <option value="1">Pensioner</option>
            <option value="2">State servant</option>
            <option value="3">Student</option>
            <option value="4">Working</option>
          </MySelect>
          <MySelect label="Education Type" name="education">
            <option value="0">Academic degree</option>
            <option value="1">Higher education</option>
            <option value="2">Incomplete higher</option>
            <option value="3">Lower secondary</option>
            <option value="4">Secondary / secondary special</option>
          </MySelect>
          <MySelect label="Family Status" name="family">
            <option value="0">Civil marriage</option>
            <option value="1">Married</option>
            <option value="2">Separated</option>
            <option value="3">Single / not married</option>
            <option value="4">Widow</option>
          </MySelect>
          <MySelect label="House Type" name="house">
            <option value="0">Co-op apartment</option>
            <option value="1">House / apartment</option>
            <option value="2">Municipal apartment</option>
            <option value="3">Rented apartment</option>
            <option value="4">With parents</option>
          </MySelect>
          <br />
          <br />
          <MyCheckbox name="car">Is there a car ?</MyCheckbox> <br />
          <MyCheckbox name="reality">Is there a property ?</MyCheckbox> <br />
          <MyCheckbox name="mobile">Is there a mobile phone ?</MyCheckbox>{' '}
          <br />
          <MyCheckbox name="workphone">Is there a work phone ?</MyCheckbox>{' '}
          <br />
          <MyCheckbox name="phone">Is there a phone?</MyCheckbox> <br />
          <MyCheckbox name="email">Is there an email ?</MyCheckbox> <br />
          <br />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
      {result && <h2>{result}</h2>}
    </>
  );
};

export default DataForm;
