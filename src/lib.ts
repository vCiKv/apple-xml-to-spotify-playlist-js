import { refreshAccessToken } from "./components/spot-button";
import { MusicDetail, SpotifyPlaylist, SpotifyUser } from "./type";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const spotifyAccessToken = localStorage.getItem('access_token');

const loadXML = async (url?: string) => {
  if (!url) {
    new Error("No URL")
    return null
  }
  const request = new XMLHttpRequest();
  await request.open("GET", url, false);
  await request.send();
  const dataXML = request.responseXML
  if (!dataXML) {
    new Error("No XML")
    return null
  }
  return dataXML
}
const xmlToJSON = (data: string | Document | null) => {
  if (!data) {
    console.error("XML no-data")
    return
  }
  const dataXMLString = typeof data === "string" ? data : new XMLSerializer().serializeToString(data.documentElement);
  const isValidXML = XMLValidator.validate(dataXMLString)
  if (typeof (isValidXML) !== "boolean") {
    throw new Error(isValidXML.err.msg)
  }
  const parser = new XMLParser({
    allowBooleanAttributes: true,
    transformTagName: (tagName) => (tagName === "integer" || tagName === "string" || tagName === "true" || tagName === "false" || tagName === "date") ? "value" : tagName
  });
  const result = parser.parse(dataXMLString);
  return result
}
const xmlToSpotifyJSON = async (data: string | Document | null) => {
  const result = xmlToJSON(data)
  const libraryData: MusicDetail[] = []
  const playlist = result.plist.dict.dict.dict
  if (!playlist[0] || !(Object.prototype.hasOwnProperty.call(playlist[0], "key"))) {
    alert("unable to read XML")
    return []
  }
  for (const music of playlist) {
    const musicObj: MusicDetail = new Object() as MusicDetail
    let dataPoint = music.key.length
    while (dataPoint--) {
      const musicKey = music.key[dataPoint].trim()
      //@ts-ignore
      musicObj[musicKey] = music.value[dataPoint]

    }
    libraryData.push(musicObj)
  }
  return libraryData
}
const handleJsonDownload = (data: any[], fileName?: string) => {
  const name = fileName ?? 'data.json';
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
const delay = (ms = 3000) => { return new Promise((resolve) => { setTimeout(resolve, ms) }) }
const findSharedWords = (string1: string, string2: string) => {
  if (typeof (string1) !== "string" || typeof (string2) !== "string") {
    return 0
  }
  // 1. Convert both strings to lowercase and remove punctuation for consistent comparison.
  const cleanString1 = string1.toLowerCase().replace(/[^\w\s]/g, '');
  const cleanString2 = string2.toLowerCase().replace(/[^\w\s]/g, '');

  // 2. Split both strings into arrays of words.
  const words1 = cleanString1.split(/\s+/).filter(word => word !== ''); // Split by spaces and remove empty strings
  const words2 = cleanString2.split(/\s+/).filter(word => word !== '');

  // 3. Create a Set from the words of the first string for efficient lookup.
  const wordSet1 = new Set(words1);

  // 4. Initialize an empty Set to store the shared words (to avoid duplicates).
  const sharedWords = new Set();

  // 5. Iterate through the words of the second string and check if they exist in the Set of the first string.
  for (const word of words2) {
    if (wordSet1.has(word)) {
      sharedWords.add(word);
    }
  }

  // 6. Convert the Set of shared words back into an array.
  return sharedWords.size
}
// const checkSpotifyLogin = async (fn: (...args: any) => any, fallbackFn: (...args: any) => any,) => {
//   if (!spotifyAccessToken) {
//     await setSpotifyToken()
//     return function (args: any) {
//       fallbackFn(args)
//     }
//   } else {
//     return function (args: any) {
//       fn(args)
//     }
//   }
// }
const getSpotifyAlbumId = async (albumName: string, albumArtist?: string, albumYear?: number): Promise<{ id: string | null; error: String | null; rating: number; }> => {
  const spotifyAccessToken = localStorage.getItem('access_token');
  const spotifyAccessTokenIssued = localStorage.getItem('access_token_issued')
  if (!spotifyAccessToken) {
    return { id: null, error: "not signed in", rating: 0 }
  }
  // const expires = 1000 * 60 * 50 //50 mins
  const tokenExpires = 1000 * 60 * 50  //50 mins

  if (Math.abs(Number(spotifyAccessTokenIssued) - Date.now()) > tokenExpires) {
    //re-issue token
    console.log("reconnection")
    await refreshAccessToken()
  }


  if (albumName === "") {
    console.error("error: empty string")
    return { id: null, error: "empty string", rating: 0 }
  }
  const spotifyUrl = `https://api.spotify.com/v1/search?type=album&limit=8&q=${albumName}`
  try {
    const albumsRequest = await fetch(spotifyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotifyAccessToken
      },
    })
    const albumResponse = await albumsRequest.json()
    if (albumResponse?.error) {
      if (albumResponse.error.status === 401) {
        console.error("sign in and try again")
      }
      return { id: null, error: albumResponse.error.message, rating: 0 }
    }
    const closestMatches: { id: string | null, points: number, name?: string, artist?: string, year?: string }[] = []
    if (!albumResponse.albums || (albumResponse?.albums?.total) <= 0) {
      return { id: null, error: null, rating: 0 }
    }
    console.log("looking for", albumName, "by", albumArtist, "year", albumYear)
    console.log("albumResponse", albumResponse)
    for (const album of albumResponse.albums.items) {
      let points = 1
      points += findSharedWords(albumName, album.name)
      if (albumArtist) {
        points += findSharedWords(albumArtist, album.artists[0].name)
      }
      if (albumYear) {
        const spotifyYear = album.release_date.slice(0, 4)
        if (spotifyYear === String(albumYear)) {
          points++
        }
      }
      closestMatches.push({
        id: album.uri,
        points,
        artist: album.artists[0].name,
        name: album.name,
        year: album.release_date
      })
    }
    const sortedMatches = closestMatches.sort((a, b) => (a.points > b.points ? -1 : 1))
    console.log("sorted matches", sortedMatches)
    return {
      id: sortedMatches[0].id,
      error: null,
      rating: sortedMatches[0].points ?? 0
    }
  } catch (error) {
    console.error("spotify get album", error)
    return {
      id: null,
      error: "try catch error",
      rating: 0
    }
  }
}
const getSpotifyTrackId = async (trackName: string, trackArtist?: string, trackYear?: number): Promise<{ id: string | null; error: String | null; rating: number; }> => {
  const spotifyAccessToken = localStorage.getItem('access_token');
  const spotifyAccessTokenIssued = localStorage.getItem('access_token_issued')
  if (!spotifyAccessToken) {
    return { id: null, error: "not signed in", rating: 0 }
  }
  // const expires = 1000 * 60 * 50 //50 mins
  const tokenExpires = 1000 * 60 * 50  //50 mins

  if (Math.abs(Number(spotifyAccessTokenIssued) - Date.now()) > tokenExpires) {
    //re-issue token
    console.log("reconnection")
    await refreshAccessToken()
  }


  if (trackName === "") {
    console.error("error: empty string")
    return { id: null, error: "empty string", rating: 0 }
  }
  const spotifyUrl = `https://api.spotify.com/v1/search?type=track&limit=8&q=${trackName}`
  try {
    const trackRequest = await fetch(spotifyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotifyAccessToken
      },
    })
    const trackResponse = await trackRequest.json()
    if (trackResponse?.error) {
      if (trackResponse.error.status === 401) {
        console.error("sign in and try again")
      }
      return { id: null, error: trackResponse.error.message, rating: 0 }
    }
    const closestMatches: { id: string | null, points: number, name?: string, artist?: string, year?: string }[] = []
    if (!trackResponse.tracks || (trackResponse?.tracks?.total) <= 0) {
      return { id: null, error: null, rating: 0 }
    }
    console.log("looking for", trackName, "by", trackArtist, "year", trackYear)
    console.log("trackResponse", trackResponse)
    for (const track of trackResponse.tracks.items) {
      let points = 1
      points += findSharedWords(trackName, track.name)
      if (trackArtist) {
        points += findSharedWords(trackArtist, track.artists[0].name)
      }
      if (trackYear) {
        const spotifyYear = track.album.release_date.slice(0, 4)
        if (spotifyYear === String(trackYear)) {
          points++
        }
      }
      closestMatches.push({
        id: track.uri,
        points,
        artist: track.artists[0].name,
        name: track.name,
        year: track.release_date
      })
    }
    const sortedMatches = closestMatches.sort((a, b) => (a.points > b.points ? -1 : 1))
    console.log("sorted matches", sortedMatches)
    return {
      id: sortedMatches[0].id,
      error: null,
      rating: sortedMatches[0].points ?? 0
    }
  } catch (error) {
    console.error("spotify get album", error)
    return {
      id: null,
      error: "try catch error",
      rating: 0
    }
  }
}
const getSpotifyUserId = async () => {
  const spotifyUrl = `https://api.spotify.com/v1/me`
  try {
    const myProfileRequest = await fetch(spotifyUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + spotifyAccessToken
      },
    })
    const myProfileResponse: SpotifyUser = await myProfileRequest.json()
    return myProfileResponse.id ?? null
  } catch (error) {
    console.error("getUserId Error", error)
    return null
  }
}


const createSpotifyPlaylist = async (playlistName: string, isPublic?: boolean) => {
  const uid = await getSpotifyUserId();
  if (!uid) {
    console.error("no user id found")
    return null
  }
  const spotifyUrl = ` https://api.spotify.com/v1/users/${uid}/playlists`
  const playlistDetails = {
    "name": playlistName,
    "description": "Music From AppleMusic/iTunes",
    "public": isPublic ?? false
  }
  try {
    const playlistRequest = await fetch(spotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + spotifyAccessToken
      },
      body: JSON.stringify(playlistDetails)
    })
    const playlistResponse: SpotifyPlaylist = await playlistRequest.json()
    return playlistResponse.id ?? null
  } catch (error: any) {
    console.error("createPlaylist error", error)
    return null
  }

}
const addToSpotifyPlaylist = async (playlistId: string, songs: string[]) => {
  const spotifyUrl = ` https://api.spotify.com/v1/playlists/${playlistId}/tracks`
  const playlistTracks = {
    "uris": songs,
  }
  const playlistRequest = await fetch(spotifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyAccessToken
    },
    body: JSON.stringify(playlistTracks)
  })

  if (!playlistRequest.ok) {
    console.error("playlist error", await playlistRequest.json())
    return false
  } else {
    return true
  }
}

export { xmlToJSON, loadXML, xmlToSpotifyJSON, handleJsonDownload, getSpotifyAlbumId, createSpotifyPlaylist, getSpotifyUserId, addToSpotifyPlaylist, delay, getSpotifyTrackId }