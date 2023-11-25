const predictionModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'));

    const toggleDisplay = (element = null, show = true) => {
      show ? element.classList.remove("hide") : element.classList.add("hide");
    };

    const loadingButton = (domElement) => {
      // const div = document.querySelector("#loading");
      const button = document.createElement("button");
      button.classList.add("btn", "btn-dark", "disabled");
      button.setAttribute("id", "loading-btn");

      const spanTag = document.createElement("span");
      spanTag.classList.add("spinner-border", "spinner-border-sm");
      spanTag.setAttribute("role", "status");
      spanTag.setAttribute("aria-hidden", "true");

      button.appendChild(spanTag);
      button.appendChild(document.createTextNode(" loading..."));
      domElement.textContent = "";
      domElement.appendChild(button);
    };

    const generateModelButton = () => {
      const div = document.querySelector("#loading");
      const button = document.createElement("button");
      button.classList.add("btn", "btn-outline-dark");
      button.setAttribute("id", "generate-model");

      button.appendChild(document.createTextNode("Generate model"));
      div.textContent = "";
      div.appendChild(button);
    };

    const showModel = (x0 = 234.5, x1 = 23, x2 = 34.53, x3 = 2657.34, x4 = 0.5) => {
      // <p class="text-center fs-2">\[\begin{equation} y=\beta_{0}+\beta_{1}x_{1}+\beta_{2}x_{2}+\beta_{3}x_{3}+\epsilon.  \end{equation}\]</p>
      const div = document.querySelector('#model-display');
      let modelTag = document.createElement('p');
      const x1_sign = `${x1.toString().charAt(0) === '-' ? '-' : '+'}`;
      const x1_value = `${x1.toString().charAt(0) === '-' ? x1.toString().substring(1) : x1}`

      const x2_sign = `${x2.toString().charAt(0) === '-' ? '-' : '+'}`;
      const x2_value = `${x2.toString().charAt(0) === '-' ? x2.toString().substring(1) : x2}`

      const x3_sign = `${x3.toString().charAt(0) === '-' ? '-' : '+'}`;
      const x3_value = `${x3.toString().charAt(0) === '-' ? x3.toString().substring(1) : x3}`

      const x4_sign = `${x4.toString().charAt(0) === '-' ? '-' : '+'}`;
      const x4_value = `${x4.toString().charAt(0) === '-' ? x4.toString().substring(1) : x4}`

      const modelText = `y  = ${x0} ${x1_sign} ${x1_value}𝑥<sub class="fs-6">1</sub> ${x2_sign} ${x2_value}𝑥<sub class="fs-6">2</sub> ${x3_sign} ${x3_value}𝑥<sub class="fs-6">3</sub> ${x4_sign} ${x4_value}𝑥<sub class="fs-6">4</sub>`;
      modelTag.classList.add('text-center', 'fs-2')
      modelTag.innerHTML = modelText

      document.querySelector('#model-example').append(modelText)
      div.textContent = '';
      div.appendChild(modelTag)
    }


    const generateSubmitPredictionButton = () => {
      const div = document.querySelector("#spanPredictionButton");
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary");
      button.setAttribute("id", "btn-run-prediction");

      button.appendChild(document.createTextNode("Run Prediction"));
      div.textContent = "";
      div.appendChild(button);
    }

    document.addEventListener("click", async (e) => {
      //e.preventDefault();
      if (e.target.closest("#generate-model")) {
        toggleDisplay(document.querySelector("#run-prediction"), false);
        console.log("hello");
        loadingButton(document.querySelector("#loading"));
        // setTimeout(() => {
        //   generateModelButton();
        //   toggleDisplay(document.querySelector("#run-prediction"), true);
        //   showModel()
        // }, 3000);
        const path = "api/regression/model/prompt";
        const method = "GET";
        const response = await httpRequest(path, method, {})

        console.log(response)
        if (response?.status) {
          setTimeout(() => {
            generateModelButton();
            toggleDisplay(document.querySelector("#run-prediction"), true);
            const { y_intercept, x1_team_experience_coefficient, x2_project_size_coefficient, x3_budget_coefficient, x4_communication_efficiency_coeffiient } = response?.result[0]
            showModel(y_intercept, x1_team_experience_coefficient, x2_project_size_coefficient, x3_budget_coefficient, x4_communication_efficiency_coeffiient)
          }, 1000);
        }
      }else{
        generateModelButton();
      }
    });

    const clearModalForm = () => {
      document.querySelector('#x1_team_experience').value = '';
      document.querySelector('#x2_project_size').value = '';
      document.querySelector('#x3_budget').value = '';
      document.querySelector('#x4_communication').value = '';
    }

    document.addEventListener("click", async (e) => {
      //e.preventDefault();

      if (e.target.closest('#btn-run-prediction')) {
        const payload = {
          x1: document.querySelector("#x1_team_experience").value,
          x2: document.querySelector("#x2_project_size").value,
          x3: document.querySelector("#x3_budget").value,
          x4: document.querySelector("#x4_communication").value,
        };

        !payload.x1 || payload.x1 === ""
          ? toggleDisplay(document.querySelector("#x1_error_text"), true)
          : toggleDisplay(document.querySelector("#x1_error_text"), false);
        !payload.x2 || payload.x2 === ""
          ? toggleDisplay(document.querySelector("#x2_error_text"), true)
          : toggleDisplay(document.querySelector("#x2_error_text"), false);
        !payload.x3 || payload.x3 === ""
          ? toggleDisplay(document.querySelector("#x3_error_text"), true)
          : toggleDisplay(document.querySelector("#x3_error_text"), false);
        !payload.x4 || payload.x4 === ""
          ? toggleDisplay(document.querySelector("#x4_error_text"), true)
          : toggleDisplay(document.querySelector("#x4_error_text"), false);

        if (payload.x1 === "" || payload.x2 === "" || payload.x3 === "" || payload.x4 === "") return;

        //call api

        loadingButton(document.querySelector('#spanPredictionButton'))
        console.log(payload);
        const path = 'api/regression/prediction/prompt'
        const method = 'POST';

        const response = await httpRequest(path, method, payload)

        if (response?.status) {
          setTimeout(() => {
            generateSubmitPredictionButton();

            clearModalForm()
            predictionModal.hide();
            const {y_software_effort, y_intercept, x1_team_experience_coefficient, x2_project_size_coefficient, x3_budget_coefficient, x4_communication_efficiency_coeffiient } = response?.result[0]

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Good job!",
              text: "Upload successful",
              showConfirmButton: false,
              timer: 1500
            });
            console.log("software effort is: ", y_software_effort);
            return;
          }, 1000);
        }
        //show modal
      }

    });
  

    
    document.querySelector("#getScatterPlot").addEventListener("click", async (e) => {
      e.preventDefault();
      
      const path = "api/regression/scatter-plot?page_number=1&page_size=20";
      const method = "GET";
      const response = await httpRequest(path, method, {});
      
      if (response?.status) {
        
        const data_points = response?.result;
        console.log(data_points);
        
        // Generate values
        const x1Values = [];
        const x2Values = [];
        const x3Values = [];
        const x4Values = [];
        const y1Values = [];
        const y2Values = [];
        const y3Values = [];
        const y4Values = [];
        
        for (let x = 0; x <= data_points.length - 1; x += 1) {
          x1Values.push(data_points[x]?.x1_team_experience);
          x2Values.push(data_points[x]?.x2_project_size);
          x3Values.push(data_points[x]?.x3_budget);
          x4Values.push(data_points[x]?.x4_communication_efficiency);
          y1Values.push(eval(data_points[x]?.y_software_development_effort));
          y2Values.push(eval(data_points[x]?.y_software_development_effort));
          y3Values.push(eval(data_points[x]?.y_software_development_effort));
          y4Values.push(eval(data_points[x]?.y_software_development_effort))
        }

        // Define Data
        const data = [
          { x: x1Values, y: y1Values, mode: "markers" },
          { x: x2Values, y: y2Values, mode: "markers" },
          { x: x3Values, y: y3Values, mode: "markers" },
          { x: x4Values, y: y4Values, mode: "markers" }
        ];

        //Define Layout
        const layout = ''

        // Display using Plotly
        console.log(data);
        Plotly.newPlot("myPlot", data, layout);

      } else {
        Swal.fire({
          position: "top-center",
          icon: "failure",
          title: "Error!",
          text: "Unable to fetch data",
          showConfirmButton: false,
          timer: 1500
        });
        console.log("software effort is: ", y_software_effort);
        return;
      }
    })
