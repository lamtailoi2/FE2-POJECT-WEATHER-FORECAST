const searchInput = document.getElementById("city");
const submitBtn = document.getElementById("submit");

const handleSubmit = (e) => {
  e.preventDefault();
  const location = searchInput.value;
  fetchData(location);
};

const fetchData = async (location) => {
  try {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=e8710f95fd96060539ab0bcb1aa8ca60&lang=vi`;
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! ${response.status}`);
    }

    const data = await response.json();
    searchInput.value = "";
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

submitBtn.addEventListener("click", handleSubmit);
