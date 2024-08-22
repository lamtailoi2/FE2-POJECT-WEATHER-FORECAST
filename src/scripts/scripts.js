const searchInput = document.getElementById("city");

const handleSearch = (e) => {
  console.log(e.target.value);
};

searchInput.addEventListener("input", handleSearch);
