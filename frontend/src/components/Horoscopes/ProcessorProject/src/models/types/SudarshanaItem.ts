interface SudarshanaItemElement {
  value: string | number,
  title: string,
}

export interface SudarshanaItem {
  main: SudarshanaItemElement,
  elements: Array<SudarshanaItemElement>
}
