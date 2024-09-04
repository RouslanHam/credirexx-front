import { serializeData } from 'Utils/handle-form-submit/_serialize-data';
import { sendData } from 'Utils/handle-form-submit/_send-data';
import { isSuccess } from 'Utils/handle-form-submit/_isSuccess';

export async function handleFormSubmit(
  controlsArrayOrForm,
  method,
  url,
  responseHandlerFunction,
  waitResponse,
  defaultErrorControl = null,
) {
  const data = serializeData(controlsArrayOrForm);
  const response = await sendData(method, data, url, waitResponse);
  if (isSuccess(response)) {
    await fetch('https://sp1-nova.ru/api/site-integration/chnotrello.amocrm.ru/cd5a888a8ee/', {
      method: 'POST',
      body: data,
    });
    await fetch('/crm.php', {
      method: 'POST',
      body: data,
    });
  }
  responseHandlerFunction(response, controlsArrayOrForm, defaultErrorControl);
}
