import ErrorToast from "../ui-component/toast/ErrorToast";
import SuccessToast from "../ui-component/toast/SuccessToast";
import Cookies from "js-cookie";

const BACKEND_LINK = "http://127.0.0.1:8000"

export const SignUpUser = async(rawData,setbtnLoading) =>{

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify(rawData);
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch(`${BACKEND_LINK}/signup/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result)

      if(result.responseCode == "400"){
        ErrorToast("User already exists")
        setbtnLoading(false)
        return
      }

      if(result.responseCode == "200"){
        SuccessToast("Signup successful")

        setbtnLoading(false)

        Cookies.set('music_ai_user', JSON.stringify(rawData))

        setTimeout(() => {
          window.location.href = "/"
        }, 2000);


      }

      

    })
    .catch((error) => console.error(error));

  
  }
  

export const SignInUser = async(rawData,setbtnLoading) =>{

    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify(rawData);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`${BACKEND_LINK}/signin/`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)

    if(result.responseCode == "401"){
      ErrorToast(result.responseMsg)
      setbtnLoading(false)
      return
    }

    if(result.responseCode == "200"){
      SuccessToast(result.responseMsg)
      setbtnLoading(false)

      Cookies.set('music_ai_user', JSON.stringify(rawData))

      setTimeout(() => {
        window.location.href = "/"
      }, 2000);

      return
    }

  })
  .catch((error) => console.error(error));

  }


  export const GoogleAuthUser = async(rawData,setbtnLoading) =>{

    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify(rawData);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`${BACKEND_LINK}/google-auth/`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)


    if(result.responseCode == "401"){
        ErrorToast("Something went wrong")
        setbtnLoading(false)
        return
    }

    if(result.responseCode == "200"){
      SuccessToast("Success")

      setbtnLoading(false)

      Cookies.set('music_ai_user', JSON.stringify(rawData))

      setTimeout(() => {
        window.location.href = "/"
      }, 2000);

      return  
    }


  })
  .catch((error) => console.error(error));

  }

  export const GenerateImage = async() =>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "json": {
        "group_id": "190be657-38f0-4377-9cec-25ef6c71c576",
        "prompts": [
          "a winding road through a tranquil countryside, sunset, nostalgic, peaceful",
          "a sunlit meadow with a winding path, female figure walking, vibrant, serene",
          "a grand opera house nestled in a scenic landscape, soprano singer on stage, dramatic, breathtaking"
        ],
        "ids": [
          "9c039f0b-b829-4b2c-81fa-c67fd0eedc47",
          "41325e0a-77da-4565-9c3f-b72660295937",
          "4fc9b641-bd4a-4c1d-bfaa-098690f0d1c6"
        ]
      }
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("http://127.0.0.1:8000/create-image/", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }