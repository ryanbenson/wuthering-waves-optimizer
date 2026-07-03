type AttackTests = {
  selector: string;
  values: string[];
}[];

type StatTests = {
  selector: string;
  value: string;
}[];

declare global {
  namespace Cypress {
    interface Chainable {
      importCharacterData(data: object): Chainable<void>;
    }
  }
}

export {};
