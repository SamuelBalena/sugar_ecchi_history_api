export interface LocalizedText { en: string; ja: string }
export interface Anime { id: string; slug: string; name: LocalizedText; description: LocalizedText }
export interface Character { id: string; slug: string; animeId: string; name: LocalizedText; description: LocalizedText }
export interface Collection { id: string; slug: string; title: LocalizedText; description: LocalizedText }
export interface Tag { id: string; slug: string; label: LocalizedText }
export interface Pack {
  id: string; slug: string; title: LocalizedText; description: LocalizedText; contents: LocalizedText;
  galleryUrls: string[]; characterIds: string[]; tagIds: string[]; collectionIds: string[];
  price: number; compareAtPrice?: number; isPublished: boolean; isFeatured: boolean;
  isBestseller: boolean; fileCount: number; format: string; salesCount: number;
  patreonUrl: string; createdAt: string;
}
export interface Catalog { animes: Anime[]; characters: Character[]; collections: Collection[]; tags: Tag[]; packs: Pack[] }
