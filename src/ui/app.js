function uploadFile() {
    console.log("Hola")
    const fileInput = document.getElementById("jsonFile");
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("jsonFile", selectedFile);

      fetch("http://127.0.0.1:5000/", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
        } else {
          alert(data.error);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
    } else {
      alert("Please select a JSON file to upload.");
    }
  }