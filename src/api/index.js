export const GenerateAudio = async() =>{

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "token=%5B%22eyJhbGciOiJIUzI1NiIsImtpZCI6Ikw0RGdDdUNuOHEvNXFMYm4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE4MzUxNTQxLCJpYXQiOjE3MTc3NDY3NDEsImlzcyI6Imh0dHBzOi8vaGd0cHp1a2V6b2R4cmdtZmhsdnkuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjUwOWM4Yzc3LWNlMmUtNDgyMi1iMjlhLWQzYWFlNzY4YjNiYSIsImVtYWlsIjoicmVjb3JkaW5ncy5sa0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0x5amNMTVJkRUtwRmY4Uks2czNUbU9Nc1pEN3pIODZ6NEZmeW9OZnVvazF4NGo9czk2LWMiLCJlbWFpbCI6InJlY29yZGluZ3MubGtAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6InJlY29yZGluZ3MgbGsiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoicmVjb3JkaW5ncyBsayIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0x5amNMTVJkRUtwRmY4Uks2czNUbU9Nc1pEN3pIODZ6NEZmeW9OZnVvazF4NGo9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExNTA2ODgyNzg0MzQ0NzUxNjA3NCIsInN1YiI6IjExNTA2ODgyNzg0MzQ0NzUxNjA3NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzE3NzQ2NzQxfV0sInNlc3Npb25faWQiOiJmZTI3ZTBkNC0wYTMwLTRmNzgtYjkxOC1hZGVjYzhlMDEwYmMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.u6WuRfQKjwahko_Xjhp79uFAns4fXrexQL1gR6fzGy0%22%2C%22774nkbivOx7GPDDIYyZHOA%22%2C%22ya29.a0AXooCguKS-NjqmZQZvXj8iJN5jOsorF5l963IzmAZ71CLmayBBxQzlRljKZFjvkUl98aCJP3swvNZBaZE7h-GcsAZ3cw3FbqjhyOd1cC5GBAribWD57uibAmFMLEbJhc-w7qGIQEX1Va03T7y2ERZLxWTMO60GV3D1uRaCgYKAYUSARMSFQHGX2MinbcZXlzZKMQ0eYuoRy3oIA0171%22%2Cnull%2Cnull%5D");
    
    const raw = JSON.stringify({
      "json": {
        "group_id": "4e858a01-70b7-4b07-b31a-9e4fd9a5ede6",
        "prompts": [
          "",
          "",
          ""
        ],
        "audio_variations": [
          "operatic aria, soprano singer, beautiful clear vocals, romantic opera singer on a moonlit stage",
          "edm dance song, male vocals harmonies, futuristic electronic beats, energetic dancing",
          "bluegrass jam, male vocals, banjo, folk music festival, free-spirited singing"
        ],
        "visual_prompts": [
          "soprano singer with a captivating smile, floating dreamily among stars",
          "digital dream world with neon lights and shimmering smiles, energetic and futuristic",
          "folk singer with a joyful smile, surrounded by dreamlike bluegrass landscape"
        ],
        "lyrics": [
          "Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Ridge Ridge Ridge",
          "Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Ridge Ridge Ridge",
          "Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Mountains Almost heaven, West Virginia Blue Ridge Ridge Ridge Ridge"
        ],
        "seeds": [
          null,
          null,
          null
        ],
        "ids": [
          "e8e62e0a-5a3a-4998-bf4d-93bc1bbb8c51",
          "1c4887f6-12a7-4274-958a-babafe79eadb",
          "450d6535-7c3f-429f-ba22-1ec3d5e360a8"
        ],
        "title": "Timeless Dreamer's Smile",
        "is_public": true,
        "interpolate_for_remix": false
      },
      "meta": {
        "values": {
          "seeds.0": [
            "undefined"
          ],
          "seeds.1": [
            "undefined"
          ],
          "seeds.2": [
            "undefined"
          ]
        }
      }
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("https://app.riffusion.com/api/trpc/inference.textToAudioBatch", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  
   }
  