const CHARACTER_API_BASE = "https://api-v2.encore.moe/api/en/character";
const CHARACTER_LIST_URL = `${CHARACTER_API_BASE}?v=Beta`;
const WEAPON_API_BASE = "https://api-v2.encore.moe/api/en/weapon";
const WEAPON_LIST_URL = `${WEAPON_API_BASE}?v=Beta`;

export interface ApiCharacterListItem {
  Id: number;
  Name: string;
  QualityId: number;
  Element: {
    Name: string;
  };
  WeaponType: {
    Name: string;
  };
}

export interface ApiLocalizedText {
  Content: string;
}

export interface ApiCharacterDetail {
  Id: number;
  Name: string | ApiLocalizedText;
  NickName?: ApiLocalizedText;
  QualityId: number;
  ElementName: string;
  WeaponTypeName: string;
  favorRole?: {
    Sex: ApiLocalizedText;
  } | null;
  Properties: Array<{
    Name: string;
    BaseValue: number;
    GrowthValues: Array<{
      growthId: number;
      level: number;
      value: number;
    }>;
  }>;
  Skills: ApiSkill[];
  ResonantChain?: ApiResonantChain[];
  SkillTree?: ApiSkillTreeNode[];
}

export interface ApiSkillTreeNode {
  PropertyNodeTitle: string;
  PropertyNodeDescribe: string;
}

export interface ApiResonantChain {
  GroupIndex: number;
  NodeName: string;
  AttributesDescription: string;
}

export interface ApiDamageListEntry {
  EntryNumber: number;
  Type: string;
  SubType?: string;
  PropertyName?: string;
  DmgType?: string;
  RateLv: string[];
}

export interface ApiSkill {
  SkillType: string;
  SkillName: string;
  SkillDescribe: string;
  SkillAttributes: Array<{
    attributeId: number;
    attributeName: string;
    values?: string[];
    Description?: string;
  }>;
  SkillDetailNum?: string[];
  DamageList?: ApiDamageListEntry[];
}

interface CharacterListResponse {
  roleList: ApiCharacterListItem[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${url}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchCharacterList(): Promise<ApiCharacterListItem[]> {
  const data = await fetchJson<CharacterListResponse>(CHARACTER_LIST_URL);
  // API returns oldest-first; reverse so newest characters appear first.
  return [...data.roleList].reverse();
}

export function getNameFromDetailField(detail: ApiCharacterDetail): string {
  if (typeof detail.Name === "string") {
    return detail.Name.trim();
  }
  return detail.Name?.Content?.trim() ?? "";
}

export function getNickNameFromDetail(detail: ApiCharacterDetail): string {
  return detail.NickName?.Content?.trim() ?? "";
}

export function getSuggestedCharacterName(
  detail: ApiCharacterDetail,
  listItem?: ApiCharacterListItem,
): string {
  const nameFromField = getNameFromDetailField(detail);
  if (nameFromField) {
    return nameFromField;
  }

  const nickName = getNickNameFromDetail(detail);
  if (nickName) {
    return nickName;
  }

  if (listItem?.Name && listItem.Name !== "Unknown") {
    return listItem.Name;
  }

  return "";
}

/** True when the detail API has no Name — common for unreleased beta characters. */
export function isCharacterNameUncertain(detail: ApiCharacterDetail): boolean {
  return getNameFromDetailField(detail) === "";
}

export function getCharacterNameUncertaintyHints(
  detail: ApiCharacterDetail,
  listItem?: ApiCharacterListItem,
): string[] {
  const hints: string[] = [];

  if (listItem?.Name === "Unknown") {
    hints.push('list API name is "Unknown"');
  }
  if (!getNameFromDetailField(detail)) {
    hints.push("detail API Name is empty");
  }

  const nickName = getNickNameFromDetail(detail);
  if (nickName) {
    hints.push(`NickName is "${nickName}"`);
  }

  return hints;
}

export function getCharacterName(detail: ApiCharacterDetail): string {
  const name = getSuggestedCharacterName(detail);
  if (!name) {
    throw new Error(
      `Character ID ${detail.Id} has no Name or NickName in API response`,
    );
  }
  return name;
}

export async function fetchCharacterDetail(
  id: number,
): Promise<ApiCharacterDetail> {
  const data = await fetchJson<ApiCharacterDetail & { roleList?: unknown }>(
    `${CHARACTER_API_BASE}/${id}?v=Beta`,
  );

  if (data.roleList !== undefined) {
    throw new Error(
      `API returned character list instead of detail for ID ${id}`,
    );
  }

  return data;
}

export interface ApiWeaponListItem {
  Id: number;
  Name: string;
  QualityId: number;
  TypeName: string;
}

export interface ApiWeaponDetail {
  ItemId: number;
  WeaponName: string;
  QualityId: number;
  WeaponTypeName: string;
  ResonName: string;
  Desc: string;
  ObtainedShowDescription?: string;
  BgDescription?: string;
  AttributesDescription?: string;
  Properties: Array<{
    Name: string;
    GrowthValues: Array<{
      Level: number;
      Value: string;
    }>;
  }>;
}

interface WeaponListResponse {
  weapons: ApiWeaponListItem[];
}

export async function fetchWeaponList(): Promise<ApiWeaponListItem[]> {
  const data = await fetchJson<WeaponListResponse>(WEAPON_LIST_URL);
  return [...data.weapons].reverse();
}

export function getSuggestedWeaponName(
  detail: ApiWeaponDetail,
  listItem?: ApiWeaponListItem,
): string {
  const nameFromField = detail.WeaponName?.trim() ?? "";
  if (nameFromField) {
    return nameFromField;
  }

  if (listItem?.Name && listItem.Name !== "Unknown") {
    return listItem.Name;
  }

  return "";
}

export function isWeaponNameUncertain(detail: ApiWeaponDetail): boolean {
  return (detail.WeaponName?.trim() ?? "") === "";
}

export function getWeaponNameUncertaintyHints(
  detail: ApiWeaponDetail,
  listItem?: ApiWeaponListItem,
): string[] {
  const hints: string[] = [];

  if (listItem?.Name === "Unknown") {
    hints.push('list API name is "Unknown"');
  }
  if (!detail.WeaponName?.trim()) {
    hints.push("detail API WeaponName is empty");
  }

  return hints;
}

export function getWeaponName(detail: ApiWeaponDetail): string {
  const name = getSuggestedWeaponName(detail);
  if (!name) {
    throw new Error(
      `Weapon ID ${detail.ItemId} has no WeaponName in API response`,
    );
  }
  return name;
}

export async function fetchWeaponDetail(id: number): Promise<ApiWeaponDetail> {
  const data = await fetchJson<ApiWeaponDetail & { weapons?: unknown }>(
    `${WEAPON_API_BASE}/${id}?v=Beta`,
  );

  if (data.weapons !== undefined) {
    throw new Error(`API returned weapon list instead of detail for ID ${id}`);
  }

  return data;
}
