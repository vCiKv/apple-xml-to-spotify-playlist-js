export interface MusicDetail {
  TrackID: number;
  Name: string;
  Artist: string;
  AlbumArtist: string;
  ArtistName: string
  Album: string;
  Year: number;
  Genre: string;
}
export interface SpotifyError {
  error: {
    status: number;
    message: string;
  }
  tracks?: never
  albums?: never
  artist?: never


}
interface SpotifyBase<T> {
  href: string;
  limit: number
  next: string | null;
  previous: string | null
  offset: number;
  total: number;
  items: T
}
interface SpotifyImages {
  url: string;
  height: number | null;
  width: number | null;
}
type SpotifyRestrictionReasons = "market" | "product" | "explicit"
type SpotifyAlbumTypes = "album" | "single" | "compilation"

type SpotifyExternalUrl = {

  spotify: string

}
type SpotifyRestriction = {

  reason: SpotifyRestrictionReasons

}
interface SpotifyArtist {
  external_urls: SpotifyExternalUrl
  href: string
  id: string;
  name: string
  type: "artists"
  uri: string
}
interface SpotifyAlbum {
  album_type: SpotifyAlbumTypes
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrl
  href: string;
  id: string;
  images: SpotifyImages[]
  name: string
  release_date: string
  release_date_precision: string
  restriction: SpotifyRestriction
  type: "album"
  uri: string;
  artist: SpotifyArtist
}
export interface SpotifyUser {
  country: string;
  display_name: string
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filer_locked: boolean;
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href?: string
    total: number
  }
  href: string
  id: string
  images: SpotifyImages[]
  products: string;
  type: "user";
  uri: string;
}
export interface SpotifySearch {
  tracks?: SpotifyBase<{
    album: {
      album_type: SpotifyAlbumTypes
      total_tracks: number;
      available_markets: string[];
      external_urls: SpotifyExternalUrl
      href: string;
      id: string;
      images: SpotifyImages[]
      name: string
      release_date: string
      release_date_precision: string
      restriction: SpotifyRestriction
      type: "album"
      uri: string;
      artists: SpotifyArtist
    },
    artists: SpotifyArtist[]
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      /**international standard recording code */
      isrc: string;
      /**international article number */
      ean: string;
      /**universal product code */
      upc: string;
    }[]
    external_urls: SpotifyExternalUrl;
    href: string;
    id: string;
    is_playable: boolean
    linked_from: {}; //fix later
    preview_url?: string | null /** is Deprecated */
    restriction: SpotifyRestriction;
    name: string;
    popularity: number
    track_number: number;
    type: 'track';
    uri: string;
    is_local: boolean
  }[]>,
  albums?: SpotifyBase<{
    album_type: SpotifyAlbumTypes
    total_tracks: number;
    available_markets: string[];
    external_urls: SpotifyExternalUrl
    href: string;
    id: string;
    images: SpotifyImages[]
    name: string
    release_date: string
    release_date_precision: string
    restriction: SpotifyRestriction
    type: "album"
    uri: string;
    artist: SpotifyArtist[]
  }[]>,
  error?: never

}
export interface SpotifyPlaylist {
  collaborative: boolean;
  description?: string;
  external_urls: {
    spotify: string
  }
  followers: {
    href?: string
    total: number
  }
  href: string
  id: string
  images: SpotifyImages[]
  name: string;
  owner: {
    external_urls: {
      spotify: string
    }
    followers: {
      href?: string
      total: number
    }
    href: string
    id: string
    type: "user"
    uri: string
    display_name?: string
  }
  public: boolean;
  snapshot_id: string;
  type: "playlist"
  uri: string;
  tracks: SpotifyBase<{
    added_at?: string | Date
    added_by: {
      external_urls: {
        spotify: string
      }
      followers: {
        href?: string
        total: number
      }
      href: string
      id: string
      type: "user"
      uri: string
      display_name?: string
    }
    is_local: boolean
    track: {
      album: {
        album_type: SpotifyAlbumTypes
        total_tracks: number;
        available_markets: string[];
        external_urls: SpotifyExternalUrl
        href: string;
        id: string;
        images: SpotifyImages[]
        name: string
        release_date: string
        release_date_precision: string
        restriction: SpotifyRestriction
        type: "album"
        uri: string;
        artist: SpotifyArtist
      },
      artists: SpotifyArtist[]
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_ids: {
        /**international standard recording code */
        isrc: string;
        /**international article number */
        ean: string;
        /**universal product code */
        upc: string;
      }[]
      external_urls: SpotifyExternalUrl;
      href: string;
      id: string;
      is_playable: boolean
      linked_from: {}; //fix later
      preview_url?: string | null /** is Deprecated */
      restriction: SpotifyRestriction;
      name: string;
      popularity: number
      track_number: number;
      type: 'track';
      uri: string;
      is_local: boolean
    }

  }>
}
