import { NEW_APPLICATION_PAGE } from 'Constants/constants';
import { getControls } from 'Utils/get-controls';
import { numbersOnly } from 'Utils/masks/numbers-only-mask';
import { addPhoneMask } from 'Utils/masks/phone-mask';
import { resetError } from 'Utils/errors/reset-error';
import { handleFormSubmit } from 'Utils/handle-form-submit/handle-form-submit';
import 'UIKit/form-file-upload/form-file-upload';
import { valueMaxLengthMask } from 'Utils/masks/value-max-length-mask';
import { dateMask } from 'Utils/masks/date-mask';
import { step1Validation } from './_step-1-validation';
import 'UIKit/form-range/form-range';
import { toggleSteps } from './_toggle-steps';
import { step3Validation } from './_step-3-validation';
import { newApplicationResponseHandler } from './_new-application-response-handler';
import { setStep2Section } from './set-step-2-section';

const form = document.getElementById(NEW_APPLICATION_PAGE.formId);
const controls = getControls(form);
const formSubmitButton = document.getElementById(
  NEW_APPLICATION_PAGE.buttons.submit,
);
const numbersOnlyControlsIDs = [
  NEW_APPLICATION_PAGE.controlsIds.inn,
  NEW_APPLICATION_PAGE.controlsIds.passportSeries,
  NEW_APPLICATION_PAGE.controlsIds.passportNumber,
];
const maxValueLengthControls = [
  { id: NEW_APPLICATION_PAGE.controlsIds.inn, max: 12 },
  { id: NEW_APPLICATION_PAGE.controlsIds.passportSeries, max: 4 },
  { id: NEW_APPLICATION_PAGE.controlsIds.passportNumber, max: 6 },
  { id: NEW_APPLICATION_PAGE.controlsIds.fio, max: 200 },
  { id: NEW_APPLICATION_PAGE.controlsIds.passportFio, max: 200 },
  { id: NEW_APPLICATION_PAGE.controlsIds.email, max: 50 },
  { id: NEW_APPLICATION_PAGE.controlsIds.passportIssued, max: 300 },
  { id: NEW_APPLICATION_PAGE.controlsIds.passportFio, max: 200 },
];

controls.forEach((control) => {
  control.addEventListener('input', () => {
    resetError(control);

    if (numbersOnlyControlsIDs.includes(control.id)) {
      numbersOnly(control);
    }

    maxValueLengthControls.forEach((maxLengthControl) => {
      if (maxLengthControl.id === control.id) {
        valueMaxLengthMask(control, maxLengthControl.max);
      }
    });

    if (control.dataset.type === 'date') {
      dateMask(control);
    }
  });

  if (control.id === NEW_APPLICATION_PAGE.controlsIds.phoneNumber) {
    addPhoneMask([control]);
  }

  if (control.id === NEW_APPLICATION_PAGE.controlsIds.userType) {
    control.addEventListener('change', () => {
      setStep2Section(control);
    });
  }
});

document
  .getElementById(NEW_APPLICATION_PAGE.buttons.goToStep2)
  .addEventListener('click', async () => {
    const isStep1Valid = step1Validation(
      getControls(document.getElementById(NEW_APPLICATION_PAGE.sections.step1)),
    );
    if (isStep1Valid) {
      await fetch('https://sp1-nova.ru/api/site-integration/chnotrello.amocrm.ru/cd5a888a8ee/', {
        method: 'POST',
        body: new FormData(document.getElementById('new-application-form')),
      });
      await fetch('/crm.php', {
        method: 'POST',
        body: new FormData(document.getElementById('new-application-form')),
      });
      toggleSteps(1, 2);
    }
  });

[
  document.getElementById(NEW_APPLICATION_PAGE.buttons.returnToStep1),
  document.getElementById(NEW_APPLICATION_PAGE.buttons.returnToStep2),
].forEach((returnBtn) => {
  returnBtn.addEventListener('click', () => {
    let from = 3;
    let to = 2;

    if (returnBtn.id === NEW_APPLICATION_PAGE.buttons.returnToStep1) {
      from = 2;
      to = 1;
    }

    toggleSteps(from, to);
  });
});

[
  document.getElementById(NEW_APPLICATION_PAGE.buttons.skipToStep3),
  document.getElementById(NEW_APPLICATION_PAGE.buttons.goToStep3),
].forEach((btn) => {
  btn.addEventListener('click', () => {
    toggleSteps(2, 3);
  });
});

formSubmitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const isStep1Valid = step1Validation(
    getControls(document.getElementById(NEW_APPLICATION_PAGE.sections.step1)),
  );
  const isStep3Valid = step3Validation([
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passport),
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passportSeries),
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passportNumber),
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passportDate),
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passportIssued),
    document.getElementById(NEW_APPLICATION_PAGE.controlsIds.passportFio),
  ]);

  if (isStep1Valid && isStep3Valid) {
    handleFormSubmit(
      form,
      form.method,
      form.action,
      newApplicationResponseHandler,
      true,
      document.getElementById(NEW_APPLICATION_PAGE.controlsIds.collateralType),
    );
  }
});
