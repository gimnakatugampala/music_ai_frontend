import ErrorToast from "../ui-component/toast/ErrorToast";
import SuccessToast from "../ui-component/toast/SuccessToast";
import Cookies from "js-cookie";

const BACKEND_LINK = "http://127.0.0.1:8000"
const MUSIC_AI_TOKEN = Cookies.get('MUSIC_AI_TOKEN')


let CURRENT_USER = null;

try {
  const userCookie = Cookies.get('music_ai_user');
  
  if (userCookie) {
    CURRENT_USER = JSON.parse(userCookie);
  } else {
    console.error('User cookie not found');
  }
} catch (error) {
  console.error('Error parsing user cookie:', error);
}



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


  export const GenerateTextVariations = async(songDesc,settextVariations) =>{

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "json": {
      "text": `${songDesc}`,
      "user_id": "509c8c77-ce2e-4822-b29a-d3aae768b3ba",
      "is_augment_prompt": true,
      "lyrics": `${songDesc}`,
      "is_public": true,
      "curate_variations": false
    }
  });

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`${BACKEND_LINK}/generate-text-variations/`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
    settextVariations(result)
  })
  .catch((error) => console.error(error));


  }

  export const GenerateMusicImage = async (visuals) => {

    const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(visuals);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch(`${BACKEND_LINK}/create-images/`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

  }


// api.js
export const GenerateMusicBySongDesc = async (songDesc) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "gpt_description_prompt": `${songDesc}`,
    "make_instrumental": false,
    "mv": "chirp-v3-0",
    "prompt": ""
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/generate/description-mode`, requestOptions);
    const result = await response.json();

    // Save the Token
    Cookies.set('MUSIC_AI_TOKEN', result.token)


    // Extract the clip IDs and create audio URLs
    const audioUrls = result.response.clips.map(clip => `https://cdn1.suno.ai/${clip.id}.mp3`);

    return audioUrls; // return an array of audio URLs
  } catch (error) {
    console.error("Error:", error);
    throw error; // throw error to handle it in the component
  }
};


export const AudioSreamingAPI = async () => {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${MUSIC_AI_TOKEN}`);
  myHeaders.append("Referer", "https://suno.com");
  myHeaders.append("Origin", "https://suno.com");

  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://cdn1.suno.ai/a5ef2e79-498c-43ef-90d2-bbad88b2c25f.mp3", requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Return a blob
    return await response.blob();
  } catch (error) {
    console.error("Error fetching audio:", error);
    throw error;
  }
};



// api/index.js
export const GetSongsByUserEmail = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/get-song-by-email/${CURRENT_USER.email}`, requestOptions);
    const result = await response.json();

    return result; // Return the result for further use
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to be handled in the action
  }
};
