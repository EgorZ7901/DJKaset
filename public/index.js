const checkDiv = document.querySelector('.submit');
const emailInput = document.querySelector('#email');
const nameInput = document.querySelector('#firstName');
const dateInput = document.querySelector('#eventDate');
const messageInput = document.querySelector('#eventDetails');
const budgetInput = document.querySelector('#budget');
const errorFill = document.querySelector('.error.fill');
const errorEmail = document.querySelector('.error.email');
const errorFail = document.querySelector('.error.fail');
const successMessage = document.querySelector('.success');
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let currentImage = 0;
const imagesFrame = document.querySelector('.js-image-opener');
const images = document.querySelectorAll('.gallery-grid .diamond');
let removeListeners = null;
let isSent = false;

const scrollToTopBtn = document.querySelector('.js-back-button');

window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollToTopBtn.style.opacity = '1';
  } else {
    scrollToTopBtn.style.opacity = '0';
  }
};

scrollToTopBtn.onclick = function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

checkDiv.addEventListener('click', function() {
  if (isSent) {
    return;
  }
  const emailValue = emailInput.value.trim();
  const nameValue = nameInput.value.trim();
  errorFill.style.display = 'none';
  errorEmail.style.display = 'none';
  errorFail.style.display = 'none';
  successMessage.style.display = 'none';

  if (emailValue === '' || nameValue === '') {
    errorFill.style.display = 'block';
    return;
  }

  if (!emailRegex.test(emailValue)) {
    errorEmail.style.display = 'block';
    return;
  }

  sendData();
});

images.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    imagesFrame.classList.add('visible');
    imagesFrame.querySelector('img').src = elem.querySelector('img').src;
    currentImage = index;
    addArrowKeyListeners();
  })
});

function addArrowKeyListeners() {
  const onArrowLeft = (event) => {
    if (event.key === "ArrowLeft") {
      selectImage(currentImage - 1)
    }
  };

  const onArrowRight = (event) => {
    if (event.key === "ArrowRight") {
      selectImage(currentImage + 1)
    }
  };

  const onEscKey = (event) => {
    if (event.key === "Escape") {
      closeModalFunction();
    }
  };

  document.addEventListener("keydown", onArrowLeft);
  document.addEventListener("keydown", onArrowRight);
  document.addEventListener("keydown", onEscKey);

  return () => {
    document.removeEventListener("keydown", onArrowLeft);
    document.removeEventListener("keydown", onArrowRight);
    document.removeEventListener("keydown", onEscKey);
  };
}

imagesFrame.querySelectorAll('.arrow')
  .forEach(elem => elem.addEventListener('click', () => {
      elem.classList.contains('next') ? selectImage(currentImage + 1) : selectImage(currentImage - 1);
    })
  )

function selectImage(index) {
  const image = imagesFrame.querySelector('img');
  let newIndex = index;
  if (index === -1) {
    newIndex = 7;
  } else if (index === 8) {
    newIndex = 0;
  }
  image.classList.add('reload');
  imagesFrame.querySelector('img').src = images[newIndex].querySelector('img').src;
  image.classList.remove('reload');
  currentImage = newIndex;
}

imagesFrame.querySelector('.closer').addEventListener('click', () => {
  closeModalFunction();
})

function closeModalFunction() {
  currentImage = 0;
  imagesFrame.querySelector('img').src = null;
  imagesFrame.classList.remove('visible');
  removeListeners();
  removeListeners = null;
}

async function sendData() {
  const message = {
    emailValue: emailInput.value.trim(),
    nameValue: nameInput.value.trim(),
    dateValue: dateInput.value.trim(),
    budgetValue: budgetInput.value.trim(),
    messageValue: messageInput.value.trim(),
  }


  try {
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Your message has been sent!');
      isSent = true;
      checkDiv.classList.add('disabled');
      setTimeout(() => {
        checkDiv.classList.remove('disabled');
        isSent = false;
      }, 5000)
      successMessage.style.display = 'block';
    } else {
      errorFail.style.display = 'block'
      console.log('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    errorFail.style.display = 'block'
    console.log('An error occurred while sending your message.');
  }
}
