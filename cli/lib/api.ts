const CHARACTER_LIST_URL = "https://api-v2.encore.moe/api/en/character";
const CHARACTER_DETAIL_URL = "https://api-v2.encore.moe/api/en/character";

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

export interface ApiCharacterDetail {
  Id: number;
  Name: {
    Content: string;
  };
  QualityId: number;
  ElementName: string;
  WeaponTypeName: string;
  favorRole: {
    Sex: {
      Content: string;
    };
  };
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

export async function fetchCharacterDetail(
  id: number,
): Promise<ApiCharacterDetail> {
  return fetchJson<ApiCharacterDetail>(`${CHARACTER_DETAIL_URL}/${id}`);
}
