import React, { useState } from "react";
import "./ImportFile.css";

function Import() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();
  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };
  const csvFileToArray = (string) => {
    const csvHeader = ["employeeID", "projectID", "start", "end"];
    let csvRows = string.slice(string.indexOf("")).split(/\r?\n/);

    const array = csvRows.map((i) => {
      const values = i.split(", ");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];

        return object;
      }, {});

      return obj;
    });
    let arr = [];

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i].projectID === array[j].projectID) {
          let today = new Date();
          let day =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();

          if (array[i].start === "NULL") {
            array[i].start = day;
          } else if (array[i].end === "NULL") {
            array[i].end = day;
          } else if (array[j].start === "NULL") {
            array[j].start = day;
          } else if (array[j].end === "NULL") {
            array[j].end = day;
          }
          let dateStart1 = new Date(array[i].start);
          let dateStart2 = new Date(array[j].start);
          let dateEnd1 = new Date(array[i].end);
          let dateEnd2 = new Date(array[j].end);
          let result;

          if (
            (dateStart1 <= dateStart2 && dateEnd1 >= dateEnd2) ||
            (dateStart1 <= dateEnd2 && dateEnd2 <= dateEnd1) ||
            (dateStart2 < dateStart1 && dateEnd1 < dateEnd2)
          ) {
            if (dateStart1 <= dateStart2 && dateEnd1 >= dateEnd2) {
              result = Math.ceil(
                (dateEnd2 - dateStart2) / (1000 * 60 * 60 * 24)
              );
            } else if (dateStart1 <= dateEnd2 && dateEnd2 <= dateEnd1) {
              result = Math.ceil(
                (dateEnd2 - dateStart1) / (1000 * 60 * 60 * 24)
              );
            } else if (dateStart2 <= dateStart1 && dateEnd2 >= dateEnd1) {
              result = Math.ceil(
                (dateEnd1 - dateStart2) / (1000 * 60 * 60 * 24)
              );
            }
            let obj = {
              emp1ID: array[i].employeeID,
              emp2ID: array[j].employeeID,
              prjID: array[i].projectID,
              days: result,
            };
            arr.push(obj);
          }
        }
      }
    }

    setArray(arr);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };
  const headerKeys = [
    "Employee ID #1",
    "Employee ID #2",
    "Project ID",
    "Days worked",
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h1> Identifier </h1>
      <form>
        <label for="csvFileInput" className="choose-btn">
          {" "}
          Custom upload
        </label>
        <input
          className="choose-btn"
          type={"file"}
          id="csvFileInput"
          accept={(".csv", ".txt", "doc")}
          onChange={handleOnChange}
        />

        <button
          className="import-btn"
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          Import CSV
        </button>
      </form>

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px",
          width: "100vw",
        }}
      >
        <table
          style={{
            width: "500px",
            border: "1px solid navy",
            borderRadius: "5px",
          }}
        >
          <thead>
            <tr key={"header"}>
              {headerKeys.map((key) => (
                <th>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {array.map((item) => (
              <tr key={item.id}>
                {Object.values(item).map((val) => (
                  <td>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Import;
