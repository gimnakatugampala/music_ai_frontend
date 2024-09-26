import ErrorToast from "../ui-component/toast/ErrorToast";
import SuccessToast from "../ui-component/toast/SuccessToast";
import Cookies from "js-cookie";

export const BACKEND_LINK = "http://127.0.0.1:8000"
export const BACKEND_HOST = "http://127.0.0.1:8000/"

// export const BACKEND_LINK = "http://api.musicaiapp.online:8000"
// export const BACKEND_HOST = "http://api.musicaiapp.online:8000/"

// export const BACKEND_LINK = "https://62.84.180.172:8000"
// export const BACKEND_HOST = "https://62.84.180.172:8000/"

const MUSIC_AI_TOKEN = Cookies.get('MUSIC_AI_TOKEN')


export let CURRENT_USER = null;

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


        // Append user_id to the rawData
        const updatedRawData = { ...rawData, user_id: result.responseData.user_id };

        Cookies.set('music_ai_user', JSON.stringify(updatedRawData))

        setTimeout(() => {
          window.location.href = "/dashboard"
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

      const updatedRawData = { ...rawData, user_id: result.responseData.user_id };

      Cookies.set('music_ai_user', JSON.stringify(updatedRawData))

      setTimeout(() => {
        window.location.href = "/dashboard"
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

      const updatedRawData = { ...rawData, user_id: result.responseData.user_id };

      Cookies.set('music_ai_user', JSON.stringify(updatedRawData))

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000);

      return  
    }


  })
  .catch((error) => console.error(error));

  }


  export const GenerateTextVariations = async (songDesc) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      "json": {
        "text": songDesc,
        "user_id": "509c8c77-ce2e-4822-b29a-d3aae768b3ba",
        "is_augment_prompt": true,
        "lyrics": songDesc,
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
  
    try {
      const response = await fetch(`${BACKEND_LINK}/generate-text-variations/`, requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


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

  try {
    const response = await fetch(`${BACKEND_LINK}/create-images/`, requestOptions);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


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

    console.log(result.token)

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


export const AudioStreamingAPI = async (url) => {

  const token = Cookies.get('MUSIC_AI_TOKEN'); // Get the token from the cookie

  if (!token) {
    throw new Error('Token is missing. Please generate music to obtain the token.');
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization",`Bearer ${token}`);
  myHeaders.append("Referer", "https://suno.com");
  myHeaders.append("Origin", "https://suno.com");

  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${url}`, requestOptions);
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


export const AudioStreamingAPIFromLocal = async (url) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/proxy/audio?url=${url}&token=${MUSIC_AI_TOKEN}`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Convert the response to a blob (since it's an audio file)
    const audioBlob = await response.blob();

    // Create a URL for the blob so it can be used in an audio player or downloaded
    const audioStreamUrl = URL.createObjectURL(audioBlob);

    // Return the audio stream URL
    return audioStreamUrl;
  } catch (error) {
    console.error("Error fetching audio from local server:", error);
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


export const AddSongDescAPI = async (song,songDesc) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    title: song.title,
    user_song_description: songDesc, // Assuming description is based on the first item
    custom_lyrics: null, // Adjust if you want to handle lyrics
    created_date: song.created_date,
    song_type_id: 1, // Adjust based on your logic
    user_id: CURRENT_USER.user_id
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/add-songs/`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
};


export const AddSongDescItemAPI = async (songItem) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(songItem);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/add-song-item/`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding song item:", error);
    throw error;
  }
};

export const DownloadAudioAPI = async (clip_id) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/download-song/${clip_id}`, requestOptions);
    const result = await response.json();
    return result.message; // This will return the path to the song
  } catch (error) {
    console.error("Error downloading the song:", error);
    return null;
  }
}


export const GenerateSongByCustomLyrics = async (lyrics, musicStyle, title) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "prompt": lyrics,  // Pass the processed lyrics as prompt
    "mv": "chirp-v3-0",
    "title": title == null ? "" : title,
    "tags": musicStyle // Pass the music style
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/generate/`, requestOptions);
    const result = await response.json();

    // Extract clip IDs and construct audio URLs
    const audioUrls = result.clips.map(clip => `https://cdn1.suno.ai/${clip.id}.mp3`);

    return audioUrls; // Return array of audio URLs
  } catch (error) {
    console.error("Error generating song:", error);
    throw error; // Throw error to handle in the calling function
  }
};


// Generate ChatGPT Lyrics for Custom Lyrics
export const GenerateChatGPTLyricsForCustomLyrics = async (lyrics) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
      "soundPrompt": "",
      "lyricsInput": `${lyrics}`
    }
  );

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`${BACKEND_LINK}/generate-chatgpt-lyrics`, requestOptions)
    .then((response) => response.json()) // Return response as JSON
    .catch((error) => console.error(error));
};


export const GenerateTextVariationsForCustomLyrics = async (lyrics) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "json": {
      "text": "",
      "user_id": "509c8c77-ce2e-4822-b29a-d3aae768b3ba",
      "is_augment_prompt": true,
      "lyrics": lyrics,
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

  try {
    const response = await fetch(`${BACKEND_LINK}/generate-text-variations/`, requestOptions);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const AddSongCustomLyricsAPI = async (song,lyrics) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    title: song.title,
    user_song_description: null, // Assuming description is based on the first item
    custom_lyrics: lyrics, // Adjust if you want to handle lyrics
    created_date: song.created_date,
    song_type_id: 2, // Adjust based on your logic
    user_id: CURRENT_USER.user_id
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/add-songs/`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
};


export const shortenLyrics = (lyrics) => {
  // Split lyrics into an array of words
  const words = lyrics.split(' ');

  // Calculate half of the total length and truncate the lyrics
  const halfLength = Math.floor(words.length / 2);

  // Join the first half back into a string
  const shortenedLyrics = words.slice(0, halfLength).join(' ');

  return shortenedLyrics;
};


export const containsEnglish = (lyrics) => {
  // Regular expression to match English alphabet characters (A-Z, a-z)
  const englishRegex = /[A-Za-z]/;

  // Test the lyrics to see if it contains any English characters
  return englishRegex.test(lyrics);
};


export const GetGenreByLyrics = async (lyrics, setMusicStyle) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "prompt": `${lyrics}`
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/generate/genre/`, requestOptions);
    const result = await response.json();
    console.log(result);

    // Set the genre to musicStyle
    if (result.genre) {
      setMusicStyle(result.genre);
    }
  } catch (error) {
    console.error(error);
  }
};


export const GenerateTranscript = async (audioUrl) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "audio_url": audioUrl // Use the provided audio URL
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/transcribe/`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json(); // Parse the JSON response
    return result; // Return the result containing the transcript
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};



export const GetExploreSongs = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/get-latest-songs`, requestOptions);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();
    return result; // Return the parsed result
  } catch (error) {
    console.error('Error fetching explore songs:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};


export const GetAllSongs = async () => {
  try {
    const response = await fetch(`${BACKEND_LINK}/get-all-songs`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Return the parsed JSON data
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};


export const GetSongByID = async (songItemId) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/get-song-item/${songItemId}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json(); // Parse response as JSON
    console.log(result); // You can handle the result further as needed
    return result; // Return the result for further processing if needed
  } catch (error) {
    console.error("Error fetching song item:", error);
    throw error; // Rethrow error for further handling if needed
  }
};


export const UploadAudioFile = async (file) => {
  // Create a FormData object and append the uploaded file
  const formData = new FormData();
  formData.append("file", file); // Use the file passed as a parameter

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BACKEND_LINK}/upload-audio/`, requestOptions);

    if (!response.ok) {
      throw new Error("Failed to upload audio file");
    }

    const result = await response.json(); // Assuming the response is JSON
    console.log("Upload successful:", result);

    return result; // Returning the result for further usage

  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Rethrowing the error for further error handling if needed
  }
};
