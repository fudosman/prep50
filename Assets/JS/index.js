function showErrorToast(message) {
  const errorToast = document.createElement('div');
  errorToast.classList.add('error-toast');
  errorToast.textContent = message;
  document.body.appendChild(errorToast);
  setTimeout(() => {
    errorToast.remove();
  }, 1500);
}



document.getElementById('myForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Extracting form values individually without a loop
  const fullName = document.getElementById('fullName').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const state = document.getElementById('state').value;
  const orderedProduct = document.getElementById('copies').value;

  // Constructing the form data object
  const formDataObject = {
    fullName: fullName,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
    state: state,
    orderedProduct: orderedProduct
  };

  console.log(formDataObject);

  try {
    const response = await fetch('https://prep50-server.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataObject)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);

      // Redirect to index.html
      window.location.href = 'thankyou.html';
    } else {
      console.error('Failed to submit form:', response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
