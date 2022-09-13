document.getElementById("getData").onclick = function (element) {
  // query the current tab to find its id
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tab) {
      let url = tab[0].url;
      const data = await chrome.scripting.executeScript({
        target: { tabId: tab[0].id },
        function: scrapeData,
      });
      data[0].result.Profile_link = url;
      downloadJson(data[0].result);
      console.log(data);
    }
  );
};

function downloadJson(data) {
  var jsonData = JSON.stringify(data, null, 4); //indentation in json format, human readable

  var vLink = document.createElement("a"),
    vBlob = new Blob([jsonData], { type: "octet/stream" }),
    vName = `${data.Name}-linkedin-profile.json`,
    vUrl = window.URL.createObjectURL(vBlob);
  vLink.setAttribute("href", vUrl);
  vLink.setAttribute("download", vName);
  vLink.click();
}

function scrapeData() {
  let data = {
    Name: "",
    about: {},
    Profile_Pic: "",
    Designation: "",
    Profile_link: "",
    Contact_Info: "",
  };

  //  Name
  let Name = {
    firstName: "",
    lastName: "",
  };
  let personInfo = document
    .getElementsByClassName("pv-text-details__left-panel")[0]
    .innerText.split(/\r?\n/);
  Name.firstName = personInfo[0].split(" ")[0];
  Name.lastName = personInfo[0].split(" ")[1];
  data.Name = `${Name.firstName} ${Name.lastName}`;

  //       Profile_Pic

  let imgsrc = document.getElementsByClassName(
    "pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"
  )[0].src;
  data.Profile_Pic = imgsrc;

  //  Contact_Info

  let Contact_Info = document.getElementById(
    "top-card-text-details-contact-info"
  ).href;
  data.Contact_Info = Contact_Info;
  console.log(data.Contact_Info);

  //       About

  let personAbout = document
    .getElementsByClassName("display-flex ph5 pv3")[0]
    .innerText.split(/\r?\n/);
  let length = personAbout.length - 1;

  if ((length) => 4) {
    personAbout.pop();
    data.about = personAbout;
  } else {
    data.about = personAbout;
  }

  // Languages

  // let Lang = [];
  // let personLang = Array.from(
  //   document.querySelectorAll("section.artdeco-card.ember-view #languages")
  // );

  //   Designation

  let personDesignation = document
    .getElementsByClassName("text-body-medium break-words")[0]
    .innerText.split(/\r?\n/);
  data.Designation = personDesignation[0];

  //   Location

  let personLocation = document
    .getElementsByClassName(
      "text-body-small inline t-black--light break-words"
    )[0]
    .innerText.split(/\r?\n/);
  data.Location = personLocation.toString();

  return data;
}
