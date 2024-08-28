import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators/dist/index.mjs";
import { useLanguage } from "@/utils/languages/UseLanguage";

const { langTranslations, languagePref, customPrintf } = useLanguage();

const maxLengthPostal = {
  en: "Must be at most 32 characters",
  fr: "Doit contenir au plus 32 caractères",
};

export const userFormRules = {
  firstname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  lastname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  address: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "100"),
      maxLength(100)
    ),
  },
  user_postal: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthPostal[languagePref.value],
      maxLength(32)
    ),
  },
  user_province: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "100"),
      maxLength(100)
    ),
  },
  user_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  user_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  phone: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "180"),
      maxLength(180)
    ),
  },
  role_type: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  email: {
    emailFormat: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "254"),
      maxLength(254)
    ),
  },
  password: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    minLength: helpers.withMessage(
      customPrintf(
        langTranslations.value.formErorrText.passwordMinLength,
        "10"
      ),
      minLength(10)
    ),
    regexValidation: helpers.withMessage(
      langTranslations.value.formErorrText.passwordRegex,
      (value: string) => {
        const regex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
        );
        return regex.test(value);
      }
    ),
  },
};

export const clubFormRules =  {
  club_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
    minLenght: helpers.withMessage(
      customPrintf(langTranslations.value.minLengthMessage, "5"),
      minLength(5)
    ),
  },
  club_address: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "100"),
      maxLength(100)
    ),
  },
  club_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  club_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  club_email: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    email: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "254"),
      maxLength(254)
    ),
  },
};