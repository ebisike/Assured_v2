let formSize = 1;
    let div = document.querySelector('#showForm')

    const addForm = (count) => {
      let row = document.createElement('div')
      row.setAttribute('class', 'row mt-1 justify-content-center')
      row.setAttribute('id', `form${count}`)
      row.innerHTML =
        `
        <div class="form-group col-md-2">
          <input type="text" class="form-control" name="y1${count}_software_effort" id="y1${count}_software_effort" required placeholder="Software Effort (Y)">
        </div>
        <div class="form-group col-md-2">
          <input type="text" class="form-control" name="x1${count}_team_experience" id="x1${count}_team_experience" required placeholder="Team Exp. (x1)">
        </div>
        <div class="form-group col-md-2">
          <input type="text" class="form-control" name="x2${count}_project_size" id="x2${count}_project_size" required placeholder="Project size (x2)">
        </div>
        <div class="form-group col-md-2">
          <input type="text" class="form-control" name="x3${count}_budget" id="x3${count}_budget" required placeholder="Budget (x3)">
        </div>
        <div class="form-group col-md-2">
          <input type="text" class="form-control" name="x4${count}_communication" id="x4${count}_communication" required placeholder="Comm. (x4)">
        </div>
        `;
      div.appendChild(row)
    }

    const deleteForm = (count) => {
      let row = document.querySelector(`#form${count}`)
      if (row != null) {
        row.parentNode.removeChild(row);
        formSize -= 1;
      }
    }


    // add new from
    document.querySelector('#addForm').addEventListener('click', (e) => {
      e.preventDefault();
      formSize += 1;
      addForm(formSize)
    })

    // delete form
    document.querySelector('#removeForm').addEventListener('click', (e) => {
      e.preventDefault();
      if (formSize > 1) {
        deleteForm(formSize)
      }
    })


    //submit forms
    document.querySelector('#rawForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload_array = [];

      for (let count = 1; count <= formSize; count++) {
        const form = new FormData(document.querySelector('#rawForm'));

        const payload = {
          Y_SoftwareDevelopmentEffort: form.get(`y1${count}_software_effort`),
          X1_TeamExperience: form.get(`x1${count}_team_experience`),
          X2_ProjectSize: form.get(`x2${count}_project_size`),
          X3_Budget: form.get(`x3${count}_budget`),
          X4_CommunicationEfficiency: form.get(`x4${count}_communication`)
        }

        payload_array.push(payload);
      }

      const path = 'api/regression/upload/historic-data/manually';
      const method = 'POST';

      const response = await httpRequest(path, method, payload_array);

      if (response?.status) {

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Good job!",
          text: "Upload successful",
          showConfirmButton: false,
          timer: 1500
        });
        return;
      }

      swal("Error!", response?.error_message);

    })

    //file uploader
    document.querySelector('#fileUploadForm').addEventListener('submit', async (e) => {

      e.preventDefault();
      var fileInput = document.getElementById("document");

      const selectedFile = fileInput.files[0];
      const payload = {};
      if (selectedFile) {
        fileToBase64String(selectedFile, (str) => {
          payload['Document'] = str
          console.log(str)
        })

        payload['Mime'] = selectedFile.type
        payload['DocumentName'] = selectedFile.name;
        payload['DocumentExtension'] = getFileExtension(selectedFile.name);
      }

      const path = 'api/regression/upload/historic-data';
      const method = 'POST';

      const response = await httpRequest(path, method, payload);

      if (response?.status) {

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Good job!",
          text: "Upload successful",
          showConfirmButton: false,
          timer: 1500
        });
        return;
      }

      swal("Error!", response?.error_message);

    })

    addForm(formSize)
