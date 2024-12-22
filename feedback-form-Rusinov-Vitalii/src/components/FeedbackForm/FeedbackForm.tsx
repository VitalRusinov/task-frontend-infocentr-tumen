import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import styles from "./FeedbackForm.module.scss";

// Максимальный размер файла в байтах
const MAX_FILE_SIZE = 2_000_000;

// Список категорий
const optionsList = ['Feedback', 'Bug Report', 'Feature Request'];

// Интерфейс формы
interface FeedbackFormValues {
  firstName?: string;
  lastName?: string;
  email: string;
  category: string;
  message: string;
  file?: File;
}

// Схема валидации
const validationSchema = Yup.object({
  firstName: Yup.string().test(
    "first-or-last-name",
    "First name is required if last name is not provided",
    function (value) {
      const { lastName } = this.parent;
      return value || lastName;
    }
  ),
  lastName: Yup.string().test(
    "last-or-first-name",
    "Last name is required if first name is not provided",
    function (value) {
      const { firstName } = this.parent;
      return value || firstName;
    }
  ),
  email: Yup.string().email("Invalid email").required("Email is required"),
  category: Yup.string().test(
    "not-empty",
    "Category is required",
    (value) => value !== "default"
  ),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
  file: Yup.mixed<File>()
    .test(
      "fileSize",
      "File size must be less than 2MB",
      (value) => !value || value.size <= MAX_FILE_SIZE
    )
    .notRequired(),
});

// Начальные значения
const initialValues: FeedbackFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  category: "default",
  message: "",
  file: undefined,
};

// Компонент формы
const FeedbackForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  // Функция при загрузке изображения
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File | undefined) => void
  ) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : undefined;
    setFieldValue("file", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Функция для сабмита
  const handleSubmit = (values: FeedbackFormValues) => {
    // Данные для отправки запроса в формате FormData
    // const formData = new FormData();
    // formData.append("firstName", values.firstName || "");
    // formData.append("lastName", values.lastName || "");
    // formData.append("email", values.email);
    // formData.append("category", values.category);
    // formData.append("message", values.message);
    // if (values.file) {
    //   formData.append("file", values.file);
    // }

    // Данные для логирования в формате JSON
    const formattedValues = {
      ...values,
      file: values.file
        ? {
            name: values.file.name,
            size: values.file.size,
            type: values.file.type,
          }
        : undefined,
    };

    console.log(formattedValues);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className={styles.feedbackForm}>
          <div className={styles.field}>
            <label htmlFor="firstName">First Name</label>
            <Field name="firstName" type="text" />
            <ErrorMessage name="firstName" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName">Last Name</label>
            <Field name="lastName" type="text" />
            <ErrorMessage name="lastName" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <Field as="select" name="category">
              <option value="default">Select category</option>
              {optionsList.map((option, index) => {
                return (
                  <option key={index} value={option}>{option}</option>
                )
              })}
            </Field>
            <ErrorMessage name="category" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Message</label>
            <Field as="textarea" name="message" />
            <ErrorMessage name="message" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="file">File</label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(event) => handleFileChange(event, setFieldValue)}
            />
            <ErrorMessage name="file" component="p" className={styles.error} />
          </div>

          {preview && (
            <div className={styles.preview}>
              <p>Image Preview:</p>
              <img src={preview} alt="Preview" className={styles.previewImage} />
            </div>
          )}
          <button type="submit" className={styles.submitButton}>Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default FeedbackForm;
