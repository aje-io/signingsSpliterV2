function rangeSlide(value) {
  document.getElementById("sliderValue").innerHTML = value;
}

("use strict");
const textareaInput = document.getElementById("inputValues");
const outputUniqueValue = document.getElementById("outputValueUnique");
const button = document.getElementById("button");
const sliderValue = document.getElementById("sliderValue");
const slider = document.getElementById("numberOfAllocations");
const outputSection = document.getElementsByClassName("outputSection");
let tBodyEl = document.querySelector("tbody");
let umrObjectArraySorted;
let numberOfUsers = 0;
button.addEventListener("click", () => {
  // need to understand how this time out works
  // setTimeout(stopAnimation, 5000);

  // function stopAnimation() {
  //   loadingAnimation.classList.toggle("hidden");
  // }
  // loadingAnimation.classList.toggle("hidden");
  const textAreaValue = textareaInput.value;
  const originalInputValue = textAreaValue.split("\n");
  //   const inputArrayFiltered = JSON.stringify([...new Set(originalInputValue)]);

  //convetring the
  const umrAndCount = checkForOccurance(originalInputValue);
  const umrObjectArray = [];
  for (const key in umrAndCount) {
    let obj = { umrNumber: key, noOfDuplicates: umrAndCount[key] };
    umrObjectArray.push(obj);
  }

  // dont know why, but the umrObjectArray and the sorted array has the output in a sorted manner
  umrObjectArraySorted = umrObjectArray.sort(function (a, b) {
    if (a.noOfDuplicates < b.noOfDuplicates) return 1;
    if (a.noOfDuplicates > b.noOfDuplicates) return -1;
    return 0;
  });

  numberOfUsers = slider.value;

  allocateToUsers(numberOfUsers, umrObjectArraySorted, originalInputValue);
  console.log("");
});

function checkForOccurance(bulkUMR) {
  let umrAndCount = {};

  for (let i = 0; i < bulkUMR.length; i++) {
    let umr = bulkUMR[i];
    umrAndCount[umr] = umrAndCount[umr] ? umrAndCount[umr] + 1 : 1;
  }
  return umrAndCount;
}

slider.addEventListener("input", () => {
  sliderValue.value = slider.value;
});

function allocateToUsers(noOfUsers, umrArray, originalInput) {
  let allocation = [];
  const ListOfUsers = [];
  let RemainingAllocations = [];
  let obj;
  for (let i = 0; i < noOfUsers; i++) {
    ListOfUsers[i] = prompt(`Enter User ${i + 1} ID: `);
  }
  console.log("Allocation Part");
  console.log("Number of Users: " + noOfUsers);
  RemainingAllocations = umrArray.slice(); //so that we dont change the original Array

  while (RemainingAllocations.length > 0) {
    for (let i = 0; i < noOfUsers; i++) {
      obj = {
        userName: ListOfUsers[i],
        allocaredUmr: RemainingAllocations.shift(),
      };
      allocation.push(obj);
    }
    RemainingAllocations.reverse();
  }

  replaceWithUsername(originalInput, allocation);
}
let originalInputArray = [];
let newUserNameArray = [];
function replaceWithUsername(originalInput, allocation) {
  originalInputArray = originalInput.slice();

  console.log(originalInputArray);
  const filteredAllocation = allocation.filter((e) => {
    return e.allocaredUmr !== undefined;
  });
  console.log(filteredAllocation);

  filteredAllocation.forEach((e) => {
    console.log(`${e.allocaredUmr["umrNumber"]} Is Allocated To ${e.userName}`);

    const allocatedUmr = e.allocaredUmr["umrNumber"];
    const allocatedUserName = e.userName;
    originalInputArray.forEach((item) => {
      if (item == allocatedUmr) {
        let newIndex = originalInputArray.indexOf(item);
        originalInputArray[newIndex] = allocatedUserName;
      }
    });
  });
  for (let i = 0; i < originalInputArray.length; i++) {
    // the logic to push data into the table

    tBodyEl.innerHTML += `
      <tr>
       <td>${originalInput[i]}</td>
        <td>${originalInputArray[i]}</td>
     </tr>
    `;
  }
}
